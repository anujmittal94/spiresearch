# Generated by Django 3.2.4 on 2021-08-17 11:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('papers', '0005_auto_20210817_1533'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userproject',
            name='description',
            field=models.TextField(blank=True, default='', max_length=1250),
        ),
        migrations.AlterField(
            model_name='userproject',
            name='name',
            field=models.CharField(blank=True, default='', max_length=250),
        ),
    ]
