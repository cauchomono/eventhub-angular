import { Routes } from '@angular/router';
import { EventList } from './features/events/event-list/event-list';
import { EventListResource } from './features/events/event-list-resource/event-list-resource';

export const routes: Routes = [
    {
        path:"events",component:EventList,
        
    },
    {
        path:"events-resource", component:EventListResource
    }
];
