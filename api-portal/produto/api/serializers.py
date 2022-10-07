from produto.models import Produto
from rest_framework.serializers import ModelSerializer

class ProdutoSerializer(ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'