from rest_framework.serializers import ModelSerializer
from sendEmail.models import GenericEmail

class GenericEmailSerializer(ModelSerializer):
    class Meta:
        model = GenericEmail
        fields = '__all__'