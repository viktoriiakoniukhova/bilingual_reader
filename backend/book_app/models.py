from django.db import models
from django.contrib.auth.models import User
import mongoengine
mongoengine.connect('documents', alias='default')

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    avatar = models.BinaryField(blank=True, null=True)
    avatar_data_type = models.CharField(max_length=20, null=True)
    books = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table_comment = 'default'


class File(mongoengine.Document):
    file = mongoengine.FileField()
    size = mongoengine.IntField()
    fileType = mongoengine.StringField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    meta = {'db': 'documents'}


class BookText(mongoengine.Document):
    paragraphs = mongoengine.ListField(mongoengine.StringField())
    language = mongoengine.StringField()
    size = mongoengine.IntField()
    translator = mongoengine.ListField(mongoengine.StringField())
    meta = {'db': 'documents'}


class Book(mongoengine.Document):
    title = mongoengine.StringField()
    author = mongoengine.ListField(mongoengine.StringField())
    genre = mongoengine.ListField(mongoengine.StringField())
    ageRestriction = mongoengine.StringField(max_length=5)
    totalPages = mongoengine.IntField()
    progressPages = mongoengine.IntField()
    preview = mongoengine.ReferenceField(File)
    originalText = mongoengine.ReferenceField(BookText)
    translationText = mongoengine.ListField(mongoengine.ReferenceField(BookText))
    
    meta = {'db': 'documents'}


class VocabularyTerm(mongoengine.Document):
    ukrainian = mongoengine.StringField()
    english = mongoengine.StringField()
    voice_over = mongoengine.BinaryField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    meta = {'db': 'documents'}
