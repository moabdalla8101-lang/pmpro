/**
 * Pull a human-readable message from API / Axios / RTK reject payloads.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error == null) return fallback;

  if (typeof error === 'string') {
    const trimmed = error.trim();
    return trimmed || fallback;
  }

  const err = error as {
    message?: string;
    response?: { status?: number; data?: unknown };
    data?: unknown;
  };

  const fromBody = messageFromBody(err.response?.data ?? err.data);
  if (fromBody) return fromBody;

  const status = err.response?.status;
  if (status === 401) return 'Invalid email or password';
  if (status === 403) return 'You do not have access to this feature';
  if (status === 404) return 'Not found';
  if (status === 409) return 'This action conflicts with the current state';
  if (status === 429) {
    return 'Too many requests. Please wait a minute and try again. Your progress should still be saved.';
  }
  if (status && status >= 500) return 'Server error. Please try again shortly.';

  const raw = typeof err.message === 'string' ? err.message.trim() : '';
  if (raw && !/^request failed with status code \d+$/i.test(raw)) {
    return raw;
  }

  return fallback;
}

function messageFromBody(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === 'string') {
    const trimmed = data.trim();
    return trimmed || null;
  }
  if (typeof data !== 'object') return null;

  const body = data as Record<string, unknown>;

  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message.trim();
  }

  const nested = body.error;
  if (typeof nested === 'string' && nested.trim()) {
    return nested.trim();
  }
  if (nested && typeof nested === 'object') {
    const msg = (nested as Record<string, unknown>).message;
    if (typeof msg === 'string' && msg.trim()) {
      return msg.trim();
    }
  }

  return null;
}
