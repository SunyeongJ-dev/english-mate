import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config({ path: ".env.local" });

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Hello, world",
      },
    ],
  });

  console.log(message.content);
}

main();