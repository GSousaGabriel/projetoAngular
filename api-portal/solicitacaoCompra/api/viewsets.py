from rest_framework.viewsets import ModelViewSet
from solicitacaoCompra.models import SolicitacaoCompra
from user.fixUser import fixUser
from .serializers import SolicitacaoCompraSerializer, SolicitacaoCompraSerializerView
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.settings import api_settings
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

class SolicitacaoCompraViewSet(ModelViewSet):
   authentication_classes = [TokenAuthentication, BasicAuthentication]
   permission_classes = [IsAuthenticated]
   filter_backends = (DjangoFilterBackend, SearchFilter,)
   filter_fields = ('solicitacaoId', 'fluigNumber')
   search_fields = ('solicitacaoId', 'requester__id', 'fluigNumber')
   queryset = SolicitacaoCompra.objects.all().order_by('solicitacaoId')
   serializer_class = SolicitacaoCompraSerializer
   
   def create(self, request, *args, **kwargs):
      
        serializer = self.get_serializer(data=fixUser(self.request.user.id, request.data, 'order'))
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

   def perform_create(self, serializer):
      serializer.save()

   def get_success_headers(self, data):
      try:
         return {'Location': str(data[api_settings.URL_FIELD_NAME])}
      except (TypeError, KeyError):
         return {}
      
   def partial_update(self, request, *args, **kwargs):
         kwargs['partial'] = True
        
         if 'fluigNumber' in request.data.keys():
            request.data.pop('fluigNumber')
         if 'requester' in request.data.keys():
            request.data.pop('requester')
         if 'expenseTitle' in request.data.keys():
            request.data.pop('expenseTitle')
        
         return self.update(request, *args, **kwargs)
   
class SolicitacaoCompraViewSetView(ModelViewSet):
   authentication_classes = [TokenAuthentication, BasicAuthentication]
   permission_classes = [IsAuthenticated]
   filter_backends = (DjangoFilterBackend, SearchFilter,)
   filter_fields = ('solicitacaoId', 'fluigNumber')
   search_fields = ('solicitacaoId', 'requester__id', 'fluigNumber')
  # queryset = SolicitacaoCompra.objects.all().order_by('solicitacaoId')
   serializer_class = SolicitacaoCompraSerializerView
   
   def get_queryset(self):
        
        queryset = SolicitacaoCompra.objects.all().order_by('solicitacaoId')
        hasQuotation = self.request.query_params.get('empty')
        if hasQuotation is not None:
            queryset = queryset.filter(~Q(cotacao__isnull=True))
        return queryset.distinct()
     
   def list(self, request, *args, **kwargs):
         queryset = self.filter_queryset(self.get_queryset())
         
         filter = self.request.query_params.get('filter')
         
         if filter== '1':
            queryset = queryset.filter(alreadyListed=1)
            
         elif filter== '2':
            queryset = queryset.filter(~Q(fluigNumber=0))
         
         page = self.paginate_queryset(queryset)
         if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

         serializer = self.get_serializer(queryset, many=True)
         return Response(serializer.data)