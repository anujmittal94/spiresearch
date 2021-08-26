from django.test import TestCase, Client
from django.urls import reverse

from papers.models import UserRead, UserProject
from accounts.models import CustomUser

class IndexViewTest(TestCase):
    def test_index(self):
        response = self.client.get(reverse('index'))

        self.assertEqual(response.status_code, 200)

        self.assertTemplateUsed(response, 'papers/index.html')

class ReadlistViewTest(TestCase):
    def setUp(self):
        u1 = CustomUser.objects.create(username="user1")
        u1.set_password('password')
        u1.save()

    def test_readlist_not_logged_in(self):
        response = self.client.get(reverse('readlist'))

        self.assertRedirects(response, '/accounts/login/?next=/papers/readlist')

    def test_readlist_logged_in(self):
        login = self.client.login(username='user1', password='password')
        response = self.client.get(reverse('readlist'))

        self.assertEqual(str(response.context['user']), 'user1')

        self.assertEqual(response.status_code, 200)

        self.assertTemplateUsed(response, 'papers/readlist.html')

    def test_readlist_context(self):
        login = self.client.login(username='user1', password='password')
        response = self.client.get(reverse('readlist'))

        self.assertEqual(str(response.context['user']), 'user1')
        self.assertFalse('readlist' in response.context)

        u1 = CustomUser.objects.get(username='user1')
        UserRead.objects.create(user = u1, urls = 'test1.test,')

        response = self.client.get(reverse('readlist'))
        self.assertTrue('readlist' in response.context)
        self.assertEqual(response.context['readlist'], 'test1.test')

class PaperViewTest(TestCase):
    def test_paper_direct_access(self):
        response = self.client.get(reverse('paper'))

        self.assertRedirects(response, reverse('index'))

class ProjectsViewTest(TestCase):
    def setUp(self):
        u1 = CustomUser.objects.create(username="user1")
        u1.set_password('password')
        u1.save()

    def test_projects_not_logged_in(self):
        response = self.client.get(reverse('projects'))

        self.assertRedirects(response, '/accounts/login/?next=/papers/projects')

    def test_projects_logged_in(self):
        login = self.client.login(username='user1', password='password')
        response = self.client.get(reverse('projects'))

        self.assertEqual(str(response.context['user']), 'user1')

        self.assertEqual(response.status_code, 200)

        self.assertTemplateUsed(response, 'papers/projects.html')

    def test_projects_context(self):
        login = self.client.login(username='user1', password='password')
        response = self.client.get(reverse('projects'))

        self.assertEqual(str(response.context['user']), 'user1')
        self.assertFalse(response.context['projects'].exists())

        u1 = CustomUser.objects.get(username='user1')
        up1 = UserProject.objects.create(user = u1, name = 'test1 name', description = 'test1 description', urls = 'test1.test,')

        response = self.client.get(reverse('projects'))
        self.assertTrue(response.context['projects'].exists())
        self.assertTrue(up1 in response.context['projects'])

class ProjectViewTest(TestCase):
    def setUp(self):
        u1 = CustomUser.objects.create(username="user1")
        u1.set_password('password')
        u1.save()

        u2 = CustomUser.objects.create(username="user2")
        u2.set_password('password')
        u2.save()

        up1 = UserProject.objects.create(user = u1, name = 'test1 name', description = 'test1 description', urls = 'test1.test,')
        up1.save()

        up2 = UserProject.objects.create(user = u2, name = 'test2 name', description = 'test2 description', urls = 'test2.test,')
        up2.save()

    def test_project_not_logged_in(self):
        u1 = CustomUser.objects.get(username = 'user1')
        up1 = UserProject.objects.get(user = u1)

        response = self.client.get(reverse('project', kwargs={'project_id':up1.id}))
        self.assertRedirects(response, '/accounts/login/?next=/papers/project/'+str(up1.id))

    def test_project_logged_in(self):
        login = self.client.login(username='user1', password='password')

        u1 = CustomUser.objects.get(username = 'user1')
        up1 = UserProject.objects.get(user = u1)

        response = self.client.get(reverse('project', kwargs={'project_id':up1.id}))

        self.assertEqual(str(response.context['user']), 'user1')

        self.assertEqual(response.status_code, 200)

        self.assertTemplateUsed(response, 'papers/project.html')

    def test_project_context(self):
        login = self.client.login(username='user1', password='password')

        u1 = CustomUser.objects.get(username = 'user1')
        up1 = UserProject.objects.get(user = u1)

        response = self.client.get(reverse('project', kwargs={'project_id':up1.id}))

        self.assertEqual(str(response.context['user']), 'user1')

        self.assertTrue('projectlist' in response.context)
        self.assertTrue('test1' in response.context['projectlist'])

        self.assertEqual(response.context['project'], up1)

    def test_other_user_project(self):
        login = self.client.login(username='user1', password='password')

        u2 = CustomUser.objects.get(username = 'user2')
        up2 = UserProject.objects.get(user = u2)

        response = self.client.get(reverse('project', kwargs={'project_id':up2.id}))

        self.assertRedirects(response, reverse('projects'))
