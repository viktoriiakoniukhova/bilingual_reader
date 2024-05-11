"""book_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

import book_app.views as views


router = routers.DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),
    path("admin/", admin.site.urls),

    path("book/create/", views.add_book),
    path("book/all_books/", views.all_books),
    path("book/one/info/", views.one_book_info),
    path("book/filter/", views.filter_books),
    path("book/search/", views.search_books),
    path("book/file/", views.get_file),
    path("book/paragraphs/", views.get_paragraphs),

    path("user/", views.UserUpdateView.as_view()),
    path("user/login/", views.authenticate_user),
    path("user/create/", views.create_user),
    path("user/change-password/", views.change_password),
    path("user/change-avatar/", views.change_avatar),
    path("user/info/", views.user_info),

    path("translate/", views.get_translation),

    # login/logout
    path('auth/', include('rest_framework.urls', namespace='rest_framework'))
]
