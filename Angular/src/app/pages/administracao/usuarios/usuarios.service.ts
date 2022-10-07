import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { IUsuario } from './cadastro-usuario/cadastro-usuario-json';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) {

  }

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'id', label: 'Id', type: 'string' },
      { property: 'username', label: 'Usuário', type: 'string', width: '200px' },
      { property: 'first_name', label: 'Nome' },
      { property: 'last_name', label: 'Sobrenome', type: 'string' },
      { property: 'email', label: 'E-mail', type: 'string' },
      { property: 'is_active', label: 'Ativo', type: 'boolean' },

    ];
  }

  postUser(usuario: IUsuario): Observable<IUsuario> {
    return this.http.post<IUsuario>(this.api_link + 'usuarios/', usuario,
      { headers: this.httpHeaders });
  }

  putUser(usuario: IUsuario): Observable<IUsuario> {
    return this.http.put<IUsuario>(this.api_link + 'usuarios/' + usuario.id + '/', usuario,
      { headers: this.httpHeaders });
  }
}
