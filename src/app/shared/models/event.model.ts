export interface EventModel {
  id: string;
  title: string;
  description?: string;
  category: 'MUSIC' | 'TECH' | 'SPORTS' | 'ART';
  date: string;
  capacity: number;
  price: number;
  organizerId: number;
  isPublished: boolean;
  slug?: string;
}
