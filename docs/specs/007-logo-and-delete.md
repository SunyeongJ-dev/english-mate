# 007: Logo button and deleting history

## Goal

Clicking the logo goes back to the input screen, like `New sentence`. The user can delete an item from the history list.

## In scope

### Logo button

- [x] The logo mark and the `English Mate` text next to it are one button. This is true in the desktop sidebar, the mobile header, and the mobile drawer.
- [x] Clicking it does the same as `New sentence`: the input screen shows with an empty, focused textarea, and no item is highlighted. While a check is loading, the input screen shows in its loading state with the submitted sentence.
- [x] In the drawer, clicking it also closes the drawer.
- [x] Screen readers get the name `English Mate` for the button, also when the text is hidden on a narrow window.
- [x] The button works with the keyboard and shows a visible focus ring.

### Delete button

- [x] Every saved item and every failed item in the history list has a delete button with a trash icon at the right end of its row. A pending item has none.
- [x] In the desktop sidebar, the delete button shows only while the pointer is over the row or keyboard focus is in the row. In the mobile drawer, it always shows.
- [x] The icon is `neutral-600`, and `red-700` while the pointer is over the button.
- [x] The delete button works with the keyboard and shows a visible focus ring. Its `aria-label` is the text `Delete` in the selected language, then the item's sentence, like `Delete: Thanks!`.

### Deleting

- [x] Clicking the delete button removes the item from the list right away, with no confirmation.
- [x] A deleted saved item is removed from `localStorage` and is still gone after a reload.
- [x] Deleting the item whose card is showing does the same as `New sentence`.
- [x] Deleting any other item does not change the main screen. In the drawer, the drawer stays open.
- [x] Deleting the last item shows the empty text of the list.
- [x] A failed item can be deleted while another check is loading.
- [x] The menu button's red dot goes away when the deleted item was the last bold or failed item.

## Text

| English | French | Korean |
| --- | --- | --- |
| Delete | Supprimer | 삭제 |

## Out of scope

- Asking for confirmation, or undoing a delete
- Clearing all history at once
- Cancelling a check that is loading
- Moving keyboard focus to a neighbouring item after a delete
- Swiping to delete on mobile
- Dark mode (spec 008)

## Done when

- On a 1280px-wide window with a result card showing, clicking the logo in the sidebar shows the input screen with an empty, focused textarea, and no sidebar item is highlighted.
- On a 375px-wide window with a result card showing, clicking the logo in the header shows the input screen. Clicking the logo in the drawer shows the input screen and closes the drawer.
- With `I am agree with you` and `Thanks!` in the sidebar, moving the pointer over `Thanks!` shows a trash icon at the right end of that row only.
- Clicking that icon removes `Thanks!` from the sidebar with no confirmation. After a reload, it is still gone.
- With the `I am agree with you` card showing, deleting `I am agree with you` shows the input screen with an empty textarea, and the sidebar shows `No chats yet`.
- With the `I am agree with you` card showing, deleting another item keeps that card on screen.
- Pressing Tab through the sidebar reaches each delete button, and the button shows while it has focus. Pressing Enter on it deletes the item.
- On a 375px-wide window, every saved and failed item in the drawer shows its trash icon without hovering. Deleting an item keeps the drawer open.
- With a failed item in the list, clicking its trash icon removes it. If it was the only bold or failed item, the menu button's red dot goes away.
- With `KO` selected, the delete button's `aria-label` for `Thanks!` is `삭제: Thanks!`.
- `Delete` appears only once in the source code as a text, in `app/lib/texts.ts`.
- `pnpm run lint` and `pnpm run build` pass.
