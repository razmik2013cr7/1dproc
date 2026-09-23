import { useState } from 'react'
import PinModal from './PinModal.jsx'

// Photo-or-initials card in the style of escs.am hero cards:
// full-bleed image with a bold white title across the top.
export default function SectionView({ section, items, onBack, onAdd, onRemove, busy }) {
  const [showPin, setShowPin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [photo, setPhoto] = useState('')

  const resetForm = () => {
    setTitle('')
    setBody('')
    setPhoto('')
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    await onAdd({ title: t, body: body.trim(), photo })
    resetForm()
    setShowForm(false)
  }

  const handlePinSuccess = () => {
    setShowPin(false)
    setShowForm(true)
  }

  return (
    <div className="section-view">
      <div className="view-toolbar">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Հետ
        </button>
        <button className="btn btn-primary" onClick={() => setShowPin(true)}>
          + Ավելացնել
        </button>
      </div>

      <h2 className="view-title">{section.title}</h2>
      {section.subtitle && <p className="view-desc">{section.subtitle}</p>}

      {items.length === 0 ? (
        <div className="empty">
          <p>Դեռ տվյալներ չկան։</p>
          <p className="empty-sub">
            Օգտագործեք «+ Ավելացնել» կոճակը՝ ծածկագրով։
          </p>
        </div>
      ) : (
        <div className="hero-grid">
          {items.map((it) => (
            <article key={it.id} className="hero-card">
              {it.photo ? (
                <img src={it.photo} alt={it.title} loading="lazy" />
              ) : (
                <div className={'hero-card-fallback ' + section.grad}>
                  <span>{section.emoji}</span>
                </div>
              )}
              <div className="hero-card-body">
                <h3>{it.title}</h3>
                {it.body && <p>{it.body}</p>}
              </div>
              {onRemove && (
                <button
                  type="button"
                  className="chip chip-danger hero-remove"
                  onClick={() => onRemove(it.id)}
                  disabled={busy}
                >
                  🗑 Հեռացնել
                </button>
              )}
            </article>
          ))}
        </div>
      )}

      {showPin && (
        <PinModal
          title={`Ավելացնել — ${section.title}`}
          onCancel={() => setShowPin(false)}
          onSuccess={handlePinSuccess}
        />
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              Նոր գրառում — {section.title}
            </h3>
            <form onSubmit={handleAdd}>
              <label className="field">
                Վերնագիր
                <input
                  type="text"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="օր.՝ Դպրոցի հիմնադրումը"
                  autoFocus
                  required
                />
              </label>
              <label className="field">
                Նկարագրություն
                <textarea
                  className="input"
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Տեքստ…"
                />
              </label>
              <label className="field">
                Լուսանկար (ըստ ցանկության)
                <input
                  type="file"
                  accept="image/*"
                  className="input"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    const reader = new FileReader()
                    reader.onload = () => setPhoto(reader.result)
                    reader.readAsDataURL(f)
                  }}
                />
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    resetForm()
                    setShowForm(false)
                  }}
                >
                  Չեղարկել
                </button>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  Ավելացնել
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
