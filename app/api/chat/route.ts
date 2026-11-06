import Anthropic from "@anthropic-ai/sdk";
import {
  EMPTY_INPUT_MESSAGE,
  INVALID_INPUT_MESSAGE,
  LANGUAGES,
  LEVELS,
  REQUEST_FAILED_MESSAGE,
  TOO_LONG_MESSAGE,
  Language,
  Level,
  Result,
} from "@/app/lib/types";
import { buildSystemPrompt } from "@/app/lib/prompt";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-haiku-5-5";

const RESULT_KEYS = ["level", "formal", "casual", "note"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  const actualKeys = Object.keys(value);
  return (
    actualKeys.length === keys.length &&
    keys.every((key) => actualKeys.includes(key))
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isLevel(value: unknown): value is Level {
  return LEVELS.some((level) => level === value);
}

function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((language) => language === value);
}

function isInvalidResponse(value: unknown): boolean {
  return (
    isRecord(value) &&
    hasExactKeys(value, ["invalid"]) &&
    value.invalid === true
  );
}

function isResult(value: unknown): value is Result {
  return (
    isRecord(value) &&
    hasExactKeys(value, RESULT_KEYS) &&
    isLevel(value.level) &&
    isNonEmptyString(value.formal) &&
    isNonEmptyString(value.casual) &&
    isNonEmptyString(value.note)
  );
}

function failed(): Response {
  return Response.json({ error: REQUEST_FAILED_MESSAGE }, { status: 500 });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!isRecord(body)) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { input, language } = body;

  if (typeof input !== "string" || !input.trim()) {
    return Response.json({ error: EMPTY_INPUT_MESSAGE }, { status: 400 });
  }
  if (input.length > 1000) {
    return Response.json({ error: TOO_LONG_MESSAGE }, { status: 400 });
  }
  if (!isLanguage(language)) {
    return Response.json({ error: "Invalid language" }, { status: 400 });
  }

  let text = "";
  try {
    const response = await client.messages.create({
      model: MODEL,
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
    console.error("Claude call failed:", error);
    return failed();
  }

  let result: unknown;
  try {
    result = JSON.parse(text);
  } catch (error) {
    console.error("Claude's response is not JSON:", error);
    return failed();
  }

  if (isInvalidResponse(result)) {
    return Response.json({ error: INVALID_INPUT_MESSAGE }, { status: 400 });
  }

  if (!isResult(result)) {
    console.error("Claude's response does not match the shape:", result);
    return failed();
  }

  return Response.json({
    level: result.level,
    formal: result.formal,
    casual: result.casual,
    note: result.note,
  });
}
