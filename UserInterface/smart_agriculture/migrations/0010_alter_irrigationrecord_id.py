# Generated by Django 4.2.4 on 2023-10-30 04:55

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "smart_agriculture",
            "0009_alter_product_options_alter_product_managers_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="irrigationrecord",
            name="id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
