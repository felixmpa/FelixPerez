import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Product} from '../interfaces/product';
import {Response} from '../interfaces/response';
import {STableColumnsProps, STableRowProps} from '../app/components/shared/table/table.component';

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

}
