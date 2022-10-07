import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { UsuariosService } from '../usuarios.service';
import { IUsuario } from './cadastro-usuario-json';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {

  pageTitle: string = 'Novo usuário';
  validForm!: UntypedFormGroup;
  nome!: string;
  sobrenome!: string;
  email!: string;
  ativo!: boolean;
  admin!: boolean;
  staff!: boolean;
  username!: string;
  senha!: string;
  usuario!: IUsuario;
  newRegister: boolean = true;
  id!: number;
  staffEnabled: boolean = true;
  userType: string = this.authService.userType();
  notAdm: string = this.userType != 'adm' ? 'true' : 'false';

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Listagem de usuários', link: '/usuarios' }, { label: 'Manutenção de usuários' }]
  };

  constructor(
    private fb: UntypedFormBuilder,
    public poNotification: PoNotificationService,
    private fService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {

    this.route.params.subscribe(params => {
      if (params['id'] != '0') {
        this.pageTitle = "Editar usuário"
        this.newRegister = false;
      }
    });

    this.createReactiveForm()
    this.setType()
  }

  ngOnInit(): void {

  }

  fixType(adm: any) {
    if (adm) {
      this.validForm.get('staff')?.setValue(false)
      this.staffEnabled = false
    } else {
      this.staffEnabled = true
    }
  }

  onClickSalvar() {

    this.nome = this.validForm.get('nome')?.value
    this.sobrenome = this.validForm.get('sobrenome')?.value
    this.email = this.validForm.get('email')?.value
    this.ativo = this.validForm.get('ativo')?.value
    this.admin = this.validForm.get('admin')?.value
    this.staff = this.validForm.get('staff')?.value
    this.username = this.validForm.get('username')?.value
    this.senha = this.validForm.get('senha')?.value
    if (this.validateForm()) {
      this.usuario = {
        id: this.id,
        first_name: this.nome,
        last_name: this.sobrenome,
        email: this.email,
        is_active: this.ativo,
        is_superuser: this.admin,
        is_staff: this.staff,
        username: this.username,
        password: this.senha
      }
      if (this.newRegister) {
        this.fService.postUser(this.usuario).subscribe({
          next: data => {
            this.poNotification.success(`Usuário : ${data.first_name} incluido com sucesso.`);
            this.validForm.reset();
            this.validForm.get('ativo')?.setValue(true)
            this.validForm.get('admin')?.setValue(false)
            this.validForm.get('staff')?.setValue(true)
            this.staffEnabled = true
          },
          error: error => {
            if (error.error.hasOwnProperty("username")) {
              this.poNotification.error(error.error.username[0]);
            }
            if (error.error.hasOwnProperty("email")) {
              this.poNotification.error(error.error.email[0]);
            } else if (error.error.includes("UNIQUE constraint failed")) {
              this.poNotification.error("Erro ao cadastrar o usuário, usuário já existe!");
            }
          }
        });
      } else {
        this.fService.putUser(this.usuario).subscribe({
          next: data => { this.poNotification.success(`Usuário : ${data.first_name} alterado com sucesso.`); },
          error: error => {
            if (error.error.hasOwnProperty("username")) {
              this.poNotification.error(error.error.username[0]);
            }
            if (error.error.hasOwnProperty("email")) {
              this.poNotification.error(error.error.email[0]);
            }
          }
        });
      }
    }


  }

  createReactiveForm() {
    this.validForm = this.fb.group({
      nome: ['', Validators.compose([Validators.required])],
      sobrenome: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      ativo: [true, Validators.compose([Validators.required])],
      staff: [true, Validators.compose([Validators.required])],
      admin: [false, Validators.compose([Validators.required])],
      senha: ['', Validators.compose([Validators.required])],

    });
  }

  validateForm() {

    if (this.nome.length == 0) {
      this.poNotification.error('Informe o Nome')
      return false
    }
    if (this.sobrenome.length == 0) {
      this.poNotification.error('Informe o Sobrenome')
      return false
    }
    if (this.email.length == 0) {
      this.poNotification.error('Informe o Email')
      return false
    }
    if (this.username.length == 0) {
      this.poNotification.error('Informe o Usuário')
      return false
    }
    if (this.senha.length == 0) {
      this.poNotification.error('Informe a Senha')
      return false
    }

    return true
  }

  setType() {
    const nav = this.router.getCurrentNavigation();
    if (nav != null) {
      if (nav.extras.state != undefined) {
        this.setFields(nav.extras.state)
        this.newRegister = false;
      } else if (this.userType == "supplier") {
        this.router.navigateByUrl('atualiza-cotacao')
      } else if (this.userType == "employee") {
        this.router.navigateByUrl('fornecedores')
      }
    } else {
      this.id = 0
      this.newRegister = true;
    }
  }

  setFields(usuario: any) {

    this.id = usuario.id
    this.validForm.get('nome')?.setValue(usuario.first_name)
    this.validForm.get('sobrenome')?.setValue(usuario.last_name)
    this.validForm.get('email')?.setValue(usuario.email)
    this.validForm.get('ativo')?.setValue(usuario.is_active)
    this.validForm.get('staff')?.setValue(usuario.is_staff)
    this.validForm.get('admin')?.setValue(usuario.is_superuser)
    this.validForm.get('username')?.setValue(usuario.username)
    this.validForm.get('senha')?.setValue("")

    this.fixType(this.validForm.get('admin')?.value)
  }
}
