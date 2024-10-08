import { Component, OnInit } from '@angular/core';
import { SignupComponent } from '../signup/signup.component';
import { ModalService } from '../modal/modal.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    //private dialog:MatDialog,
    private modalService: ModalService,
  private userService:UserService,
private router:Router) { }

  ngOnInit(): void {
    this.userService.checkToken().subscribe((res:any)=>{
        this.router.navigate(['cafe/dashboard']);
    },(error:any)=>{
      console.log(error);
    })
  }

  handleSignUpAction(){
    //const dialogConfig = new MatDialogConfig();
    //dialogConfig.width = "550px";
    //this.dialog.open(SignupComponent,dialogConfig);
    this.modalService.open(SignupComponent, {
      animations: {
        modal: {
          enter: 'enter-scaling 0.3s ease-out',
          leave: 'fade-out 0.1s forwards',
        },
        overlay: {
          enter: 'fade-in 1s',
          leave: 'fade-out 0.3s forwards',
        },
      },
      size: {
        width: '40rem',
        padding: '24px',
        //zIndex: '111',
      },
    });
  }
  handleForgotPasswordAction(){
    //const dialogConfig = new MatDialogConfig();
    //dialogConfig.width = "550px";
    //this.dialog.open(ForgotPasswordComponent,dialogConfig);

    this.modalService.open(ForgotPasswordComponent, {
      animations: {
        modal: {
          enter: 'enter-scaling 0.3s ease-out',
          leave: 'fade-out 0.1s forwards',
        },
        overlay: {
          enter: 'fade-in 1s',
          leave: 'fade-out 0.3s forwards',
        },
      },
      size: {
        width: '40rem',
        padding: '24px',
        //zIndex: '111',
      },
    });
  }

  handleLoginAction(){
    //const dialogConfig = new MatDialogConfig();
    //dialogConfig.width = "550px";
    //this.dialog.open(ForgotPasswordComponent,dialogConfig);

    this.modalService.open(LoginComponent, {
      animations: {
        modal: {
          enter: 'enter-scaling 0.3s ease-out',
          leave: 'fade-out 0.1s forwards',
        },
        overlay: {
          enter: 'fade-in 1s',
          leave: 'fade-out 0.3s forwards',
        },
      },
      size: {
        width: '40rem',
        padding: '24px',
        //zIndex: '111',
      },
    });
  }


}
