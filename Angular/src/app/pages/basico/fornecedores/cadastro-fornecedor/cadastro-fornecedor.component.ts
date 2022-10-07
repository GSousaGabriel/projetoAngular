import { LookupGetUser } from './cadastro-fornecedor.service';
import { PoBreadcrumb, PoPageAction } from '@po-ui/ng-components';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ISuppliers } from './cadastro-fornecedor-json';
import { CadastroFornecedorService, PostSuppliers } from './cadastro-fornecedor.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AllValidationErrors, getFormValidationErrors } from 'src/app/components/shared/validador/get-form-validation-errors';
import { PoNotificationService } from '@po-ui/ng-components';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import { ComboFilterOptionSupplier } from '../fornecedores.service';

@Component({
  selector: 'app-cadastro-fornecedor',
  templateUrl: './cadastro-fornecedor.component.html',
  styleUrls: ['./cadastro-fornecedor.component.css'],
  providers: [CadastroFornecedorService, PostSuppliers, LookupGetUser, DataManipulation, ComboFilterOptionSupplier]
})

export class CadastroFornecedorComponent implements OnInit {
  
  isIncluir = true
  pageTitle:string='Novo fornecedor';
  validForm!: UntypedFormGroup;
  pessoa!:any;
  event!: string;
  newRegister = true;
  supplier! : ISuppliers;
  error!:string | any 
  maskDocumento!:string;
  input!:string;
  disableCod: string= 'true';
  cartaoCNPJ!: ImageSnippet;
  cadastroSintegra!: ImageSnippet;
  certidaoNegativaRF!: ImageSnippet;
  contratoSocial!: ImageSnippet;
  certidaoNegativaFGTS!: ImageSnippet;
  certidaoNegativaTrabalhista!: ImageSnippet;
  outrosAnexos!: ImageSnippet;
  dadosBanco!: ImageSnippet;
  typeCad!:string;

  public readonly columnsUser = this.registerService.getColumnsLookup();

