"""solicitacaoCompras URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from financeiro.api.viewsets import TitulosViewSet
from sendEmail.api.viewsets import OtherEmail
from solicitacaoCompra.api.viewsets import SolicitacaoCompraViewSet, SolicitacaoCompraViewSetView
from produto.api.viewsets import ProdutoViewSet
from itensSolicitacao.api.viewsets import ItensSolicitacaoViewSet
from itemCotacao.api.viewsets import ItemCotacaoViewSet
from fornecedores.api.viewsets import FornecedoresViewSet, FornecedoresViewSetFornAccess, FornecedoresCustomViewSet
from cotacaoCompra.api.viewsets import CotacaoCompraViewSet, CotacaoCompraViewSetView
from condicaoPagamento.api.viewsets import CondicaoPagamentoViewSet
from user.api.viewsets import UsersViewSet, UserValidation, UserResetPass
from rest_framework.authtoken.views import obtain_auth_token
from django.conf.urls.static import static
from django.conf import settings

router = routers.DefaultRouter()
router.register(r'solicitacaoCompraView', SolicitacaoCompraViewSetView, basename='solicitacaoCompraView')
router.register(r'solicitacaoCompra', SolicitacaoCompraViewSet, basename='solicitacaoCompra')
router.register(r'produto', ProdutoViewSet)
router.register(r'genericEmail', OtherEmail, basename='genericEmail')
router.register(r'itensSolicitacao', ItensSolicitacaoViewSet)
router.register(r'itemCotacao', ItemCotacaoViewSet, basename='itemCotacao')
router.register(r'fornecedores', FornecedoresViewSet, basename='fornecedores')
router.register(r'fornecedoresFree', FornecedoresViewSetFornAccess, basename='fornecedoresFree')
router.register(r'fornecedoresCustom', FornecedoresCustomViewSet, basename='fornecedoresCustom')
router.register(r'cotacaoCompra', CotacaoCompraViewSet, basename='cotacaoCompra')
router.register(r'cotacaoCompraView', CotacaoCompraViewSetView, basename='cotacaoCompraView')
router.register(r'condicaoPagamento', CondicaoPagamentoViewSet)
router.register(r'usuarios', UsersViewSet)
router.register(r'resetPass', UserResetPass, basename='resetPass')
router.register(r'usuariosValidacao', UserValidation, basename='usuariosValidacao')
router.register(r'titulos', TitulosViewSet, basename='titulos')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-token-auth/', obtain_auth_token),
]

urlpatterns += static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
