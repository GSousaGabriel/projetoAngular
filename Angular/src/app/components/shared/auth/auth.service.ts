import { Link } from './../models/link.model';
import { PoNotificationService } from '@po-ui/ng-components';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ILogin } from 'src/app/pages/administracao/usuarios/cadastro-usuario/cadastro-usuario-json';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  isUrlAuthorized(url: string): boolean {
    return true;
  }
  rotinas: Array<Link> = []
  private usuario: any;
  idUser_local: Array<Link> = [];
  tokenUser_local: Array<Link> = [];
  staff_local: Array<Link> = [];
  adm_local: Array<Link> = [];

  mostrarMenuEmitter = new EventEmitter<boolean>()
  constructor(
    private router: Router,
    private http: HttpClient,
    private poNotification: PoNotificationService) {
  }

  autenticacao(login: ILogin): Observable<any> {
    return this.http.post<ILogin>(this.api_link + 'usuariosValidacao/', login,
      { headers: this.httpHeaders });
  }

  login(user: string, pass: string) {
    let login = { username: user, password: pass };

    this.autenticacao(login).subscribe(
      data => {
        if (data[0].msg.indexOf("sucesso") != -1) {
          sessionStorage.setItem(`idUser${this.idUser_local}`, btoa(JSON.stringify({ id: data[0].user.id, type: data[0].user.id })))
          sessionStorage.setItem(`staff${this.staff_local}`, btoa(JSON.stringify({ id: data[0].user.staff, type: data[0].user.staff })))
          sessionStorage.setItem(`adm${this.adm_local}`, btoa(JSON.stringify({ id: data[0].user.adm, type: data[0].user.adm })))

          this.setToken(user, pass).subscribe(data => {
            sessionStorage.setItem(`token${this.tokenUser_local}`, btoa(JSON.stringify({ id: data.token, type: data.token })))
            this.mostrarMenuEmitter.emit(true)

            if (this.userType() != "supplier") {
              this.router.navigate(['/fornecedores']);
            } else {
              this.router.navigate(['/atualiza-cotacao']);
            }
          })
        } else {
          this.poNotification.error(data[0].msg);
          this.mostrarMenuEmitter.emit(false)
          this.router.navigate(['/login']);
        }
      }
    )
  }

  logout(login: boolean = false) {
    sessionStorage.removeItem(`token${this.tokenUser_local}`);
    this.mostrarMenuEmitter.emit(false);
    if (!login) {
      this.router.navigate(['login']);
      sessionStorage.clear();
    }
    return true;
  }

  isUserAuth() {
    const user = sessionStorage.getItem(`token${this.tokenUser_local}`);
    if (user === null) {
      this.mostrarMenuEmitter.emit(false)
      return false
    } else {
      this.mostrarMenuEmitter.emit(true)
      return true
    }
  }
  getTypeUser() {
    return this.usuario.type
  }

  userType() {
    if (sessionStorage.getItem(`staff${this.staff_local}`)) {
      let staff = JSON.parse(atob(sessionStorage.getItem(`staff${this.staff_local}`)!))
      let adm = JSON.parse(atob(sessionStorage.getItem(`adm${this.adm_local}`)!))
      if (adm.id) {
        return 'adm'
      } else if (staff.id) {
        return 'employee'
      }
      return 'supplier'
    }
    return ''
  }

  setToken(user: string, pass: string): Observable<any> {
    let data = { username: user, password: pass }
    return this.http.post<any>(this.api_link + 'api-token-auth/', data,
      { headers: this.httpHeaders });
  }

  getToken() {
    let token = sessionStorage.getItem(`token${this.tokenUser_local}`)
    if (token != null) {
      token = atob(token)
      token = JSON.parse(token).id
      return token
    }
    return '0'
  }

  getIdUser() {
    if (sessionStorage.getItem(`token${this.tokenUser_local}`) == null) {
      return '0'
    }
    return JSON.parse(atob(sessionStorage.getItem(`idUser${this.idUser_local}`)!)).id
  }
}
