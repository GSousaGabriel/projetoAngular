from itemCotacao.models import CotacaoItem
from rest_framework import serializers
from condicaoPagamento.api.serializers import CondicaoPagamentoSerializer
from fornecedores.api.serializers import FornecedoresSerializer

class ItemCotacaoSerializer(serializers.ModelSerializer):
    supplierId = FornecedoresSerializer()
    paymentTermsId = CondicaoPagamentoSerializer()
    class Meta:
        model = CotacaoItem
        fields = '__all__'
        
class ItemCotacaoSerializerIds(serializers.ModelSerializer):
    class Meta:
        model = CotacaoItem
        fields = '__all__'