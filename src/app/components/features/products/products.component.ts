import {Component, computed, effect, Injector, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {NavbarComponent} from '../../shared/navbar/navbar.component';
import {
  STableComponent,
  STableColumnsProps, STableBtnProps
} from '../../shared/table/table.component';
import {ProductService} from '../../../../services/product.service';
import {Product} from '../../../../interfaces/product';
import {MapItemsToRowsPropsPipe} from '../../shared/pipe/table-map-items.pipe';
import {NgIf} from '@angular/common';
import {NotificationComponent} from '../../shared/notification/notification.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    NavbarComponent,
    STableComponent,
    MapItemsToRowsPropsPipe,
    NgIf,
    NotificationComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  productDeleteMessage: string = '';
  productDeletedStatus: 'success' | 'error' = 'success';

  isLoading$: WritableSignal<boolean> = signal<boolean>(true);
  productItems$: WritableSignal<Product[]> = signal<Product[]>([]);

  productColumns: STableColumnsProps[] = [
    {field: 'logo', label: 'Logo', isImage: true },
    {field: 'name', label: 'Nombre del producto'},
    {field: 'description', label: 'Descripción', title: 'Title for Description'},
    {field: 'date_release', label: 'Fecha de liberación'},
    {field: 'date_revision', label: 'Fecha de reestructuración'},
    {field: 'id', label: '', isAction: true }
  ];

  buttons: STableBtnProps[] = [
    {
      label: 'Agregar',
      href: '/products/create',
      action: 'create'
    },
    {
      label: 'Editar',
      href: '/products/edit',
      action: 'edit'
    },
    {
      label: 'Borrar',
      href: '#!',
      action: 'delete'
    }
  ];

  constructor(
    private productService: ProductService,
    private injector: Injector) {}

  ngOnInit() {
    this.fetchProducts()
  }

  fetchProducts(): void {
    effect(async () => {
      this.isLoading$.set(true);
      try {
        const products = await this.productService.getProducts();
        this.productItems$.set(products);
      } finally {
        this.isLoading$.set(false)
      }
    }, {injector: this.injector, allowSignalWrites: true})
  }

  onProductDelete(productId: string | number): void {
    if(productId) {
      this.productService.deleteProduct(productId.toString()).then((res) => {
        this.productDeleteMessage = 'Producto eliminado correctamente!';
        this.productDeletedStatus = 'success'
        this.fetchProducts();
      }).catch((err) => {
        this.productDeleteMessage = 'Error al borrar el producto.';
        this.productDeletedStatus = 'error';
      })
    }
  }

}
