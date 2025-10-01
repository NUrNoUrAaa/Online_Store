import { Component } from '@angular/core';
import { FormBuilder ,FormControl,FormGroup,Validators } from '@angular/forms';
import { Auth } from '../auth';
import { Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {  ToastService } from '../../toast/service/toast';



@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {


 loading = false;
 error= '';
 message ='';
 
//use form group without form builder

form =new FormGroup({
  
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
 });



//  form : FormGroup;

constructor (
  // private fb: FormBuilder,
  private auth : Auth,
  private route : ActivatedRoute,
 private router : Router,
 private toast: ToastService

){

  //   this.form = this.fb.group({
  //   username :['', Validators.required],
  //   password:['', Validators.required]
  // })
}






submit(){

  //cheak if invalid input
  if(this.form.invalid){
    this.error ='please fill all fields';
    return;
  }

//reset al loading and error 
this.loading = true;
this.error='';

//bst5rg al values from form
    const username = this.form.controls.username.value;
    const password = this.form.controls.password.value;


  if (!username || !password) {
      this.error = 'Please provide valid credentials';
      this.loading = false;
      return;
    }


//login "api"
 this.auth.login(username, password).subscribe({
  next: (user)=>{
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.toast.show(`Welcome back, ${user.username || username}`, 'success', 1800);
    this.router.navigateByUrl(returnUrl);
    this.loading = false;
},

error :(err)=> {
// login without api 
     console.warn('Real login failed, falling back to mock login', err);
        this.auth.loginMock(username);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.toast.show(`Logged in (mock) as ${username}`, 'info', 1600);
        this.router.navigateByUrl(returnUrl);
        this.loading = false;
      }
    });
  }



  goHome() {
    this.router.navigateByUrl('/');
  }
}
