export async function GET(req) {
  const pincodes = ["134109", "134116"]; // array of strings
  return new Response(JSON.stringify(pincodes), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
