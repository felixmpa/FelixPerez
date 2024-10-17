import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirm event with the correct itemId', () => {
    const confirmSpy = jest.spyOn(component.confirm, 'emit');
    component.openModal(123);
    component.onConfirm();
    expect(confirmSpy).toHaveBeenCalledWith(123);
  });

  it('should emit cancel event and close modal', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    component.isVisible = true;
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
    expect(component.isVisible).toBe(false);
    expect(component.itemId).toBeNull();
  });

  it('should open modal and set itemId correctly', () => {
    component.openModal(456);
    expect(component.isVisible).toBe(true);
    expect(component.itemId).toBe(456);
  });

  it('should close modal and reset itemId', () => {
    component.openModal(789);
    component.closeModal();
    expect(component.isVisible).toBe(false);
    expect(component.itemId).toBeNull();
  });
});
