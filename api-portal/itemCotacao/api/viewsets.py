from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from cotacaoCompra.models import CotacaoCompra
from itemCotacao.models import CotacaoItem
from sendEmail.send_mail import setupEmail
from .serializers import ItemCotacaoSerializer, ItemCotacaoSerializerIds
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class ItemCotacaoViewSet(ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('id', 'approve')
    filterset_fields = ('id','productCode')
    
    def get_serializer_class(self):
        if self.request.query_params.get('useId') is not None:
            return ItemCotacaoSerializerIds
        return ItemCotacaoSerializer
    
    def get_queryset(self):
        
        queryset = CotacaoItem.objects.all().order_by('id')
        isFiltered = self.request.query_params.get('filter')
        quotation = self.request.query_params.get('quotation')
        user= self.request.query_params.get('user')
        if isFiltered is not None:
            queryset = queryset.filter(itens__quotationId = quotation)
            queryset = queryset.filter(itens__approve = 3)
            queryset = queryset.filter(itens__userId = user)
        return queryset.distinct().order_by('id')
    
    # metodo que define o que sera mostrado ao dar UPDATE
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        if 'itens' in request.data.keys():
            quotation= CotacaoCompra.objects.get(cotacaoId=request.data['itens']['quotationId'])
            dataEmail={}
            dataEmail['itens']=[]
            dataEmail['itens'].append(request.data.pop('itens'))
            dataEmail['cotacaoId']= quotation.cotacaoId
            dataEmail['issueDate'] = str(quotation.issueDate.year)+'-'+str(quotation.issueDate.month)+'-'+str(quotation.issueDate.day)
            dataEmail['buyer']=[]
            dataEmail['buyer'].append({'name':quotation.buyer})
            
        correctData= request.data
        
        sendEmail = self.request.query_params.get('sendEmail')
         
        if sendEmail is not None:
            setupEmail(data=dataEmail,subject='[SIDI] -  Corrigir Item da Cotação',from_email='',to_emails=[dataEmail['itens'][0]['supplierId']['email']], type='returnQuotation')
        
        serializer = self.get_serializer(instance, data=correctData, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)