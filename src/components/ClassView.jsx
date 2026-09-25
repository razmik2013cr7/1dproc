import { useState } from 'react'
import PinModal from './PinModal.jsx'
import ProjectCard from './ProjectCard.jsx'

export default function ClassView({
  classItem,
  color,
  onBack,
  onAddProject,
  onDeleteProject,
  onRename,
  onEditProject,
  busy,
}) {
  const [showPin, setShowPin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null) // project id pending PIN
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
    if (deleteTarget) {
      onDeleteProject(classItem.id, deleteTarget)
      setDeleteTarget(null)
    } else {
      setShowForm(true)
    }
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

      <h2 className="view-title">
        <span
          className="nb-swatch"
          style={{ background: color ? color.base : undefined }}
        />
        {classItem.custom_name || classItem.name}
      </h2>
      {classItem.custom_name && (
        <p className="view-code">դասարան {classItem.name}</p>
      )}
      {classItem.description && (
        <p className="view-desc">{classItem.description}</p>
      )}

      <div className="rename-row">
        <button
          className="btn btn-ghost btn-small"
          onClick={() => {
            setRenameValue(classItem.custom_name || '')
            setShowRename(true)
          }}
        >
          ✏️ Անվանափոխել
        </button>
      </div>

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
              onDelete={() => setDeleteTarget(p.id)}
              onEdit={(projectId, project) => onEditProject(classItem.id, projectId, project)}
              busy={busy}
            />
          ))}
        </div>
      )}

      {showPin && (
        <PinModal
          title={`Նախագիծ ավելացնել «${classItem.name}»-ում`}
          pin={classItem}
          onCancel={() => setShowPin(false)}
          onSuccess={handlePinSuccess}
        />
      )}

      {deleteTarget && (
        <PinModal
          title={`Հեռացնել նախագիծ «${classItem.name}»-ից`}
          pin={classItem}
          onCancel={() => setDeleteTarget(null)}
          onSuccess={handlePinSuccess}
        />
      )}

      {showRename && (
        <div className="modal-overlay" onClick={() => setShowRename(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Անվանափոխել դասարանը</h3>
            <p className="modal-sub">
              Դասարանի կոդը մնում է «{classItem.name}» — փոխվում է միայն ցուցադրվող անունը։
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                onRename(classItem.id, renameValue.trim())
                setShowRename(false)
              }}
            >
              <label className="field">
                Դասարանի անուն
                <input
                  type="text"
                  className="input"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="օր.՝ Our Learning Space"
                  autoFocus
                />
              </label>
              <p className="field-hint">Դատարկ թողնելու դեպքում կցուցադրվի «{classItem.name}»։</p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowRename(false)}
                >
                  Չեղարկել
                </button>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  Պահպանել
                </button>
              </div>
            </form>
          </div>
        </div>
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
