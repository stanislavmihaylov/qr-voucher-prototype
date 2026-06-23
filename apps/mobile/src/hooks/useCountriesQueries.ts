import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Country } from '@repo/types'

export const COUNTRIES_QUERY_KEY = ['countries'] as const

/**
 * Fetches the full list of selectable countries from /api/countries.
 * Returns Country[] sorted alphabetically by name.
 */
export function useCountries() {
  return useQuery({
    queryKey: COUNTRIES_QUERY_KEY,
    queryFn: () => api.get<Country[]>('/api/countries'),
  })
}
