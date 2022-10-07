import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class CadastroCondicaoPagamentoService {

}

@Injectable()
export class PostPaymentTerms {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  postPaymentTerms(paymentTerms: any): Observable<any> {
    const body = {
      id: paymentTerms.id,
      description: paymentTerms.description,
      codErp: paymentTerms.codErp,
    };
    return this.http.post(this.api_link + 'condicaoPagamento/', body,
      { headers: this.httpHeaders }).pipe(retry(1), catchError(this.handleError));
  }

  putPaymentTerms(paymentTerms: any): Observable<any> {
    const body = {
      id: paymentTerms.id,
      name: paymentTerms.name,
      description: paymentTerms.description,
      unit: paymentTerms.unit,
      codErp: paymentTerms.codErp,
    };
    return this.http.put(this.api_link + 'condicaoPagamento/' + paymentTerms.id + '/', body,
      { headers: this.httpHeaders }).pipe(retry(1), catchError(this.handleError));
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
    return throwError(() => {
      new Error(errorMessage);
    });
  };
}