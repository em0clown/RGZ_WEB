from rest_framework import serializers
from .models import Video, Comment, Complaint
from users.serializers import UserSerializer

class VideoSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    like_count = serializers.IntegerField(read_only=True)
    comment_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Video
        fields = ('id', 'title', 'description', 'video_file', 'thumbnail', 'author', 
                  'views', 'like_count', 'comment_count', 'created_at', 'duration', 'is_liked')
        read_only_fields = ('id', 'views', 'created_at')
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'video', 'user', 'text', 'created_at')
        read_only_fields = ('id', 'created_at', 'user')

class ComplaintSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    video_title = serializers.CharField(source='video.title', read_only=True)
    
    class Meta:
        model = Complaint
        fields = ('id', 'video', 'video_title', 'user', 'complaint_type', 
                  'description', 'status', 'created_at')
        read_only_fields = ('id', 'created_at', 'status')
