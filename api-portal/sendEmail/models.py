from django.db import models

#email generico
class GenericEmail(models.Model):
    email= models.CharField(max_length=100, blank=True, null=True)