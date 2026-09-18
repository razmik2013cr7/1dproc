import { useEffect, useState } from 'react'
import ClassList from './components/ClassList.jsx'
import ClassView from './components/ClassView.jsx'
import PinModal from './components/PinModal.jsx'
import { loadLocalClasses, saveLocalClasses, clearLocalClasses } from './storage.js'
import {
  fetchClasses,
  createClass as apiCreateClass,
  removeClass as apiRemoveClass,
  addProject as apiAddProject,
  deleteProject as apiDeleteProject,
  migrateLocalClasses,
} from './api.js'
import './index.css'

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const LETTERS = ['ա', 'բ', 'գ', 'դ', 'ե', 'զ']

export default function App() {
  const [classes, setClasses] = useState(loadLocalClasses)
  const [selectedId, setSelectedId] = useState(null)
  const [pinAction, setPinAction] = useState(null) // 'create' | { type: 'remove', id }
  const [showCreate, setShowCreate] = useState(false)
  const [grade, setGrade] = useState('10')
  const [letter, setLetter] = useState('ա')
  const [newDesc, setNewDesc] = useState('')
  const [cloud, setCloud] = useState(false) // true = connected to Supabase
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const selected = classes.find((c) => c.id === selectedId) || null

  // Local-only mutation (offline fallback) — also persists to localStorage
  const mutateLocal = (fn) => {
    setClasses((prev) => {
      const next = fn(prev)
      saveLocalClasses(next)
      return next
    })
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const remote = await fetchClasses()
        if (cancelled) return

        // One-time migration: push local classes up if the cloud is empty
        const local = loadLocalClasses()
        if (remote.length === 0 && local.length > 0) {
          setBusy(true)
          try {
            const migrated = await migrateLocalClasses(local)
            if (cancelled) return
            setClasses(migrated)
            setCloud(true)
            clearLocalClasses()
            setNotice('Տեղական դասարանները տեղափոխվեցին ամպ ☁️')
          } catch {
            if (!cancelled) {
              setCloud(true)
              setNotice('Ամպը կապակցված է, բայց տեղական տվյալները չհաջողվեց տեղափոխել։')
            }
          } finally {
            if (!cancelled) setBusy(false)
          }
          return
        }

        if (!cancelled) {
          setClasses(remote)
          setCloud(true)
        }
      } catch {
        // Supabase unreachable / tables missing — stay in local mode
        if (!cancelled) setCloud(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const name = `${grade}${letter}`
    if (classes.some((c) => c.name === name)) {
      alert('Այս դասարանն արդեն կա։')
      return
    }
    if (cloud) {
      setBusy(true)
      try {
        const created = await apiCreateClass(name, newDesc.trim())
        setClasses((prev) => [...prev, created])
        setShowCreate(false)
        setNewDesc('')
      } catch (err) {
        if (String(err?.code) === '23505') {
          alert('Այս դասարանն արդեն կա։')
        } else {
          alert('Չհաջողվեց ստեղծել դասարանը: ' + (err?.message || ''))
        }
      } finally {
        setBusy(false)
      }
    } else {
      mutateLocal((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          name,
          description: newDesc.trim(),
          projects: [],
        },
      ])
      setShowCreate(false)
      setNewDesc('')
    }
  }

  const handleRemove = async (id) => {
    if (cloud) {
      setBusy(true)
      try {
        await apiRemoveClass(id)
        setClasses((prev) => prev.filter((c) => c.id !== id))
        if (selectedId === id) setSelectedId(null)
      } catch (err) {
        alert('Չհաջողվեց հեռացնել դասարանը: ' + (err?.message || ''))
      } finally {
        setBusy(false)
      }
    } else {
      mutateLocal((prev) => prev.filter((c) => c.id !== id))
      if (selectedId === id) setSelectedId(null)
    }
  }

  const handleAddProject = async (classId, project) => {
    if (cloud) {
      setBusy(true)
      try {
        const created = await apiAddProject(classId, project)
        updateClassProjects(classId, (projects) => [...projects, created])
      } catch (err) {
        alert('Չհաջողվեց ավելացնել նախագիծը: ' + (err?.message || ''))
      } finally {
        setBusy(false)
      }
    } else {
      mutateLocal((prev) =>
        prev.map((c) =>
          c.id === classId
            ? { ...c, projects: [...c.projects, { id: `p-${Date.now()}`, ...project }] }
            : c,
        ),
      )
    }
  }

  const handleDeleteProject = async (classId, projectId) => {
    if (cloud) {
      setBusy(true)
      try {
        await apiDeleteProject(projectId)
        updateClassProjects(classId, (projects) =>
          projects.filter((p) => p.id !== projectId),
        )
      } catch (err) {
        alert('Չհաջողվեց հեռացնել նախագիծը: ' + (err?.message || ''))
      } finally {
        setBusy(false)
      }
    } else {
      mutateLocal((prev) =>
        prev.map((c) =>
          c.id === classId
            ? { ...c, projects: c.projects.filter((p) => p.id !== projectId) }
            : c,
        ),
      )
    }
  }

  function updateClassProjects(classId, fn) {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId ? { ...c, projects: fn(c.projects) } : c,
      ),
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <button className="brand" onClick={() => setSelectedId(null)}>
            <span className="brand-mark">ԻՄ</span>
            <span className="brand-title">ԻՄ ԹԻՎՄԵԿ</span>
          </button>
          <span className={'cloud-badge' + (cloud ? ' online' : '')}>
            {cloud ? '☁️ Ամպ' : '⚠ Տեղական'}
          </span>
        </div>
      </header>

      {(notice || busy) && (
        <div className="status-bar" role="status">
          {busy ? '⏳ Բեռնում է…' : notice}
        </div>
      )}

      <main className="container main">
        {!selected ? (
          <>
            <div className="page-head">
              <h2 className="page-title">Դասարաններ</h2>
              <p className="page-sub">
                Ընտրեք դասարանը՝ տեսնելու դրա նախագծերը։
              </p>
            </div>

            <div className="toolbar">
              <button
                className="btn btn-primary"
                onClick={() => setPinAction('create')}
              >
                + Ստեղծել դասարան
              </button>
              {classes.length > 0 && (
                <div className="remove-group">
                  <select
                    className="input select"
                    defaultValue=""
                    id="remove-select"
                  >
                    <option value="" disabled>
                      Ընտրեք դասարանը…
                    </option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      const sel = document.getElementById('remove-select')
                      if (sel && sel.value) {
                        setPinAction({ type: 'remove', id: sel.value })
                      }
                    }}
                  >
                    − Հեռացնել
                  </button>
                </div>
              )}
            </div>

            <ClassList classes={classes} onSelect={setSelectedId} />
          </>
        ) : (
          <ClassView
            classItem={selected}
            onBack={() => setSelectedId(null)}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            busy={busy}
          />
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <span>ԻՄ ԹԻՎՄԵԿ — դասարաններ և նախագծեր</span>
        </div>
      </footer>

      {pinAction && (
        <PinModal
          title={
            pinAction === 'create' ? 'Ստեղծել դասարան' : 'Հեռացնել դասարան'
          }
          onCancel={() => setPinAction(null)}
          onSuccess={() => {
            if (pinAction === 'create') {
              setNewDesc('')
              setShowCreate(true)
            } else {
              handleRemove(pinAction.id)
            }
            setPinAction(null)
          }}
        />
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Նոր դասարան</h3>
            <form onSubmit={handleCreate}>
              <div className="field-row">
                <label className="field">
                  Դասարան
                  <select
                    className="input"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Տառ
                  <select
                    className="input"
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                  >
                    {LETTERS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="name-preview">
                Դասարանը կկոչվի՝ <strong>{grade}{letter}</strong>
              </p>
              <label className="field">
                Նկարագրություն (ըստ ցանկության)
                <input
                  type="text"
                  className="input"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="օր.՝ Բնագիտության նախագծեր"
                  autoFocus
                />
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowCreate(false)}
                >
                  Չեղարկել
                </button>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  Ստեղծել
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
