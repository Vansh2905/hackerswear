import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import Order from '@/models/Orders';
import User from '@/models/User';
import connectdb from '@/middleware/mongoose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    await connectdb();
    
    let userId = null;
    
    // Try JWT token first
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (token && JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded?.user?.id || decoded?.id;
        console.log('JWT user ID:', userId);
      } catch (err) {
        console.log('JWT verification failed, trying NextAuth session');
      }
    }
    
    // If no JWT user, try NextAuth session
    if (!userId) {
      try {
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            userId = dbUser._id.toString();
            console.log('NextAuth user ID:', userId);
          }
        }
      } catch (err) {
        console.error('NextAuth session error:', err);
      }
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Fetch orders
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${orders.length} orders for user ${userId}`);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectdb();
    
    let userId = null;
    
    // Try JWT token first
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (token && JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded?.user?.id || decoded?.id;
        console.log('Creating order for JWT user:', userId);
      } catch (err) {
        console.log('JWT verification failed for order creation');
      }
    }
    
    // If no JWT user, try NextAuth session
    if (!userId) {
      try {
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            userId = dbUser._id.toString();
            console.log('Creating order for NextAuth user:', userId);
          }
        }
      } catch (err) {
        console.error('NextAuth session error during order creation:', err);
      }
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { products, amount, address } = await request.json();

    const order = new Order({
      userId,
      products,
      amount,
      address,
      status: 'pending'
    });

    const savedOrder = await order.save();
    console.log('Order created successfully:', savedOrder._id);
    
    return NextResponse.json({ success: true, order: savedOrder });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
