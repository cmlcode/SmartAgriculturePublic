# Generated by Django 4.2.4 on 2023-10-24 23:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("smart_agriculture", "0004_alert"),
    ]

    operations = [
        migrations.AddField(
            model_name="plant",
            name="status",
            field=models.CharField(default="In Progress", max_length=30),
        ),
        migrations.AlterField(
            model_name="plant",
            name="plant_id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="product",
            name="product_id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]