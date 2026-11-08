import { Component, input, output } from '@angular/core';
import { ApiError } from '../../../core/error/api-error';

@Component({
  selector: 'app-error-card',
  imports: [],
  templateUrl: './error-card.html',
  styleUrl: './error-card.css',
})
export class ErrorCard {

  errorObject = input.required<ApiError | undefined>();

  retry = output<void>()
}
