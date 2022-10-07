import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi } from '@po-ui/ng-components';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedServicesService {

  constructor() { }
}

@Injectable()
export class DataManipulation {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getAllPageData(numPage: number, page: string): Observable<any> {
    return this.http.get(`${this.api_link}${page}/?page=${numPage}`, { headers: this.httpHeaders });
  }

  getSingleData(id: number | string, page: string): Observable<any> {
    return this.http.get(`${this.api_link}${page}/${id}/`, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() }) });
  }

  deleteData(id: number, page: string): Observable<any> {
    return this.http.delete(`${this.api_link}${page}/${id}/`, { headers: this.httpHeaders });
  }

  searchData(numPage: number, searchParam: string, page: string): Observable<any> {
    return this.http.get(`${this.api_link}${page}/?page=${numPage}&search=${searchParam}`, { headers: this.httpHeaders });
  }

  filteredData(page: string, filter: string, filterValue: string): Observable<any> {
    return this.http.get(`${this.api_link}${page}/?${filter}=${filterValue}`, { headers: this.httpHeaders });
  }

  sendEmail(id: number, page: string): Observable<any> {
    return this.http.get(`${this.api_link}${page}/${id}/?sendEmail=1`, { headers: this.httpHeaders });
  }

  genericEmail(data:any){
    return this.http.post(`${this.api_link}genericEmail/?sendEmail=1`,data, { headers: this.httpHeaders });
  }

  getCustomLookupData(field: string, value: any, page: string): Observable<any> {
    return this.http.get(`${this.api_link}${page}/?field=${field}&value=${value}`, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token 77a0dcf52f15d10aa458a844cfcad6c8f04595d6' }) });
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
    return errorMessage;
  };
}

@Injectable()
export class LookupGetUser implements PoLookupFilter {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getFilteredItems({ filter, page, filterParams }: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
    let numPage = ''

    if (page && filter) {
      filter = '?page=' + page + '&search=' + filter;
    } else if (page) {
      numPage = '?page=' + page;
    } else if (filter) {
      filter = '?search=' + filter;
    }

    return this.http.get(`${this.api_link}usuarios/${numPage}${filter}`, { headers: this.httpHeaders }).pipe(map((response: any) => ({
      items: response.results,
      hasNext: !!response.next
    })))
  }

  getObjectByValue(value: any, filterParams?: any): Observable<any> {
    if (typeof value != 'number') {
      value = value.id
    }
    return this.http.get(`${this.api_link}usuarios/?search=${value}`, { headers: this.httpHeaders }).pipe(map((response: any) => response.results[0]));
  }
}