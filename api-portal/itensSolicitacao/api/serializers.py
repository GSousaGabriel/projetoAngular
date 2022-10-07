from itensSolicitacao.models import SolicitacaoItem
from rest_framework.serializers import ModelSerializer

class ItensSolicitacaoSerializer(ModelSerializer):
    class Meta:
        model = SolicitacaoItem
        fields = '__all__'