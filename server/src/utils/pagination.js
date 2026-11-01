export function parsePaginationParams(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const rawLimit = parseInt(query.limit, 10) || 10;
  // Allowed limit values per specification: 5, 10, or 20 (defaults to 10)
  const allowedLimits = [5, 10, 20];
  const limit = allowedLimits.includes(rawLimit) ? rawLimit : 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