  public readonly actions: Array<PoPageAction> = [
    { label: 'Salvar', action: this.saveForm.bind(this)},
   
  ];
  public  breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Fornecedor', link: '/fornecedores' }, { label: 'Manutenção de Fornecedor' }]
  };

  constructor(private fb: UntypedFormBuilder,
    private router: Router,
    private registerService: CadastroFornecedorService,
    public poNotification: PoNotificationService,
    private dataService: DataManipulation,
    private fService: PostSuppliers,
    private route: ActivatedRoute,
    public userService: LookupGetUser,
    public supplierService: ComboFilterOptionSupplier
    ){
      this.route.params.subscribe(params =>{ 
        this.typeCad = params['id']
      });


      this.createReactiveForm()
      this.setType(true)
    }

  ngOnInit() {
    if(this.newRegister){
      this.disableCod='false'
    }
  }

  createReactiveForm() {
    if (this.newRegister == true){
      this.setValidaForm()
  }else{
    this.validForm = this.fb.group({
      codigo: ['',],
      document: [''],
      documento: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(30)])],
      razaoSocial: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(40)])],
      nomeFantasia:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      cep:['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(9)])],
      endereco:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      bairro:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      cidade:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      estado:['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2)])],
      DDD: ['', Validators.pattern('^[0-9]*$')],
      telefone:['', Validators.pattern('^[0-9]*$')],
      mobilePhone:['', Validators.pattern('^[0-9]*$')],
      contato:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
      email:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      coderp:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(9)])],
      usuario:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(9)])],
      cartaoCNPJ:[''],
      cadastroSintegra:['',''],
      certidaoNegativaRF:['',''],
      contratoSocial:['',''],
      certidaoNegativaFGTS:['',''],
      certidaoNegativaTrabalhista:['',''],
      outrosAnexos:['',''],
      dadosBanco:[''],

    });
  }

  }
  saveForm() {
    if (this.validForm.valid){
     
        this.supplier={
            id: (this.newRegister == true ? 0 :this.validForm.get('codigo')?.value),
            document: this.validForm.get('documento')?.value.replaceAll(".","").replaceAll("-","").replaceAll("/",""),
            socialName: this.validForm.get('razaoSocial')?.value,
            fantasyName: this.validForm.get('nomeFantasia')?.value,
            cep: this.validForm.get('cep')?.value,
            address: this.validForm.get('endereco')?.value,
            district: this.validForm.get('bairro')?.value,
            city:this.validForm.get('cidade')?.value,
            state:this.validForm.get('estado')?.value,
            DDD: this.validForm.get('DDD')?.value,
            phone: this.validForm.get('telefone')?.value,
            mobilePhone: this.validForm.get('mobilePhone')?.value,
            contact: this.validForm.get('contato')?.value,
            email: this.validForm.get('email')?.value,
            erp: this.validForm.get('coderp')?.value,
            approve: (this.newRegister) ? 2 : this.supplier.approve,
            user: this.validForm.get('usuario')?.value,
            cartaoCNPJ : this.cartaoCNPJ,
            cadastroSintegra :this.cadastroSintegra,
            certidaoNegativaRF :this.certidaoNegativaRF,
            contratoSocial :this.contratoSocial,
            certidaoNegativaFGTS :this.certidaoNegativaFGTS,
            certidaoNegativaTrabalhista: this.certidaoNegativaTrabalhista,
            outrosAnexos :this.outrosAnexos,
            dadosBanco :this.dadosBanco,
        }
        this.setTypeReq()
     
    }else{
      const error: AllValidationErrors |any = getFormValidationErrors(this.validForm.controls).shift();
      if (error) {
        let text;
        switch (error.error_name) {
          case 'required': text = `${error.control_name} é obrigatório!`; break;
          case 'pattern': text = `${error.control_name} formato do campo errado!`; break;
          case 'email': text = `${error.control_name}  incorreto !`; break;
          case 'minlength': text = `${error.control_name} tamanho inválido! Tamanho do campo é : ${error.error_value.requiredLength}`; break;
          case 'maxlength': text = `${error.control_name} tamanho inválido! Tamanho do campo é : ${error.error_value.requiredLength}`; break;
          case 'areEqual': text = `${error.control_name} deve ser igual !`; break;
          default: text = `${error.control_name}: ${error.error_name}: ${error.error_value}`;

          
        }
        this.poNotification.error(text);
      }
      return;
    }
  }

  changeEvent() {
    var document= this.validForm.get('documento')?.value
    this.supplierExists(document)
    var formatado  =""
    if (document.length ==11){
      formatado =   document.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") 
    }else{
      formatado =   document.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
    this.validForm.get('documento')?.setValue(formatado)
  }

  fillSupplier(document: string){
    this.supplierExists(document)
  }

  setTypeReq(){
    if(this.newRegister){
      this.postSupplier();
    }else{
      this.putSupplier();
    }
   
  }

  supplierExists(document: string){
   this.dataService.getCustomLookupData('document', document, 'fornecedoresCustom').subscribe(data=>{
      if(data.results !=0 && this.typeCad!='3'){
        if (this.typeCad =="99"){
          this.newRegister = false;
          this.createReactiveForm()
          this.pageTitle = "Editar fornecedor"
          this.setSupplier(data.results[0])
        }else{
          this.isIncluir = false
          this.poNotification.error("Você já existe na base de dados") 
          this.router.navigate(["/login"]);
        }
      }else{
        this.isIncluir = true
      }
    })
  }

  postSupplier() {
    this.fService.postSuppliers(this.supplier).subscribe({
      next: data => {
        this.poNotification.success(` Fornecedor ${data.fantasyName} incluido com sucesso.`) 
        this.validForm.reset()
      },
      error: error =>{  
        this.poNotification.error(this.validateError(error.error)) 
      }
    });
  }

  putSupplier() {
    this.fService.putSuppliers(this.supplier, this.typeCad).subscribe({
      next: data => {
        this.poNotification.success(`Dados do fornecedor ${data.fantasyName} alterado com sucesso.`)
      },
      error: error =>{ 
        this.poNotification.error(this.validateError(error))
      }
    });
  }

  validateError(error: any){
    let checkError = ""

    checkError = this.testAttachment(error.error)

    if(checkError == ""){
      return this.dataService.handleError(error)
    }
    
    return error
  }

  testAttachment(error: any){
    let anexos = 'pdf, doc, docx, jpg, jpeg, png, xlsx ou xls'
    let erro = ''
    let anexoType = ""

    if(error.cartaoCNPJ != undefined){
      anexoType = 'cartaoCNPJ'
      erro= 'cartão CNPJ inválido'
    }else if(error.cadastroSintegra != undefined){
      anexoType = 'cadastroSintegra'
      erro= 'cadastro Sintegra inválido'
    }else if(error.certidaoNegativaRF != undefined){
      anexoType = 'certidaoNegativaRF'
      erro= 'cert. Negativa Receita Federal'
    }else if(error.contratoSocial != undefined){
      anexoType = 'contratoSocial'
      erro= 'cartão Contrato Social'
    }else if(error.certidaoNegativaFGTS != undefined){
      anexoType = 'certidaoNegativaFGTS'
      erro= 'cert. Negativa FGTS'
    }else if(error.certidaoNegativaTrabalhista != undefined){
      anexoType = 'certidaoNegativaTrabalhista'
      erro= 'cert. Negativa Trabalhista'
    }else if(error.outrosAnexos != undefined){
      anexoType = 'outrosAnexos'
      erro= 'outros'
    }else if(error.dadosBanco != undefined){
      anexoType = 'dadosBanco'
      erro= 'dados bancários'
    }
    
    if(anexoType == ""){
      return ""
    }
    return 'anexo '+anexoType+' inválido, certifique-se de que o anexo seja ' + anexos
  }

  setType(edit: boolean){
    const nav = this.router.getCurrentNavigation();
      if(nav != null){
        if(nav.extras.state != undefined){
          if(edit){
            this.newRegister = false;
            this.createReactiveForm()
            this.pageTitle = "Editar fornecedor"
            
            this.setSupplier(nav.extras.state)
           
          }
        }else if(this.typeCad =='3'){
          this.router.navigateByUrl('atualiza-cotacao')
        }
      }else{
       
      }      
  }
  
 setSupplier(supplier:any){
  if(supplier.approve == 1){
    this.disableCod='false'
  }
  if(this.typeCad=='3'){
    this.validForm.get('document')?.setValue(supplier.document)
  }
  this.validForm.get('codigo')?.setValue(supplier.id)
  this.validForm.get('documento')?.setValue(supplier.document)
  this.validForm.get('razaoSocial')?.setValue(supplier.socialName)
  this.validForm.get('nomeFantasia')?.setValue(supplier.fantasyName)
  this.validForm.get('cep')?.setValue(supplier.cep)
  this.validForm.get('endereco')?.setValue(supplier.address)     
  this.validForm.get('bairro')?.setValue(supplier.district)
  this.validForm.get('cidade')?.setValue(supplier.city)    
  this.validForm.get('estado')?.setValue(supplier.state) 
  this.validForm.get('DDD')?.setValue(supplier.DDD)
  this.validForm.get('telefone')?.setValue(supplier.phone)
  this.validForm.get('mobilePhone')?.setValue(supplier.mobilePhone)
  this.validForm.get('contato')?.setValue(supplier.contact)
  this.validForm.get('email')?.setValue(supplier.email),
  this.validForm.get('coderp')?.setValue(supplier.erp)
  this.validForm.get('usuario')?.setValue(supplier.user)     
  this.supplier = supplier
}

onclickVisualizaAnexo(btn:any){

  switch (btn) {
    case 'btnCartaoCNPJ':
        window.open(this.supplier.cartaoCNPJ)
        break;
    case 'btnCadastroSintegra':
        window.open(this.supplier.cadastroSintegra)
        break;
    case 'btnCertidaoNegativaRF':
        window.open(this.supplier.certidaoNegativaRF)
        break;
    case 'btnContratoSocial':
        window.open(this.supplier.contratoSocial)
        break;
    case 'btnCertidaoNegativaFGTS':
        window.open(this.supplier.certidaoNegativaFGTS)
        break;
    case 'btnCertidaoNegativaTrabalhista':
      window.open(this.supplier.certidaoNegativaTrabalhista)
       break;
    case 'btnOutrosAnexos':
      window.open(this.supplier.outrosAnexos)
        break;
    case 'btnDadosBanco':
      window.open(this.supplier.dadosBanco)
        break;
  }
}

setValidaForm(){
  
  if (this.typeCad =='99' || this.typeCad =='0'){
      this.validForm = this.fb.group({
        codigo: ['',],
        documento: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(30)])],
        razaoSocial: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(40)])],
        nomeFantasia:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
        cep:['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(9)])],
        endereco:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
        bairro:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
        cidade:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
        estado:['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2)])],
        DDD: ['', Validators.pattern('^[0-9]*$')],
        telefone:['', Validators.pattern('^[0-9]*$')],
        mobilePhone:['', Validators.pattern('^[0-9]*$')],
        contato:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
        email:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
        coderp:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(9)])],
        usuario:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(9)])],
        cartaoCNPJ:['',Validators.compose([Validators.required])],
        cadastroSintegra:[''/*,Validators.compose([Validators.required])*/],
        certidaoNegativaRF:[''/*,Validators.compose([Validators.required])*/],
        contratoSocial:[''/*,Validators.compose([Validators.required])*/],
        certidaoNegativaFGTS:[''/*,Validators.compose([Validators.required])*/],
        certidaoNegativaTrabalhista:[''/*,Validators.compose([Validators.required])*/],
        outrosAnexos:[''/*,Validators.compose([Validators.required])*/],
        dadosBanco:['',Validators.compose([Validators.required])],

      });
  }else if (this.typeCad =='1' ){
    this.breadcrumb= {items: [{ label: 'Cadastro', link: '/cadastro-fornecedor/1' }, { label: 'Cadastro' }] }
    this.validForm = this.fb.group({
      codigo: ['',],
      documento: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(30)])],
      razaoSocial: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(40)])],
      nomeFantasia:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      cep:['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(9)])],
      endereco:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      bairro:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      cidade:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      DDD: ['', Validators.pattern('^[0-9]*$')],
      telefone:['', Validators.pattern('^[0-9]*$')],
      mobilePhone:['', Validators.pattern('^[0-9]*$')],
      contato:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
      email:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      cartaoCNPJ:['',Validators.compose([Validators.required])],
      cadastroSintegra:[''/*,Validators.compose([Validators.required])*/],
      certidaoNegativaRF:[''/*,Validators.compose([Validators.required])*/],
      contratoSocial:[''/*,Validators.compose([Validators.required])*/],
      certidaoNegativaFGTS:[''/*,Validators.compose([Validators.required])*/],
      certidaoNegativaTrabalhista:[''/*,Validators.compose([Validators.required])*/],
      outrosAnexos:[''/*,Validators.compose([Validators.required])*/],
      dadosBanco:['',Validators.compose([Validators.required])],
      coderp:['',''],
      usuario:['', ''],
    });

  }else if (this.typeCad =='3'){
    this.validForm = this.fb.group({
      codigo: ['',],
      document: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(30)])],
      razaoSocial: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(40)])],
      nomeFantasia:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      cep:['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(9)])],
      endereco:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      bairro:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      cidade:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
      estado:['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2)])],
      DDD: ['', Validators.pattern('^[0-9]*$')],
      telefone:['', Validators.pattern('^[0-9]*$')],
      mobilePhone:['', Validators.pattern('^[0-9]*$')],
      contato:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
      email:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      coderp:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(9)])],
      usuario:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(9)])],
      cartaoCNPJ:['',Validators.compose([Validators.required])],
      cadastroSintegra:[''/*,Validators.compose([Validators.required])*/],
      certidaoNegativaRF:[''/*,Validators.compose([Validators.required])*/],
      contratoSocial:[''/*,Validators.compose([Validators.required])*/],
      certidaoNegativaFGTS:[''/*,Validators.compose([Validators.required])*/],
      certidaoNegativaTrabalhista:[''/*,Validators.compose([Validators.required])*/],
      outrosAnexos:[''/*,Validators.compose([Validators.required])*/],
      dadosBanco:['',Validators.compose([Validators.required])],

    });
  }
}

