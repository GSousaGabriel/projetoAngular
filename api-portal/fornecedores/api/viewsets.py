from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework import status
from rest_framework.settings import api_settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from fornecedores.models import Fornecedores
from sendEmail.send_mail import setupEmail
from .serializers import FornecedoresSerializer

class FornecedoresViewSet(ModelViewSet):
   authentication_classes = (TokenAuthentication,)
   permission_classes = (IsAuthenticated,)
   serializer_class = FornecedoresSerializer
   filter_backends = (DjangoFilterBackend, SearchFilter,)
   filterset_fields = ('id', 'socialName', 'fantasyName', 'state', 'approve')
   search_fields = ('id', 'socialName', 'fantasyName', 'document', 'erp')
   
   def get_queryset(self):
        
      queryset = Fornecedores.objects.all().order_by('id')
      user = self.request.query_params.get('user')
      
      if user is not None:
         queryset = queryset.filter(user=user)
            
      return queryset.distinct()
    
    
      
   # metodo que define o que sera mostrado ao dar update
   def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        sendChanges = self.request.query_params.get('sendChanges')
        self.perform_update(serializer, sendChanges)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

   def perform_update(self, serializer, sendChanges):
      serializer.save(sendChanges=sendChanges)

   def partial_update(self, request, *args, **kwargs):
      kwargs['partial'] = True
      return self.update(request, *args, **kwargs)
    
class FornecedoresViewSetFornAccess(ModelViewSet):
   queryset = Fornecedores.objects.all().order_by('id')
   serializer_class = FornecedoresSerializer   
   
   # metodo que define o que sera mostrado ao dar POST
   def create(self, request, *args, **kwargs):
      serializer = self.get_serializer(data=request.data)
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      headers = self.get_success_headers(serializer.data)
              
      sendEmail = self.request.query_params.get('sendEmail')
         
      if sendEmail is not None:
         setupEmail(data=serializer.data,subject='[SIDI] -  Novo cadastro de fornecedor realizado',from_email='',to_emails=['compras@sidi.org.br'], type='supplier')
      
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

   def perform_create(self, serializer):
      serializer.save()

   def get_success_headers(self, data):
      try:
         return {'Location': str(data[api_settings.URL_FIELD_NAME])}
      except (TypeError, KeyError):
         return {}
      
class FornecedoresCustomViewSet(ModelViewSet):
   authentication_classes = (TokenAuthentication,)
   permission_classes = (IsAuthenticated,)
   serializer_class = FornecedoresSerializer
   
   def get_queryset(self):
        
      field = self.request.query_params.get('field')
      value= self.request.query_params.get('value')
      
      results = Fornecedores.objects.all().filter(**{field: value})
            
      return results.distinct()