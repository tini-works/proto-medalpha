import type { FavoriteDoctor } from '../types'

export async function apiGetFavorites(): Promise<FavoriteDoctor[]> {
  const key = 'docliq_favorites'
  const stored = localStorage.getItem(key)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function apiAddFavorite(doctor: {
  doctorId: string
  doctorName: string
  specialty: string
  city: string
}): Promise<FavoriteDoctor[]> {
  const favorites = await apiGetFavorites()

  const existingIndex = favorites.findIndex((f) => f.doctorId === doctor.doctorId)
  if (existingIndex !== -1) {
    favorites[existingIndex].lastBookedAt = new Date().toISOString()
  } else {
    favorites.push({
      ...doctor,
      lastBookedAt: new Date().toISOString(),
    })
  }

  const maxFavorites = 5
  const sorted = favorites
    .sort((a, b) => new Date(b.lastBookedAt).getTime() - new Date(a.lastBookedAt).getTime())
    .slice(0, maxFavorites)

  localStorage.setItem('docliq_favorites', JSON.stringify(sorted))
  return sorted
}

export async function apiRemoveFavorite(doctorId: string): Promise<FavoriteDoctor[]> {
  const favorites = await apiGetFavorites()
  const filtered = favorites.filter((f) => f.doctorId !== doctorId)
  localStorage.setItem('docliq_favorites', JSON.stringify(filtered))
  return filtered
}

export async function apiClearFavorites(): Promise<void> {
  localStorage.removeItem('docliq_favorites')
}
