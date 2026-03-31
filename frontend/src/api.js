const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const JAMENDO_CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID
const JAMENDO_BASE = 'https://api.jamendo.com/v3.0'

export async function fetchPopular() {
  const res = await fetch(
    `${JAMENDO_BASE}/tracks?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=30&order=popularity_total&audioformat=mp32&include=musicinfo&imagesize=500`
  )
  const data = await res.json()
  return data.results || []
}

export async function searchTracks(q) {
  const res = await fetch(
    `${JAMENDO_BASE}/tracks?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&search=${encodeURIComponent(q)}&audioformat=mp32&include=musicinfo&imagesize=500`
  )
  const data = await res.json()
  return data.results || []
}

export async function updateUserTrack(username, track) {
  await fetch(`${API_BASE}/usuarios/${username}/musica`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      musica_id: String(track.id),
      nome: track.name,
      artista: track.artist_name,
      capa: track.album_image,
    }),
  }).catch(() => {})
}

export async function clearUserTrack(username) {
  await fetch(`${API_BASE}/usuarios/${username}/musica`, { method: 'DELETE' }).catch(() => {})
}

export async function getFriendTrack(username) {
  const res = await fetch(`${API_BASE}/usuarios/${username}/musica`).catch(() => null)
  if (!res || !res.ok) return null
  return res.json().catch(() => null)
}
