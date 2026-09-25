import { useEffect, useState } from 'react'
import ClassList from './components/ClassList.jsx'
import ClassView from './components/ClassView.jsx'
import SectionView from './components/SectionView.jsx'
import PinModal from './components/PinModal.jsx'
import { PIN } from './pin.js'
import { pickColor, colorOf, sortedIndex } from './colors.js'
import {
  loadLocalClasses,
  saveLocalClasses,
  clearLocalClasses,
  loadLocalSections,
  saveLocalSections,
  clearLocalSections,
} from './storage.js'
import {
  fetchClasses,
  fetchAllSectionItems,
  createClass as apiCreateClass,
  removeClass as apiRemoveClass,
  addProject as apiAddProject,
  deleteProject as apiDeleteProject,
  addSectionItem as apiAddSectionItem,
  removeSectionItem as apiRemoveSectionItem,
  updateProject as apiUpdateProject,
  updateSectionItem as apiUpdateSectionItem,
  updateClass as apiUpdateClass,
  migrateLocalClasses,
  setClassColor,
  setClassCustomName,
} from './api.js'
import { SECTIONS } from './sections.js'
import './index.css'

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const LETTERS = ['ա', 'բ', 'գ', 'դ', 'ե', 'զ']

export default function App() {
  const [classes, setClasses] = useState(loadLocalClasses)
  const [sectionItems, setSectionItems] = useState(loadLocalSections)
  const [route, setRoute] = useState({ view: 'home' }) // { view:'home' } | { view:'classes', id? } | { view:'section', key }
  const [pinAction, setPinAction] = useState(null) // 'create' | { type: 'remove', id }
  const [showCreate, setShowCreate] = useState(false)
  const [grade, setGrade] = useState('10')
  const [letter, setLetter] = useState('ա')
  const [newDesc, setNewDesc] = useState('')
  const [newPin, setNewPin] = useState('')
  const [newCustom, setNewCustom] = useState('')
  const [editClassId, setEditClassId] = useState(null)
  const [editPin, setEditPin] = useState(false)
  const [editGrade, setEditGrade] = useState('10')
  const [editLetter, setEditLetter] = useState('ա')
  const [editCustom, setEditCustom] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [showEditClass, setShowEditClass] = useState(false)
  const [cloud, setCloud] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const selected = classes.find((c) => c.id === route.id) || null

  const mutateLocal = (fn) => {
    setClasses((prev) => {
      const next = fn(prev)
      saveLocalClasses(next)
      return next
    })
  }

  const mutateLocalSections = (fn) => {
    setSectionItems((prev) => {
      const next = fn(prev)
      saveLocalSections(next)
      return next
    })
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const remote = await fetchClasses()
        if (cancelled) return

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
          backfillColors(remote, () => cancelled)
        }

        // Load section items too — sections degrade to local if the
        // section_items table doesn't exist yet
        try {
          const secItems = await fetchAllSectionItems(
            SECTIONS.filter((s) => s.key !== 'classes').map((s) => s.key),
          )
          if (!cancelled) setSectionItems((prev) => ({ ...prev, ...secItems }))
        } catch {
          // section_items table missing — keep local section data
        }
      } catch {
        if (!cancelled) setCloud(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // One-time: classes created before the color column get their deterministic
  // fallback color saved to the cloud so every device shows the same colors.
  const backfillColors = async (remoteClasses, cancelled) => {
    const missing = remoteClasses.filter((c) => !c.color)
    if (missing.length === 0) return
    const named = [...remoteClasses].sort((a, b) =>
      String(a.name).localeCompare(String(b.name), 'hy'),
    )
    for (const c of missing) {
      if (cancelled()) return
      const idx = named.findIndex((x) => x.id === c.id)
      const col = colorOf(c, idx)
      try {
        await setClassColor(c.id, col.name)
        setClasses((prev) =>
          prev.map((x) => (x.id === c.id ? { ...x, color: col.name } : x)),
        )
      } catch {
        // column may not exist yet — the deterministic fallback still applies
      }
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const name = `${grade}${letter}`
    if (classes.some((c) => c.name === name)) {
      alert('Այս դասարանն արդեն կա։')
      return
    }
    const color = pickColor(classes)
    const pin = newPin.trim()
    const customName = newCustom.trim()
    if (cloud) {
      setBusy(true)
      try {
        const created = await apiCreateClass(name, newDesc.trim(), color.name, pin, customName)
        setClasses((prev) => [...prev, created])
        setShowCreate(false)
        setNewDesc('')
        setNewPin('')
        setNewCustom('')
      } catch (err) {
        if (String(err?.code) === '23505') {
          alert('Այս դասարանն արդեն կա։')
        } else if (String(err?.code) === '42703' || String(err?.message || '').includes('column')) {
          // color/pin/custom_name columns not added yet — create without them
          try {
            const created = await apiCreateClass(name, newDesc.trim(), '', '', '')
            setClasses((prev) => [...prev, created])
            setShowCreate(false)
            setNewDesc('')
            setNewPin('')
            setNewCustom('')
            setNotice('Ամպում չկան color/pin սյուները — թարմացրեք SQL-ը։')
          } catch (err2) {
            alert('Չհաջողվեց ստեղծել դասարանը: ' + (err2?.message || ''))
          }
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
          color: color.name,
          pin,
          custom_name: customName,
          projects: [],
        },
      ])
      setShowCreate(false)
      setNewDesc('')
      setNewPin('')
      setNewCustom('')
    }
  }

  const handleRemove = async (id) => {
    if (cloud) {
      setBusy(true)
      try {
        await apiRemoveClass(id)
        setClasses((prev) => prev.filter((c) => c.id !== id))
        if (route.id === id) setRoute({ view: 'classes' })
      } catch (err) {
        alert('Չհաջողվեց հեռացնել դասարանը: ' + (err?.message || ''))
      } finally {
        setBusy(false)
      }
    } else {
      mutateLocal((prev) => prev.filter((c) => c.id !== id))
      if (route.id === id) setRoute({ view: 'classes' })
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
        alert('Չհաջողվեց հեռացնել նախագծը: ' + (err?.message || ''))
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

  const handleEditClassSubmit = (e) => {
    e.preventDefault()
    const code = `${editGrade}${editLetter}`
    if (classes.some((c) => c.name === code && c.id !== editClassId)) {
      alert('«' + code + '» կոդով դասարան արդեն կա։')
      return
    }
    handleEditClass(editClassId, {
      name: code,
      custom_name: editCustom.trim(),
      description: editDesc.trim(),
    })
    setShowEditClass(false)
  }

  // Rename a class (custom display name shown on cards and the class view).
  const handleRename = async (id, customName) => {
    const applyLocal = () =>
      mutateLocal((prev) =>
        prev.map((c) => (c.id === id ? { ...c, custom_name: customName } : c)),
      )
    if (cloud && !String(id).startsWith('local-')) {
      setBusy(true)
      try {
        await setClassCustomName(id, customName)
        applyLocal()
      } catch {
        // column may not exist yet — apply locally regardless
        applyLocal()
      } finally {
        setBusy(false)
      }
    } else {
      applyLocal()
    }
  }

  function updateClassProjects(classId, fn) {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId ? { ...c, projects: fn(c.projects) } : c,
      ),
    )
  }

  /* ---------- editing (master PIN) ---------- */

  const handleEditProject = async (classId, projectId, project) => {
    const applyLocal = () =>
      updateClassProjects(classId, (projects) =>
        projects.map((p) => (p.id === projectId ? { ...p, ...project } : p)),
      )
    if (cloud && !String(projectId).startsWith('p-')) {
      setBusy(true)
      try {
        const updated = await apiUpdateProject(projectId, project)
        updateClassProjects(classId, (projects) =>
          projects.map((p) => (p.id === projectId ? updated : p)),
        )
      } catch {
        applyLocal()
      } finally {
        setBusy(false)
      }
    } else {
      applyLocal()
    }
  }

  const handleEditSectionItem = async (sectionKey, id, item) => {
    const applyLocal = () =>
      mutateLocalSections((prev) => ({
        ...prev,
        [sectionKey]: (prev[sectionKey] || []).map((i) =>
          i.id === id ? { ...i, ...item } : i,
        ),
      }))
    if (cloud && !String(id).startsWith('local-')) {
      setBusy(true)
      try {
        const updated = await apiUpdateSectionItem(id, item)
        mutateLocalSections((prev) => ({
          ...prev,
          [sectionKey]: (prev[sectionKey] || []).map((i) =>
            i.id === id ? updated : i,
          ),
        }))
      } catch {
        applyLocal()
      } finally {
        setBusy(false)
      }
    } else {
      applyLocal()
    }
  }

  // Full class edit: grade/letter code, custom name, description.
  const handleEditClass = async (id, fields) => {
    const applyLocal = () =>
      mutateLocal((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...fields } : c)),
      )
    if (cloud && !String(id).startsWith('local-')) {
      setBusy(true)
      try {
        const updated = await apiUpdateClass(id, fields)
        setClasses((prev) => prev.map((c) => (c.id === id ? updated : c)))
      } catch {
        applyLocal()
      } finally {
        setBusy(false)
      }
    } else {
      applyLocal()
    }
  }

  /* ---------- section items ---------- */

  const items = sectionItems[route.key] || []

  const handleAddSectionItem = async (item) => {
    if (cloud) {
      setBusy(true)
      try {
        const created = await apiAddSectionItem(route.key, item)
        mutateLocalSections((prev) => ({
          ...prev,
          [route.key]: [...(prev[route.key] || []), created],
        }))
        setBusy(false)
        return
      } catch {
        // section_items table may not exist yet — fall back to local
      }
      setBusy(false)
    }
    mutateLocalSections((prev) => ({
      ...prev,
      [route.key]: [
        ...(prev[route.key] || []),
        { id: `local-${Date.now()}`, ...item },
      ],
    }))
  }

  const handleRemoveSectionItem = async (id) => {
    if (cloud && !String(id).startsWith('local-')) {
      setBusy(true)
      try {
        await apiRemoveSectionItem(id)
      } catch {
        // fall through to local removal so the UI stays consistent
      }
      setBusy(false)
    }
    mutateLocalSections((prev) => ({
      ...prev,
      [route.key]: (prev[route.key] || []).filter((i) => i.id !== id),
    }))
  }

  const section = SECTIONS.find((s) => s.key === route.key) || null
  const viewColor = selected ? colorOf(selected, sortedIndex(classes, selected)) : null

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <button className="brand" onClick={() => setRoute({ view: 'home' })}>
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

      <main
        className={'container main' + (viewColor ? ' class-tinted' : '')}
        style={viewColor ? { '--nb': viewColor.base } : undefined}
      >
        {route.view === 'home' && (
          <>
            <div className="page-head">
              <h2 className="page-title">Բաժիններ</h2>
              <p className="page-sub">Ընտրեք բաժինը։</p>
            </div>
            <div className="menu-grid">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  className={'menu-card ' + s.grad}
                  onClick={() =>
                    setRoute(
                      s.key === 'classes'
                        ? { view: 'classes' }
                        : { view: 'section', key: s.key },
                    )
                  }
                >
                  <span className="menu-card-emoji">{s.emoji}</span>
                  <span className="menu-card-title">{s.title}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {route.view === 'classes' && !selected && (
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

            <ClassList
              classes={classes}
              onSelect={(id) => setRoute({ view: 'classes', id })}
              onEdit={(id) => {
                setEditClassId(id)
                setEditPin(true)
              }}
            />
          </>
        )}

        {route.view === 'classes' && selected && (
          <ClassView
            classItem={selected}
            color={viewColor}
            onBack={() => setRoute({ view: 'classes' })}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onRename={handleRename}
            onEditProject={handleEditProject}
            busy={busy}
          />
        )}

        {route.view === 'section' && section && (
          <SectionView
            section={section}
            items={items}
            onBack={() => setRoute({ view: 'home' })}
            onAdd={handleAddSectionItem}
            onRemove={handleRemoveSectionItem}
            onEdit={handleEditSectionItem}
            busy={busy}
          />
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <span>ԻՄ ԹԻՎՄԵԿ</span>
        </div>
      </footer>

      {editPin && (
        <PinModal
          title="Խմբագրել դասարանը"
          pin={PIN}
          onCancel={() => setEditPin(false)}
          onSuccess={() => {
            const cls = classes.find((c) => c.id === editClassId)
            if (cls) {
              const code = cls.name || ''
              const m = code.match(/^(\d+)(.*)$/)
              setEditGrade(m ? m[1] : '10')
              setEditLetter(m ? m[2] : 'ա')
              setEditCustom(cls.custom_name || '')
              setEditDesc(cls.description || '')
            }
            setEditPin(false)
            setShowEditClass(true)
          }}
        />
      )}

      {showEditClass && editClassId && (
        <div className="modal-overlay" onClick={() => setShowEditClass(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Խմբագրել դասարանը</h3>
            <form onSubmit={handleEditClassSubmit}>
              <div className="field-row">
                <label className="field">
                  Դասարան
                  <select
                    className="input"
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
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
                    value={editLetter}
                    onChange={(e) => setEditLetter(e.target.value)}
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
                Կոդը կդառնա՝ <strong>{editGrade}{editLetter}</strong>
              </p>
              <label className="field">
                Դասարանի անուն (ըստ ցանկության)
                <input
                  type="text"
                  className="input"
                  value={editCustom}
                  onChange={(e) => setEditCustom(e.target.value)}
                  placeholder="օր.՝ Our Learning Space"
                />
              </label>
              <label className="field">
                Նկարագրություն (ըստ ցանկության)
                <input
                  type="text"
                  className="input"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="օր.՝ Բնագիտության նախագծեր"
                />
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowEditClass(false)}
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

      {pinAction && (
        <PinModal
          title={
            pinAction === 'create' ? 'Ստեղծել դասարան' : 'Հեռացնել դասարան'
          }
          pin={PIN}
          onCancel={() => setPinAction(null)}
          onSuccess={() => {
            if (pinAction === 'create') {
              setNewDesc('')
              setNewPin('')
              setNewCustom('')
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
                Դասարանի ծածկագիր
                <input
                  type="text"
                  className="input"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="օր.՝ #space"
                />
              </label>
              <p className="field-hint">
                Այս ծածկագրով դասարանը կավելացնի իր նախագծերը։ Դատարկ թողնելու
                դեպքում կգործի գլխավոր ծածկագիրը։
              </p>
              <label className="field">
                Դասարանի անուն (ըստ ցանկության)
                <input
                  type="text"
                  className="input"
                  value={newCustom}
                  onChange={(e) => setNewCustom(e.target.value)}
                  placeholder="օր.՝ Our Learning Space"
                />
              </label>
              <p className="field-hint">
                Եթե դատարկ թողնեք՝ կցուցադրվի պարզապես «{grade}{letter}»։
              </p>
              <label className="field">
                Նկարագրություն (ըստ ցանկության)
                <input
                  type="text"
                  className="input"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="օր.՝ Բնագիտության նախագծեր"
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
