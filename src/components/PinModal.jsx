import { useState } from 'react'
import { PIN } from '../pin.js'

export default function PinModal({ title, onCancel, onSuccess }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pin === PIN) {
      onSuccess()
    } else {
      setError('Սխալ ծածկագիր։ Փորձեք կրկին։')
      setPin('')
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
            value={pin}
            placeholder="Ծածկագիր"
            onChange={(e) => {
              setPin(e.target.value)
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
