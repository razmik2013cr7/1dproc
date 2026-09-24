import { useState } from 'react'
import { pinFor } from '../pin.js'

// `pin` may be:
//   - a string (compare directly)
//   - a class object (compare against its own PIN, falling back to master)
//   - undefined (fall back to master PIN)
export default function PinModal({ title, pin, onCancel, onSuccess }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const expected = typeof pin === 'string' ? pin : pinFor(pin)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value === expected) {
      onSuccess()
    } else {
      setError('Սխալ ծածկագիր։ Փորձեք կրկին։')
      setValue('')
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-sub">Մուտքագրեք ծածկագիրը՝ շարունակելու համար։</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="input"
            value={value}
            placeholder="Ծածկագիր"
            onChange={(e) => {
              setValue(e.target.value)
              setError('')
            }}
            autoFocus
          />
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Չեղարկել
            </button>
            <button type="submit" className="btn btn-primary">
              Հաստատել
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
