import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { cartService } from '../../../carts/services/carts';
import { ToastService } from '../../../toast/service/toast';
import { ProductsService } from '../../services/products';
import { Auth } from '../../../auth/auth';
import { Wishlist } from '../../../wishlist/service/wishlist';
@Component({
  selector: 'app-products-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './products-details.html',
  styleUrl: './products-details.css'
})
export class ProductsDetails implements OnInit {
  product: any = null;
  loading = true;
  constructor(
    public cartservice: cartService,
    public toastService: ToastService,
    public productService: ProductsService,
    public auth: Auth,
    private route: ActivatedRoute,
    public router: Router,
    public wishlist : Wishlist
  ) {}



  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      this.product = await res.json();
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      this.loading = false;
    }
  }



  //add to cart

  addToCart(product: any, event: MouseEvent) {
     if(!this.auth.getToken()){
      this.toastService.show('You must be logged in to add products to cart', 'error', 2500);
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/carts' } });
      return;
     }
    this.cartservice.addToCart(product);
    this.toastService.show(`${product.title} added to cart`, 'success', 2200);
    this.flyToCart(event);
  }



  //fly to cart


  private flyToCart(event: MouseEvent) {
    const cartIcon = document.querySelector('.fa-shopping-bag') as HTMLElement;
    if (!cartIcon) return;

    const img = (event.target as HTMLElement)
      .closest('.product-card')
      ?.querySelector('img') as HTMLImageElement;

    if (!img) return;


    const flyingImg = img.cloneNode(true) as HTMLImageElement;
    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();


    flyingImg.style.position = 'fixed';
    flyingImg.style.left = imgRect.left + 'px';
    flyingImg.style.top = imgRect.top + 'px';
    flyingImg.style.width = imgRect.width + 'px';
    flyingImg.style.height = imgRect.height + 'px';
    flyingImg.style.transition = 'all 1s ease-in-out';
    flyingImg.style.zIndex = '2000';
    flyingImg.style.borderRadius = '8px';
    document.body.appendChild(flyingImg);

    setTimeout(() => {
      flyingImg.style.left = cartRect.left + 'px';
      flyingImg.style.top = cartRect.top + 'px';
      flyingImg.style.width = '30px';
      flyingImg.style.height = '30px';
      flyingImg.style.opacity = '0.5';
    }, 50);

    setTimeout(() => {
      flyingImg.remove();
    }, 1100);
  }
}
