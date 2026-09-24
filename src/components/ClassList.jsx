import { colorOf, sortedIndex } from '../colors.js'

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
      {classes.map((c) => {
        const col = colorOf(c, sortedIndex(classes, c))
        return (
          <button
            key={c.id}
            className={'class-card nb-card ' + col.grad}
            onClick={() => onSelect(c.id)}
          >
            <span className="nb-tape" aria-hidden="true" />
            <span className="nb-rings" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <i key={i} />
              ))}
            </span>
            <span className="nb-body">
              <span className="nb-name">{c.custom_name || c.name}</span>
              {c.custom_name && <span className="nb-code">դասարան {c.name}</span>}
              {c.description && <span className="nb-desc">{c.description}</span>}
              <span className="nb-count">{c.projects.length} նախագիծ</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
