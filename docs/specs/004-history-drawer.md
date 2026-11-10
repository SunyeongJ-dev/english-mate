# 004: History drawer on mobile

## Goal

On mobile, where the sidebar is hidden, the user can open the history list from the header and choose a sentence.

## In scope

- [ ] On mobile (narrower than `md`), the header shows a menu button on the left, before the logo mark. It is an icon button with the `aria-label` `Open history` and a touch target of at least 44px.
- [ ] The menu button opens the sidebar as a drawer from the left, over the page, with a dimmed backdrop behind it. The drawer shows the same content as the desktop sidebar.
- [ ] The drawer has a close button with the `aria-label` `Close history`. The drawer also closes on Escape, on a click on the backdrop, and when the user chooses an item.
- [ ] When the drawer opens, focus moves into it and stays inside it. When it closes without an item chosen, focus goes back to the menu button.
- [ ] On desktop (`md` and wider), there is no menu button and no drawer. The sidebar always shows.
- [ ] The drawer works at 320px wide without horizontal scrolling.
- [ ] The backdrop is `neutral-900` at 40% opacity. No class uses `black`.

## Out of scope

- Swipe gestures to open or close the drawer
- Animations for opening and closing
- Translating the drawer's labels (spec 006)

## Done when

- On a 375px-wide window, the header shows a menu button. Clicking it opens the drawer with the history list.
- Clicking an item closes the drawer and shows that item's card.
- Opening the drawer again and pressing Escape closes it and puts focus back on the menu button.
- On a 1280px-wide window, there is no menu button and the sidebar shows on the left.
- Opening the drawer, choosing an item, and closing the drawer all work with the keyboard only.
- `pnpm run lint` and `pnpm run build` pass.
