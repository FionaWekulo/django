from django.urls import path
from . import views

#Define a list of url patterns the user can navigate to
urlpatterns = [
    path("", views.index),
]