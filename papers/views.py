from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib import messages
import json
from urllib.parse import unquote

from .models import CustomUser, UserRead, UserProject
from .forms import URLForm, NewProjectForm

def index(request):
    form = URLForm
    return render(request, 'papers/index.html', {'form': form})

def paper(request):
    if request.method == 'POST':
        form = URLForm(request.POST)
        ref_form = URLForm
        if form.is_valid():
            paper_url = form.cleaned_data['paper_url']
            readlist = False
            projects = False
            if request.user.is_authenticated:
                readlist = UserRead.objects.filter(user = request.user).first()
                if readlist:
                    readlist = ','.join(readlist.all_urls())
                else:
                    readlist = ''
                projects = UserProject.objects.filter(user = request.user)
            return render(request, 'papers/paper.html', {
            'paper_url': paper_url,
            'form': ref_form,
            'readlist': readlist,
            'projects': projects,
            })
        if form.errors['paper_url']:
            messages.error(request, form.errors['paper_url'])
        else:
            messages.error(request, 'Sorry, something went wrong')
        return redirect('index')
    else:
        return redirect('index')


@login_required
def readlist(request):
    ref_form = URLForm
    readlist = UserRead.objects.filter(user = request.user).first()
    projects = UserProject.objects.filter(user = request.user)
    if readlist and readlist != "":
        return render(request, 'papers/readlist.html', {
        'readlist': ','.join(readlist.all_urls()),
        'form': ref_form,
        'projects': projects,
        })
    else:
        return render(request, 'papers/readlist.html')

@login_required
@csrf_exempt
def read(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required"}, status = 400)
    user_read = UserRead.objects.filter(user = request.user).first()
    json_data = json.loads(request.body)
    read_url = json_data.get("read_url", "")
    if user_read:
        if read_url in user_read.all_urls():
            user_read.remove_url(read_url)
            user_read.save()
            return JsonResponse({"message": "Readlist Subtraction"}, status = 200)
        else:
            user_read.add_url(read_url)
            user_read.save()
            return JsonResponse({"message": "Readlist Addition"}, status = 200)
    else:
        UserRead.objects.create(user = request.user, urls = read_url + ',')
        return JsonResponse({"message": "Readlist Created"}, status = 200)


@login_required
def projects(request):
    if request.method == "POST":
        submitted_form = NewProjectForm(request.POST)
        if submitted_form.is_valid():
            name = submitted_form.cleaned_data['name']
            description = submitted_form.cleaned_data['description']
            UserProject.objects.create(
                user = request.user,
                name = name,
                description = description)
        else:
            messages.error(request, "Sorry, something went wrong.")
        create_form = NewProjectForm
        projects = UserProject.objects.filter(user = request.user)
        return render(request, 'papers/projects.html',{
            'form': create_form,
            'projects': projects,
        })
    else:
        form = NewProjectForm
        projects = UserProject.objects.filter(user = request.user)
        return render(request, 'papers/projects.html',{
            'form': form,
            'projects': projects,
        })

@login_required
def project(request, project_id):
    ref_form = URLForm
    project = UserProject.objects.get(id = project_id)
    if project.user != request.user:
        messages.error(request, "Only acess your own projects.")
        return redirect('projects')
    readlist = UserRead.objects.filter(user = request.user).first()
    if readlist:
        readlist = ','.join(readlist.all_urls())
    else:
        readlist = ''
    return render(request, 'papers/project.html', {
        'project': project,
        'readlist': readlist,
        'projectlist': ','.join(project.all_urls()),
        'form': ref_form
    })

@login_required
@csrf_exempt
def read_project(request, project_id):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required"}, status = 400)
    project = UserProject.objects.get(id = project_id)
    if project.user != request.user:
        messages.error(request, "Only acess your own projects.")
        return redirect('projects')
    json_data = json.loads(request.body)
    read_url = json_data.get("read_url", "")
    if read_url in project.all_urls():
        project.remove_url(read_url)
        project.save()
        return JsonResponse({"message": "Project Subtraction"}, status = 200)
    else:
        project.add_url(read_url)
        project.save()
        return JsonResponse({"message": "Project Addition"}, status = 200)

@login_required
@csrf_exempt
def project_status(request):
    if request.method != 'POST':
        return redirect('index')
    json_data = json.loads(request.body)
    url = json_data['url']
    project_id = json_data['projectId']
    project = UserProject.objects.get(id = project_id)
    if project.user != request.user:
        messages.error(request, "Only acess your own projects.")
        return redirect('projects')
    status = 'True' if url in project.all_urls() else 'False'
    return JsonResponse({"status" : status}, status = 200)

@login_required
def delete_project(request):
    if request.method != 'POST':
        return redirect('projects')
    project = UserProject.objects.get(id = request.POST['del'])
    if project.user != request.user:
        messages.error(request, "Only acess your own projects.")
        return redirect('projects')
    project.delete()
    messages.success(request, "Project Deleted")
    return redirect('projects')
