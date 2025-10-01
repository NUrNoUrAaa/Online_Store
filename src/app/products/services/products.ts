// products.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private search = signal<string>('');

  setSearch(query: string) {
    this.search.set(query.toLowerCase());
  }

  clearSearch() {
    this.search.set('');
  }

  getSearch() {
    return this.search();
  }
}
