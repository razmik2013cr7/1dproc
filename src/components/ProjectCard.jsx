import { useState } from 'react'

function toEmbedUrl(url) {
  if (!url) return ''
  try {
    const u = new URL(url)
    // YouTube → embed
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const id =
        u.hostname.includes('youtu.be')
          ? u.pathname.slice(1)
          : u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : ''
    }
    // Vimeo → embed
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id ? `https://player.vimeo.com/video/${id}` : ''
    }
    return ''
  } catch {
    return ''
  }
}

function isVideoFile(url) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)
}

export default function ProjectCard({ project, onDelete, onEdit, busy }) {
  const [lightbox, setLightbox] = useState(null)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(project.title)
  const [description, setDescription] = useState(project.description || '')
  const [link, setLink] = useState(project.link || '')
  const [photos, setPhotos] = useState(project.photos || [])
  const [videos, setVideos] = useState(project.videos || [])

  const photosList = photos.filter(Boolean)
  const videosList = videos.filter(Boolean)

  const startEdit = () => {
    setTitle(project.title)
    setDescription(project.description || '')
    setLink(project.link || '')
    setPhotos(project.photos || [])
    setVideos(project.videos || [])
    setEditing(true)
  }

  const submitEdit = (e) => {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    onEdit(project.id, {
      title: t,
      description: description.trim(),
      link: link.trim(),
      photos,
      videos: videos.filter((v) => v.trim()),
    })
    setEditing(false)
  }

  const cover = photosList[0] || null

  return (
    <article className="project-card">
      {cover && (
        <img
          className="project-cover"
          src={cover}
          alt={project.title}
          loading="lazy"
          onClick={() => setLightbox(photosList)}
        />
      )}

      <h3 className="project-title">{project.title}</h3>
      {project.description && (
        <p className="project-desc">{project.description}</p>
      )}

      {videosList.length > 0 && (
        <div className="video-embeds">
          {videosList.map((v) => {
            const embed = toEmbedUrl(v)
            return embed ? (
              <iframe
                key={v}
                src={embed}
                title={`Video: ${project.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isVideoFile(v) ? (
              <video key={v} src={v} controls preload="metadata" />
            ) : (
              <a key={v} href={v} target="_blank" rel="noreferrer" className="project-link">
                ▶ Դիտել տեսանյութը
              </a>
            )
          })}
        </div>
      )}

      <div className="project-footer">
        {photosList.length > 1 && (
          <button
            type="button"
            className="chip"
            onClick={() => setLightbox(photosList)}
          >
            📷 {photosList.length} լուսանկար
          </button>
        )}
        {videosList.length > 0 && (
          <span className="chip">
            ▶ {videosList.length} տեսանյութ
          </span>
        )}
        {project.link && (
          <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
            Բացել նախագիծը →
          </a>
        )}
        {onEdit && (
          <button type="button" className="chip" onClick={startEdit} disabled={busy}>
            ✏️ Խմբագրել
          </button>
        )}
        {onDelete && (
          <button type="button" className="chip chip-danger" onClick={onDelete}>
            🗑 Հեռացնել
          </button>
        )}
        {lightbox && (
          <div className="modal-overlay" onClick={() => setLightbox(null)}>
            <div className="lightbox" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="lightbox-close"
                onClick={() => setLightbox(null)}
              >
                ✕
              </button>
              {lightbox.map((src, i) => (
                <img key={i} src={src} alt={`${project.title} ${i + 1}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Խմբագրել նախագիծը</h3>
            <form onSubmit={submitEdit}>
              <label className="field">
                Վերնագիր
                <input
                  type="text"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                />
              </label>
              <label className="field">
                Հղում
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
                  onClick={() => setEditing(false)}
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
    </article>
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
