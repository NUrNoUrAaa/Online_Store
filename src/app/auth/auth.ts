import { computed, Injectable , signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap   , catchError} from 'rxjs/operators';
import { Observable , throwError } from 'rxjs';


export interface User {
id ?: number;
username?: string;
email?:string;
role?: "user"|"admin";
token ?: string;

}


@Injectable({
  providedIn: 'root'
})
export class Auth {
  private base ='https://fakestoreapi.com';

  //status of user in localstorage
  private user = signal<User | null >(null);

  //check user logged in
  readonly isLoggedIn = computed(()=> !!this.user()?.token); //!! --> converte to boolean


constructor(private http: HttpClient) {

  const raw = localStorage.getItem('my_store_user_v1');
  if(raw){

    try{
      this.user.set(JSON.parse(raw));
    }
    catch(e){
      console.warn('Invalid saved user in localStorage');
    }
  }
}


  login(username: string, password: string): Observable<User>{
    //Generic Type Annotation
    return this.http.post<{token:string}> (`${this.base}/auth/login`,{ username, password }).pipe(
      map(res  => {
        const u: User = { username, 
          token: res.token,
          role: username === 'admin' ? 'admin' : 'user' };
        this.setUser(u);
        return u;
        }),
        catchError((err) => {
          return throwError(() => err); 
        })
      );
  }


  //mock (without API)
   loginMock(username: string): User {
    const u: User = { id: Date.now(), username, token: 'mock-token', role: username === 'admin' ? 'admin' : 'user' };
    this.setUser(u);
    return u;
  }


  //save or remove status
    private setUser(u: User | null) {
    this.user.set(u);
    if (u) {
      localStorage.setItem('my_store_user_v1', JSON.stringify(u));
    } else {
      localStorage.removeItem('my_store_user_v1');
    }
  }


  logout() {
    this.setUser(null);
  }


//guard "getters"
  getToken(): string | null {
    return this.user()?.token ?? null; //??--> coalescing operator return null only
  }



//info user (guard)
  getUser(): User | null {
    return this.user();
  }


//guard
  getRole(): string | undefined {
    return this.user()?.role;
  }

  //signUp

    signup(username: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.base}/users`, { username, email, password }).pipe(
        map((u: any) => {
          return {
            id: u.id,
            username: u.username,
            email: u.email,
            role: 'user',
          } as User;
        })
      );
  }

  

}




