import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';

import { AuthType } from './../../constants/auth-type.enum';
import { User } from './../../interfaces/user';
require('aws-sdk');

import { SigninComponent } from '../signin/signin.component';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @Output() successHandler = new EventEmitter<boolean>();

  form0     : FormGroup;
  form1     : FormGroup;
  loading   : boolean;
  error : {
    key: string,
    message: string
  };
  private authType  : number;
  step: number;
  private email     : string;
  private password  : string;
  private firstName : string;
  private lastName  : string;
  public token : string;
  public avaimg: string;
  userInfo: User;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.successSignupWithFB     = this.successSignupWithFB.bind(this);
    this.successSignupWithGoogle = this.successSignupWithGoogle.bind(this);
    this.step = 0;
  }

  ngOnInit() {
    this.loading = false;
    this.clearError();
    this.avaimg = 'assets/images/no_avatar.svg';

    this.userInfo = { ...this.userInfo, completedRegistration: false };

    this.form0 = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });

    this.form1 = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required]
    });
  }

  goBack(): void {
    this.step = 0;
  }

  goNext(): void {
    this.step = 1;
  }

  onClickBack(): void {
    this.goBack();
  }

  makeid(text = '') {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  fileEvent(fileInput:any) {
    const vm = this;
    let AWSService = window.AWS;
    let file = fileInput.target.files[0];
    const onlyName = file.name.split(".");
    AWSService.config.accessKeyId = 'AKIAIGALHANVPEWURBJA';
    AWSService.config.secretAccessKey = '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';
    onlyName[0] = this.makeid(onlyName[0]);
    let bucket = new AWSService.S3({params: {Bucket: 'pointters_dev/dev'}});
    let params = {Key: onlyName[0] + '.' + onlyName[1] , Body: file};
    bucket.upload(params, function(error, res) {
      vm.avaimg = res.Location;
      vm.userInfo = { ...vm.userInfo, profilePic: res.Location };
    });
  }

  onClickContinue(email, password): void {
    this.email = email;
    this.password = password;

    let promise = null;

    switch (this.authType) {
      case AuthType.Email:
        promise = this.authService.signupWithEMail(email, password);
        break;

      case AuthType.Google:
        promise = this.authService.signupWithGoogle();
        break;

      case AuthType.Facebook:
        promise = this.authService.signupWithFB(this.token);
        break;

      default:
        promise = this.authService.signupWithEMail(email, password);
        break;
    }
    promise
      .subscribe(
        (res: any) => {
          console.log(res.id);
          this.loading = false;
          this.userInfo = { ...this.userInfo, completedRegistration: true, completedRegistrationDate: (new Date()).toISOString() };
          this.goNext();
        //  this.successHandler.emit(true);
        },
        (err: any) => {
          this.loading = false;
          this.userInfo = { ...this.userInfo, completedRegistration: false };
          console.log(err);
          switch (err.status) {
            case 409:
              this.error = {
                key: 'email',
                message: 'Email is already used'
              };
              this.goBack();
              break;
             case 500:
              this.error = {
                key: 'email',
                message: err.error.message
              }
              break;
            default:
              // code...
              break;
           } 
        }
      );
  }

  onChangeFirstName(firstName) {
    this.userInfo = { ...this.userInfo, firstName };
  }

  onChangeLastName(lastName) {
    this.userInfo = { ...this.userInfo, lastName };
  }

  onClickSignup(): void {

    let promise = null;
    this.userInfo.completedRegistration = true;
    const vm = this;
    switch (this.authType) {
      case AuthType.Email:
        promise = this.userService.update(vm.userInfo);
        break;

      case AuthType.Google:
        promise = this.authService.signupWithGoogle();
        break;

      case AuthType.Facebook:
        promise = this.authService.signupWithFB(this.token);
        break;

      default:
        promise = this.userService.update(vm.userInfo);
        break;
    }
    promise
      .subscribe(
        (res: any) => {
          this.loading = false;

          if (vm.userInfo.completedRegistration && 
              vm.userInfo.firstName && 
              vm.userInfo.lastName && 
              vm.userInfo.profilePic && 
              vm.userInfo.location) {
            this.successHandler.emit(true);
          }
          else this.goBack();
        },
        (err: any) => {
          this.loading = false;
          console.log(err);
          switch (err.status) {
            case 409:
              this.error = {
                key: 'email',
                message: 'Email is already used'
              };
              this.goBack();
              break;
             case 500:
              this.error = {
                key: 'email',
                message: err.error.message
              }
              break;
            default:
              // code...
              break;
           } 
        }
      );
  }

  open() {
    this.activeModal.close();
    const modalRef = this.modalService.open(SigninComponent);
    const signInComponent : SigninComponent = modalRef.componentInstance as SigninComponent

    signInComponent.successHandler.subscribe(() => {
      modalRef.close()
      // this.handleSuccessLogin()
    })
  }

  onClickSignupWithGoogle(): void {
    this.authType = AuthType.Google;
    this.authService.googleSignin(this.successSignupWithGoogle);
  }

  onClickSignupWithFB(): void {
    this.authType = AuthType.Facebook;
    this.authService.fbSignin(this.successSignupWithFB);
  }

  successSignupWithGoogle(data: any): void {
    console.log(data);
    this.goNext();
  }

  successSignupWithFB(data: any): void {
    this.authService.signupWithFB(data.authResponse.userID)
      .subscribe(
        (res) => {
          this.loading = false;
          this.successHandler.emit(true);
          console.log(res);
        },
        (err) => {
          console.log(err);
          this.loading = false;
          switch (err.status) {
            case 403:
              this.error = {
                key: 'fb',
                message: 'Facebook access invalid'
              }
              break;
            
            default:
              // code...
              break;
          }
        }
      );
    console.log(data);
    // this.goNext();
  }

  clearError() {
    this.error = {
      key: '',
      message: ''
    };
  }


  public componentData1: any = '';

  autoCompleteCallback1(data: any): any {
    const location = {
      city: data.data.address_components[2].long_name,
      country: data.data.address_components[5].long_name,
      geoJson: {
        type: 'Point',
        coordinates: [data.data.geometry.location.lat, data.data.geometry.location.lng]
      },
      postalCode: data.data.address_components[6].long_name,
      province: data.data.address_components[3].long_name,
      state: data.data.address_components[4].short_name
    }
    this.userInfo = { ...this.userInfo, location };

    this.componentData1 = JSON.stringify(data);
  }

}
