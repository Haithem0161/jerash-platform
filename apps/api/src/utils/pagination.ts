export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function getPaginationParams(query: { page?: number; pageSize?: number }): PaginationParams {
  return {
    page: Math.max(1, query.page || 1),
    pageSize: Math.min(100, Math.max(1, query.pageSize || 20)),
  }
}

export function getPaginationMeta(total: number, params: PaginationParams): PaginationMeta {
  return {
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(total / params.pageSize),
  }
}

export function getSkipTake(params: PaginationParams) {
  return {
    skip: (params.page - 1) * params.pageSize,
    take: params.pageSize,
  }
}
