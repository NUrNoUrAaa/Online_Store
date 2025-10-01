import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, Auth as AuthService } from '../auth';
import { ToastService } from '../../toast/service/toast';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule , RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})



export class Signup {
loading = false;
error='';
message = '';
form: FormGroup;


constructor(private auth :Auth , private toast: ToastService , private fb : FormBuilder , private router: Router){
  this.form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
}


submit(){
  if(this.form.invalid){
    this.error ='please fill all fields correctly';
    return ;
  }

  this.loading =true;
  this.error ='';



  const { username , email , password} = this.form.value ;


  //api 
  this.auth.signup(username , email ,password).subscribe({ //post data to api 
    //if success
    next : (user)=> {
      // try login after sign up  / mo3zm al api msh btrg3 token fa lazm n login after sign up 
      this.auth.login(username, password).subscribe({
        //if success
          next: (user) => {
            this.toast.show(`Welcome, ${user.username || username}`, 'success', 1800);
            this.router.navigateByUrl('/'); //redirect to home page
            this.loading = false;
          },
          //if failed "api"
          error: () => {
            // use mock 
            this.auth.loginMock(username);
            this.toast.show(`Account created (mock login) — Welcome ${username}`, 'info', 1600);
            this.router.navigateByUrl('/');
            this.loading = false;
          }
        });
      },
      //if failed "signup || login"
      error: (err) => {
        console.error('Signup failed', err);
        this.error = 'Signup failed — try a different username';
        this.loading = false;
      }
    });
  }

  goHome() {
    this.router.navigateByUrl('/');
  }
}


