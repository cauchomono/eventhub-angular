import { inject, Injectable } from '@angular/core';
import { Api } from '../../core/api';
import { EventModel } from '../../shared/models/event.model';
import { HTTP_METHODS } from '../../core/models/api-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsApi {
    api = inject(Api)

  returnAllEvents(params: Record<string,any>): Observable<EventModel[]>{
    return this.api.callApi<EventModel[]>({path:"/events",method:HTTP_METHODS.GET, params:params})
  }
}
