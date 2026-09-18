export default function ClassList({ classes, onSelect }) {
  if (classes.length === 0) {
    return (
      <div className="empty">
        <p>Դեռ դասարաններ չկան։</p>
        <p className="empty-sub">
          Օգտագործեք «+ Ստեղծել դասարան» կոճակը՝ ծածկագրով։
        </p>
      </div>
    )
  }

  return (
    <div className="class-grid">
      {classes.map((c) => (
        <button key={c.id} className="class-card" onClick={() => onSelect(c.id)}>
          <span className="class-icon">📘</span>
          <span className="class-name">{c.name}</span>
          {c.description && <span className="class-desc">{c.description}</span>}
          <span className="class-count">
            {c.projects.length} նախագիծ
          </span>
        </button>
      ))}
    </div>
  )
}
