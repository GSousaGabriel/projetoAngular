from solicitacaoCompra.models import SolicitacaoCompra
from rest_framework.serializers import ModelSerializer
from itensSolicitacao.api.serializers import ItensSolicitacaoSerializer
from cotacaoCompra.api.serializers import CotacaoCompraSerializerData
from user.api.serializers import UsersSerializer
from drf_writable_nested.serializers import WritableNestedModelSerializer
        
class SolicitacaoCompraSerializer(WritableNestedModelSerializer, ModelSerializer):
    itens = ItensSolicitacaoSerializer(many=True)
    cotacao = CotacaoCompraSerializerData(many=True, required=False)
    class Meta:
        model = SolicitacaoCompra
        fields = '__all__'
        
class SolicitacaoCompraSerializerView(WritableNestedModelSerializer, ModelSerializer):
    itens = ItensSolicitacaoSerializer(many=True)
    cotacao = CotacaoCompraSerializerData(many=True, required=False)
    requester = UsersSerializer()
    class Meta:
        model = SolicitacaoCompra
        fields = '__all__'