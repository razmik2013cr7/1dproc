import { useState } from 'react'
import PinModal from './PinModal.jsx'
import ProjectCard from './ProjectCard.jsx'

export default function ClassView({
  classItem,
  onBack,
  onAddProject,
  onDeleteProject,
  busy,
}) {
  const [showPin, setShowPin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setLink('')
    setPhotos([])
    setVideos([])
  }

  const handleAddProject = async (e) => {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    const project = {
      title: t,
      description: description.trim(),
      link: link.trim(),
      photos,
      videos: videos.filter((v) => v.trim()),
    }
    await onAddProject(classItem.id, project)
    resetForm()
    setShowForm(false)
  }

  const handlePinSuccess = () => {
    setShowPin(false)
    setShowForm(true)
  }

  return (
    <div className="class-view">
      <div className="view-toolbar">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Հետ դասարաններին
        </button>
        <button className="btn btn-primary" onClick={() => setShowPin(true)}>
          + Ավելացնել նախագիծ
        </button>
      </div>

      <h2 className="view-title">{classItem.name}</h2>
      {classItem.description && (
        <p className="view-desc">{classItem.description}</p>
      )}

      {classItem.projects.length === 0 ? (
        <div className="empty">
          <p>Այս դասարանում դեռ նախագծեր չկան։</p>
        </div>
      ) : (
        <div className="project-grid">
          {classItem.projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onDelete={() => onDeleteProject(classItem.id, p.id)}
              busy={busy}
            />
          ))}
        </div>
      )}

      {showPin && (
        <PinModal
          title="Նախագիծ ավելացնել դասարանում"
          onCancel={() => setShowPin(false)}
          onSuccess={handlePinSuccess}
        />
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Նոր նախագիծ</h3>
            <form onSubmit={handleAddProject}>
              <label className="field">
                Վերնագիր
                <input
                  type="text"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="օր.՝ Ջրի ցիկլը բնության մեջ"
                  autoFocus
                  required
                />
              </label>
              <label className="field">
                Նկարագրություն
                <textarea
                  className="input"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Կարճ նկարագրություն"
                />
              </label>
              <label className="field">
                Հղում (ըստ ցանկության)
                <input
                  type="url"
                  className="input"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                />
              </label>

              <label className="field">
                Լուսանկարներ
                <MediaInput
                  items={photos}
                  onChange={setPhotos}
                  accept="image/*"
                  placeholder="https://... (լուսանկարի հղում)"
                />
              </label>

              <label className="field">
                Տեսանյութեր
                <MediaInput
                  items={videos}
                  onChange={setVideos}
                  placeholder="YouTube/Vimeo հղում կամ ուղիղ .mp4"
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

function MediaInput({ items, onChange, accept, placeholder }) {
  const [value, setValue] = useState('')

  const add = () => {
    const v = value.trim()
    if (!v || items.includes(v)) return
    onChange([...items, v])
    setValue('')
  }

  return (
    <div className="media-input">
      <div className="media-input-row">
        <input
          type={accept ? 'file' : 'url'}
          accept={accept}
          className="input"
          placeholder={placeholder}
          value={accept ? undefined : value}
          onChange={(e) => {
            if (accept) {
              const files = Array.from(e.target.files || [])
              files.forEach((f) => {
                const reader = new FileReader()
                reader.onload = () =>
                  onChange((prev) => [...prev, reader.result])
                reader.readAsDataURL(f)
              })
              e.target.value = ''
            } else {
              setValue(e.target.value)
            }
          }}
        />
        {!accept && (
          <button type="button" className="btn btn-ghost" onClick={add}>
            + Ավելացնել
          </button>
        )}
      </div>
      {items.length > 0 && (
        <div className="media-chips">
          {items.map((it, i) => (
            <span key={i} className="media-chip">
              {it.startsWith('data:') ? '📷 վերբեռնված' : it.slice(0, 32) + (it.length > 32 ? '…' : '')}
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
