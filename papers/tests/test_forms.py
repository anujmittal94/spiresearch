from django.test import TestCase
from papers.forms import URLForm

class URLFormTest(TestCase):
    def test_inspire_validator_false(self):
        form = URLForm(data={'paper_url': 'test.test'})
        self.assertFalse(form.is_valid())

    def test_inspire_validator_true(self):
        form = URLForm(data={'paper_url': 'inspirehep.net'})
        self.assertTrue(form.is_valid())
