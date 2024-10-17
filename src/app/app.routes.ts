import { Routes } from '@angular/router';
import {ProductsComponent} from './components/features/products/products.component';
import {ProductsFormComponent} from './components/features/products-form/products-form.component';

export const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'products/create',
    component: ProductsFormComponent
  },
  {
    path: 'products/edit/:id',
    component: ProductsFormComponent
  },
  {
    path: '**',
    redirectTo: 'products',
    pathMatch: 'full'
  }
];
