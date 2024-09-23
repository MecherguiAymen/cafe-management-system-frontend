import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ModalService } from '../modal/modal.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    //private dialog:MatDialog,
    private modalService: ModalService) { }

  ngOnInit(): void {
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


}
