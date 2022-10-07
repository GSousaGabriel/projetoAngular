from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from financeiro.api.serializers import TituloSerializer
from financeiro.models import Titulo

class TitulosViewSet(ModelViewSet):
   authentication_classes = (TokenAuthentication,)
   permission_classes = (IsAuthenticated,)
   serializer_class = TituloSerializer
   filter_backends = (DjangoFilterBackend, SearchFilter,)
   filterset_fields = ('id', 'fluigNumber', 'titleNumber', 'status')
   search_fields = ('id', 'fluigNumber', 'titleNumber', 'status', 'supplier')
   queryset = Titulo.objects.all()