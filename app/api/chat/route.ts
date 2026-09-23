import Anthropic from "@anthropic-ai/sdk";
import { LANGUAGES, LEVELS } from "@/app/lib/types";
import { buildSystemPrompt } from "@/app/lib/prompt";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function validateResult(result: any): boolean {
  if (
    typeof result !== "object" ||
    !result ||
    !LEVELS.includes(result.level) ||
    typeof result.formal !== "string" ||
    typeof result.informal !== "string" ||
    typeof result.note !== "string"
  ) {
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { input, language } = body;

  if (typeof input !== "string" || !input.trim()) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  if (input.length > 1000) {
    return Response.json({ error: "Input is too long" }, { status: 400 });
  }
  if (!LANGUAGES.includes(language)) {
    return Response.json({ error: "Invalid language" }, { status: 400 });
  }

  let text = "";
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: buildSystemPrompt(language),
      messages: [
        {
          role: "user",
          content: `<sentence>${input}</sentence>`,
        },
      ],
    });
    const textBlock = response.content.find((block) => block.type === "text");
    if (textBlock && textBlock.type === "text") {
      text = textBlock.text;
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }

  let result;
  try {
    result = JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return Response.json(
      { error: "Failed to parse response" },
      { status: 500 },
    );
  }

  if (!validateResult(result)) {
    return Response.json(
      { error: "Invalid response format from AI" },
      { status: 500 },
    );
  }

  return Response.json({
    level: result.level,
    formal: result.formal,
    informal: result.informal,
    note: result.note,
  });
}
