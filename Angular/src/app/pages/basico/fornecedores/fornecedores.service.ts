import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { PoComboFilter, PoComboOption, PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi, PoTableColumn } from '@po-ui/ng-components';
import { ISuppliers } from './cadastro-fornecedor/cadastro-fornecedor-json';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { environment } from 'src/environments/environment'; 

@Injectable()
export class FornecedoresService {
  getColumns(): Array<PoTableColumn> {
    return [
      {
        property: 'approve',
        label: 'Status',
        type: 'subtitle',
        subtitles: [
          {
            value: 1,
            color: 'success',
            label: 'Aprovado',
            content: '',
          },
          {
            value: 2,
            color: 'danger',
            label: 'Reprovado',
            content: '',
          },
          {
            value: 3,
            color: 'warning',
            label: 'Pendente aprovação',
            content: '',
          },
        ],
      },
      { property: 'id', label: 'Código', type: 'string' },
      { property: 'socialName', label: 'Razão Social' },
      { property: 'fantasyName', label: 'Nome Fantasia', type: 'string' },
    ];
  }
}


@Injectable()
export class SupplierDataManipulation {
  api_link: string= environment.API_URL
  httpHeaders = new HttpHeaders({ 'Authorization': 'Token '+ this.authService.getToken()});

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  approvedSupllier(id:any,approved :any): Observable<any> {
    const supplierAproved ={ approve: approved}
    return this.http.patch<ISuppliers>(this.api_link + 'fornecedores/' + id + '/', supplierAproved,{headers: this.httpHeaders});
  }
  
  filteredSuppliers(page: number,status :any): Observable<any> {
    return this.http.get<ISuppliers>(`${this.api_link}fornecedores/?page=${page}&approve=${status}`,{headers: this.httpHeaders});
  }
}

@Injectable()
export class LookupFilterSupplier implements PoLookupFilter{
  api_link: string= environment.API_URL
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Token '+ this.authService.getToken()});

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
    
    return this.http.get(this.api_link+'fornecedores/'+numPage+filter, { headers: this.httpHeaders }).pipe(map((response: any) => ({
      items: response.results,
      hasNext: !!response.next
    })))
  }
  
  getObjectByValue(value: string | any[], filterParams?: any): Observable<any> {
    return this.http.get(`${this.api_link}fornecedores/?id=${value}`, { headers: this.httpHeaders }).pipe(map((response: any) => response.results[0]));
  }
}

@Injectable()
export class ComboFilterOptionSupplier implements PoComboFilter {
  fieldLabel: string = 'document';
  fieldValue: string = 'document';
  filter: string = '';
  hasNext: any;
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getFilteredData(param: any, filterParams?: any): Observable<Array<PoComboOption>> {
    const params = { param: param?.toString() };

    if (param.value) {
      this.filter = '&search=' + param.value;
    }

    return this.http.get(`${this.api_link}fornecedores/?user=${this.authService.getIdUser()}${this.filter}`, { headers: this.httpHeaders }).pipe(
      tap(res => (this.hasNext = res['hasNext' as keyof typeof res])),
      map((response: any) => this.parseToArrayComboOption(response.results))
    );
  }

  private parseToArrayComboOption(items: Array<any>): Array<PoComboOption> {
    if (items && items.length > 0) {
      const parsedOptions: PoComboOption[] = [];

      for (var i = 0; items.length > i; i++) {
        if (!items[i]?.[this.fieldValue]) {

          parsedOptions.push({ value: '' });
        }
        var label = items[i][this.fieldLabel];
        var value = items[i][this.fieldValue];

        parsedOptions.push({ label, value });
      }

      return parsedOptions;
    }

    return [];
  }

  getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
    return this.http.get(`${this.api_link}fornecedores/?user=${this.authService.getIdUser()}&search=${value}`, { headers: this.httpHeaders }).pipe(map(item =>
      this.parseToCombo(item)));
  }

  private parseToCombo(items: any): PoComboOption {

    return { label: items.results[0].document, value: items.results[0].document };

  }
}

@Injectable()
export class LookupFilterOptionSupplier implements PoLookupFilter {
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

    return this.http.get(this.api_link + 'fornecedores/' + numPage + filter, { headers: this.httpHeaders }).pipe(map((response: any) => ({
      items: response.results,
      hasNext: !!response.next
    })))
  }

  getObjectByValue(value: string | any[], filterParams?: any): Observable<any> {
    return this.http.get(`${this.api_link}fornecedores/?id=${value}`, { headers: this.httpHeaders }).pipe(map((response: any) => response.results[0]));
  }
}