from fornecedores.models import Fornecedores
from rest_framework.serializers import ModelSerializer

class FornecedoresSerializer(ModelSerializer):
    class Meta:
        model = Fornecedores
        fields = '__all__'