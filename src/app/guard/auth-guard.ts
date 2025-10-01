import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth/auth';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth);  //inject --> calling service
  const router = inject(Router);

  if (auth.isLoggedIn()){
    return true;
  }
  return router.createUrlTree(['/login'] , {
     queryParams: { returnUrl: state.url }
  });



};
