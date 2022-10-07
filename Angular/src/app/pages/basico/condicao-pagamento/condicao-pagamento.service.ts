import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoComboFilter, PoComboOption, PoTableColumn } from '@po-ui/ng-components';
import { Observable, tap, map } from 'rxjs';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class CondicaoPagamentoService {
  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'id', label: 'Código', type: 'string' },
      { property: 'description', label: 'Descrição', type: 'string' },
    ];
  }
}

@Injectable()
export class ComboFilterOption implements PoComboFilter {
  fieldLabel: string = 'description';
  fieldValue: string = 'id';
  filter: string = '';
  hasNext: any;
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getFilteredData(param: any, filterParams?: any): Observable<Array<PoComboOption>> {
    const params = { param: param?.toString() };

    this.fieldLabel = 'description';

    if (param.value) {
      this.filter = '?search=' + param.value;
    }

    return this.http.get(`${this.api_link}condicaoPagamento/${this.filter}`, { headers: this.httpHeaders }).pipe(
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
    return this.http.get(`${this.api_link}condicaoPagamento/?id=${value}`, { headers: this.httpHeaders }).pipe(map(item =>
      this.parseToCombo(item)));
  }

  private parseToCombo(items: any): PoComboOption {

    return { label: items.results[0].description, value: items.results[0].id };

  }
}