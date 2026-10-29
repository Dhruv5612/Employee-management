export function parseUrlFilters(searchParams) {
  return {
    q: searchParams.get('q') || '',
    department: searchParams.get('department') || '',
    status: searchParams.get('status') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    order: searchParams.get('order') || 'desc',
    page: parseInt(searchParams.get('page'), 10) || 1,
    limit: parseInt(searchParams.get('limit'), 10) || 10,
  };
}

export function buildSearchParams(params) {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  if (params.department) sp.set('department', params.department);
  if (params.status) sp.set('status', params.status);
  if (params.sortBy && params.sortBy !== 'createdAt') sp.set('sortBy', params.sortBy);
  if (params.order && params.order !== 'desc') sp.set('order', params.order);
  if (params.page && params.page > 1) sp.set('page', String(params.page));
  if (params.limit && params.limit !== 10) sp.set('limit', String(params.limit));
  return sp;
}
