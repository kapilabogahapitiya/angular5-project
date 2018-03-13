import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from './../../services/auth.service';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { SigninComponent } from '../signin/signin.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @Output() successHandler = new EventEmitter<boolean>();
  form   : FormGroup;
  loading: boolean;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loading = false;

    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  onClickSubmit(email: string): void {
    this.authService.forgotPassword(email);
  }

  onClickSignIn() {
    this.activeModal.close();
    const modalRef = this.modalService.open(SigninComponent);
    const signInComponent : SigninComponent = modalRef.componentInstance as SigninComponent

    signInComponent.successHandler.subscribe(() => {
      modalRef.close()
      // this.handleSuccessLogin()
    })
  }
}
