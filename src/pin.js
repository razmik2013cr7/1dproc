// Central place to change PINs.
// Note: this is client-side only — it gates the UI, not real security.

// Master/admin PIN — still guards create/remove class and section edits.
export const PIN = 'IM1dpRoc!!!'

// Per-class PINs from the school's notebook (the code each class uses to
// add projects to its own page). Keys are class names, e.g. «10ա».
// New classes get their own PIN chosen at creation time.
export const CLASS_PINS = {
  '10ա': '#space1',
  '10բ': '10Bb2026',
  '10գ': 'Smart22!',
  '10դ': '#justiti10',
  '11ա': 'Lpzuren11',
  '11բ': '#BnF11',
  '11գ': '2025Lg#',
  '11դ': '#SuS12',
  '12ա': '#Hovo2014',
  '12բ': '', // no password given
  '12գ': '', // no password given
  '12դ': 'Hovo2014!',
  '12ե': '1School12#',
  '12զ': '#12Tntes', // from the earlier notebook reading — say the word to remove
}

// The PIN that unlocks a given class's project form: the class's own code
// (created with the class or from the notebook), falling back to the
// master PIN for classes with no code assigned yet.
export function pinFor(cls) {
  const own = (cls && cls.pin) || (cls && CLASS_PINS[cls.name]) || ''
  return own || PIN
}
