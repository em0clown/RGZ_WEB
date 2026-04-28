from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/%Y/%m/', null=True, blank=True)
    banner = models.ImageField(upload_to='banners/%Y/%m/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True, default='')
    location = models.CharField(max_length=100, blank=True, default='')
    website = models.URLField(blank=True, default='')
    birth_date = models.DateField(null=True, blank=True)
    subscribers = models.ManyToManyField('self', symmetrical=False, blank=True)
    is_verified = models.BooleanField(default=False)
    total_views = models.IntegerField(default=0)
    
    def __str__(self):
        return self.username
    
    @property
    def subscriber_count(self):
        return self.subscribers.count()
    
    @property
    def video_count(self):
        return self.videos.count()
    
    @property
    def like_count(self):
        total = 0
        for video in self.videos.all():
            total += video.likes.count()
        return total
