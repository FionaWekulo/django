from django.db import models

# Create your models here.
class Tour(models.Model):
    #we need an origin country, destination, number of nights and the price for the tour
    origin_country = models.CharField(max_length=64)
    destination_country = models.CharField(max_length=64)
    number_of_nights = models.IntegerField()
    price = models.IntegerField()
    
    
    # This is a string representation of the tours
    def __str__(self):
        return (f"ÏD:{self.id}: From {self.origin_country} To {self.destination_country}, {self.number_of_nights} nights costs ${self.price}")
