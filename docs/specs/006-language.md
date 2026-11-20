# 006: Language

## Goal

The user picks English, French, or Korean, and the whole app speaks that language: the labels, the error messages, and Claude's note. The sentences Claude suggests are always in English.

## In scope

### Choosing a language

- [x] The language switcher offers `EN`, `FR`, and `KO`. A first-time visitor starts in `EN`.
- [x] The choice is saved in `localStorage` and is still selected after a reload.
- [x] If the saved choice is damaged or `localStorage` is blocked, the app starts in `EN` and shows no error message.
- [x] Switching the language changes the text on screen right away, without a reload.
- [x] The page's `lang` attribute matches the selected language.

### What is translated

- [x] Every text in the table in "Text" shows in the selected language. This includes text that only screen readers get, such as `aria-label` values.
- [x] Claude writes `note` in the language that was selected when the sentence was submitted. `formal` and `casual` are always in English.
- [x] Error messages show in the language that was selected when the sentence was submitted. This is true for messages from `app/api/chat/route.ts` and for the message the page shows when the request itself fails.
- [x] A request with a missing or unknown language gets its error message in English.

### What keeps its language

- [x] A result card's `note` stays in the language its sentence was checked in. The card's labels, level sentence, and buttons follow the selected language like the rest of the screen.
- [x] An error message that is showing, and the message of a failed item in the history list, do not change when the user switches the language.
- [x] `English Mate`, the footer, the switcher's `EN`, `FR`, and `KO`, the user's own sentences, and the browser tab title and description are the same in every language.

### Code

- [x] Each text in the table is defined once per language, in one place. Components hold none of these texts themselves.
- [x] A missing translation is a TypeScript error, not a blank on screen.

## Text

| English                                                  | French                                                           | Korean                                                   |
| -------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| What do you want to say today?                           | Que voulez-vous dire aujourd'hui ?                               | 오늘은 어떤 말을 하고 싶으세요?                          |
| Write one English sentence to see how natural it sounds. | Écrivez une phrase en anglais pour voir si elle sonne naturelle. | 영어 문장 하나를 쓰고 얼마나 자연스러운지 확인해 보세요. |
| Type your sentence here...                               | Écrivez votre phrase ici...                                      | 여기에 문장을 입력하세요...                              |
| Press Enter to check.                                    | Appuyez sur Entrée pour vérifier.                                | Enter를 누르면 검사합니다.                               |
| Checking your sentence...                                | Vérification de votre phrase...                                  | 문장을 검사하는 중...                                    |
| Send sentence                                            | Envoyer la phrase                                                | 문장 보내기                                              |
| Sending sentence                                         | Envoi de la phrase                                               | 문장 보내는 중                                           |
| Your sentence                                            | Votre phrase                                                     | 내 문장                                                  |
| Review result                                            | Résultat de la vérification                                      | 검사 결과                                                |
| Formal                                                   | Formel                                                           | 격식 표현                                                |
| Casual                                                   | Familier                                                         | 비격식 표현                                              |
| Note                                                     | Remarque                                                         | 설명                                                     |
| Copy formal sentence                                     | Copier la phrase formelle                                        | 격식 문장 복사                                           |
| Copy casual sentence                                     | Copier la phrase familière                                       | 비격식 문장 복사                                         |
| Copied                                                   | Copié                                                            | 복사됨                                                   |
| Copy failed                                              | Échec de la copie                                                | 복사 실패                                                |
| New sentence                                             | Nouvelle phrase                                                  | 새 문장                                                  |
| No chats yet                                             | Aucune conversation                                              | 기록된 대화가 없습니다                                   |
| Chat history                                             | Historique des conversations                                     | 대화 기록                                                |
| History                                                  | Historique                                                       | 기록                                                     |
| Open history                                             | Ouvrir l'historique                                              | 기록 열기                                                |
| Open history, new update                                 | Ouvrir l'historique, nouveauté                                   | 기록 열기, 새 소식 있음                                  |
| Close history                                            | Fermer l'historique                                              | 기록 닫기                                                |
| Checking                                                 | Vérification en cours                                            | 검사 중                                                  |
| New result                                               | Nouveau résultat                                                 | 새 결과                                                  |
| Check failed                                             | Échec de la vérification                                         | 검사 실패                                                |
| Language                                                 | Langue                                                           | 언어                                                     |
| Please enter your sentence.                              | Veuillez saisir votre phrase.                                    | 문장을 입력해 주세요.                                    |
| Input is too long.                                       | Le texte est trop long.                                          | 문장이 너무 깁니다.                                      |
| Please enter one English sentence.                       | Veuillez saisir une seule phrase en anglais.                     | 하나의 영어 문장을 입력해 주세요.                        |
| Something went wrong. Please try again.                  | Une erreur s'est produite. Veuillez réessayer.                   | 문제가 발생했습니다. 다시 시도해 주세요.                 |

The three level sentences are in `levels` in `app/lib/texts.ts`.

## Out of scope

- Languages other than English, French, and Korean
- Picking the first language from the browser's settings
- Translating the browser tab title and description
- Translating the `note` of a saved result: it keeps the language it was checked in
- Checking sentences in a language other than English

## Done when

- On a first visit, `EN` is selected and the heading says `What do you want to say today?`
- Clicking `KO` changes the heading to `오늘은 어떤 말을 하고 싶으세요?` and the sidebar's empty text to `기록된 대화가 없습니다`, without a reload. Reloading keeps `KO` selected.
- With `KO` selected, submitting `I am agree with you` shows a card with the labels `내 문장`, `격식 표현`, `비격식 표현`, and `설명`, a note in Korean, and formal and casual sentences in English.
- With that card showing, clicking `FR` changes its labels to `Votre phrase`, `Formel`, `Familier`, and `Remarque`, and its button to `Nouvelle phrase`. The note stays in Korean.
- With `FR` selected, submitting `이것은 테스트입니다` shows `Veuillez saisir une seule phrase en anglais.`
- With `KO` selected, submitting an empty input shows `문장을 입력해 주세요.`, and submitting 1001 characters shows `문장이 너무 깁니다.`
- With `KO` selected and the network turned off in the browser's developer tools, submitting a sentence shows `문제가 발생했습니다. 다시 시도해 주세요.`
- With an error message showing in Korean, clicking `EN` keeps the message in Korean. It goes away after typing one character.
- With `FR` selected on a 375px-wide window, the menu button's `aria-label` is `Ouvrir l'historique`.
- With `localStorage` blocked in the browser, the page opens in `EN` and the switcher still changes the language.
- Each English text in the table in "Text" appears only once in the source code.
- `pnpm run lint` and `pnpm run build` pass.
