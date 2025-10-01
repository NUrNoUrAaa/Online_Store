import { Component } from '@angular/core';
import { Wishlist } from '../service/wishlist';

@Component({
  selector: 'app-wishlist',
   standalone: false,
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class WishlistComponent {
 constructor(public wishlist: Wishlist) {}
}