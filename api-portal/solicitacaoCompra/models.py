from django.db import models
from django.conf import settings
from itensSolicitacao.models import SolicitacaoItem

#solicitacao compra
class SolicitacaoCompra(models.Model):
    solicitacaoId = models.AutoField(primary_key=True)
    fluigNumber = models.IntegerField(blank=True, null=True)
    expenseTitle = models.CharField(max_length=100, blank=True, null=True)
    branch = models.CharField(max_length=4, help_text="Máximo de 4 caracteres")
    issueDate = models.DateField(verbose_name="Emissão", auto_now=True)
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    itens = models.ManyToManyField(SolicitacaoItem, related_name='solicitacao')
    alreadyListed = models.IntegerField(default=1)
    
    def __str__(self):
        return str(self.solicitacaoId)