processFile(imageInput: any) {
  const file: File = imageInput.files[0];
  const reader = new FileReader();
  var nomeCampo = imageInput.name;
  reader.readAsDataURL(file);
  var disabled =  (this.newRegister == false ?  false : !true)
  
  switch (nomeCampo) {
    case 'cartaoCNPJ':
      reader.addEventListener('load', (event: any) => {
          this.cartaoCNPJ = new ImageSnippet(event.target.result, file);  
      });
        break;
    case 'cadastroSintegra':
      reader.addEventListener('load', (event: any) => {
      this.cadastroSintegra = new ImageSnippet(event.target.result, file);  
      });
        break;
    case 'certidaoNegativaRF':
      reader.addEventListener('load', (event: any) => {
        this.certidaoNegativaRF = new ImageSnippet(event.target.result, file);  
        });
        break;
    case 'contratoSocial':
      reader.addEventListener('load', (event: any) => {
        this.contratoSocial = new ImageSnippet(event.target.result, file);  
        });
      break;
    case 'certidaoNegativaFGTS':
      reader.addEventListener('load', (event: any) => {
        this.certidaoNegativaFGTS = new ImageSnippet(event.target.result, file);  
        });
        break;
    case 'certidaoNegativaTrabalhista':
      reader.addEventListener('load', (event: any) => {
        this.certidaoNegativaTrabalhista = new ImageSnippet(event.target.result, file);  
        });
      break;
    case 'outrosAnexos':
      reader.addEventListener('load', (event: any) => {
        this.outrosAnexos = new ImageSnippet(event.target.result, file);  
        });
        break;
        case 'dadosBanco':
          reader.addEventListener('load', (event: any) => {
            this.dadosBanco = new ImageSnippet(event.target.result, file);  
          });
          break;
  }  
} 
}

class ImageSnippet {
  constructor(public src: string, public file: File ) {}
}
