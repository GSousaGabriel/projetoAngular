from drf_writable_nested import WritableNestedModelSerializer
from cotacaoCompra.models import CotacaoCompra
from rest_framework.serializers import ModelSerializer
from itemCotacao.api.serializers import ItemCotacaoSerializer, ItemCotacaoSerializerIds

class CotacaoCompraSerializer(WritableNestedModelSerializer, ModelSerializer):
    itens = ItemCotacaoSerializerIds(many=True)
    
    class Meta:
        model = CotacaoCompra
        fields = '__all__'

class CotacaoCompraSerializerData(WritableNestedModelSerializer, ModelSerializer):
    itens = ItemCotacaoSerializer(many=True)
    
    class Meta:
        model = CotacaoCompra
        fields = '__all__'