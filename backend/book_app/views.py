import json
import io
import os

from PIL import Image
import base64
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from wsgiref.util import FileWrapper
from django.core.files.storage import FileSystemStorage
import textract

from book_app.cloud import translate_text, synthesize_text
from book_app.serializers import UserSerializer, ProfileSerializer, VocabularyTermSerializer
from book_app.models import File, Book, VocabularyTerm, User, Profile, BookText
from book_app.exceptions import CustomValidationError
from book_app.models import File, Book, BookText
from bson import ObjectId


class AuthenticatedAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
def create_user(request):
    """Create a new user and bound profile model.

    Params:
    - username: str, required, username
    - password: str, required, password
    - email: str, required, email
    - firstName: str, required, first name
    - lastName: str, required, last name
    - phone: str, optional, phone
    - avatar: file, optional, avatar image
    - avatar_data_type: str, avatar data type

    Returns:
    - token: str, token
    - user: json, user data
        - id: int, user id
        - username: str, username
        - email: str, email
        - first_name: str, first name
        - last_name: str, last name
        - phone: str, phone
        - books: list, book ids
        - avatar: str, avatar image
        - avatar_data_type: str, avatar data type

    Example request:
    http POST localhost:8000/user/create/ \
        username='username' password='password' email='email' \
        firstName='first_name' lastName='last_name' phone='phone' \
        Authorization:'Token {token}'
    """
    user_serializer = UserSerializer(data=request.data)
    profile_serializer = ProfileSerializer(data=request.data)

    if not user_serializer.is_valid():
        raise CustomValidationError(detail=user_serializer.errors)
    if not profile_serializer.is_valid():
        raise CustomValidationError(detail=profile_serializer.errors)

    user = user_serializer.save()
    try:
        validate_password(user.password)
    except ValidationError as e:
        user.delete()
        raise CustomValidationError(detail=e.messages)
    user.set_password(user.password)
    user.save()

    profile = profile_serializer.save(user=user)

    token = Token.objects.create(user=user)

    user_data = UserSerializer(user).data
    profile_data = ProfileSerializer(profile).data

    response_data = {
        'token': token.key,
        'user': {
            **user_data,
            **profile_data,
        }
    }

    return Response(response_data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def authenticate_user(request):
    """Authenticate user. Uses email or phone as authentication fields.
    
    Note:
    - username, email or phone must be provided.
    
    Params:
    - username: str, optional, username
    - email: str, optional, email
    - phone: str, optional, phone
    - password: str, required, password
    
    Returns:
    - token: str, token
    - user: json, user data
        - id: int, user id
        - username: str, username
        - email: str, email
        - first_name: str, first name
        - last_name: str, last name
        - phone: str, phone
        - books: list, book ids
        - avatar: str, avatar image
        - avatar_data_type: str, avatar data type
    
    Example request:
    http POST localhost:8000/user/login/ \
        username='username' password='password' \
        Authorization:'Token {token}'
    """
    username = request.data.get('username')
    email = request.data.get('email')
    phone = request.data.get('phone')
    password = request.data.get('password')

    if not any([username, email, phone]):
        raise CustomValidationError(detail=['Username, email or phone is required'])

    if not password:
        raise CustomValidationError(detail=['Password is required'])

    user = (
        User.objects.filter(email=email).first()
        or User.objects.filter(profile__phone=phone).first()
    )
    
    user = authenticate(username=username or user.username, password=password)

    if user is None:
        raise CustomValidationError(detail=['User not found'], status_code=status.HTTP_404_NOT_FOUND)

    token, _ = Token.objects.get_or_create(user=user)

    user_data = UserSerializer(user).data
    profile_data = ProfileSerializer(user.profile).data

    response_data = {
        'token': token.key,
        'user': {
            **user_data,
            **profile_data,
        }
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user's password.
    
    Headers:
    - Authorization: str, required, token
    
    Params:
    - oldPassword: str, required, current password
    - newPassword: str, required, new password
    
    Example request:
    http PUT localhost:8000/user/change-password/ \
        oldPassword='old_password' newPassword='new_password \
        Authorization:'Token {token}'
    """
    user = request.user
    oldPassword = request.data.get('oldPassword')
    newPassword = request.data.get('newPassword')

    if not oldPassword or not newPassword:
        raise CustomValidationError(detail=['Current password and new password are required.'], status_code=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(oldPassword):
        raise CustomValidationError(detail=['Current password is incorrect.'], status_code=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(newPassword)
    except ValidationError as e:
        raise CustomValidationError(detail=e.messages, status_code=status.HTTP_400_BAD_REQUEST)

    user.set_password(newPassword)
    user.save()
    
    return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class UserUpdateView(AuthenticatedAPIView):

    def delete(self, request):
        """Delete user account.
        
        Headers:
        - Authorization: str, required, token
        
        Example request:
        http DELETE localhost:8000/user/ Authorization:'Token {token}'
        """
        user = request.user

        user_data = UserSerializer(user).data
        profile_data = ProfileSerializer(user.profile).data

        user.profile.delete()
        user.delete()

        response_data = {
            'message': 'User deleted successfully.',
            'user': {
                **user_data,
                **profile_data,
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)

    def put(self, request):
        """Update user account.
        
        Headers:
        - Authorization: str, required, token
        
        Params:
        - username: str, optional, new username
        - email: str, optional, new email
        - firstName: str, optional, new first name
        - lastName: str, optional, new last name
        - age: int, optional, new age

        Example request:
        http PUT localhost:8000/user/ \
            username='new_username' \
            email='new_email' \
            firstName='new_first_name' \
            lastName='new_last_name' \
            age=25 \
            Authorization:'Token {token}'
        """
        user = request.user
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        profile_serializer = ProfileSerializer(user.profile, data=request.data, partial=True)

        if not user_serializer.is_valid():
            raise CustomValidationError(
                detail=user_serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        if not profile_serializer.is_valid():
            raise CustomValidationError(
                detail=profile_serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        user_serializer.save()
        profile_serializer.save()

        user_data = user_serializer.data
        profile_data = profile_serializer.data

        response_data = {
            'user': {
                **user_data,
                **profile_data,
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)


@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_avatar(request):
    """Change user's avatar.
    
    Headers:
    - Authorization: str, required, token
    
    Params:
    - avatar: file, required, avatar image
    - avatar_data_type: str, avatar data type
    
    Example request:
    http PUT localhost:8000/user/change-avatar/ avatar@'path/to/avatar image' Authorization:'Token {token}'
    """
    user = request.user
    avatar = Image.open(request.data.get('avatar'), mode='r')
    avt_byte_arr = io.BytesIO()
    avatar.save(avt_byte_arr, format=avatar.format)
    avt_byte_arr = avt_byte_arr.getvalue()
    user.profile.avatar = avt_byte_arr
    user.profile.avatar_data_type = avatar.format
    user.save()
    user.profile.save()
    return Response({'message': 'Avatar changed successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_info(request):
    """Get information about the user.
    
    Headers:
    - Authorization: str, required, token
    
    Example request:
    http GET localhost:8000/user/info/ Authorization:'Token {token}'
    """
    user = request.user
    user_data = UserSerializer(user).data
    profile_data = ProfileSerializer(user.profile).data

    response_data = {
        'user': {
            **user_data,
            **profile_data,
        }
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_book(request):
    """Add a book to the user's library.
    
    Headers:
    - Authorization: str, required, token
    
    Params:
    - preview: file, required, preview image
    - origin: file, required, english text
    - translation_0: file, required, ukrainian text
    - book: json, required, book data.
        - title: str, required, book title
        - author: list, required, book author
        - translator: list, required, book translator
        - genre: list, required, book genre
        - ageRestriction: list, required, book age restriction
        - totalPages: int, required, total pages
    
    Returns:
    - message: str, message
    - bookId: str, book id

    Example request:
    http POST localhost:8000/book/create/ \
        english@'path/to/english text' \
        translation_0@./ukrainian.epub \
        preview@./silly_cat.jpeg \
        book:='{ \
            "title": "Harry Potter", \
            "author": ["J.K. Rowling"], \
            "genre": ["Fantasy"], \
            "ageRestriction": ["12+"], \
            "totalPages": 100, \
            "origin_language": "en", \
            "translations_count": 1, \
            "translation_0_language": "ua", \
            "translator_0": ["translator"], \
        }' \
        Authorization:'Token {token}'
    """
    user = request.user
    book_data = json.loads(request.data.get('book'))
    preview_byte_arr = request.data.get('preview').read()
    origin_file = request.data.get('english')
    FileSystemStorage(location="./tmp").save(origin_file.name, origin_file)
    origin_paragraphs = textract.process(f"./tmp/{origin_file.name}").decode("utf-8").split("\n")
    origin_language = book_data['origin_language']
    os.remove(f"./tmp/{origin_file.name}")
    origin = BookText(paragraphs=origin_paragraphs,
                      language=origin_language,
                      size=len(origin_paragraphs),
                      translator=[])
    origin.save()
    translations_list = []
    translations_count = int(book_data['translations_count'])
    for i in range(translations_count):
        translation_file = request.data.get(f'translation_{i}')
        FileSystemStorage(location="./tmp").save(translation_file.name, translation_file)
        translation_paragraphs = textract.process(f"./tmp/{translation_file.name}").decode("utf-8").split("\n")
        translation_language = book_data[f'translation_{i}_language']
        translator = book_data[f'translator_{i}']
        os.remove(f"./tmp/{translation_file.name}")
        translation = BookText(paragraphs=translation_paragraphs,
                               language=translation_language,
                               size=len(translation_paragraphs),
                               translator=translator)
        translation.save()
        translations_list.append(translation)

    preview = File(size=request.data.get('preview').size,
                   fileType=request.data.get('preview').content_type)
    preview.file.put(preview_byte_arr, content_type=request.data.get('preview').content_type)
    preview.save()
    book = Book(title=book_data['title'],
                author=book_data['author'],
                genre=book_data['genre'],
                ageRestriction=book_data['ageRestriction'],
                totalPages=book_data['totalPages'],
                progressPages=0,
                preview=preview,
                originalText=origin,
                translationText=translations_list)
    book.save()
    book_id = str(book.id)
    book_ids = user.profile.books
    if book_ids is None:
        book_ids = []
    else:
        book_ids = json.loads(book_ids)
    book_ids.append(book_id)
    user.profile.books = json.dumps(book_ids)
    user.profile.save()
    data = {'message': 'Book added successfully.', 'bookId': book_id}
    return Response(data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def all_books(request):
    """Get information about all books.

    Headers:
    - Authorization: str, required, token

    Returns:
    - book_ids: list, book ids

    Example request:
    http GET localhost:8000/book/all_books/ Authorization:'Token {token}'
    """
    user = request.user
    book_ids = user.profile.books
    if book_ids is None:
        book_ids = []
    else:
        book_ids = json.loads(book_ids)
    response_data = {
        "book_ids": book_ids,
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def one_book_info(request):
    """Get information about one book.

    Headers:
    - Authorization: str, required, token

    Params:
    - book_id: str, required, book id

    Example request:
    http GET localhost:8000/book/one/info/ book_id='60f7b3b3b3b3b3b3b3b3b3b3' Authorization:'Token {token}'
    """
    user = request.user
    book_ids = user.profile.books
    if book_ids is None:
        book_ids = []
    else:
        book_ids = json.loads(book_ids)
    book_id = request.data.get('book_id')
    if book_id not in book_ids:
        return Response({'message': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    book = Book.objects.get(id=ObjectId(book_id))
    translations = book.translationText
    translation_ids = []
    for translation in translations:
        translation_ids.append(str(translation.id))
    response_data = {
        "title": book.title,
        "author": book.author,
        "genre": book.genre,
        "ageRestriction": book.ageRestriction,
        "totalPages": book.totalPages,
        "progressPages": book.progressPages,
        "preview_id": str(book.preview.id),
        "image": base64.b64encode(book.preview.file.read()).decode('utf-8'),
        "image_type": book.preview.fileType,
        "original_text_id": str(book.originalText.id),
        "translation_ids": translation_ids,
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_paragraphs(request):
    """Get paragraphs of the text.
    
    Headers:
    - Authorization: str, required, token
    
    Params:
    - offset: int, optional, first paragraph position
    - limit: int, optional, number of paragraphs
    - text_id: str, required, translation or original text id
    
    Returns:
    - paragraphs: list, paragraphs
    - language: str, language
    - total: int, number of paragraphs
    - translator: list, translators
    
    Example request:
    http GET localhost:8000/book/paragraphs/ \
        offset=0 limit=5 text_id='60f7b3b3b3b3b3b3b3b3b3b' \
        Authorization:'Token {token}' \
    """
    offset = int(request.data.get('offset', 0))
    limit = request.data.get('limit')
    text_id = ObjectId(request.data.get('text_id'))

    book_text = BookText.objects.get(pk=text_id)
    limit = int(limit or len(book_text.paragraphs))
    end_pos = min(len(book_text.paragraphs), offset + limit)
    data = {
        "paragraphs": book_text.paragraphs[offset:end_pos],
        "language": book_text.language,
        "total": book_text.size,
        "translator": book_text.translator,
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def filter_books(request):
    """Filter books by genre and age restriction.
    
    Headers:
    - Authorization: str, required, token
    
    Params:
    - filter_genres: list, optional, genre names
    - filter_age_restrictions: list, optional, age restrictions
    
    Example request:
    http GET localhost:8000/book/filter/ \
        filter_genres:='["Fantasy"]' \
        filter_age_restrictions:='["12+"]' \
        Authorization:'Token {token}'
    """
    user = request.user
    book_ids = user.profile.books
    if book_ids is None:
        book_ids = []
    else:
        book_ids = json.loads(book_ids)
    filtered_book_ids = []
    filter_genres = request.data.get('filter_genres')
    filter_age_restrictions = request.data.get('filter_age_restrictions')
    for book_id in book_ids:
        book = Book.objects.get(id=ObjectId(book_id))
        genre_valid = False
        age_restriction_valid = False
        if filter_genres is None:
            genre_valid = True
        else:
            for genre in filter_genres:
                if genre in book.genre:
                    genre_valid = True

        if filter_age_restrictions is None:
            age_restriction_valid = True
        else:
            for restriction in filter_age_restrictions:
                if restriction in book.ageRestriction:
                    age_restriction_valid = True
        if genre_valid and age_restriction_valid:
            filtered_book_ids.append(book_id)
    response_data = {
        "book_ids": filtered_book_ids,
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def search_books(request):
    """Search books by title or author.
    
    Headers:
    - Authorization: str, required, token
    
    Params:
    - search_data: str, required, search query

    Returns:
    - book_ids: list, book ids

    Example request:
    http GET localhost:8000/book/search/ search_data='Harry' Authorization:'Token {token}'
    """
    user = request.user
    book_ids = user.profile.books
    if book_ids is None:
        book_ids = []
    else:
        book_ids = json.loads(book_ids)
    search_book_ids = []
    search_data = request.data.get('search_data')
    for book_id in book_ids:
        book = Book.objects.get(id=ObjectId(book_id))
        if search_data in book.title:
            search_book_ids.append(book_id)
            continue
        for author in book.author:
            if search_data in author:
                search_book_ids.append(book_id)
                break
    response_data = {
        "book_ids": search_book_ids,
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_translation(request):
    """Get translation of the text and voice over.

    Headers:
    - Authorization: str, required, token

    Params:
    - english: str, required, text to translate
    - ukrainian: str, optional, translated text

    Returns:
    - english: str, text to translate
    - ukrainian: str, translated text
    - voice_over: base64 encoded file, voice over
    - format: str, audio format

    Example request:
    http GET localhost:8000/translate/ english='Hello' Authorization:'Token {token}'
    """

    vocabulary_term = VocabularyTerm.objects.filter(**request.data).first()

    if vocabulary_term is None:
        english = request.data.get('english')

        translation = translate_text(english)
        if translation['status'] != 200:
            raise CustomValidationError(detail=['Translation failed'], status_code=translation['status'])

        voice_over = synthesize_text(translation['translated_text'])
        if voice_over['status'] != 200:
            raise CustomValidationError(detail=['Voice over synthesis failed'], status_code=voice_over['status'])

        vocabulary_term_serializer = VocabularyTermSerializer(
            data={
                'english': english,
                'ukrainian': translation['translated_text'],
                'voice_over': voice_over['content'],
            }
        )

        if not vocabulary_term_serializer.is_valid():
            raise CustomValidationError(detail=vocabulary_term_serializer.errors)
        
        vocabulary_term = vocabulary_term_serializer.save()
    else:
        vocabulary_term_serializer = VocabularyTermSerializer(vocabulary_term)

    response_data = vocabulary_term_serializer.data | {'format': 'audio/wav'}
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_file(request):
    """Get one file by id.

        Headers:
        - Authorization: str, required, token

        Params:
        - file_id: str, required, file id

        Example request:
        http GET localhost:8000/book/file/ file_id='662f71c88a61c1889406e13b' Authorization:'Token {token}'
        """
    file_id = ObjectId(request.data.get('file_id'))
    file = File.objects.get(id=file_id)
    file_bytes = base64.b64encode(file.file.read()).decode('utf-8')
    data = {
        "file": file_bytes,
        "file_type": file.fileType,
    }
    return Response(data, status=status.HTTP_200_OK)

