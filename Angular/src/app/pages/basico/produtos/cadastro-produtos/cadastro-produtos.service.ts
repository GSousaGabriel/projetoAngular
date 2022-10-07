import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { environment } from 'src/environments/environment'; 
import { PoLookupColumn } from '@po-ui/ng-components';

@Injectable()
export class CadastroProdutosService {
  getColumnsLookup(): Array<PoLookupColumn> {
      return[
        { property: 'id', label: 'Id' },
        { property: 'socialName', label: 'Razão Social' },
        { property: 'document', label: 'CNPJ' }    
      ]
  }
}

@Injectable()
export class PostProducts {
  api_link: string= environment.API_URL
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Token '+ this.authService.getToken()});

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  postProducts(products: any): Observable<any> {
    const body = {
      id: products.id,
      name: products.name,
      description: products.description,
      unit: products.unit,
      codErp: products.codErp,
      defaultSupplier: products.defaultSupplier
    };
    return this.http.post(this.api_link + 'produto/', body,
    {headers: this.httpHeaders});
  }

  putProducts(products: any): Observable<any> {
    const body = {
      id: products.id,
      name: products.name,
      description: products.description,
      unit: products.unit,
      codErp: products.codErp,
      defaultSupplier: products.defaultSupplier
    };
    return this.http.put(this.api_link + 'produto/' + products.id +'/', body,
    {headers: this.httpHeaders});
  }

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };
}