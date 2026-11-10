# 005: Check states in the sidebar

## Goal

When the user opens a history item while a check is loading, the check moves to the sidebar. The sidebar then shows whether it is still loading, has a new result, or failed.

## In scope

### Pending

- [ ] When the user opens a history item while a check is loading, a pending item with the submitted sentence appears at the top of the list, with a small spinner before the sentence.
- [ ] The card on screen and the highlighted item do not change when the check finishes.
- [ ] Clicking the pending item, or `New sentence`, while the check is still loading shows the input screen in its loading state with the submitted sentence in the textarea. The pending item leaves the list.

### New result

- [ ] When the check succeeds, the pending item becomes a saved history item in the same place, with its sentence in bold.
- [ ] Opening the item shows its card and makes the sentence regular weight.
- [ ] The bold state is not saved. After a reload, every sentence is regular weight.

### Failed

- [ ] When the check fails, the pending item becomes a failed item in the same place, with a warning icon (a triangle with an exclamation mark) in `red-700` before the sentence.
- [ ] A failed item is not saved in `localStorage`, does not count toward the limit of 50, and is gone after a reload.
- [ ] Clicking a failed item shows the input screen with its sentence in the textarea and its error message under the input. The failed item leaves the list.
- [ ] A failed item is disabled while another check is loading.

### Accessibility

- [ ] Each state has visually hidden text for screen readers: `Checking`, `New result`, and `Check failed`. The spinner, the bold text, and the icon are never the only sign.
- [ ] The spinner does not spin when the user prefers reduced motion.

## Out of scope

- Running more than one check at the same time
- Keeping failed items or the bold state after a reload
- Translating the hidden text (spec 006)

## Done when

- After submitting `Stop.` and clicking `I am agree with you` in the sidebar before the result arrives, `Stop.` appears at the top of the sidebar with a spinner, and the `I am agree with you` card stays on screen.
- When that check finishes, the spinner goes away and `Stop.` turns bold without opening. Clicking it shows its card and the sentence turns regular weight.
- Doing the same with `이것은 테스트입니다` shows a warning icon before the sentence when the check finishes. Clicking it shows the input screen with `이것은 테스트입니다` in the textarea and `Please enter one English sentence.` under it, and the item is gone from the sidebar.
- Reloading while a failed item is in the sidebar removes it.
- `pnpm run lint` and `pnpm run build` pass.
