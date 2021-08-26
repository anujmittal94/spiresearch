from django.db import models
from accounts.models import CustomUser
# Create your models here.

class UserRead(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    urls = models.TextField()

    def add_url(self, url):
        if url not in self.urls.split(',')[:-1]:
            self.urls += url + ','

    def remove_url(self,url):
        self.urls = self.urls.replace(url + ',','')

    def all_urls(self):
        return self.urls.split(',')[:-1]

class UserProject(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length = 250, blank=True, default='')
    description = models.TextField(max_length = 1250, blank=True, default='')
    urls = models.TextField()

    def rename_project(self, name):
        self.name = name

    def add_url(self, url):
        if url not in self.urls.split(',')[:-1]:
            self.urls += url + ','

    def remove_url(self,url):
        self.urls = self.urls.replace(url + ',','')

    def all_urls(self):
        return self.urls.split(',')[:-1]
