import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, RouterLink } from '@angular/router';
import { WishlistComponent } from './components/wishlist';
import { ProductsDetails } from '../products/components/products-details/products-details';


const routes : Routes = [
  {path : '' , component : WishlistComponent},
  {path : 'product/:id' , component : ProductsDetails}
];

@NgModule({
  declarations: [WishlistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProductsDetails
  ],
  exports: [RouterModule]
})
export class WishlistModule { }
