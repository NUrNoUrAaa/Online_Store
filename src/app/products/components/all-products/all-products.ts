import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { cartService } from '../../../carts/services/carts';
import { ToastService } from '../../../toast/service/toast';
import { ProductsService } from '../../services/products';
import { Auth } from '../../../auth/auth';
import { Wishlist } from '../../../wishlist/service/wishlist';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './all-products.html',
  styleUrl: './all-products.css'
})


export class AllProducts implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  loading = true;
  activeCategory!:'all' | string;
  searchQuery = '';


  //pagination
  currentPage=1;
  pageSize=8;
  totalPages =0;


  constructor(
    public cartservice: cartService,
    public toastService: ToastService,
    public productService: ProductsService,
    public auth: Auth,
    public router: Router,
    public wishlist: Wishlist
  ) {}

  async ngOnInit() {
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      this.products = await res.json();
      this.filteredProducts = this.products;

      const resCat = await fetch('https://fakestoreapi.com/products/categories');
      this.categories = await resCat.json();


      this.activeCategory = 'all';
      this.applyFilters();

    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      this.loading = false;
    }
  }


filterByCategory(category: string) {
  this.activeCategory = category;
  if (category === 'all') {
    this.applyFilters();
  } else {
    this.applyFilters(category);
  }
}

  applyFilters(category: string | null = null) {
    let filtered = this.products;

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (this.searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    //paginate

    this.totalPages =Math.ceil(filtered.length/this.pageSize);
    this.filteredProducts = this.paginate(filtered);
  }
  //function paginate
paginate(data: any[]) {
  const start = (this.currentPage - 1) * this.pageSize;
  return data.slice(start, start + this.pageSize);
}

goToPage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.applyFilters(this.activeCategory === 'all' ? null : this.activeCategory);
}

  onSearchChange() {
    this.applyFilters();
  }


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


  //animation wish list
toggleWishlist(product: any, event: MouseEvent) {
   if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/wishlist' }
      });
      return;
    }



  this.wishlist.toggle({
    id: product.id,
    title: product.title,
    image: product.image,
    price: product.price
  });

  const btn = event.currentTarget as HTMLElement;
  btn.classList.add('pulse');
  setTimeout(() => btn.classList.remove('pulse'), 400);
}


}
