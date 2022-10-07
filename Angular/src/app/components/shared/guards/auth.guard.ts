import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  mostrarMenuEmitter: any;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    let userType = this.authService.userType();

    if (route.routeConfig?.path?.indexOf('cadastro-usuario') == 0 && userType == 'employee') {
      return true
    } if (userType == 'supplier') {
      if (route.routeConfig?.path?.indexOf('cadastro-usuario') == 0) {
        return true
      } else if (route.routeConfig?.path == "cadastro-fornecedor/:id" && route.params['id'] == '3') {
        return true
      } else if (route.routeConfig?.path?.indexOf('atualiza-cotacao') == -1) {
        this.router.navigate(["/atualiza-cotacao"])
        return false
      }
    }

    if (route.routeConfig?.path == "cadastro-fornecedor/:id") {
      if (route.params['id'] == '1') {
        return true
      } else if (route.params['id'] == '99' || route.params['id'] == '0') {
        return this.verificarAcesso(state);
      } else {
        this.router.navigate(["/login"]);
        return false;
      }

    } else if (route.routeConfig?.path == "login") {
      return this.authService.logout(true)
    }

    return this.verificarAcesso(state);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    return this.verificarAcesso(state);
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  private verificarAcesso(state: RouterStateSnapshot) {

    if (this.authService.isUserAuth()) {
      return true
    } else {
      this.router.navigate(['/login']);
      return false
    }
  }
}