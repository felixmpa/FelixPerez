import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'SSearch',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Output() searchTermChange = new EventEmitter<string>();

  onSearchTermChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTermChange.emit(inputElement.value);
  }
}
