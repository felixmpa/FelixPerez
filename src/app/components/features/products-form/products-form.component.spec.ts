import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsFormComponent } from './products-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import {ProductService} from '../../../../services/product.service';

// Mock ProductService
const mockProductService = {
  createProduct: jest.fn().mockResolvedValue(true),
  getProducts: jest.fn().mockReturnValue(of([])),
  getProductById: jest.fn().mockReturnValue(of(null)),
};

describe('ProductsFormComponent', () => {
  let component: ProductsFormComponent;
  let fixture: ComponentFixture<ProductsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, ProductsFormComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('should call createProduct on form submit', () => {
    component.productRegistration.setValue({
      id: '123',
      name: 'Product Name',
      description: 'Product Description',
      logo: 'http://example.com/logo.png',
      date_release: '2024-10-17',
      date_revision: '2024-10-18',
    });
    component.productRegistration.markAsDirty(); // Mark form as dirty to simulate user input
    component.onSubmit();
    fixture.detectChanges();
    expect(mockProductService.createProduct).toHaveBeenCalled();
  });

  it('should initialize the form with empty fields', () => {
    const formValue = component.productRegistration.value;
    expect(formValue).toEqual({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
  });

  it('should reset the form when resetForm is called', () => {
    component.productRegistration.setValue({
      id: '123',
      name: 'Product Name',
      description: 'Product Description',
      logo: 'http://example.com/logo.png',
      date_release: '2024-10-17',
      date_revision: '2024-10-18',
    });
    component.resetForm();
    fixture.detectChanges();
    expect(component.productRegistration.value).toEqual({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
  });*/
});
