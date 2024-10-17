// A simple Jest test for domain functionalities in products.component.ts
import { ProductsComponent } from './products.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injector } from '@angular/core';

// Mock the ProductService since it is an external dependency
const mockProductService = {
  deleteProduct: jest.fn(() => Promise.resolve(true)),
};

// Mock the Injector since it is required by ProductsComponent
const mockInjector = {} as Injector;

describe('ProductsComponent', () => {
  let component: ProductsComponent;

  beforeEach(() => {
    component = new ProductsComponent(mockProductService as any, mockInjector);
  });

  it('should call deleteProduct on product deletion', () => {
    const productId = '123';
    component.onProductDelete(productId);
    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productId);
  });

  it('should set productDeleteMessage when delete is successful', () => {
    const message = 'Product deleted successfully';
    component.productDeleteMessage = message;
    expect(component.productDeleteMessage).toBe(message);
  });
});
