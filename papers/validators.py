from urllib.parse import urlparse
from django.core.exceptions import ValidationError


def validate_url(value):
    if not value:
        return
    obj = urlparse(value)
    if not obj.hostname in ('inspirehep.net'):
        raise ValidationError('Only urls from Inspire HEP allowed.')
