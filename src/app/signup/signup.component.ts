import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { ModalService } from '../modal/modal.service';
export interface user {
  name: string;
  email: string;
  contactNumber: string;
  password: string;
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})


export class SignupComponent implements OnInit {

  password = true;
  confirmPassword = true;
  signUpForm:any = FormGroup;
  responseMessage:any;
  user : user;


  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    private snackBarService:SnackbarService,
   // public dialogRef:MatDialogRef<SignupComponent>,
    private ngxService:NgxUiLoaderService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contacNumberRegex)]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }
  validateSubmit() {
    if (this.signUpForm.controls['password'].value != this.signUpForm.controls['confirmPassword'].value) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit() {
    console.log('signUpForm.valid: name', this.signUpForm.get('name')?.valid);
    console.log('signUpForm.valid: email', this.signUpForm.get('email')?.valid);
    console.log('signUpForm.valid: contactNumber', this.signUpForm.get('contactNumber')?.valid);
    console.log('signUpForm.valid: confirmPassword', this.signUpForm.get('confirmPassword')?.valid); 
    this.ngxService.start();
    var formData = this.signUpForm.value;
    this.user= 
      {name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password}
      ;
    console.log('formData', formData);
    console.log('user', this.user);

    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
    }
    console.log('data', data);
    this.userService.signUp(this.user).subscribe((response: any) => {

      this.ngxService.stop();
     // this.dialogRef.close();
     this.modalService.close();
      this.responseMessage = response.message;
      this.snackBarService.openSnackBar(this.responseMessage, "");
      this.router.navigate(['/']);
    }, (error) => {
      this.ngxService.stop();
     // this.modalService.close();

      error.error?.message ? this.responseMessage = error.error?.message : this.responseMessage = GlobalConstants.genericError;
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);

    })
    }
    closeModal(){
      this.modalService.close();
    }

}
