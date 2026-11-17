import { Language } from "@/app/lib/types";

// Every text the app shows, once per language. The table in
// docs/specs/006-language.md is the source for these.
const en = {
  // Input screen
  heading: "What do you want to say today?",
  intro: "Write one English sentence to see how natural it sounds.",
  placeholder: "Type your sentence here...",
  enterHint: "Press Enter to check.",
  checkingSentence: "Checking your sentence...",
  send: "Send sentence",
  sending: "Sending sentence",

  // Result card
  yourSentence: "Your sentence",
  reviewResult: "Review result",
  formal: "Formal",
  casual: "Casual",
  note: "Note",
  copyFormal: "Copy formal sentence",
  copyCasual: "Copy casual sentence",
  copied: "Copied",
  copyFailed: "Copy failed",
  newSentence: "New sentence",

  // History list, drawer, and header
  noChats: "No chats yet",
  chatHistory: "Chat history",
  history: "History",
  openHistory: "Open history",
  openHistoryUpdate: "Open history, new update",
  closeHistory: "Close history",
  checking: "Checking",
  newResult: "New result",
  checkFailed: "Check failed",
  deleteItem: "Delete",
  language: "Language",

  // Error messages
  emptyInput: "Please enter your sentence.",
  tooLong: "Input is too long.",
  invalidInput: "Please enter one English sentence.",
  requestFailed: "Something went wrong. Please try again.",

  // The sentence a result card shows for each level
  levels: {
    natural: "This sounds natural.",
    slightly_awkward: "This is a bit awkward.",
    awkward: "This sounds quite awkward.",
  },
};

// The other languages must have the same keys as English, so a missing
// translation is a TypeScript error.
export type Texts = typeof en;

const fr: Texts = {
  heading: "Que voulez-vous dire aujourd'hui ?",
  intro: "Écrivez une phrase en anglais pour voir si elle sonne naturelle.",
  placeholder: "Écrivez votre phrase ici...",
  enterHint: "Appuyez sur Entrée pour vérifier.",
  checkingSentence: "Vérification de votre phrase...",
  send: "Envoyer la phrase",
  sending: "Envoi de la phrase",

  yourSentence: "Votre phrase",
  reviewResult: "Résultat de la vérification",
  formal: "Formel",
  casual: "Familier",
  note: "Remarque",
  copyFormal: "Copier la phrase formelle",
  copyCasual: "Copier la phrase familière",
  copied: "Copié",
  copyFailed: "Échec de la copie",
  newSentence: "Nouvelle phrase",

  noChats: "Aucune conversation",
  chatHistory: "Historique des conversations",
  history: "Historique",
  openHistory: "Ouvrir l'historique",
  openHistoryUpdate: "Ouvrir l'historique, nouveauté",
  closeHistory: "Fermer l'historique",
  checking: "Vérification en cours",
  newResult: "Nouveau résultat",
  checkFailed: "Échec de la vérification",
  deleteItem: "Supprimer",
  language: "Langue",

  emptyInput: "Veuillez saisir votre phrase.",
  tooLong: "Le texte est trop long.",
  invalidInput: "Veuillez saisir une seule phrase en anglais.",
  requestFailed: "Une erreur s'est produite. Veuillez réessayer.",

  levels: {
    natural: "Cette phrase est naturelle.",
    slightly_awkward: "Cette phrase est un peu maladroite.",
    awkward: "Cette phrase est assez maladroite.",
  },
};

const ko: Texts = {
  heading: "오늘은 어떤 말을 하고 싶으세요?",
  intro: "영어 문장 하나를 쓰고 얼마나 자연스러운지 확인해 보세요.",
  placeholder: "여기에 문장을 입력하세요...",
  enterHint: "Enter를 누르면 검사합니다.",
  checkingSentence: "문장을 검사하는 중...",
  send: "문장 보내기",
  sending: "문장 보내는 중",

  yourSentence: "내 문장",
  reviewResult: "검사 결과",
  formal: "격식 표현",
  casual: "비격식 표현",
  note: "설명",
  copyFormal: "격식 문장 복사",
  copyCasual: "비격식 문장 복사",
  copied: "복사됨",
  copyFailed: "복사 실패",
  newSentence: "새 문장",

  noChats: "기록된 대화가 없습니다",
  chatHistory: "대화 기록",
  history: "기록",
  openHistory: "기록 열기",
  openHistoryUpdate: "기록 열기, 새 소식 있음",
  closeHistory: "기록 닫기",
  checking: "검사 중",
  newResult: "새 결과",
  checkFailed: "검사 실패",
  deleteItem: "삭제",
  language: "언어",

  emptyInput: "문장을 입력해 주세요.",
  tooLong: "문장이 너무 깁니다.",
  invalidInput: "하나의 영어 문장을 입력해 주세요.",
  requestFailed: "문제가 발생했습니다. 다시 시도해 주세요.",

  levels: {
    natural: "자연스러운 문장입니다.",
    slightly_awkward: "약간 어색한 문장입니다.",
    awkward: "꽤 어색한 문장입니다.",
  },
};

export const TEXTS: Record<Language, Texts> = { en, fr, ko };
