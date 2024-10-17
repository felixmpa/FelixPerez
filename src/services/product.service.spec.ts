import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '../environments/environment.development';
import { Product } from '../interfaces/product';
import { Response } from '../interfaces/response';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  logo: 'test-logo.png',
  date_release: new Date('2023-01-01'),
  date_revision: new Date('2023-06-01')
};

const mockResponse: Response = {
  data: [mockProduct]
};

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve products', (done) => {
    service.getProducts().then((products) => {
      expect(products.length).toBe(1);
      expect(products).toEqual([mockProduct]);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should retrieve a product by ID', (done) => {
    service.getProductById('1').then((product) => {
      expect(product).toEqual(mockProduct);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/bp/products/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProduct });
  });

  it('should handle error when retrieving products', (done) => {
    service.getProducts().catch((error) => {
      expect(error).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/bp/products`);
    req.error(new ErrorEvent('Network error'));
  });
});
