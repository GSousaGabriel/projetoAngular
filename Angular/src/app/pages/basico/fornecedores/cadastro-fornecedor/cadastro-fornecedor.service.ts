import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ISuppliers } from './cadastro-fornecedor-json';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { PoLookupColumn, PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment'; 

@Injectable()
export class CadastroFornecedorService {
  getCity(state: number) {
    switch (state) {
      case 1: {
        return [
          { label: 'Palhoça', value: 5 },
          { label: 'Lages', value: 6 },
          { label: 'Balneário Camboriú', value: 7 },
          { label: 'Brusque', value: 8 }
        ];
      }
      case 2: {
        return [
          { label: 'São Paulo', value: 9 },
          { label: 'Guarulhos', value: 10 },
          { label: 'Campinas', value: 11 },
          { label: 'São Bernardo do Campo', value: 12 }
        ];
      }
      case 3: {
        return [
          { label: 'Rio de Janeiro', value: 13 },
          { label: 'São Gonçalo', value: 14 },
          { label: 'Duque de Caxias', value: 15 },
          { label: 'Nova Iguaçu', value: 16 }
        ];
      }
      case 4: {
        return [
          { label: 'Belo Horizonte', value: 17 },
          { label: 'Uberlândia', value: 18 },
          { label: 'Contagem', value: 19 },
          { label: 'Juiz de Fora', value: 20 }
        ];
      }
    }
    return [];
  }

  getColumnsLookup(): Array<PoLookupColumn> {
        return[
          { property: 'id', label: 'Cód Usuario' },  
          { property: 'username', label: 'Usuário' }, 
          { property: 'first_name', label: 'Nome' },  
          { property: 'last_name', label: 'Sobrenome' },  
          { property: 'email', label: 'email' }   
        ]
  }
}

@Injectable()
export class PostSuppliers {
  api_link: string= environment.API_URL
  httpHeaders = new HttpHeaders({ 'Authorization': 'Token '+ this.authService.getToken()});
  

  constructor(private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,) { }

  postSuppliers(suppliers: ISuppliers): Observable<any> {
    const form = new FormData();
    let sendEmail = false;

    this.route.params.subscribe(params =>{
      if((params['id'] == '1' || params['id'] == '2') && this.authService.userType() != 'adm'){
        sendEmail = true
      }
    });
    
    form.append("document", suppliers.document);
    form.append("socialName", suppliers.socialName);
    form.append("fantasyName", suppliers.fantasyName);
    form.append("cep",suppliers.cep)
    form.append("address",suppliers.address)
    form.append("district",suppliers.district)
    form.append("city",suppliers.city)
    form.append("state",suppliers.state)
    form.append("phone",suppliers.phone)
    form.append("mobilePhone",suppliers.mobilePhone)
    form.append("contact",suppliers.contact)
    form.append("email",suppliers.email)
    form.append("erp",suppliers.erp)
    form.append("approve",  suppliers.approve.toString());
    form.append("user",  suppliers.user);
    if (typeof suppliers.cartaoCNPJ != 'undefined'){
      form.append("cartaoCNPJ", suppliers.cartaoCNPJ.file, suppliers.cartaoCNPJ.name);
    }
    if (typeof suppliers.cadastroSintegra != 'undefined'){
      form.append("cadastroSintegra", suppliers.cadastroSintegra.file, suppliers.cadastroSintegra.name);
    }
    if (typeof suppliers.certidaoNegativaRF != 'undefined'){
      form.append("certidaoNegativaRF", suppliers.certidaoNegativaRF.file, suppliers.certidaoNegativaRF.name);
    }
    if (typeof suppliers.contratoSocial != 'undefined'){
      form.append("contratoSocial", suppliers.contratoSocial.file, suppliers.contratoSocial.name);
    }
    if (typeof suppliers.certidaoNegativaFGTS != 'undefined'){
      form.append("certidaoNegativaFGTS", suppliers.certidaoNegativaFGTS.file, suppliers.certidaoNegativaFGTS.name);
    }
    if (typeof suppliers.certidaoNegativaTrabalhista != 'undefined'){
      form.append("certidaoNegativaTrabalhista", suppliers.certidaoNegativaTrabalhista.file, suppliers.certidaoNegativaTrabalhista.name);
    }
    if (typeof suppliers.outrosAnexos != 'undefined'){
      form.append("outrosAnexos", suppliers.outrosAnexos.file, suppliers.outrosAnexos.name);
    }
    if (typeof suppliers.dadosBanco != 'undefined'){
      form.append("dadosBanco", suppliers.dadosBanco.file, suppliers.dadosBanco.name);
    }

    if(sendEmail){
      return this.http.post<ISuppliers>(this.api_link + 'fornecedoresFree/?sendEmail=1', form,{headers: this.httpHeaders});
    }else{
      return this.http.post<ISuppliers>(this.api_link + 'fornecedores/', form,{headers: this.httpHeaders});
    }
  }

  putSuppliers(suppliers: ISuppliers, isSupplier: string): Observable<any> {
    const form = new FormData();
    
    form.append("document", suppliers.document);
    form.append("socialName", suppliers.socialName);
    form.append("fantasyName", suppliers.fantasyName);
    form.append("cep",suppliers.cep)
    form.append("address",suppliers.address)
    form.append("district",suppliers.district)
    form.append("city",suppliers.city)
    form.append("state",suppliers.state)
    form.append("phone",suppliers.phone)
    form.append("mobilePhone",suppliers.mobilePhone)
    form.append("contact",suppliers.contact)
    form.append("email",suppliers.email)
    form.append("erp",suppliers.erp)
    form.append("approve",  suppliers.approve.toString());
    form.append("user",  suppliers.user);
    if (typeof suppliers.cartaoCNPJ != 'undefined'){
      form.append("cartaoCNPJ", suppliers.cartaoCNPJ.file, suppliers.cartaoCNPJ.name);
    }
    if (typeof suppliers.cadastroSintegra != 'undefined'){
      form.append("cadastroSintegra", suppliers.cadastroSintegra.file, suppliers.cadastroSintegra.name);
    }
    if (typeof suppliers.certidaoNegativaRF != 'undefined'){
      form.append("certidaoNegativaRF", suppliers.certidaoNegativaRF.file, suppliers.certidaoNegativaRF.name);
    }
    if (typeof suppliers.contratoSocial != 'undefined'){
      form.append("contratoSocial", suppliers.contratoSocial.file, suppliers.contratoSocial.name);
    }
    if (typeof suppliers.certidaoNegativaFGTS != 'undefined'){
      form.append("certidaoNegativaFGTS", suppliers.certidaoNegativaFGTS.file, suppliers.certidaoNegativaFGTS.name);
    }
    if (typeof suppliers.certidaoNegativaTrabalhista != 'undefined'){
      form.append("certidaoNegativaTrabalhista", suppliers.certidaoNegativaTrabalhista.file, suppliers.certidaoNegativaTrabalhista.name);
    }
    if (typeof suppliers.outrosAnexos != 'undefined'){
      form.append("outrosAnexos", suppliers.outrosAnexos.file, suppliers.outrosAnexos.name);
    }
    if (typeof suppliers.dadosBanco != 'undefined'){
      form.append("dadosBanco", suppliers.dadosBanco.file, suppliers.dadosBanco.name);
    }
   
    if(isSupplier == '3'){
    return this.http.patch<ISuppliers>(this.api_link + 'fornecedores/' + suppliers.id +'/' + '?sendChanges=1', form,{headers: this.httpHeaders});
    }
    return this.http.patch<ISuppliers>(this.api_link + 'fornecedores/' + suppliers.id +'/', form,{headers: this.httpHeaders});
  }
}

@Injectable()
export class LookupGetUser implements PoLookupFilter{
  api_link: string= environment.API_URL
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken()});

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getFilteredItems({ filter, page, filterParams }: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
    let numPage= ''
    
    if(page && filter){
      filter= '?page='+page+'&search='+filter;
    }else if(page){
      numPage= '?page='+page;
    }else if (filter) {
      filter = '?search='+filter;
    }
    
    return this.http.get(`${this.api_link}usuarios/${numPage}${filter}`, { headers: this.httpHeaders }).pipe(map((response: any) => ({
      items: response.results,
      hasNext: !!response.next
    })))
  }
  
  getObjectByValue(value: any, filterParams?: any): Observable<any> {
    if(typeof value != 'number'){
      value = value.id
    }
    return this.http.get(`${this.api_link}usuarios/?search=${value}`, { headers: this.httpHeaders }).pipe(map((response: any) => response.results[0]));
  }
}