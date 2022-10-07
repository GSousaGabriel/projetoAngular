from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from django.contrib.auth.models import User

from sendEmail.send_mail import setupEmail 
from .serializers import UsersSerializer
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework.settings import api_settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class UsersViewSet(ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    #filterset_fields = ('id', 'name', 'description', 'state')
    search_fields = ('id', 'first_name', 'email', 'username')
    queryset = User.objects.all()
    serializer_class = UsersSerializer
    
    
    def create(self, request, *args, **kwargs):
        username = request.data.pop('username', None) 
        password = request.data.pop('password', None)
        request.data.pop('id', None) 
        
        user = User.objects.create(username=username, password=password, **request.data)
        user.set_password(password)
        user.save()
        return Response(request.data)
    
    def update(self, request, *args, **kwargs):
        password = request.data['password']
        user = User.objects.get(username__exact = request.data['username'])
        
        user.username = request.data['username']
        user.is_superuser = request.data['is_superuser']
        user.first_name = request.data['first_name']
        user.last_name = request.data['last_name']
        user.email = request.data['email']
        user.is_staff = request.data['is_staff']
        user.is_active = request.data['is_active']
        user.set_password(password)
        user.save()
        
        return Response(request.data)
    
        
        
    
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
    

class UserValidation(ModelViewSet):
    http_method_names = ['post']
    queryset = None
    serializer_class = None
    
    # metodo que define o que sera mostrado ao dar POST
    def create(self, request, *args, **kwargs): 
        
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                return Response([{'msg': 'Login realizado com sucesso!',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'staff': user.is_staff,
                        'adm': user.is_superuser
                    }
                }])
                # Redirecione para uma página de sucesso.
            else:
                return Response([{'msg': 'Conta desativada!'}])
                # Retorna uma mensagem de erro de 'conta desabilitada'
        else:
                return Response([{'msg': 'Usuário ou senha inválidos!'}])
            
class UserResetPass(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UsersSerializer
    
    def create(self, request, *args, **kwargs): 
        
        userChange= request.data['user']
        
        if type(userChange) == int:
            user = User.objects.all().filter(id=userChange)
        else:
            user = User.objects.all().filter(username=userChange)
        
        if len(user.values()) > 0:
            
            self.resetPass(userChange, user.values()[0]['email'])            
            return Response('senha enviada para o email cadastrado!')
    
        
    def resetPass(self, userChange, email):
        
        if type(userChange) == int:
            user = User.objects.all().get(id=userChange)
        else:
            user = User.objects.all().get(username=userChange)
            
        password = User.objects.make_random_password()
        user.set_password(password)
        user.save(update_fields=['password'])
        
        setupEmail(password, '[SIDI PORTAL] -  Nova senha', '', [email], 'resetPass', '')
        return Response('senha enviada para o email cadastrado!')
        
