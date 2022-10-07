import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login//login/login.component';
import { LogoutComponent } from './components/logout/logout/logout.component';

import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './pages/administracao/dashboard/dashboard.component';
import { DatabaseExplorerComponent } from './pages/administracao/database-explorer/database-explorer.component';
import { DiferencaArquivosComponent } from './pages/administracao/diferenca-arquivos/diferenca-arquivos.component';
import { EditorMenuComponent } from './pages/administracao/editor-menu/editor-menu.component';
import { GruposComponent } from './pages/administracao/grupos/grupos.component';
import { InfoComponent } from './pages/administracao/info/info.component';
import { PainelSQLComponent } from './pages/administracao/painel-sql/painel-sql.component';
import { PreferenciasComponent } from './pages/administracao/preferencias/preferencias.component';
import { ProgramasComponent } from './pages/administracao/programas/programas.component';
import { SystemInformationComponent } from './pages/administracao/system-information/system-information.component';
import { UnidadesComponent } from './pages/administracao/unidades/unidades.component';
import { CadastroUsuarioComponent } from './pages/administracao/usuarios/cadastro-usuario/cadastro-usuario.component';
import { UsuariosComponent } from './pages/administracao/usuarios/usuarios.component';
import { AtualizaCotacaoComponent } from './pages/analisa_cotacao/atualiza-cotacao/atualiza-cotacao.component';
import { CadastroCondicaoPagamentoComponent } from './pages/basico/condicao-pagamento/cadastro-condicao-pagamento/cadastro-condicao-pagamento.component';
import { CondicaoPagamentoComponent } from './pages/basico/condicao-pagamento/condicao-pagamento.component';
import { CadastroFornecedorComponent } from './pages/basico/fornecedores/cadastro-fornecedor/cadastro-fornecedor.component';
import { FornecedoresComponent } from './pages/basico/fornecedores/fornecedores.component';
import { CadastroProdutosComponent } from './pages/basico/produtos/cadastro-produtos/cadastro-produtos.component';
import { ProdutosComponent } from './pages/basico/produtos/produtos.component';
import { AnalisaCotacaoComponent } from './pages/compras/analisa-cotacao/analisa-cotacao.component';
import { CadastroGerarCotacaoComponent } from './pages/compras/gerar-cotacao/cadastro-gerar-cotacao/cadastro-gerar-cotacao.component';
import { GerarCotacaoComponent } from './pages/compras/gerar-cotacao/gerar-cotacao.component';
import { CadastroSolicitarComprasComponent } from './pages/compras/solicitar-compras/cadastro-solicitar-compras/cadastro-solicitar-compras.component';
import { SolicitarComprasComponent } from './pages/compras/solicitar-compras/solicitar-compras.component';
import { CategoriasComponent } from './pages/documentos/categorias/categorias.component';
import { CompartilharComigoComponent } from './pages/documentos/compartilhar-comigo/compartilhar-comigo.component';
import { EnviarDocumentosComponent } from './pages/documentos/enviar-documentos/enviar-documentos.component';
import { MeusDocumentosComponent } from './pages/documentos/meus-documentos/meus-documentos.component';
import { DashboardLogsComponent } from './pages/logs/dashboard-logs/dashboard-logs.component';
import { LogAcessoComponent } from './pages/logs/log-acesso/log-acesso.component';
import { LogAlteracaoComponent } from './pages/logs/log-alteracao/log-alteracao.component';
import { LogInfoComponent } from './pages/logs/log-info/log-info.component';
import { LogRequestComponent } from './pages/logs/log-request/log-request.component';
import { LogSQLComponent } from './pages/logs/log-sql/log-sql.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { EsqueciSenhaComponent } from './components/esqueci-senha/esqueci-senha.component';
import { TituloComponent } from './pages/financeiro/titulo/titulo.component';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LoginComponent,
    LogoutComponent,
    FornecedoresComponent,
    ProdutosComponent,
    CondicaoPagamentoComponent,
    SolicitarComprasComponent,
    GerarCotacaoComponent,
    AnalisaCotacaoComponent,
    AtualizaCotacaoComponent,
    DashboardComponent,
    ProgramasComponent,
    GruposComponent,
    UnidadesComponent,
    UsuariosComponent,
    DatabaseExplorerComponent,
    PainelSQLComponent,
    EditorMenuComponent,
    DiferencaArquivosComponent,
    InfoComponent,
    SystemInformationComponent,
    PreferenciasComponent,
    EnviarDocumentosComponent,
    MeusDocumentosComponent,
    CompartilharComigoComponent,
    CategoriasComponent,
    LogAcessoComponent,
    LogAlteracaoComponent,
    LogSQLComponent,
    LogRequestComponent,
    LogInfoComponent,
    DashboardLogsComponent,
    CadastroFornecedorComponent,
    CadastroProdutosComponent,
    CadastroCondicaoPagamentoComponent,
    CadastroSolicitarComprasComponent,
    CadastroGerarCotacaoComponent,
    CadastroUsuarioComponent,
    EsqueciSenhaComponent,
    TituloComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    RouterModule.forRoot([]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
