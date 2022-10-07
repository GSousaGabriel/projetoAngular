import { Component, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from './../../shared/auth/auth.service';
import { RecaptchaErrorParameters } from "ng-recaptcha";
import { Router } from '@angular/router';


@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnDestroy {
  $login!: Subscription;
  senha!: string;
  reactiveForm!: UntypedFormGroup;
  siteKey: string = '6LcHKj8hAAAAAMa8zwU5K13Fph_X_pBHg0HjQ4jz';
  captchaSolved: boolean = false

  constructor(private authService: AuthService,
    private fb: UntypedFormBuilder,
    public poNotification: PoNotificationService,
    private router: Router
  ) {
    this.createReactiveForm();
  }

  ngOnDestroy() {

  }

  createReactiveForm() {

    this.reactiveForm = this.fb.group({

      // tslint:disable-next-line: max-line-length

      user: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],

      pass: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(10)])],

    });

  }

  onClick() {
    if (this.reactiveForm.valid) {
      grecaptcha.reset()
      this.captchaSolved = false
      this.authService.login(this.reactiveForm.get('user')?.value, this.reactiveForm.get('pass')?.value)
    }
  }

  public resolved(captchaResponse: string) {
    this.captchaSolved = true
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    this.captchaSolved = false
  }

  resetPass() {
    this.router.navigate(['/esqueci-senha']);
  }
}

