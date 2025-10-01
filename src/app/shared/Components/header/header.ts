import { Component, NgModule } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { cartService } from '../../../carts/services/carts';
import { FormsModule, NgModel } from '@angular/forms';
import { Auth } from '../../../auth/auth';
import { Wishlist } from '../../../wishlist/service/wishlist';

@Component({
  selector: 'app-header',
   standalone: true,
  imports: [CommonModule ,FormsModule,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
//profile
profileOpen =false;


//darkMode
 isDarkMode = false;

  constructor(public cartService : cartService , public auth : Auth , private router: Router , public wishlist : Wishlist){}

//prrofile
getInitial(){
  const name = this.auth.getUser()?.username || '';
  return  name ? name.charAt(0).toUpperCase(): '';
}


toggleDropdown(event: Event) {
  const circle = (event.currentTarget as HTMLElement);
  circle.classList.toggle('active');
}

toggleProfile (){
  this.profileOpen =!this.profileOpen;
}

logOut(){
  this.auth.logout();
   this.cartService.clearCart();
   this.wishlist.clearWishList();
  this.router.navigateByUrl('/');
}






//darkMode

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }



  //scroll nave bar

  ngOnInit() {
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.floating-navbar');
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    });
  }
}
