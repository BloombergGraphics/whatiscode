from django.contrib import admin

from models import Book
admin.site.register(Book)

class BookAdmin(admin.ModelAdmin):
    fields = ('title', 'price')

# Register your models here.
