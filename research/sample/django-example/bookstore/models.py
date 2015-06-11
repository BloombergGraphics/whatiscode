from django.db import models
class Book(models.Model):
    title = models.CharField(
        max_length=140)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=6,
        decimal_places=2)



