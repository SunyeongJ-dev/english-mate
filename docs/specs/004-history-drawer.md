# 004: History drawer on mobile

## Goal

On mobile, where the sidebar is hidden, the user can open the history list from the header and choose a sentence.

## In scope

- [x] On mobile (narrower than `md`), the header shows a menu button on the left, before the logo mark. It is an icon button with the `aria-label` `Open history` and a touch target of at least 44px.
- [x] The header fits at 320px wide with the menu button in it: nothing wraps, is cut off, or scrolls sideways. Narrower than 375px, the header hides the `English Mate` text and keeps the logo mark.
- [x] The menu button opens the sidebar as a drawer from the left, over the page, with a dimmed backdrop behind it. The drawer shows the same content as the desktop sidebar, including `No chats yet` when there is no history.
- [x] The drawer has a close button with the `aria-label` `Close history`. The drawer also closes on Escape, on a click on the backdrop, and when the user chooses an item.
- [x] When the drawer opens, focus moves into it and stays inside it.
- [x] While the drawer is open, screen readers treat it as a dialog named `History`, and the page behind it cannot be clicked, focused, or read.
- [x] When the drawer closes without an item chosen, focus goes back to the menu button.
- [x] When the user chooses an item, focus moves to that item's result card. This is also true when the chosen item's card is already showing.
- [x] On desktop (`md` and wider), there is no menu button and no drawer. The sidebar always shows.
- [x] The drawer works at 320px wide without horizontal scrolling.
- [x] The backdrop is `neutral-900` at 40% opacity. No class uses `black`.

## Out of scope

- Swipe gestures to open or close the drawer
- Animations for opening and closing
- Translating the drawer's labels (spec 006)

## Done when

- On a 375px-wide window, the header shows a menu button. Clicking it opens the drawer with the history list.
- On a 320px-wide window, the header shows the menu button, the logo mark, and the language switcher on one line, without the `English Mate` text, and nothing scrolls sideways.
- On a 375px-wide window, the header also shows the `English Mate` text, on one line.
- With empty `localStorage`, opening the drawer shows `No chats yet`.
- Clicking an item closes the drawer and shows that item's card, with focus on the card.
- With an item's card showing, opening the drawer and choosing the same item closes the drawer and puts focus on the card.
- With the drawer open, pressing Tab many times never moves focus to the page behind it.
- Opening the drawer again and pressing Escape closes it and puts focus back on the menu button.
- On a 1280px-wide window, there is no menu button and the sidebar shows on the left.
- Opening the drawer, choosing an item, and closing the drawer all work with the keyboard only.
- `pnpm run lint` and `pnpm run build` pass.
