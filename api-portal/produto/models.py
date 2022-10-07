from django.db import models

#produto
class Produto(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nome", help_text="Máximo de 100 caracteres")
    description = models.CharField(max_length=100, verbose_name="Descrição", help_text="Máximo de 100 caracteres")
    unit = models.CharField(max_length=3, verbose_name="Unidade de medida")
    codErp = models.CharField(max_length=12, verbose_name="Código ERP")
    defaultSupplier = models.CharField(max_length=8, verbose_name="Fornecedor Padrão", blank=True, null=True)
    
    def __str__(self):
        return self.name
