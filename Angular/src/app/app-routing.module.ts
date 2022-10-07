import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './components/shared/guards/auth.guard';

//
import { EsqueciSenhaComponent } from './components/esqueci-senha/esqueci-senha.component';
import { LoginComponent } from './components/login/login/login.component';
import { LogoutComponent } from './components/logout/logout/logout.component';
//                              Pages
// Basico
import { FornecedoresComponent } from './pages/basico/fornecedores/fornecedores.component';
import { ProdutosComponent } from './pages/basico/produtos/produtos.component';
import { CondicaoPagamentoComponent } from './pages/basico/condicao-pagamento/condicao-pagamento.component';
import { DataGridComponent } from './pages/basico/data-grid/data-grid.component';

// Compras
import { SolicitarComprasComponent } from './pages/compras/solicitar-compras/solicitar-compras.component';
import { GerarCotacaoComponent } from './pages/compras/gerar-cotacao/gerar-cotacao.component';
import { AnalisaCotacaoComponent } from './pages/compras/analisa-cotacao/analisa-cotacao.component';

// Analiza Cotacao
import { AtualizaCotacaoComponent } from './pages/analisa_cotacao/atualiza-cotacao/atualiza-cotacao.component';

//Financeiro
import { TituloComponent } from './pages/financeiro/titulo/titulo.component';

// Adminisração
import { DashboardComponent } from './pages/administracao/dashboard/dashboard.component';
import { ProgramasComponent } from './pages/administracao/programas/programas.component';
import { GruposComponent } from './pages/administracao/grupos/grupos.component';
import { UnidadesComponent } from './pages/administracao/unidades/unidades.component';
import { UsuariosComponent } from './pages/administracao/usuarios/usuarios.component';
import { DatabaseExplorerComponent } from './pages/administracao/database-explorer/database-explorer.component';
import { PainelSQLComponent } from './pages/administracao/painel-sql/painel-sql.component';
import { EditorMenuComponent } from './pages/administracao/editor-menu/editor-menu.component';
import { DiferencaArquivosComponent } from './pages/administracao/diferenca-arquivos/diferenca-arquivos.component';
import { InfoComponent } from './pages/administracao/info/info.component';
import { SystemInformationComponent } from './pages/administracao/system-information/system-information.component';
import { PreferenciasComponent } from './pages/administracao/preferencias/preferencias.component';

//Documentos
import { EnviarDocumentosComponent } from './pages/documentos/enviar-documentos/enviar-documentos.component';
import { MeusDocumentosComponent } from './pages/documentos/meus-documentos/meus-documentos.component';
import { CompartilharComigoComponent } from './pages/documentos/compartilhar-comigo/compartilhar-comigo.component';
import { CategoriasComponent } from './pages/documentos/categorias/categorias.component';

//Logs
import { LogSQLComponent } from './pages/logs/log-sql/log-sql.component';
import { DashboardLogsComponent } from './pages/logs/dashboard-logs/dashboard-logs.component';
import { LogAcessoComponent } from './pages/logs/log-acesso/log-acesso.component';
import { LogAlteracaoComponent } from './pages/logs/log-alteracao/log-alteracao.component';
import { LogRequestComponent } from './pages/logs/log-request/log-request.component';
import { LogInfoComponent } from './pages/logs/log-info/log-info.component';

//cadastros
import { CadastroFornecedorComponent } from './pages/basico/fornecedores/cadastro-fornecedor/cadastro-fornecedor.component';
import { CadastroProdutosComponent } from './pages/basico/produtos/cadastro-produtos/cadastro-produtos.component';
import { CadastroCondicaoPagamentoComponent } from './pages/basico/condicao-pagamento/cadastro-condicao-pagamento/cadastro-condicao-pagamento.component';
import { CadastroSolicitarComprasComponent } from './pages/compras/solicitar-compras/cadastro-solicitar-compras/cadastro-solicitar-compras.component';
import { CadastroGerarCotacaoComponent } from './pages/compras/gerar-cotacao/cadastro-gerar-cotacao/cadastro-gerar-cotacao.component'
import { CadastroUsuarioComponent } from './pages/administracao/usuarios/cadastro-usuario/cadastro-usuario.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent },
  { path: 'esqueci-senha', component: EsqueciSenhaComponent },

  // Basico
  { path: 'fornecedores', component: FornecedoresComponent, canActivate: [AuthGuard] },
  { path: 'produtos', component: ProdutosComponent, canActivate: [AuthGuard] },
  { path: 'condicao-pagamento', component: CondicaoPagamentoComponent, canActivate: [AuthGuard] },
  { path: 'data-grid', component: DataGridComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-fornecedor/:id', component: CadastroFornecedorComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-produtos/:id', component: CadastroProdutosComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-condicao-pagamento/:id', component: CadastroCondicaoPagamentoComponent, canActivate: [AuthGuard] },

  // Compras
  { path: 'solicitar-compras', component: SolicitarComprasComponent, canActivate: [AuthGuard] },
  { path: 'gerar-cotacao', component: GerarCotacaoComponent, canActivate: [AuthGuard] },
  { path: 'analisa-cotacao', component: AnalisaCotacaoComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-solicitar-compras/:id', component: CadastroSolicitarComprasComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerar-cotacao/:id', component: CadastroGerarCotacaoComponent, canActivate: [AuthGuard] },

  // Analisar Pedidos
  { path: 'atualiza-cotacao', component: AtualizaCotacaoComponent, canActivate: [AuthGuard] },

  // Financeiro
  { path: 'titulos', component: TituloComponent, canActivate: [AuthGuard] },

  //Administração
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'programas', component: ProgramasComponent, canActivate: [AuthGuard] },
  { path: 'grupos', component: GruposComponent, canActivate: [AuthGuard] },
  { path: 'Unidades', component: UnidadesComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-usuario/:id', component: CadastroUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'database-explorer', component: DatabaseExplorerComponent, canActivate: [AuthGuard] },
  { path: 'painel-SQL', component: PainelSQLComponent, canActivate: [AuthGuard] },
  { path: 'editor-menu', component: EditorMenuComponent, canActivate: [AuthGuard] },
  { path: 'diferenca-arquivos', component: DiferencaArquivosComponent, canActivate: [AuthGuard] },
  { path: 'info', component: InfoComponent, canActivate: [AuthGuard] },
  { path: 'system-information', component: SystemInformationComponent, canActivate: [AuthGuard] },
  { path: 'preferencias', component: PreferenciasComponent, canActivate: [AuthGuard] },

  // Documentos
  { path: 'enviar-documentos', component: EnviarDocumentosComponent, canActivate: [AuthGuard] },
  { path: 'meus-documentos', component: MeusDocumentosComponent, canActivate: [AuthGuard] },
  { path: 'compartilhar-comigo', component: CompartilharComigoComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard] },

  // Logs
  { path: 'dashboard', component: DashboardLogsComponent, canActivate: [AuthGuard] },
  { path: 'log-acesso', component: LogAcessoComponent, canActivate: [AuthGuard] },
  { path: 'log-alteracao', component: LogAlteracaoComponent, canActivate: [AuthGuard] },
  { path: 'log-SQL', component: LogSQLComponent, canActivate: [AuthGuard] },
  { path: 'log-request', component: LogRequestComponent, canActivate: [AuthGuard] },
  { path: 'log-info', component: LogInfoComponent, canActivate: [AuthGuard] },



  { path: '', redirectTo: '/login', pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
