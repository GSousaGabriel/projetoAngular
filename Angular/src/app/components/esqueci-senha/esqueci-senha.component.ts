import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';
import { EsqueciSenhaServiceService } from './esqueci-senha-service.service';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.component.html',
  styleUrls: ['./esqueci-senha.component.css'],
  providers: [EsqueciSenhaServiceService]
})

export class EsqueciSenhaComponent {
  $user!: Subscription;
  reactiveForm!: UntypedFormGroup;

  constructor(private passService: EsqueciSenhaServiceService,
    private fb: UntypedFormBuilder,
    public poNotification: PoNotificationService
  ) {
    this.createReactiveForm();
  }

  createReactiveForm() {

    this.reactiveForm = this.fb.group({

      user: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],

    });

  }

  resetPassword() {
    if (this.reactiveForm.valid) {
      this.poNotification.information('Enviando a nova senha...')
      this.passService.resetPass(this.reactiveForm.get('user')?.value).subscribe({
        next: data => {
          this.poNotification.success('A nova senha temporária foi enviada para o email do usuário!')
        },
        error: error => {
          this.poNotification.error('Erro ao enviar a nova senha.')
        }
      })
    }
  }
}

