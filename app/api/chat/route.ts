import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { input } = await req.json();

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Confirm you got the message: " + input,
      },
    ],
  });

  const textBlock = response.content.find(
    (block) => block.type === "text"
  );

  return Response.json({
    message: textBlock?.text ?? "",
  });
}
