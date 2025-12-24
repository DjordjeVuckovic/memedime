import { HTTPException } from 'hono/http-exception'

export const DEFAULT_LIMIT = 50;

export const encodeCursor = (id: string | number, date?: string) => {
  const cursor = `${id}${date ? `:${date}` : ''}`
  return btoa(cursor)
}

export const decodeCursor = (cursor: string) => {
  const decoded = atob(cursor)
  const colonIndex = decoded.indexOf(':')

  if (colonIndex === -1) {
    // No colon, just ID
    const id = decoded
    if(!id) {
      throw new HTTPException(400, { message: 'Invalid cursor'})
    }
    return { id, date: undefined }
  }

  // Split on first colon only
  const id = decoded.slice(0, colonIndex)
  const date = decoded.slice(colonIndex + 1)

  if(!id) {
    throw new HTTPException(400, { message: 'Invalid cursor'})
  }
  return { id, date }
}

