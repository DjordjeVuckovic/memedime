export const buildFtsQuery = (query: string): string => {
  const term = query.trim().toLowerCase()

  if (term.length <= 3) {
    return `${term}*`
  }

  if (term.length <= 5 && /^[a-z0-9]+$/i.test(term)) {
    return `{name ticker}: ${term}* OR ${term}`
  }

  return `${term}* OR ${term}`
}
