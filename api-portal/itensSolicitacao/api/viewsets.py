from rest_framework.viewsets import ModelViewSet
from itensSolicitacao.models import SolicitacaoItem
from .serializers import ItensSolicitacaoSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class ItensSolicitacaoViewSet(ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    filter_fields = ('id', 'id')
    search_fields = ('id', 'id')
    queryset = SolicitacaoItem.objects.all()
    serializer_class = ItensSolicitacaoSerializer