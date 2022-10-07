from rest_framework.viewsets import ModelViewSet
from produto.models import Produto
from .serializers import ProdutoSerializer
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class ProdutoViewSet(ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (SearchFilter, DjangoFilterBackend)
    filter_fields = ('id', 'name', 'codErp')
    search_fields = ('id', 'name', 'codErp')
    queryset = Produto.objects.all().order_by('id')
    serializer_class = ProdutoSerializer