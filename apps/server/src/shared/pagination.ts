import { HTTPException } from 'hono/http-exception'

export const DEFAULT_LIMIT = 50;

export const encodeCursor = (id: string | number, date?: string) => {
  const cursor = `${id}${date ? `:${date}` : ''}`
  return btoa(cursor)
}

export const decodeCursor = (cursor: string) => {
  const [id, date] = atob(cursor).split(':')
  if(!id) {
    throw new HTTPException(400, { message: 'Invalid cursor'})
  }
  return { id, date }
}

