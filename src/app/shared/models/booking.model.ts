export interface BookingModel {
  id: number;
  eventId: string;
  userId: number;
  seats: number;       // entero entre 1 y 5
  createdAt: string;
}
