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

function isImageFile(url) {
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url)
}

function isVideoFile(url) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)
}

export default function ProjectCard({ project, onDelete }) {
  const [lightbox, setLightbox] = useState(null)

  const photos = (project.photos || []).filter(Boolean)
  const videos = (project.videos || []).filter(Boolean)
  const photoCount = photos.length
  const videoCount = videos.length

  const cover = photos[0] || null

  return (
    <article className="project-card">
      {cover && (
        <img
          className="project-cover"
          src={cover}
          alt={project.title}
          loading="lazy"
          onClick={() => setLightbox(photos)}
          style={{ cursor: 'zoom-in' }}
        />
      )}

      <h3 className="project-title">{project.title}</h3>
      {project.description && (
        <p className="project-desc">{project.description}</p>
      )}

      {videoCount > 0 && (
        <div className="video-embeds">
          {videos.map((v) => {
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
        {photoCount > 1 && (
          <button
            type="button"
            className="chip"
            onClick={() => setLightbox(photos)}
          >
            📷 {photoCount} լուսանկար
          </button>
        )}
        {videoCount > 0 && (
          <span className="chip">
            ▶ {videoCount} տեսանյութ
          </span>
        )}
        {project.link && (
          <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
            Բացել նախագիծը →
          </a>
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
    </article>
  )
}
