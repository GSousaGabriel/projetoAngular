from django.db import models
from fornecedores.models import Fornecedores

#fincanceiro
class Titulo(models.Model):
    branch= models.CharField(max_length=18, verbose_name="Filial")
    fluigNumber= models.IntegerField(verbose_name="Numero do fluig")
    prefix= models.CharField(max_length=20, verbose_name="Prefixo")
    titleNumber= models.IntegerField(verbose_name="Numero do titulo")
    installment= models.CharField(max_length=10, verbose_name="Parcela")
    type= models.CharField(max_length=18, verbose_name="Tipo")
    dueDate= models.DateField(verbose_name="Vencimento")
    titleValue= models.CharField(max_length=20, verbose_name="Preco do titulo")
    status= models.IntegerField(default=2, verbose_name="Status")
    supplier= models.ForeignKey(Fornecedores, on_delete=models.DO_NOTHING, related_name="FornecedorTitulo", verbose_name="Fornecedor")
    
    def __str__(self):
        return self.titleNumber