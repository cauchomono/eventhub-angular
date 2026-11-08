import { Component, computed, inject, signal } from '@angular/core';
import { EventCard } from '../event-card/event-card';
import { EventModel } from '../../../shared/models/event.model';
import { EventsApi } from '../events-api';
import { ApiError } from '../../../core/error/api-error';
import { ErrorCard } from '../../../shared/components/error/error-card';
import { LoadingCard } from '../../../shared/components/loading-card/loading-card';
import { UiState } from '../../../core/models/ui-state';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, startWith, catchError, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

type EventsState = UiState<EventModel[]>;
export type Category = 'MUSIC'| 'TECH'| 'SPORTS'| 'ART'
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

@Component({
  selector: 'app-event-list',
  imports: [EventCard, ErrorCard, LoadingCard],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList {
  eventsService = inject(EventsApi);
  limit = signal(DEFAULT_LIMIT);
  page = signal(DEFAULT_PAGE);
  retries = signal(0);

  disabledBackButton = computed(() => this.page() === 1);

  limitRange = Array.from({ length: 50 }, (_, i) => i + 1);
  categories = ['', 'MUSIC', 'TECH', 'SPORTS', 'ART'];
  category = signal<string | undefined>('');
  areEventsPublished = signal(true);
  publishedOptions = ['Published', 'Unpublished'];
  backButtonIcon = '<';
  nextButtonIcon = '>';

  publishedSelected = computed(() => {

return this.areEventsPublished() ? 'Published' : 'Unpublished'
  }
  
);
  combined = computed(() => ({
    limit: this.limit(),
    page: this.page(),
    retries: this.retries(),
    category: this.category(),
    published:this.areEventsPublished()
  }));

  router = inject(Router);
  route = inject(ActivatedRoute);
  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      const limitParam = Number(params['limit']);
      const pageParam = Number(params['page']);
      const isvalidPage = Number.isInteger(pageParam) && pageParam > 0;
      const isValidLimit = Number.isInteger(limitParam) && this.limitRange.includes(limitParam);

     const publishedParam =  this.getPublishedParam(params['published'])
      const page = isvalidPage ? pageParam : DEFAULT_PAGE;
      const limit = isValidLimit ? limitParam : DEFAULT_LIMIT;
      const category = this.getValidCategory(params['category'])
      this.page.set(page);
      this.limit.set(limit);
      this.category.set(category)
      this.areEventsPublished.set(publishedParam)
    });
  }

  private getPublishedParam(value:string | string[] | undefined){

      const publishedStr = Array.isArray(value) ? value[0] :value;
      return publishedStr?.toLowerCase() !=="false"; 
  }

  readonly state = toSignal(
    toObservable(this.combined).pipe(
     
      switchMap(({ limit, page, category,published }) => {
        return this.eventsService
          .returnAllEvents({ limit, page, published,...(category && { category: category }) })
          .pipe(
             

            map((data): EventsState => ({ status: 'success', data: data })),
            catchError((err: unknown) =>
              of<EventsState>({ status: 'error', error: err as ApiError }),
            ),
            startWith<EventsState>({ status: 'loading' }),
          );
      }),
    ),
    { initialValue: { status: 'loading' } as EventsState },
  );

  // Paginación sin total: la API no dice cuántos eventos faltan, así que "hay página siguiente"
  // se infiere de la página actual: si trae menos elementos que `limit`, es la última.
  // Alternativas descartadas:
  //  - pedir `limit + 1`: el backend calcula el inicio como (page - 1) * limit, así que cambiar el
  //    límite desalinea las páginas, y con limit = 50 se pediría 51 (el backend responde 400).
  //  - precargar la página siguiente: una petición extra en cada navegación, casi siempre innecesaria.
  // Costo conocido: si el total es múltiplo de `limit`, ">" sigue activo en la última página y la
  // siguiente llega vacía (con limit = 1 pasa siempre; con limit = 50 casi nunca). Se acepta porque
  // la pantalla de "sin eventos" lo cubre.
  // Revisar si el backend devuelve un total (p. ej. `meta.total`, al implementar la base de datos).
  disabledNextButton = computed(() => {
    const currentState = this.state();

    return currentState.status === 'success' ? currentState.data.length < this.limit() : true;
  });
  onLimitChange(limitNumber: string) {
    this.limit.set(Number(limitNumber));
    this.page.set(1);
    this.updateAllParams();
  }
  private updateAllParams() {
    this.updateUrl({ page: this.page(), limit: this.limit(), category: this.category(),published:this.areEventsPublished() });
  }
  onCategoryChange(category: string) {
    this.category.set(category);
    this.page.set(1)
    this.updateAllParams();
  }

   private isCategory(value: any): boolean{
    return this.categories.includes(value);
  }

  private getValidCategory(value: string |undefined){
    return this.isCategory(value) ? value : "";
  }

  onPublishedEventsChange(value: string) {
    if (value.toLocaleLowerCase() === 'unpublished') {
      this.areEventsPublished.set(false);
    } else {
      this.areEventsPublished.set(true);
    }
  this.page.set(1);
    this.updateAllParams();
  }

  setPreviousPage() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
 this.updateAllParams();
    }
  }

  updateUrl(params: { page?: number; limit?: number; category?: string; published?: boolean }) {
    if (params.category?.length === 0) {
      params.category = undefined;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  setNextPage() {
    this.page.set(this.page() + 1);
     this.updateAllParams();
  }

  retry() {
    this.retries.update((n) => n + 1);
  }

  addToTheList(event : string){
    console.log(event)
  }
}
