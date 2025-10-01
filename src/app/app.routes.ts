import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Home } from './pages/Home/components/home';
import { AllProducts } from './products/components/all-products/all-products';
import { Carts } from './carts/components/carts/carts';
import { ProductsDetails } from './products/components/products-details/products-details';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
  {path: '' , component: Home},
  {path: 'signup', component: Signup},
  {path: 'login', component: Login},
  {path: 'AllProducts', component: AllProducts},
  // {path: 'Carts', component: Carts},
  { path: 'product/:id', component: ProductsDetails },
  { path: 'Carts', component: Carts, canActivate: [authGuard] },


  //lazy load wish list module
  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadChildren: ()=> import('./wishlist/wishlist-module').then(m => m.WishlistModule)
  }


];
