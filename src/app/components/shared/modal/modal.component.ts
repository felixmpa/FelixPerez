import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'SModal',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  @Input() title: string = 'Modal Title';
  @Input() message: string = '';
  @Input() confirmButtonText: string = 'Confirmar';
  @Input() cancelButtonText: string = 'Cancelar';
  @Output() confirm = new EventEmitter<string | number | null>();
  @Output() cancel = new EventEmitter<void>();

  isVisible: boolean = false;
  itemId: string | number | null = null;

  openModal(itemId?: string | number) {
    this.isVisible = true;
    if (itemId) {
      this.itemId = itemId;
    }
  }

  closeModal() {
    this.isVisible = false;
    this.itemId = null;
  }

  onConfirm() {
    this.confirm.emit(this.itemId);
    this.closeModal();
  }

  onCancel() {
    this.cancel.emit();
    this.closeModal();
  }

}
