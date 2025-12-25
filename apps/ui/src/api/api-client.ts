import type {
  CoinRespSchema,
  RandomCoinReqSchema,
  PromptCoinReqSchema,
  SocialCoinReqSchema,
  ModeSchema,
  SortBySchema,
  CoinsRespSchema,
  GlobalStatsRespSchema,
} from '@memedime/contracts'
import type { z } from 'zod'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1312'

export type CoinResp = z.infer<typeof CoinRespSchema>
export type RandomCoinReq = z.infer<typeof RandomCoinReqSchema>
export type PromptCoinReq = z.infer<typeof PromptCoinReqSchema>
export type SocialCoinReq = z.infer<typeof SocialCoinReqSchema>
export type Mode = z.infer<typeof ModeSchema>
export type SortBy = z.infer<typeof SortBySchema>
export type CoinsResp = z.infer<typeof CoinsRespSchema>
export type GlobalStatsResp = z.infer<typeof GlobalStatsRespSchema>

const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const generateCoin = async (
  data: RandomCoinReq | PromptCoinReq | SocialCoinReq,
): Promise<CoinResp> => {
  return request<CoinResp>('/api/v1/coins', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const getCoinById = async (id: number): Promise<CoinResp> => {
  return request<CoinResp>(`/api/v1/coins/${id}`)
}

const sanitizeString = (value: string, maxLength: number = 200): string => {
  return value.trim().slice(0, maxLength)
}

export const searchCoins = async (
  query: string,
  mode?: Mode,
  sortBy?: SortBy,
  limit?: number,
  cursor?: string,
): Promise<CoinsResp> => {
  const params = new URLSearchParams()

  // Sanitize and validate inputs
  const sanitizedQuery = sanitizeString(query, 200)
  if (sanitizedQuery) {
    params.append('q', sanitizedQuery)
  }

  if (mode) {
    params.append('mode', mode)
  }

  if (sortBy) {
    params.append('sortBy', sortBy)
  }

  // Validate limit is within the acceptable range
  if (limit && limit > 0 && limit <= 100) {
    params.append('limit', Math.floor(limit).toString())
  }

  if (cursor) {
    // Sanitize cursor (should be alphanumeric with: or -)
    const sanitizedCursor = cursor.replace(/[^a-zA-Z0-9:-]/g, '')
    if (sanitizedCursor) {
      params.append('cursor', sanitizedCursor)
    }
  }

  return request<CoinsResp>(`/api/v1/coins?${params.toString()}`)
}

export const getGlobalStats = async (): Promise<GlobalStatsResp> => {
  return request<GlobalStatsResp>('/api/v1/stats')
}

export const getRecentCoins = async (limit: number = 3): Promise<CoinsResp> => {
  return searchCoins('', undefined, 'recent', limit, undefined)
}
