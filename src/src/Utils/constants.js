export const PUNCTUATION = [",", ".", "!", ";", ":"]

export const SELECT_DEFAULT = "SELECT_DEFAULT"

export const HIGHLIGHTED_CLASS = "highlighted"
export const HOVER_HIGHLIGHTED_CLASS = "hover-highlighted"
export const VIEWING_HIGHLIGHTED_CLASS = "viewing-highlighted"

export const PART_ABBREVIATIONS = {
  inferno: 'Inf.',
  purgatorio: 'Purg.',
  paradiso: 'Par.',
}

export const PART_ORDER = {
  inferno: {
    next: 'purgatorio',
  },
  purgatorio: {
    next: 'paradiso',
    prev: 'inferno',
    prevNum: 34,
  },
  paradiso: {
    prev: 'purgatorio',
    prevNum: 33
  },
}

export const AUTH_ERROR_CODES = {
  "auth/invalid-email": 'Email is invalid. Please enter a valid email address.',
  "auth/invalid-credential": 'Incorrect email or password. Please try again.',
  "auth/wrong-password": 'Incorrect email or password. Please try again.',
  "auth/weak-password": "Password is too weak. Please choose a different password.",
  "auth/missing-email": "Please enter your email address.",
  "auth/missing-password": "Please enter a password.",
  "auth/missing-name": "Please enter your first and last name.",
  "auth/email-already-in-use": "Email already in use. Try logging in, or choose a different email.",
  default: 'An error occurred. Please try again',
}

export const DATABASE_URL = "https://divine-comedy-commentary-hub-default-rtdb.firebaseio.com"