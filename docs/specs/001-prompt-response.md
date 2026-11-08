# 001: Prompt response

## Goal

Claude returns one of two exact JSON shapes, one for valid input and one for invalid input, and `app/api/chat/route.ts` handles every response that matches neither.

## In scope

- [x] For valid input, Claude returns only a JSON object with exactly these non-empty string fields: `level`, `formal`, `casual`, and `note`.
- [x] The prompt tells Claude never to leave `formal`, `casual`, or `note` empty. If one is empty, `app/api/chat/route.ts` treats the response as not matching the shape.
- [x] The prompt asks Claude to keep `note` to 5 sentences or fewer. `app/api/chat/route.ts` does not count sentences in `note`.
- [x] `level` is `natural`, `slightly_awkward`, or `awkward`. The app maps each value to a fixed display sentence.
- [x] For non-English, unclear, single-word, or multi-sentence input, Claude returns only `{"invalid": true}`.
- [x] Claude decides what counts as single-word input. A word that does not work as a sentence, like `apple`, is invalid. A one-word sentence, like `Thanks!` or `Stop.`, gets a level.
- [x] Claude decides what counts as unclear. Text that cannot be understood at all, like `sadafjkhw`, is unclear. A proper sentence with some structure gets a level, even if that level is `awkward`.
- [x] For invalid input, `app/api/chat/route.ts` returns status 400 and `{"error": "Please enter one English sentence."}`, and the app shows this fixed message. Claude never generates this message.
- [x] `Please enter one English sentence.` and `Something went wrong. Please try again.` are each defined once, as exported constants in `app/lib/types.ts`.
- [x] `app/api/chat/route.ts` catches empty input before calling Claude and returns `Please enter your sentence.` The app shows this message.
- [x] `app/api/chat/route.ts` returns status 400 and `Input is too long.` for input longer than 1000 characters, without calling Claude. The app shows this message.
- [x] A request body of `null` gets the same status 400 response as a body that is not valid JSON, and Claude is not called.
- [x] When the Claude call fails, or Claude's response is not JSON or matches neither shape, `app/api/chat/route.ts` returns status 500, `Something went wrong. Please try again.`, and no result. It does not retry. The app shows this message.

## Example responses

These examples are hand-written to show the shapes. They are not captured Claude output.

Valid input, `I am agree with you`:

```json
{
  "level": "slightly_awkward",
  "formal": "I agree with you.",
  "casual": "Yeah, I totally agree.",
  "note": "\"Agree\" is a verb, so it does not need \"am\". Say \"I agree\" instead of \"I am agree\"."
}
```

Invalid input, `이것은 테스트입니다`:

```json
{
  "invalid": true
}
```

## Out of scope

- Polished UI design, including the result card (spec 002)
- Saving results in `localStorage` (spec 003)
- Choosing Claude's response language (spec 004)
- Translating the error messages (spec 004)

## Done when

- Entering `I am agree with you`, `Thanks!`, or `Stop.` shows a fixed level sentence, a formal alternative, a casual alternative, and a note.
- Entering `이것은 테스트입니다`, `sadafjkhw`, `apple`, or `I like tea. She likes coffee.` shows `Please enter one English sentence.`
- Entering an empty input shows `Please enter your sentence.`, and Claude is not called.
- Entering 1001 characters shows `Input is too long.`, and Claude is not called.
- Posting a request body of `null` returns status 400, and Claude is not called.
- A failed Claude call, a Claude response of `{"level": "great"}`, or a valid-shape response with an empty `note` makes `app/api/chat/route.ts` return status 500 and no result, and the app shows `Something went wrong. Please try again.`
- `Please enter one English sentence.` and `Something went wrong. Please try again.` each appear only once in the source code.
