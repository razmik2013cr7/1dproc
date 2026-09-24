// Notebook-cover palette for class cards.
// Each class gets one random color at creation; picking skips colors that
// are already taken so parallel classes look different.

export const NOTEBOOK_COLORS = [
  { name: 'amber', grad: 'nb-amber', base: '#f59e0b' },
  { name: 'blue', grad: 'nb-blue', base: '#3b82f6' },
  { name: 'violet', grad: 'nb-violet', base: '#8b5cf6' },
  { name: 'green', grad: 'nb-green', base: '#10b981' },
  { name: 'rose', grad: 'nb-rose', base: '#f43f5e' },
  { name: 'cyan', grad: 'nb-cyan', base: '#06b6d4' },
  { name: 'orange', grad: 'nb-orange', base: '#f97316' },
  { name: 'teal', grad: 'nb-teal', base: '#14b8a6' },
  { name: 'indigo', grad: 'nb-indigo', base: '#6366f1' },
  { name: 'lime', grad: 'nb-lime', base: '#84cc16' },
  { name: 'fuchsia', grad: 'nb-fuchsia', base: '#d946ef' },
  { name: 'red', grad: 'nb-red', base: '#ef4444' },
  { name: 'pink', grad: 'nb-pink', base: '#ec4899' },
  { name: 'sky', grad: 'nb-sky', base: '#0ea5e9' },
  { name: 'emerald', grad: 'nb-emerald', base: '#059669' },
  { name: 'slate', grad: 'nb-slate', base: '#64748b' },
]

// Pick a random color not used by any existing class (falls back to a
// fully random pick if all are taken).
export function pickColor(existingClasses) {
  const used = new Set(
    (existingClasses || [])
      .map((c) => normalizeColor(c))
      .filter(Boolean),
  )

  const free = NOTEBOOK_COLORS.filter((c) => !used.has(c.name))
  const pool = free.length > 0 ? free : NOTEBOOK_COLORS
  return pool[Math.floor(Math.random() * pool.length)]
}

// Resolve a class's color entry from its stored name or its gradient class.
// `fallbackIndex` (position of the class in the name-sorted list) keeps the
// fallback deterministic AND unique within the list, so pre-existing classes
// without a saved color never collide.
export function colorOf(cls, fallbackIndex) {
  const byName = cls && cls.color ? NOTEBOOK_COLORS.find((c) => c.name === cls.color) : null
  if (byName) return byName

  const legacy =
    cls && cls.color_grad
      ? NOTEBOOK_COLORS.find((c) => c.grad === cls.color_grad)
      : null
  if (legacy) return legacy

  if (Number.isInteger(fallbackIndex) && fallbackIndex >= 0) {
    return NOTEBOOK_COLORS[fallbackIndex % NOTEBOOK_COLORS.length]
  }

  const hash = String((cls && cls.name) || '?')
    .split('')
    .reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7)
  return NOTEBOOK_COLORS[hash % NOTEBOOK_COLORS.length]
}

// Position of a class within the name-sorted list — used for the
// deterministic unique fallback color.
export function sortedIndex(classes, cls) {
  const sorted = [...(classes || [])].sort((a, b) =>
    String(a.name).localeCompare(String(b.name), 'hy'),
  )
  return sorted.findIndex((c) => c.id === (cls && cls.id))
}

function normalizeColor(cls) {
  if (!cls) return null
  if (cls.color) return cls.color
  const byGrad = cls.color_grad
    ? NOTEBOOK_COLORS.find((c) => c.grad === cls.color_grad)
    : null
  return byGrad ? byGrad.name : null
}
