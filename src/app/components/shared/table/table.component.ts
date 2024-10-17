import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgIconComponent, provideIcons} from '@ng-icons/core';
import { heroInformationCircle, heroEllipsisVertical } from '@ng-icons/heroicons/outline';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {PaginatorComponent} from '../paginator/paginator.component';
import {SearchComponent} from '../search/search.component';
import {ModalComponent} from '../modal/modal.component';

export interface STableColumnsProps {
  field: string;
  label: string;
  title?: string;
  isImage?: boolean
  isAction?: boolean
}

export interface STableRowProps {
  [key: string]: string | number | Date | null | undefined,
}

export interface STableBtnProps {
  label: string;
  href: string;
  action: 'create' | 'edit' | 'delete';
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
    SearchComponent,
    ModalComponent
  ],
  viewProviders: [provideIcons({heroInformationCircle, heroEllipsisVertical})],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class STableComponent {

  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  @Input() columns: STableColumnsProps[] = [];
  @Input() rows: STableRowProps[] = [];
  @Input() showInputSearch?: boolean = true;
  @Input() buttons?: STableBtnProps[];

  @Output() deleteConfirmed = new EventEmitter<string | number>();

  currentPage: number = 1;
  totalItemsPerPage: number = 5;
  searchTerm: string = '';
  actionDropdownOpen: number = -1;

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
        return value != null && value.toString().toLowerCase().includes(q);
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
    return value != null ? value.toString() : '';
  }

  getSafeValue(value: string | number | Date | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }
    return value.toString();
  }


  getButtonByAction(action: 'create' | 'edit' | 'delete'): STableBtnProps | undefined {
    return this.buttons?.find(button => button.action === action);
  }

  toggleDropdown(row: number) {
    if (this.actionDropdownOpen === row) {
      this.actionDropdownOpen = -1;
    } else {
      this.actionDropdownOpen = row;
    }
  }
  isActionDropdownOpenForRow(row: number): boolean {
    return this.actionDropdownOpen === row;
  }

  openDeleteModal(itemId?: string, itemName?: string) {
    this.deleteModal.message = `¿Estás seguro de eliminar #${itemId} - ${itemName}?`;
    this.deleteModal.openModal(itemId);
  }

  onDeleteConfirm(itemId: string | number | null): void {
    if (itemId) {
      this.deleteConfirmed.emit(itemId)
    }
  }

}
