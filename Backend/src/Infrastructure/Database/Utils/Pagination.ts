export interface PaginationInput {
  page?: number;
  limit?: number;
}

export function getPagination(input?: PaginationInput) {
  const page = input?.page && input.page > 0 ? input.page : 1;
  const limit = input?.limit && input.limit > 0 ? input.limit : 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
