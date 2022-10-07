from rest_framework.viewsets import ModelViewSet
from sendEmail.api.serializers import GenericEmailSerializer
from sendEmail.send_mail import setupEmail
from rest_framework.response import Response

class OtherEmail(ModelViewSet):
    serializer_class = GenericEmailSerializer
   
    def create(self, request, *args, **kwargs):
        sendEmail = self.request.query_params.get('sendEmail')
            
        if sendEmail is not None:
            setupEmail(data='',subject='[EMPRESA] -  Convite para cadastro no portal',from_email='',to_emails=[request.data['email']], type='invitePortal')               
        return Response('Convite enviado com sucesso!')