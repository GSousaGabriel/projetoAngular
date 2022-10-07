from django.db import models
from model_utils import FieldTracker
from sendEmail.send_mail import setupEmail
from solicitacaoCompras.validators import validate_file_extension

#fornecedores
class Fornecedores(models.Model):
    document = models.CharField(max_length=18)
    socialName = models.CharField(max_length=40, verbose_name="Razão", blank=True)
    fantasyName = models.CharField(max_length=20, verbose_name="Fantasia")
    cep = models.CharField(max_length=9, blank=True)
    address = models.CharField(max_length=100, verbose_name="Endereço",  help_text="Máximo de 100 caracteres", blank=True)
    district = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=2, blank=True)
    DDD = models.CharField(max_length=3, default='')
    phone = models.CharField(max_length=15, blank=True, default='')
    mobilePhone = models.CharField(max_length=15, blank=True, default='')
    contact = models.CharField(max_length=100, blank=True)
    email = models.EmailField(max_length=100, blank=True)
    erp = models.CharField(max_length=12, verbose_name="Código ERP", blank=True)
    approve = models.IntegerField(default=3)
    user = models.IntegerField(blank=True, null=True)
    cartaoCNPJ = models.FileField(upload_to='anexos', null=True, blank=True, validators=[validate_file_extension])
    cadastroSintegra = models.FileField(upload_to='anexos', null=True, blank=True, validators=[validate_file_extension])
    certidaoNegativaRF = models.FileField(upload_to='anexos', null=True, blank=True, validators=[validate_file_extension])
    contratoSocial = models.FileField(upload_to='anexos', null=True, blank=True, validators=[validate_file_extension])
    certidaoNegativaFGTS = models.FileField(upload_to='anexos', null=True, blank=True, validators=[validate_file_extension])
    certidaoNegativaTrabalhista = models.FileField(upload_to='anexos', null=True, blank=True, validators=[validate_file_extension])
    outrosAnexos = models.FileField(upload_to='anexos', null=True, blank=True, validators=[validate_file_extension])
    dadosBanco = models.FileField(upload_to='banco', null=True, blank=True, validators=[validate_file_extension])
    tracker = FieldTracker()
    
    def save(self, *args, **kwargs):
        if (len(self.tracker.changed()) > 0 and 'approve' not in self.tracker.changed().keys()) and hasattr(self, 'sendChanges'):
            data= self.prepareData(self.tracker.changed())
            setupEmail(data=data,subject='[SIDI] -  Mudanças no cadastro do fornecedor ',from_email='',to_emails=['compras@sidi.org.br'], type='supplierChange')
        super().save(*args, **kwargs)
    
    def prepareData(self, data):
        dataFixed= [{'document': self.document, 'name': self.socialName}]
        
        for value in data:
            fixedValue = self.fixValue(value)
            dataFixed.append({'field':fixedValue, 'value':data[value], 'newValue': self.serializable_value(value)})
            
        return dataFixed
    
    def fixValue(self, value):
        match value:
            case 'socialName': 
               return 'Nome social'
            case 'fantasyName':
                return 'Nome fantasia'
            case 'address': 
                return 'Endereço'
            case 'district':
                return 'Bairro'
            case 'city': 
                return 'Cidade'
            case 'state':
                return 'Estado'
            case 'phone': 
                return 'Telefone'
            case 'mobilePhone':
                return 'Celular'
            case 'contact': 
                return 'Contato'
            case 'email':
                return 'Email'
            case default:
                return value
    
    def __str__(self):
        return self.socialName
