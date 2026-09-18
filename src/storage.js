const STORAGE_KEY = 'imtivmek:classes:v3'

export function loadLocalClasses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLocalClasses(classes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes))
  } catch {
    // storage unavailable — keep app working in-memory
  }
}

export function clearLocalClasses() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
