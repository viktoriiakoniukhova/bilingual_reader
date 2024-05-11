import base64

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_mongoengine import serializers as mongo_serializers

from book_app.models import Profile, VocabularyTerm


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['phone', 'books', 'avatar', 'avatar_data_type']


class VocabularyTermSerializer(mongo_serializers.DocumentSerializer):
    voice_over = serializers.SerializerMethodField()

    def get_voice_over(self, obj):
        # Custom logic to serialize the binary voice over field
        # You can convert it to a base64 string or any other suitable format
        return base64.b64encode(obj.voice_over)

    class Meta:
        model = VocabularyTerm
        fields = ['ukrainian', 'english', 'voice_over']
