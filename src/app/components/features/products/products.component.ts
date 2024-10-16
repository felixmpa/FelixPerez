import {Component, computed, effect, Injector, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {NavbarComponent} from '../../shared/navbar/navbar.component';
import {
  STableComponent,
  STableColumnsProps
} from '../../shared/table/table.component';
import {ProductService} from '../../../../services/product.service';
import {Product} from '../../../../interfaces/product';
import {MapItemsToRowsPropsPipe} from '../../shared/pipe/table-map-items.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    NavbarComponent,
    STableComponent,
    MapItemsToRowsPropsPipe
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  isLoading$: WritableSignal<boolean> = signal<boolean>(true);

  productItems$: WritableSignal<Product[]> = signal<Product[]>([]);

  productColumns: STableColumnsProps[] = [
    {field: 'logo', label: 'Logo', isImage: true },
    {field: 'name', label: 'Nombre del producto'},
    {field: 'description', label: 'Descripción', title: 'Title for Description'},
    {field: 'date_release', label: 'Fecha de liberación'},
    {field: 'date_revision', label: 'Fecha de reestructuración'}
  ];

  constructor(
    private productService: ProductService,
    private injector: Injector) {}

  ngOnInit() {
    this.loadProducts()
  }

  loadProducts(): void {
    effect(async () => {
      //Show skeleton
      this.isLoading$.set(true);
      try {
        const products = await this.productService.getProducts();
        this.productItems$.set(products);
      } finally {
        this.isLoading$.set(false)
      }
    }, {injector: this.injector, allowSignalWrites: true})
  }




}
