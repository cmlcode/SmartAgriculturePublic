# Generated by Django 4.2.4 on 2023-10-29 04:59

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("smart_agriculture", "0007_remove_alert_content"),
    ]

    operations = [
        migrations.AddField(
            model_name="alert",
            name="content",
            field=models.CharField(default="", max_length=255),
        ),
    ]
