# Generated by Django 5.0.4 on 2024-05-11 14:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("book_app", "0002_alter_profile_table_comment"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="avatar_data_type",
            field=models.CharField(max_length=20, null=True),
        ),
    ]
