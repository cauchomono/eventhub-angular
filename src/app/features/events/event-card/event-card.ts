import { Component, input, output } from '@angular/core';
import { EventModel } from '../../../shared/models/event.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-card',
  imports: [CurrencyPipe,DatePipe],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {

  event = input.required<EventModel>({})

  randomOutput = output<string>() 

  addEvent(){
    this.randomOutput.emit("random")
  }

}
