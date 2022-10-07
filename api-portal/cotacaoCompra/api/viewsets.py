from rest_framework.viewsets import ModelViewSet
from cotacaoCompra.bestPrice import bestPrice
from cotacaoCompra.models import CotacaoCompra
from django.contrib.auth.models import User
from user.fixUser import fixUser
from .serializers import CotacaoCompraSerializer, CotacaoCompraSerializerData
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status
from rest_framework.settings import api_settings
from sendEmail.send_mail import setupEmail
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class CotacaoCompraViewSet(ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (SearchFilter, DjangoFilterBackend,)
    search_fields = ('cotacaoId', 'buyer', 'fluigNumber')
    filterset_fields = ('cotacaoId', 'fluigNumber', 'solicitacaoCotacao')
    serializer_class = CotacaoCompraSerializer
    
    def get_queryset(self):
        
        queryset = CotacaoCompra.objects.all().order_by('cotacaoId')
        isFiltered = self.request.query_params.get('filter')
        user = self.request.query_params.get('user')
        
        if isFiltered == '1':
            queryset = queryset.filter(itens__userId=user, itens__approve=3).distinct() #correctly filter the quotation
        elif isFiltered == '2':
            queryset = queryset.filter(itens__approve=3).distinct() #correctly filter the quotation
            
        return queryset
    
    # metodo que define o que sera mostrado ao dar POST
    def create(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data=fixUser(self.request.user.get_username(), request.data, 'quotation'))
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
        
    # metodo que define o que sera mostrado ao dar UPDATE    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        correctData= request.data
        listed = self.request.query_params.get('listed')
        
        if listed is not None:
            correctData= bestPrice(request.data)
        
        serializer = self.get_serializer(instance, data=correctData, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
        
class CotacaoCompraViewSetView(ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (SearchFilter,)
    search_fields = ('cotacaoId', 'buyer', 'fluigNumber')
    queryset = CotacaoCompra.objects.all()
    serializer_class = CotacaoCompraSerializerData
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['buyer']= self.getUserData(serializer.data['buyer'])
        
        sendEmail = self.request.query_params.get('sendEmail')
        id = self.request.query_params.get('idSupplier')
        
        if sendEmail == '1':
            setupEmail(data=data,subject='[SIDI] -  Solicitação de Cotação fluig Id(' + str(data['fluigNumber'])+')',from_email='',to_emails=['compras@sidi.org.br'], type='quotation', idSupplier='0')
        
        elif sendEmail == '2':
            supplier= ''
            data = serializer.data
            data['buyer'] = self.getUserData(serializer.data['buyer'])
            
            for item in serializer.data['itens']:
                
                if int(id) == item['supplierId']['id']:
                    supplier = item['supplierId']['socialName']
                    break
                
            setupEmail(data=data,subject='Fornecedor '+supplier+' finalizou a cotação',from_email='',to_emails=data['buyer'][0]['email'], type='quotationAnswer', idSupplier=id)
        
        return Response(serializer.data)
    
    def getUserData(self, username):
        user= User.objects.all().get(username=username)
        
        return [{
                'name': user.first_name,
                'email': user.email
            }]
