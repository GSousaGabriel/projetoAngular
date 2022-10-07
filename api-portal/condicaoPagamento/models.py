from django.db import models

#Condicao de pagamento
class CondicaoPagamento(models.Model):
    description = models.CharField(max_length=100, verbose_name="Descrição", help_text="Máximo de 100 caracteres")
    codErp = models.CharField(max_length=12, verbose_name="Código ERP")
    
    def __str__(self):
        return self.description