/**
 * Utility to parse standardized API error responses or fallback to text/generic error.
 * Returns a user-friendly error message string.
 */
export async function parseApiError(response: Response): Promise<string> {
  let errorMessage = `Request failed with status: ${response.status} ${response.statusText}`;
  try {
    const errorJson = await response.clone().json();
    if (errorJson && errorJson.error && errorJson.error.message) {
      errorMessage = errorJson.error.message;
      if (errorJson.error.details) {
        if (Array.isArray(errorJson.error.details)) {
          errorMessage += ': ' + errorJson.error.details.join(', ');
        } else if (typeof errorJson.error.details === 'string') {
          errorMessage += ': ' + errorJson.error.details;
        }
      }
    }
  } catch {
    try {
      const errorText = await response.clone().text();
      if (errorText) errorMessage = errorText;
    } catch {
      // ignore
    }
  }
  return errorMessage;
}
