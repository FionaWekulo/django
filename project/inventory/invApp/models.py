from django.db import models

# Create your models here.
class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=200)
    product_sku = models.CharField(max_length=100, unique=True)
    product_price = models.FloatField()
    product_quantity = models.IntegerField()
    product_supplier = models.CharField(max_length=200)
    
    def __str__(self):
        return self.product_name