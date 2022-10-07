from rest_framework.viewsets import ModelViewSet
from condicaoPagamento.models import CondicaoPagamento
from .serializers import CondicaoPagamentoSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class CondicaoPagamentoViewSet(ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = CondicaoPagamento.objects.all()
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    filterset_fields = ('id','codErp')
    search_fields = ('id','description')
    serializer_class = CondicaoPagamentoSerializer