import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem } from '@po-ui/ng-components';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../app/components/shared/auth/auth.service';
import { DataManipulation } from './components/shared/shared-services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataManipulation]

})
export class AppComponent implements OnInit, OnDestroy {
  menus: Array<PoMenuItem> = [];
  $subsMenu: Subscription = new Subscription;
  userData: any;
  supplierData: any;

  constructor(private router: Router,
    private authService: AuthService,
    private dataService: DataManipulation) {


  }
  ngOnDestroy(): void {
    this.$subsMenu.unsubscribe();
  }

  ngOnInit() {
    this.$subsMenu = this.authService.mostrarMenuEmitter.subscribe(exibeMenu => {
      let userType = this.authService.userType()
      let userId: number = this.authService.getIdUser();

      if (exibeMenu && userType == "employee") {
        this.getUserData(userId, 'usuarios')
        this.menus = this.montaMenu();
      } else if (exibeMenu && userType == "adm") {
        this.menus = this.montaMenuAdm()
      } else if (exibeMenu && userType == "supplier") {
        this.getUserData(userId, 'usuarios')
        this.dataService.getCustomLookupData('user', userId, 'fornecedoresCustom').subscribe(data => this.supplierData =
          data.results[0])
        this.menus = this.montaMenuSupplier();
      } else {
        this.menus = [];
      }
    });

  }

  getUserData(id: number, page: string) {
    this.dataService.getSingleData(id, page).subscribe(data => this.userData = data)
  }

  montaMenuSupplier() {
    return [
      {
        label: 'Meus dados',
        icon: 'po-icon po-icon-user',
        shortLabel: 'Perfil',
        subItems: [
          {
            label: 'Dados', action: () => this.router.navigateByUrl('cadastro-fornecedor/3', {
              state: this.supplierData
            })
          },
          {
            label: 'Usuário', action: () => this.router.navigateByUrl(
              `/cadastro-usuario/${this.authService.getIdUser()}`
              , {
                state: this.userData
              })
          }
        ]
      },
      {
        label: 'Cotação',
        icon: 'po-icon-document-filled',
        shortLabel: 'Pedidos',
        subItems: [
          { label: 'Atualiza Cotação', action: () => this.router.navigate(['atualiza-cotacao']) }
        ]
      },
      {
        label: 'Financeiro',
        icon: 'po-icon po-icon-finance',
        shortLabel: 'Financeiro',
        subItems: [
          {
            label: 'Titulos', action: () => this.router.navigate(['titulos'])
          }
        ]
      },
      {
        label: 'Logout',
        icon: 'po-icon-exit',
        shortLabel: 'Logout',
        action: () => this.authService.logout()

      }
    ]
  }

  montaMenu() {
    return [
      {
        label: 'Meus dados',
        icon: 'po-icon po-icon-user',
        shortLabel: 'Perfil',
        action: () => this.router.navigateByUrl(
          `/cadastro-usuario/${this.authService.getIdUser()}`
          , {
            state: this.userData
          })
      },
      {
        label: 'Básico',
        icon: 'po-icon-archive',
        shortLabel: 'Básico',
        subItems: [
          { label: 'Fornecedores', action: () => this.router.navigate(['fornecedores']) },
          { label: 'Produtos', action: () => this.router.navigate(['produtos']) },
          { label: 'Condição de Pagamento', action: () => this.router.navigate(['condicao-pagamento']) },
        ]
      },
      {
        label: 'Compras',
        icon: 'po-icon-cart',
        shortLabel: 'Compras',
        subItems: [
          { label: 'Solicitação de Compras', action: () => this.router.navigate(['solicitar-compras']) },
          { label: 'Gerar Cotação', action: () => this.router.navigate(['gerar-cotacao']) },
          { label: 'Analisa Cotação', action: () => this.router.navigate(['analisa-cotacao']) },
        ]
      },
      {
        label: 'Cotação',
        icon: 'po-icon-document-filled',
        shortLabel: 'Pedidos',
        subItems: [
          { label: 'Atualiza Cotação', action: () => this.router.navigate(['atualiza-cotacao']) }
        ]
      },
      {
        label: 'Financeiro',
        icon: 'po-icon po-icon-finance',
        shortLabel: 'Financeiro',
        subItems: [
          {
            label: 'Titulos', action: () => this.router.navigate(['titulos'])
          }
        ]
      },
      {
        label: 'Logout',
        icon: 'po-icon-exit',
        shortLabel: 'Logout',
        action: () => this.authService.logout()

      }
    ]
  }

  montaMenuAdm() {
    return [
      {
        label: 'Básico',
        icon: 'po-icon-archive',
        shortLabel: 'Básico',
        subItems: [
          { label: 'Fornecedores', action: () => this.router.navigate(['fornecedores']) },
          { label: 'Produtos', action: () => this.router.navigate(['produtos']) },
          { label: 'Condição de Pagamento', action: () => this.router.navigate(['condicao-pagamento']) },
        ]
      },
      {
        label: 'Compras',
        icon: 'po-icon-cart',
        shortLabel: 'Compras',
        subItems: [
          { label: 'Solicitação de Compras', action: () => this.router.navigate(['solicitar-compras']) },
          { label: 'Gerar Cotação', action: () => this.router.navigate(['gerar-cotacao']) },
          { label: 'Analisa Cotação', action: () => this.router.navigate(['analisa-cotacao']) },
        ]
      },
      {
        label: 'Cotação',
        icon: 'po-icon-document-filled',
        shortLabel: 'Pedidos',
        subItems: [
          { label: 'Atualiza Cotação', action: () => this.router.navigate(['atualiza-cotacao']) }
        ]
      },
      {
        label: 'Financeiro',
        icon: 'po-icon po-icon-finance',
        shortLabel: 'Financeiro',
        subItems: [
          {
            label: 'Titulos', action: () => this.router.navigate(['titulos'])
          }
        ]
      },
      {
        label: 'Administração',
        icon: 'po-icon-home',
        shortLabel: 'Admin',
        subItems: [

          { label: 'Usuários', action: () => this.router.navigate(['usuarios']) },

        ]
      },
      {
        label: 'Logout',
        icon: 'po-icon-exit',
        shortLabel: 'Logout',
        action: () => this.authService.logout()

      }
    ]
  }

  avatar = './assets/images/avatar.png'
  contact = {
    name: 'Administrador',
    email: 'admin@admin.net',
  };

}
