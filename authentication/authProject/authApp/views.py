from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.contrib.auth.models import User
from .forms import RegisterForm

# Create your views here.
def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        #if form is valid
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            #create user
            user = User.objects.create_user(username=username, password=password)
            login(request, user)
            return redirect("home")
    else:
        form = RegisterForm()
            
    return render(request, 'accounts/register.html', {'form':form} )

def login_view(request): #login view
    error_message = None
    if request.method == "POST": #if request is post	
        username = request.POST.get("username")
        password = request.POST.get("password")
        #authenticate the user
        user = authenticate(request, username=username, password=password)
        if user is not None: #if user is authenticated	
            login(request, user)
            #redirect to the next page
            next_url = request.POST.get("next") or request.GET.get("next") or ("home")
            return redirect(next_url) 
        else:
            #if user is not authenticated
            error_message = "Invalid username or password!"
    #if request is not post
    return render(request, 'accounts/login.html', {'error': error_message} )
    

def logout_view(request): #logout view
    if request.method == "POST":
        logout(request)
        return redirect("login")
    else:
        return render('home')


#home view
#using decorator
@login_required # this decorator will redirect to home page if logged in
def home_view(request):
    return render(request, 'auth1_app/home.html')

# Protected View for which one cant see if not registered and logged in
class ProtectedView(LoginRequiredMixin, View):
    # 'login_url' - to redirect to login page
    login_url = '/login/'
    # 'next' - to redirect url
    redirect_field_name = 'redirect_to'
    
    def get(self, request):
        return render(request, 'registration/protected.html')
