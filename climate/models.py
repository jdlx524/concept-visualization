from django.db import models


class Nodes(models.Model):
    text = models.CharField(max_length=10)


class Edges(models.Model):
    edge = models.CharField(max_length=10)
