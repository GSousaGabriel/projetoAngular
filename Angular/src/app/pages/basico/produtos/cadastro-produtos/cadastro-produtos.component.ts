import { PoBreadcrumb } from '@po-ui/ng-components';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CadastroProdutosService, PostProducts } from './cadastro-produtos.service';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AllValidationErrors, getFormValidationErrors } from 'src/app/components/shared/validador/get-form-validation-errors';
import { PoNotificationService } from '@po-ui/ng-components';
import { LookupFilterSupplier } from '../../fornecedores/fornecedores.service';

@Component({
  selector: 'app-cadastro-produtos',
  templateUrl: './cadastro-produtos.component.html',
  styleUrls: ['./cadastro-produtos.component.css'],
  providers: [PostProducts, DataManipulation, LookupFilterSupplier, CadastroProdutosService]
})
export class CadastroProdutosComponent implements OnInit {

  validForm!: UntypedFormGroup;
  typeCad!:string;
  pageTitle: string= 'Novo Produto';
  newRegister = true;

  public readonly columnsSupplier = this.pService.getColumnsLookup();
  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Listagem de produtos', link: '/produtos' }, { label: 'Manutenção de produtos' }]
  };

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    public poNotification: PoNotificationService,
    private httpService: PostProducts,
    private route: ActivatedRoute,
    private dataService: DataManipulation,
    public supplierLookup: LookupFilterSupplier,
    private pService: CadastroProdutosService
    ){

      this.route.params.subscribe(params =>{
        this.typeCad=params['id']
        if(params['id'] != '0'){
          this.pageTitle = "Editar produto"
          this.newRegister = false;
        }
      });

      this.createReactiveForm()
      this.setType();
    }  

  ngOnInit() {
  }

  setType(){
    const nav = this.router.getCurrentNavigation();
      if(nav != null){
        if(nav.extras.state != undefined){
          this.createReactiveForm()
          this.setProduct(nav.extras.state)
        }
      }
  }
  
  setProduct(product:any){
    this.validForm.get('description')?.setValue(product.description)
    this.validForm.get('id')?.setValue(product.id)
    this.validForm.get('unit')?.setValue(product.unit)
    this.validForm.get('name')?.setValue(product.name)
    this.validForm.get('codErp')?.setValue(product.codErp)
    this.validForm.get('defaultSupplier')?.setValue(product.defaultSupplier)
  }

  createReactiveForm() {
      this.validForm = this.fb.group({
        id: ['',],
        name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        description: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        unit:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(3)])],
        codErp:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(12)])],
        defaultSupplier:[''],
        
      });
  }

  saveForm() {
    if (this.validForm.valid){
      this.setTypeReq()
    }else{
      const error: AllValidationErrors |any = getFormValidationErrors(this.validForm.controls).shift();
      if (error) {
        let text;
        let field = this.getField(error.control_name)

        switch (error.error_name) {
          case 'required': text = `${field} é obrigatório!`; break;
          case 'pattern': text = `${field} formato do campo errado!`; break;
          case 'minlength': text = `${field} tamanho inválido! Tamanho do campo é : ${error.error_value.requiredLength}`; break;
          default: text = `${field}: ${error.error_name}: ${error.error_value}`;
        }
        this.poNotification.error(text);
      }
      return;
    } 
  }

  getField(field:string){
    switch (field) {
      case 'name':
        return 'Nome do produto';
      case 'description':
        return 'Descrição do produto';
      case 'codErp':
        return 'Código ERP';
      case 'unit':
        return 'Unidade de Medida';
      default:
        return 'Código do produto'
    }
  }

  setTypeReq(){
     this.newRegister?this.postProduct():this.putProduct();
  }

  postProduct() {
    this.httpService.postProducts(this.validForm.value).subscribe({
      next: data => {
        this.validForm.reset();
        this.poNotification.success(`produto ${data.name} incluido com sucesso.`);
      },
      error: error=> {
        this.poNotification.error('Ops!! Ocorreu um erro.' + this.dataService.handleError(error));
      }
    });
  }

  putProduct() {
    this.httpService.putProducts(this.validForm.value).subscribe({
        next: data => {
          this.validForm.reset();
          this.poNotification.success(`produto ${data.name} alterado com sucesso.`);
        },
        error: error=> {
          this.poNotification.error('Ops!! Ocorreu um erro.' + this.dataService.handleError(error));
        }
    });
  }
}