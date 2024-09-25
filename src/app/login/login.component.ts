import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ModalService } from '../modal/modal.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide =true;
  loginForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
  //  public dialogRef:MatDialogRef<ForgotPasswordComponent>,
  private ngxService:NgxUiLoaderService,
  private snackBarService:SnackbarService,
  private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder
    .group({email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]]
      ,password:[null,[Validators.required]]
    })
  }
  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data ={
      email: formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe((response:any) =>{
      this.ngxService.stop();
      this.modalService.close();
      localStorage.setItem('tokenn',response?.token);
      this.router.navigate(['/cafe/dashboard']);
    },(error)=>{
      this.ngxService.stop();
      if(error?.error?.message){
        this.responseMessage = error?.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }
  closeModal(){
    this.modalService.close();
  }

}
