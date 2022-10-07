from django.db import models

#solicitacao item
class SolicitacaoItem(models.Model):
    product = models.CharField(verbose_name="Produto", max_length=200)
    productCode = models.IntegerField()
    defaultSupplier = models.CharField(max_length=8, verbose_name="Fornecedor Padrão", blank=True, null=True)
    item = models.CharField(max_length=3, help_text="Máximo de 3 caracteres")
    observation = models.TextField(verbose_name="Observação", blank=True, null=True)
    necessityDate = models.DateField(verbose_name="Data de necessidade")
    unit= models.CharField(max_length=2, blank=True, null=True)
    quantity = models.IntegerField()
    currency = models.CharField(max_length=2)
   
    def __str__(self):
        return str(self.product)
