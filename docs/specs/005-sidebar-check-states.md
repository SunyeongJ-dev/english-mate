# 005: Check states in the history list

## Goal

When the user opens a history item while a check is loading, the check moves to the history list. The list then shows whether it is still loading, has a new result, or failed. On mobile, the menu button shows that there is something new.

## In scope

### Where the states show

- [x] The history list shows the three states below in the same way in the desktop sidebar and in the mobile drawer.
- [x] A check that finishes while the input screen is showing adds none of these states: the result card opens, or the error message shows under the input.

### Pending

- [x] When the user opens a history item while a check is loading, a pending item with the submitted sentence appears at the top of the list, with a small spinner before the sentence.
- [x] The card on screen and the highlighted item do not change when the check finishes.
- [x] Clicking the pending item, or `New sentence`, while the check is still loading shows the input screen in its loading state with the submitted sentence in the textarea. The pending item leaves the list.

### New result

- [x] When the check succeeds, the pending item becomes a saved history item in the same place, with its sentence in bold.
- [x] Opening the item shows its card and makes the sentence regular weight.
- [x] The bold state is not saved. After a reload, every sentence is regular weight.

### Failed

- [x] When the check fails, the pending item becomes a failed item in the same place, with a warning icon (a triangle with an exclamation mark) in `red-700` before the sentence.
- [x] A failed item is not saved in `localStorage`, does not count toward the limit of 50, and is gone after a reload.
- [x] The list can hold more than one failed item, with no limit. A new pending item goes above them.
- [x] Clicking a failed item shows the input screen with its sentence in the textarea and its error message under the input. The sentence replaces any text that was in the textarea. The failed item leaves the list.
- [x] A failed item is disabled while another check is loading.
- [x] `New sentence` shows an empty, focused textarea with no error message. Failed items stay in the list.

### Menu button dot

- [x] On mobile, the menu button shows a small `red-600` dot at its top right corner while the list has a bold item or a failed item.
- [x] The dot goes away when no bold item and no failed item is left. A pending item alone shows no dot.
- [x] While the dot shows, the menu button's `aria-label` is `Open history, new update`. Without the dot, it is `Open history`.

### Accessibility

- [x] Each state has visually hidden text for screen readers: `Checking`, `New result`, and `Check failed`. The spinner, the bold text, and the icon are never the only sign.
- [x] The spinner does not spin when the user prefers reduced motion.

## Out of scope

- Running more than one check at the same time
- Keeping failed items or the bold state after a reload
- A count of new items on the menu button
- Removing a failed item without opening it
- Translating the hidden text and the menu button's label (spec 006)

## Done when

- After submitting `Stop.` and clicking `I am agree with you` in the sidebar before the result arrives, `Stop.` appears at the top of the sidebar with a spinner, and the `I am agree with you` card stays on screen.
- When that check finishes, the spinner goes away and `Stop.` turns bold without opening. Clicking it shows its card and the sentence turns regular weight.
- Submitting `Thanks!` and waiting on the input screen opens its card, and `Thanks!` is regular weight in the sidebar.
- Doing the first check again with `이것은 테스트입니다` shows a warning icon before the sentence when the check finishes. Clicking it shows the input screen with `이것은 테스트입니다` in the textarea and `Please enter one English sentence.` under it, and the item is gone from the sidebar.
- With a failed item in the sidebar, clicking `New sentence` shows an empty textarea with no error message, and the failed item is still in the sidebar.
- Reloading while a failed item is in the sidebar removes it.
- On a 375px-wide window, after a check finishes while a history item's card is showing, the menu button shows a red dot. Opening the drawer shows the bold sentence or the warning icon. After opening that item, the dot is gone.
- On a 1280px-wide window, no red dot shows.
- `pnpm run lint` and `pnpm run build` pass.
