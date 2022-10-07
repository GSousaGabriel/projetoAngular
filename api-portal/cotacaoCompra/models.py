from django.db import models
from itemCotacao.models import CotacaoItem
from solicitacaoCompra.models import SolicitacaoCompra

#cotacao compra
class CotacaoCompra(models.Model):
    cotacaoId = models.AutoField(primary_key=True)
    expenseTitle = models.CharField(max_length=100, blank=True, null=True)
    fluigNumber = models.IntegerField(blank=True, null=True)
    solicitacaoCotacao = models.ForeignKey(SolicitacaoCompra, on_delete=models.DO_NOTHING, related_name="cotacao", verbose_name="Solicitação da cotação")
    issueDate = models.DateField(verbose_name="Emissão")
    buyer = models.CharField(max_length=100)
    itens = models.ManyToManyField(CotacaoItem, related_name='cotacao')
    status = models.IntegerField(default=3)
    
    def __str__(self):
        return str(self.cotacaoId)