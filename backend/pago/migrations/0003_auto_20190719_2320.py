# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2019-07-19 23:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pago', '0002_auto_20190719_2302'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pago',
            name='cvv',
            field=models.CharField(max_length=3, null=True),
        ),
    ]