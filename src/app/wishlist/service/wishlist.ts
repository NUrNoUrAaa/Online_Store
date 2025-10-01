import { Injectable ,signal , computed, effect } from '@angular/core';

export interface WishlistItem {
  id: number;
  title : string;
  image?: string;
  price?: number;
}


@Injectable({
  providedIn: 'root'
})
export class Wishlist {
  private store = signal<WishlistItem[]>([]);
  readonly count = computed(()=> this.store().length);

  constructor() {
    const raw = localStorage.getItem('my_store_wishlist_v1')
    if(raw){
      try{
        this.store.set(JSON.parse(raw));
      }catch{}}
      effect (()=>{
        localStorage.setItem('my_store_wishlist_v1' , JSON.stringify(this.store()));
      });
    }


   getAll() {
    return this.store();
  }

  add(item: WishlistItem) {
    const exists = this.store().some(i => i.id === item.id);
    if (!exists) {
      this.store.update(s => [...s, item]);
    }
  }

  remove(id: number) {
    this.store.update(s => s.filter(i => i.id !== id));
  }

  toggle(item: WishlistItem) {
    if (this.store().some(i => i.id === item.id)) this.remove(item.id);
    else this.add(item);
  }

  isInWishlist(id: number) {
    return this.store().some(i => i.id === id);
  }
  clearWishList(){
    this.store.set([]);
  }
}
