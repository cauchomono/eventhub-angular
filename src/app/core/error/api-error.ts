import { HttpErrorResponse } from '@angular/common/http';

const FALLBACK_MESSAGE = 'Unexcpected error has ocurred';
const NETWORK_MESSAGE = 'There is not conection with the server';

export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];
  readonly requestId: string | null;

  constructor(status: number, messages: string[], requestId: string | null) {
    super(messages.join('. '));
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
    this.requestId = requestId;
  }

  // status 0 = el servidor no respondió (red caída, proxy sin backend, etc.)
  static fromHttpError(err: HttpErrorResponse): ApiError {
    const requestId = err.headers?.get('x-request-id') ?? null;

    if (err.status === 0) {
      return new ApiError(0, [NETWORK_MESSAGE], requestId);
    }

    return new ApiError(err.status, normalizeMessages(err.error?.message), requestId);
  }
}

// La API manda `message` como texto, como arreglo de textos, o no lo manda.
function normalizeMessages(raw: unknown): string[] {
  if (typeof raw === 'string' && raw.trim()) {
    return [raw];
  }
  if (Array.isArray(raw)) {
    const texts = raw.filter((m): m is string => typeof m === 'string' && m.trim() !== '');
    if (texts.length > 0) {
      return texts;
    }
  }
  return [FALLBACK_MESSAGE];
}
