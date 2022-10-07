# Generated by Django 4.0.5 on 2022-10-07 18:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('solicitacaoCompra', '0001_initial'),
        ('itemCotacao', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='CotacaoCompra',
            fields=[
                ('cotacaoId', models.AutoField(primary_key=True, serialize=False)),
                ('expenseTitle', models.CharField(blank=True, max_length=100, null=True)),
                ('fluigNumber', models.IntegerField(blank=True, null=True)),
                ('issueDate', models.DateField(verbose_name='Emissão')),
                ('buyer', models.CharField(max_length=100)),
                ('status', models.IntegerField(default=3)),
                ('itens', models.ManyToManyField(related_name='cotacao', to='itemCotacao.cotacaoitem')),
                ('solicitacaoCotacao', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='cotacao', to='solicitacaoCompra.solicitacaocompra', verbose_name='Solicitação da cotação')),
            ],
        ),
    ]