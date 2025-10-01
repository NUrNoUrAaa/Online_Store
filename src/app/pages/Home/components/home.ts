import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products: any[] = [];
  loading = true;

  async ngOnInit() {
    try {
      const res = await fetch('https://fakestoreapi.com/products?limit=4');
      this.products = await res.json();
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      this.loading = false;
    }
  }
}
