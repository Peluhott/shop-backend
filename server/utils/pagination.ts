export const DEFAULT_CURSOR_LIMIT = 9
export const MAX_CURSOR_LIMIT = 50

export type CursorPaginationQuery = {
  cursor?: number
  limit: number
}

export type CursorPaginationResult<T> = {
  data: T[]
  pagination: {
    limit: number
    nextCursor: number | null
    hasNextPage: boolean
  }
}

export function normalizeCursorPagination(
  limitInput?: number,
  cursorInput?: number
): CursorPaginationQuery {
  const safeLimit =
    typeof limitInput === 'number' && Number.isFinite(limitInput) && limitInput > 0
      ? Math.min(limitInput, MAX_CURSOR_LIMIT)
      : DEFAULT_CURSOR_LIMIT

  const safeCursor =
    typeof cursorInput === 'number' && Number.isFinite(cursorInput) && cursorInput > 0
      ? cursorInput
      : undefined

  return {
    limit: safeLimit,
    cursor: safeCursor
  }
}

export function buildCursorPage<T extends { id: number }>(
  items: T[],
  limit: number
): CursorPaginationResult<T> {
  const hasNextPage = items.length > limit
  const data = hasNextPage ? items.slice(0, limit) : items
  const nextCursor = hasNextPage ? data[data.length - 1].id : null

  return {
    data,
    pagination: {
      limit,
      nextCursor,
      hasNextPage
    }
  }
}
