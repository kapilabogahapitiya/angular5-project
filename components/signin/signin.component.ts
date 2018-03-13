import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  
  @Output() successHandler = new EventEmitter<boolean>();

  form   : FormGroup;
  loading: boolean;
  error: {
    key: string,
    message: string,
    pass: string
  };

  private email     : string;
  private password  : string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.successSigninWithFB = this.successSigninWithFB.bind(this);
    this.successSigninWithGoogle = this.successSigninWithGoogle.bind(this);
  }

  openSignupModal() {
    this.activeModal.close();
    const modalRef = this.modalService.open(SignupComponent);
    const signUpComponent : SignupComponent = modalRef.componentInstance as SignupComponent;
    signUpComponent.goNext();
    signUpComponent.successHandler.subscribe(() => {
      modalRef.close()
      // this.handleSuccessSignup()
    })
  }

  openSignupModalwithSignin() {
    this.activeModal.close();
    const modalRef = this.modalService.open(SignupComponent);
    const signUpComponent : SignupComponent = modalRef.componentInstance as SignupComponent;
    signUpComponent.goBack();

    signUpComponent.successHandler.subscribe(() => {
      modalRef.close()
      // this.handleSuccessSignup()
    })
  }

  ngOnInit() {
    this.loading = false;
    this.clearError();

    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }
  
  onClickForgotPW() {
    this.activeModal.close();
    const modalRef = this.modalService.open(ForgotPasswordComponent);
  }

  onClickSignin(email: string, password: string): void {
    this.authService.signin(email, password)
      .subscribe(
        (res) => {
          this.loading = false;
          const { completedRegistration } = res;
          if (completedRegistration) {
            this.successHandler.emit(true);
            this.userService.get().subscribe();
          } else {
            this.openSignupModal();
          }
            
        },
        (err) => {
          this.loading = false;
          console.log(err);
          switch (err.status) {
            case 401:
              this.error = {
                key: 'email',
                message: 'Invalid email or password',
                pass: 'password'
              }
              break;
            case 404:
              this.error = {
                key: 'email',
                message: 'Invalid email or password',
                pass: 'password'
              }
              break;
            default:
              // code...
              break;
          }
        }
      );
  }

  onClickSigninWithGoogle(): void {
    this.authService.googleSignin(this.successSigninWithGoogle);
  }

  onClickSigninWithFB(): void {
    this.authService.fbSignin(this.successSigninWithFB);
  }

  successSigninWithGoogle(data: any): void {
    console.log(data);
  }

  successSigninWithFB(data: any): void {
    this.authService.signinWithFB(data.authResponse.accessToken)
      .subscribe(
        (res) => {
          this.loading = false;
          this.successHandler.emit(true);
        },
        (err) => {
          console.log(err);
          this.loading = false;
          switch (err.status) {
            case 403:
              this.error = {
                key: 'fb',
                message: 'Facebook access invalid',
                pass: 'password'
              }
              break;
            
            default:
              // code...
              break;
          }
        }
      );
    console.log(data);
  }

  clearError() {
    this.error = {
      key: '',
      message: '',
      pass: ''
    };
  }
}
