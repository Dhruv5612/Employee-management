export function formatApiError(error) {
  if (error.response) {
    const { data, status } = error.response;
    return {
      message: data?.message || `Request failed with status ${status}`,
      errors: data?.errors || [],
      status,
    };
  }

  if (error.request) {
    return {
      message: 'Server is currently unreachable. Please check your network connection or ensure the API server is running.',
      errors: [],
      status: 0,
    };
  }

  return {
    message: error.message || 'An unexpected error occurred',
    errors: [],
    status: 500,
  };
}
