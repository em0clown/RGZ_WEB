from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Video(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='videos')
    views = models.IntegerField(default=0)
    likes = models.ManyToManyField(User, related_name='liked_videos', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    duration = models.IntegerField(default=0)
    is_published = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title
    
    @property
    def like_count(self):
        return self.likes.count()
    
    @property
    def comment_count(self):
        return self.comments.count()
    
    @property
    def complaint_count(self):
        return self.complaints.count()

class Comment(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}: {self.text[:50]}"

class Complaint(models.Model):
    """Модель для жалоб на видео"""
    COMPLAINT_TYPES = [
        ('spam', 'Спам'),
        ('violence', 'Насилие'),
        ('harassment', 'Домогательство'),
        ('copyright', 'Нарушение авторских прав'),
        ('inappropriate', 'Неприемлемый контент'),
        ('other', 'Другое'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'На рассмотрении'),
        ('reviewed', 'Рассмотрена'),
        ('rejected', 'Отклонена'),
        ('resolved', 'Решена'),
    ]
    
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='complaints')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaints')
    complaint_type = models.CharField(max_length=20, choices=COMPLAINT_TYPES)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['video', 'user']  # Один пользователь может пожаловаться на видео только раз
    
    def __str__(self):
        return f"Complaint on {self.video.title} by {self.user.username}"
