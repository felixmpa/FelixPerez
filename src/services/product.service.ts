import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Product} from '../interfaces/product';
import {Response} from '../interfaces/response';

@Injectable({providedIn: 'root'})
export class ProductService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async getProducts(): Promise<Product[]> {
    const url = `${this.apiUrl}/bp/products`;

    return new Promise((resolve, reject) => {
      this.http.get<Response>(url)
        .subscribe({
          next: (response: Response) => {
            const products = response.data as Product[];
            resolve(products);
          },
          error: (err) => {
            console.error('Error fetching products', err);
            reject(err);
          }
        })
    });
  }

  async getProductById(id: string) : Promise<Product> {
    const url = `${this.apiUrl}/bp/products/${id}`;

    return new Promise((resolve, reject) => {
      this.http.get<Response>(url)
        .subscribe({
          next: (response: Response) => {
            const product = (response.data ? response.data : response) as Product;
            resolve(product)
          },
          error: (err) => {
            console.error('Error fetching product', err);
            reject(err);
          }
        })
    });
  }

  async createProduct(product: Product): Promise<Product> {
    const url = `${this.apiUrl}/bp/products`;

    return new Promise((resolve, reject) => {
      this.http.post<Response>(url, product)
        .subscribe({
          next: (response: Response) => {
            const product = response.data as Product;
            resolve(product)
          },
          error: (err) => {
            console.error('Error fetching product', err);
            reject(err);
          }
        });
    });
  }

  async updateProduct(product: Product): Promise<Product> {
    const {id, ...fieldsToUpdate } = product;
    const url = `${this.apiUrl}/bp/products/${id}`;

    return new Promise((resolve, reject) => {
      this.http.put<Response>(url, {...fieldsToUpdate})
        .subscribe({
          next: (response: Response) => {
            const product = response.data as Product;
            resolve(product)
          },
          error: (err) => {
            console.error('Error fetching product', err);
            reject(err);
          }
        });
    });
  }

  async deleteProduct(id: string): Promise<Response> {
    const url = `${this.apiUrl}/bp/products/${id}`;

    return new Promise((resolve, reject) => {
      this.http.delete<Response>(url)
        .subscribe({
          next: (response: Response) => {
            resolve(response)
          },
          error: (err) => {
            console.error('Error fetching product', err);
            reject(err);
          }
        });
    });
  }
}
