from condicaoPagamento.models import CondicaoPagamento
from rest_framework.serializers import ModelSerializer

class CondicaoPagamentoSerializer(ModelSerializer):
    class Meta:
        model = CondicaoPagamento
        fields = '__all__'