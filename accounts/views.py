from django.shortcuts import render
from django.views import generic
from .forms import RegisterForm
from django.urls import reverse_lazy
from django.shortcuts import redirect
# Create your views here.

class RegisterView(generic.edit.CreateView):
    form_class = RegisterForm
    success_url = reverse_lazy('login')
    template_name = 'registration/register.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('index')
        return super(RegisterView, self).dispatch(request, *args, **kwargs)
