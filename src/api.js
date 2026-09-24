import { supabase } from './supabase.js'

const BUCKET = 'project-media'
const MEDIA_BASE = 'https://nrvvexysitfnamxfxnsf.supabase.co/storage/v1/object/public/project-media/'

/* ---------- helpers ---------- */

function mapProject(p) {
  return {
    id: String(p.id),
    title: p.title,
    description: p.description || '',
    link: p.link || '',
    photos: Array.isArray(p.photos) ? p.photos : [],
    videos: Array.isArray(p.videos) ? p.videos : [],
  }
}

function mapClass(c, projectRows = []) {
  return {
    id: String(c.id),
    name: c.name,
    description: c.description || '',
    color: c.color || '',
    pin: c.pin || '',
    custom_name: c.custom_name || '',
    projects: projectRows
      .filter((p) => String(p.class_id) === String(c.id))
      .map(mapProject),
  }
}

function mapSectionItem(r) {
  return {
    id: String(r.id),
    title: r.title,
    body: r.body || '',
    photo: r.photo || '',
  }
}

const isDataUrl = (s) => typeof s === 'string' && s.startsWith('data:')

function extFromMime(mime) {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'
  return 'jpg'
}

async function uploadPhoto(classId, dataUrl) {
  const blob = await (await fetch(dataUrl)).blob()
  const name = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extFromMime(blob.type)}`
  const path = `${classId}/${name}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false })
  if (error) throw error
  return MEDIA_BASE + path
}

/* ---------- reads ---------- */

export async function fetchClasses() {
  const [{ data: classRows, error: e1 }, { data: projectRows, error: e2 }] =
    await Promise.all([
      supabase.from('classes').select('*').order('created_at'),
      supabase.from('projects').select('*').order('created_at'),
    ])
  if (e1) throw e1
  if (e2) throw e2
  return classRows.map((c) => mapClass(c, projectRows))
}

export async function fetchSectionItems(section) {
  const { data, error } = await supabase
    .from('section_items')
    .select('*')
    .eq('section', section)
    .order('created_at')
  if (error) throw error
  return data.map(mapSectionItem)
}

export async function fetchAllSectionItems(sectionKeys) {
  const results = await Promise.all(
    sectionKeys.map(async (key) => [key, await fetchSectionItems(key)]),
  )
  return Object.fromEntries(results)
}

/* ---------- classes ---------- */

export async function createClass(name, description, color, pin, customName) {
  const { data, error } = await supabase
    .from('classes')
    .insert([
      {
        name,
        description: description || '',
        color: color || '',
        pin: pin || '',
        custom_name: customName || '',
      },
    ])
    .select()
    .single()
  if (error) throw error
  return mapClass(data)
}

export async function removeClass(id) {
  await supabase.from('projects').delete().eq('class_id', id)
  const { error } = await supabase.from('classes').delete().eq('id', id)
  if (error) throw error
}

// Persist a class's notebook color (best-effort — used to backfill colors
// for classes created before the color column existed).
export async function setClassColor(id, color) {
  const { error } = await supabase
    .from('classes')
    .update({ color })
    .eq('id', id)
  if (error) throw error
}

// Set a class's custom display name (e.g. «Our Learning Space»).
export async function setClassCustomName(id, customName) {
  const { error } = await supabase
    .from('classes')
    .update({ custom_name: customName })
    .eq('id', id)
  if (error) throw error
}

/* ---------- projects ---------- */

export async function addProject(classId, project) {
  const photos = []
  for (const src of project.photos || []) {
    if (isDataUrl(src)) photos.push(await uploadPhoto(classId, src))
    else if (src && !src.startsWith('blob:')) photos.push(src)
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        class_id: classId,
        title: project.title,
        description: project.description || '',
        link: project.link || '',
        photos,
        videos: project.videos || [],
      },
    ])
    .select()
    .single()
  if (error) throw error
  return mapProject(data)
}

export async function deleteProject(projectId) {
  // best-effort cleanup of stored photos, then delete the row
  try {
    const { data } = await supabase
      .from('projects')
      .select('photos')
      .eq('id', projectId)
      .single()
    const paths = (data?.photos || [])
      .filter((u) => typeof u === 'string' && u.startsWith(MEDIA_BASE))
      .map((u) => u.slice(MEDIA_BASE.length))
    if (paths.length > 0) {
      await supabase.storage.from(BUCKET).remove(paths)
    }
  } catch {
    // ignore cleanup failures — the row itself still gets deleted
  }
  const { error } = await supabase.from('projects').delete().eq('id', projectId)
  if (error) throw error
}

/* ---------- section items (Պատմություն, Անձնակազմ, …) ---------- */

export async function addSectionItem(section, item) {
  let photo = ''
  if (item.photo) {
    if (isDataUrl(item.photo)) {
      const blob = await (await fetch(item.photo)).blob()
      const name = `sec-${section}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extFromMime(blob.type)}`
      const path = `sections/${name}`
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false })
      if (error) throw error
      photo = MEDIA_BASE + path
    } else if (!item.photo.startsWith('blob:')) {
      photo = item.photo
    }
  }

  const { data, error } = await supabase
    .from('section_items')
    .insert([{ section, title: item.title, body: item.body || '', photo }])
    .select()
    .single()
  if (error) throw error
  return mapSectionItem(data)
}

export async function removeSectionItem(id) {
  const { error } = await supabase
    .from('section_items')
    .delete()
    .eq('id', id)
  if (error) throw error
}

/* ---------- one-time migration from localStorage ---------- */

export async function migrateLocalClasses(localClasses) {
  const created = []
  for (const c of localClasses) {
    let row
    const { data, error } = await supabase
      .from('classes')
      .insert([
        {
          name: c.name,
          description: c.description || '',
          color: c.color || '',
          pin: c.pin || '',
          custom_name: c.custom_name || '',
        },
      ])
      .select()
      .single()
    if (error) {
      // maybe it already exists by name — continue with that one
      const { data: existing } = await supabase
        .from('classes')
        .select('*')
        .eq('name', c.name)
        .maybeSingle()
      if (!existing) throw error
      row = existing
    } else {
      row = data
    }

    const cls = {
      id: String(row.id),
      name: row.name,
      description: row.description || '',
      color: row.color || '',
      pin: row.pin || '',
      custom_name: row.custom_name || '',
      projects: [],
    }
    for (const p of c.projects || []) {
      try {
        cls.projects.push(await addProject(cls.id, p))
      } catch {
        // skip individual projects that fail (e.g. bucket missing)
      }
    }
    created.push(cls)
  }
  return created
}
