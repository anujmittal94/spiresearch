from django import forms
from .validators import validate_url
from .models import UserProject

class URLForm(forms.Form):
    paper_url = forms.URLField(
        widget=forms.TextInput(attrs={
        'class' : 'form-control',
        'placeholder': 'e.g. https://inspirehep.net/literature/1480357'
        }),
        validators=[validate_url]
    )

class NewProjectForm(forms.ModelForm):
    class Meta:
        model = UserProject
        fields = ["name", "description"]
        labels = {
            "name": "Project Name",
            "description": "Description",
        }
