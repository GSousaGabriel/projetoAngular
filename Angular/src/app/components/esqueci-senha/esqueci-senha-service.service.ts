import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EsqueciSenhaServiceService {

  api_link: string= environment.API_URL
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  resetPass(user: any): Observable<any> {
    user = {
      user: user
    }
    return this.http.post(`${this.api_link}resetPass/`, user, {headers: this.httpHeaders});  
  }
}
