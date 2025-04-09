// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    return new Response(JSON.stringify({ message: "Hello, World!" }), {
      headers: { "Content-Type": "application/json" },
    });
  }