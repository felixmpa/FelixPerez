import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'SPaginator',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() totalItems: number = 0;
  @Input() totalItemsPerPage: number = 5;
  @Input() currentPage: number = 1;


  @Output() pageChange = new EventEmitter<number>();
  @Output() totalItemsPerPageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.totalItemsPerPage);
  }

  goToPage(page: number): void {
    if(page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onItemsPerPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const itemsPerPage = parseInt(selectElement.value, 10);
    this.totalItemsPerPageChange.emit(itemsPerPage);
  }

  getPageRange(): number[] {
    // Número de botones de página que se mostrarán alrededor de la página actual
    const rangeSize = 5;
    const pages: number[] = [];

    let startPage = Math.max(1, this.currentPage - Math.floor(rangeSize / 2));
    let endPage = Math.min(this.totalPages, startPage + rangeSize - 1);

    // Ajustar el rango si la última página está cerca del final
    if (endPage - startPage < rangeSize - 1) {
      startPage = Math.max(1, endPage - rangeSize + 1);
    }

    // Generar el rango de páginas
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
