import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiError } from './error/api-error';
import { ApiRequest } from './models/api-request';
import { ApiResponseModel } from './models/api-response.model';

const MALFORMED_RESPONSE_MESSAGE = 'La respuesta del servidor no tiene el formato esperado';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly httpClient = inject(HttpClient);
  private readonly apiPath = environment.apiUrl;


  callApi<T>(apiRequest: ApiRequest): Observable<T> {

    return this.makeRequest<ApiResponseModel<T>>(apiRequest).pipe(
      map((res) => {
        if (res?.data === undefined) {
          // El servidor respondió bien (2xx), pero sin el sobre esperado
          throw new ApiError(200, [MALFORMED_RESPONSE_MESSAGE], null);
        }
        return res.data;
      })
    );
  }

  // Respuestas sin envolver: /health y DELETE (204 sin cuerpo)
  callRaw<T>(apiRequest: ApiRequest): Observable<T> {
    return this.makeRequest<T>(apiRequest);
  }

  private makeRequest<T>(apiRequest: ApiRequest): Observable<T> {
    const path = `${this.apiPath}${apiRequest.path}`;
    return this.httpClient
      .request<T>(apiRequest.method, path, {
        body: apiRequest.body ?? undefined,
        headers: apiRequest.headers ?? undefined,
        params: apiRequest.params ?? undefined,
      })
      .pipe(
        catchError((err: unknown) =>
          throwError(() => (err instanceof HttpErrorResponse ? ApiError.fromHttpError(err) : err))
        )
      );
  }
}
