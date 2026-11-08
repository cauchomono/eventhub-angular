import { HttpHeaders, HttpParams } from "@angular/common/http";

export interface ApiRequest {
path: string;
  method:  HTTP_METHODS;
  params?: HttpParams | Record<string, any>; // Angular usa HttpParams de forma nativa
  body?: Record<string, any>; // El body puede contener arreglos u objetos complejos
  headers?: HttpHeaders | Record<string, string>;

}

export enum HTTP_METHODS{
    GET='GET',
    POST='POST', 
    PUT='PUT', 
    DELETE='DELETE',
    PATCH='PATCH'
}