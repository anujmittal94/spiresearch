from django.test import TestCase
from papers.models import UserRead, UserProject
from accounts.models import CustomUser

# Create your tests here.
class UserReadTestCase(TestCase):

    def setUp(self):

        # Create Users.
        u1 = CustomUser.objects.create(username="user1", email="user1@user1.user1", password="password")

        # Create UserReads.
        UserRead.objects.create(user = u1, urls = 'test1.test,')

    def test_all_urls(self):
        u1 = CustomUser.objects.get(username='user1')
        ur1 = UserRead.objects.get(user = u1)
        self.assertTrue('test1.test' in ur1.all_urls())

    def test_add_urls(self):
        u1 = CustomUser.objects.get(username='user1')
        ur1 = UserRead.objects.get(user = u1)
        ur1.add_url('test3.test')
        self.assertTrue('test3.test' in ur1.all_urls())

    def test_remove_urls(self):
        u1 = CustomUser.objects.get(username='user1')
        ur1 = UserRead.objects.get(user = u1)
        ur1.remove_url('test1.test')
        self.assertFalse('test1.test' in ur1.all_urls())

    def test_non_url(self):
        u1 = CustomUser.objects.get(username='user1')
        ur1 = UserRead.objects.get(user = u1)
        self.assertFalse('test4.test' in ur1.all_urls())

class UserProjectTestCase(TestCase):

    def setUp(self):

        # Create Users.
        u1 = CustomUser.objects.create(username="user1", email="user1@user1.user1", password="password")

        # Create UserReads.
        UserProject.objects.create(user = u1, name = 'test1 name', description = 'test1 description', urls = 'test1.test,')

    def test_all_urls(self):
        u1 = CustomUser.objects.get(username='user1')
        up1 = UserProject.objects.get(user = u1)
        self.assertTrue('test1.test' in up1.all_urls())

    def test_add_urls(self):
        u1 = CustomUser.objects.get(username='user1')
        up1 = UserProject.objects.get(user = u1)
        up1.add_url('test3.test')
        self.assertTrue('test3.test' in up1.all_urls())

    def test_remove_urls(self):
        u1 = CustomUser.objects.get(username='user1')
        up1 = UserProject.objects.get(user = u1)
        up1.remove_url('test1.test')
        self.assertFalse('test1.test' in up1.all_urls())

    def test_non_url(self):
        u1 = CustomUser.objects.get(username='user1')
        up1 = UserProject.objects.get(user = u1)
        self.assertFalse('test4.test' in up1.all_urls())

    def test_rename_project(self):
        u1 = CustomUser.objects.get(username='user1')
        up1 = UserProject.objects.get(user = u1)
        up1.rename_project('test1 rename')
        self.assertFalse(up1.name == 'test1 name')
        self.assertTrue(up1.name == 'test1 rename')
