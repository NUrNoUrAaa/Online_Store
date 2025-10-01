import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { cartService } from '../../services/carts';

@Component({
  selector: 'app-carts',
  imports: [CommonModule],
  templateUrl: './carts.html',
  styleUrl: './carts.css'
})
export class Carts {

  constructor(public cartService: cartService){}



  get items() {return this.cartService.getCart();}

  get total() {return this.cartService.getTotal();}


  removeItem(id: number) {this.cartService.removeFromCart(id);}

  increase(itemId: number, quantity: number) { this.cartService.updateQuantity(itemId, quantity + 1); }

  decrease(itemId: number, quantity: number) {this.cartService.updateQuantity(itemId, quantity - 1);}

  clearCart() { this.cartService.clearCart();}
  
}
