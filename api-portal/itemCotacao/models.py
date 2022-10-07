from email.policy import default
from django.db import models
from fornecedores.models import Fornecedores
from condicaoPagamento.models import CondicaoPagamento
from solicitacaoCompras.validators import validate_file_extension
from django.db.utils import OperationalError
    
def filterCondicao():
    try:
        try:
            data= CondicaoPagamento.objects.get(codErp="004")
            return data.pk
        except:
            return '0'
    except OperationalError:
        return '0'

#cotacao item
class CotacaoItem(models.Model):
    product = models.CharField(max_length=100)
    productCode = models.IntegerField()
    quotationId = models.IntegerField()
    userId = models.IntegerField(blank=True, null=True)
    supplierId = models.ForeignKey(Fornecedores, on_delete=models.DO_NOTHING, related_name="FornecedorCotacao", verbose_name="Fornecedor da cotação")
    paymentTermsId = models.ForeignKey(CondicaoPagamento, on_delete=models.DO_NOTHING, related_name="CondicaoPagamentoCotacao", verbose_name="condição de pagamento", default=filterCondicao())
    unit= models.CharField(max_length=2, blank=True, null=True)
    quantity = models.CharField(max_length=50)
    quotationQuantity= models.CharField(max_length=50)
    validDate = models.DateField(verbose_name="Data de validade", blank=True, auto_now=True)
    necessityDate = models.DateField(verbose_name="Data de necessidade", blank=True, auto_now=True)
    deadline = models.CharField(max_length=3, default='0')
    valueICMS = models.CharField(max_length=50, default='0,00')
    valueIPI = models.CharField(max_length=50, default='0,00')
    unitValue = models.CharField(max_length=50, default='0,00')
    totalQuotation = models.CharField(max_length=50, default='0,00')
    observation = models.TextField(verbose_name="Observação", blank=True, default='')
    observationSupplier = models.TextField(verbose_name="Observação", blank=True, default='')
    approveReason = models.CharField(max_length=100, blank=True, null=True)
    approve = models.IntegerField(default=3)
    approver = models.CharField(max_length=50, verbose_name="Nome do aprovador", blank=True, default="")
    approveDate = models.DateField(verbose_name="Data de aprovação", auto_now=True)
    bestValue = models.IntegerField(default=2)
    attachment = models.FileField(upload_to='anexos', null=True, blank=True, validators=[validate_file_extension])
    shipping = models.CharField(max_length=3, blank=True, null=True)
    shippingValue = models.CharField(max_length=10, blank=True, null=True)
    
    def __str__(self):
        return str(self.product)