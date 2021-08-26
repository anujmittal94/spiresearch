from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = 'index'),
    path('paper', views.paper, name = 'paper'),
    path('read', views.read, name = 'read'),
    path('readlist', views.readlist, name = 'readlist'),
    path('projects', views.projects, name = 'projects'),
    path('project/<int:project_id>', views.project, name = 'project'),
    path('readproject/<int:project_id>', views.read_project, name = 'readproject'),
    path('projectstatus', views.project_status, name = 'status'),
    path('delete', views.delete_project, name = 'delete'),
]
