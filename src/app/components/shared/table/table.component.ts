import {Component, Input} from '@angular/core';
import {NgIconComponent, provideIcons} from '@ng-icons/core';
import { heroInformationCircle } from '@ng-icons/heroicons/outline';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {PaginatorComponent} from '../paginator/paginator.component';
import {SearchComponent} from '../search/search.component';

export interface STableColumnsProps {
  field: string;
  label: string;
  title?: string;
  isImage?: boolean
}

export interface STableRowProps {
  [key: string]: string | number | Date | null | undefined,
}

@Component({
  selector: 'STable',
  standalone: true,
  imports: [
    NgIconComponent,
    NgForOf,
    NgIf,
    NgStyle,
    PaginatorComponent,
    SearchComponent
  ],
  viewProviders: [provideIcons({heroInformationCircle})],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class STableComponent {
  @Input() columns: STableColumnsProps[] = [];
  @Input() rows: STableRowProps[] = [];

  currentPage: number = 1;
  totalItemsPerPage: number = 5;
  searchTerm: string = '';

  get totalItems(): number {
    return this.rows.length;
  }

  get paginatedRows(): STableRowProps[] {
    const startIndex = (this.currentPage - 1) * this.totalItemsPerPage;
    return this.filteredRows.slice(startIndex, startIndex + this.totalItemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.totalItemsPerPage = itemsPerPage;
    // Reset to first page when changing items per page
    this.currentPage = 1;
  }

  get filteredRows(): STableRowProps[] {
    if(!this.searchTerm) {
      return this.rows;
    }
    const q = this.searchTerm.toLowerCase();
    return this.rows.filter(row => {
      return this.columns.some(col => {
        const value = row[col.field];
        return value?.toString().toLowerCase().includes(q);
      })
    })
  }

  onSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
  }

  formatValue(value: string | number | Date | null | undefined): string {
    if(value instanceof Date) {
      return value.toLocaleDateString();
    }
    return value?.toString() || '';
  }

}
