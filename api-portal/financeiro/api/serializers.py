from rest_framework.serializers import ModelSerializer
from financeiro.models import Titulo

class TituloSerializer(ModelSerializer):
    class Meta:
        model = Titulo
        fields = '__all__'