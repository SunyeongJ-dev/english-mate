# 003: History

## Goal

Every checked sentence and its feedback are saved in the browser's `localStorage`. The sidebar lists the saved sentences, and choosing one shows its feedback again without calling Claude.

## In scope

### Saving

- [ ] When a check succeeds, the app saves the sentence, the result, and the language it was checked in to `localStorage`.
- [ ] A check that ends in an error saves nothing.
- [ ] History keeps the 50 newest items. Saving a 51st item drops the oldest one.
- [ ] Checking the same sentence twice saves two items.
- [ ] If the saved data is damaged, or `localStorage` is blocked or full, the app still checks sentences and shows results, and the user sees no error message.

### Sidebar list

- [ ] The sidebar lists the saved sentences, newest first. Each item shows its sentence only, on one line, cut off with an ellipsis when it is too long.
- [ ] With no history, the sidebar shows `No chats yet`.
- [ ] A new sentence appears at the top of the list as soon as its result shows.
- [ ] After a reload, the sidebar shows the same items in the same order.
- [ ] The list scrolls inside the sidebar when it is too tall.

### Opening an item

- [ ] Clicking an item shows its result card with the saved sentence and feedback. The app does not call `/api/chat`.
- [ ] The card uses the language the item was checked in, whatever language is selected in the switcher.
- [ ] The item whose result is showing is highlighted with the `blue-100` background, and screen readers can tell it is the current one.
- [ ] `New sentence` goes back to the input screen with an empty, focused textarea, and no item is highlighted.
- [ ] If the user opens an item while a check is loading, that card stays on screen. When the check succeeds, its sentence is saved to the top of the list without opening.
- [ ] The list works with the keyboard only, and every item shows a visible focus ring.

## Out of scope

- Showing history on mobile, where the sidebar is hidden (spec 004)
- Showing a loading check, a new result, or a failed check in the sidebar (spec 005)
- Deleting one item or clearing all history
- Searching or filtering history
- Showing the level, the date, or the language in a history item
- Keeping history in sync between open tabs or between devices
- Translating `No chats yet` (spec 006)
- Dark mode (spec 007)

## Done when

- With empty `localStorage`, the sidebar shows `No chats yet`.
- Submitting `I am agree with you` shows the result card, and `I am agree with you` appears at the top of the sidebar, highlighted.
- Submitting `이것은 테스트입니다` shows `Please enter one English sentence.` and adds nothing to the sidebar.
- After checking `I am agree with you` and then `Thanks!`, the sidebar shows `Thanks!` above `I am agree with you`. Reloading the page shows the same two items in the same order.
- Clicking `I am agree with you` in the sidebar shows its card with the same formal sentence, casual sentence, and note as when it was checked, and the browser's network tab shows no new request to `/api/chat`.
- An item checked in `KO` shows its level sentence in Korean when it is opened with `EN` selected.
- Clicking `New sentence` shows the input screen with an empty, focused textarea, and no sidebar item is highlighted.
- With 50 items saved, checking one more keeps the list at 50, with the new sentence at the top and the oldest sentence gone.
- After submitting `Stop.` and clicking `I am agree with you` before the result arrives, the `I am agree with you` card stays on screen. `Stop.` then appears at the top of the sidebar without opening.
- With `localStorage` blocked in the browser, submitting a sentence shows the result card and no error message.
- `pnpm run lint` and `pnpm run build` pass.
