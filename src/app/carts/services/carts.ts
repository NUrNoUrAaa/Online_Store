import { computed, effect, Injectable , signal} from "@angular/core";

export interface cartItem {
  id:number;
  title:string;
  price:number;
  image?:string;
  quantity:number;
}

@Injectable ({providedIn: 'root'})
export class cartService{

 private cart = signal<cartItem[]>([]);
 cartCount = computed(()=> this.cart().reduce((sum ,item)=> sum + item.quantity, 0));
 constructor() {
    const saved = localStorage.getItem('my_store_cart_v1');
    if (saved) {
      try {
        this.cart.set(JSON.parse(saved));
      } catch { }
    }

    effect(() => {
      localStorage.setItem('my_store_cart_v1', JSON.stringify(this.cart()));
    });
  }

  // add to cart
  addToCart(product: any){
    this.cart.update(items => {
      const idx = items.findIndex(i => i.id === product.id);
      if(idx > -1){
        const copy =items.slice();
        copy[idx]={...copy[idx], quantity:copy[idx].quantity+1};
        return copy;
      }
      else{
        const newItem: cartItem={

          id:product.id, title:product.title ,
          price: product.price , image:product.image,
          quantity: 1

        };
        return [...items, newItem];
      }

    });
  }


  //remov
  removeFromCart(productId:number){
    this.cart.update(items => items.filter(i => i.id !== productId))
  }

  updateQuantity(productId: number , quantity: number){
    // this.cart.update(items => items.map(i => i.id == productId ? {...i , quantity }: i));


    this.cart.update(items => {
    if (quantity <= 0) return items.filter(i => i.id !== productId);
    return items.map(i => i.id == productId ? {...i , quantity }: i);
  });


  }

  clearCart(){
    this.cart.set([]);
  }


  getCart(){
    return this.cart();
  }


getTotal(){
  return this.cart().reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
}


}
