from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, F
from .models import Video, Comment, Complaint
from .serializers import VideoSerializer, CommentSerializer, ComplaintSerializer
import os

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.filter(is_published=True).order_by('-created_at')
    serializer_class = VideoSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        return queryset
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        videos = Video.objects.filter(is_published=True).annotate(
            score=Count('likes') + F('views')
        ).order_by('-score')[:20]
        serializer = self.get_serializer(videos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def subscriptions(self, request):
        """Видео от каналов на которые подписан пользователь"""
        if not request.user.is_authenticated:
            return Response({'error': 'Требуется авторизация'}, status=401)
        
        # Получаем ID каналов на которые подписан пользователь
        subscribed_users = request.user.subscribers.all()
        videos = Video.objects.filter(
            author__in=subscribed_users,
            is_published=True
        ).order_by('-created_at')
        
        serializer = self.get_serializer(videos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        video = self.get_object()
        if request.user.is_authenticated:
            if request.user in video.likes.all():
                video.likes.remove(request.user)
                return Response({'status': 'unliked', 'count': video.like_count})
            else:
                video.likes.add(request.user)
                return Response({'status': 'liked', 'count': video.like_count})
        return Response({'error': 'Authentication required'}, status=401)
    
    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        video = self.get_object()
        video.views = F('views') + 1
        video.save()
        video.refresh_from_db()
        
        author = video.author
        author.total_views = F('total_views') + 1
        author.save()
        author.refresh_from_db()
        
        return Response({'views': video.views})
    
    @action(detail=True, methods=['get', 'post', 'delete'])
    def comments(self, request, pk=None):
        video = self.get_object()
        
        if request.method == 'GET':
            comments = video.comments.all().order_by('-created_at')
            serializer = CommentSerializer(comments, many=True, context={'request': request})
            return Response(serializer.data)
        
        elif request.method == 'POST':
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'Требуется авторизация'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            text = request.data.get('text', '')
            if not text:
                return Response(
                    {'error': 'Текст комментария обязателен'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            comment = Comment.objects.create(
                video=video,
                user=request.user,
                text=text
            )
            
            serializer = CommentSerializer(comment, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        elif request.method == 'DELETE':
            comment_id = request.data.get('comment_id')
            if not comment_id:
                return Response(
                    {'error': 'comment_id required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                comment = Comment.objects.get(id=comment_id, video=video)
                if request.user == comment.user or request.user.is_staff:
                    comment.delete()
                    return Response({'status': 'deleted'}, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {'error': 'У вас нет прав на удаление этого комментария'}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            except Comment.DoesNotExist:
                return Response(
                    {'error': 'Комментарий не найден'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
    
    @action(detail=True, methods=['post'])
    def upload_thumbnail(self, request, pk=None):
        video = self.get_object()
        
        if request.user != video.author:
            return Response(
                {'error': 'Вы можете загружать превью только для своих видео'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if 'thumbnail' not in request.FILES:
            return Response(
                {'error': 'Файл не найден'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        thumbnail_file = request.FILES['thumbnail']
        
        if not thumbnail_file.content_type.startswith('image/'):
            return Response(
                {'error': 'Можно загружать только изображения'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if thumbnail_file.size > 5 * 1024 * 1024:
            return Response(
                {'error': 'Размер файла не должен превышать 5MB'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if video.thumbnail and video.thumbnail.name:
            try:
                if os.path.isfile(video.thumbnail.path):
                    os.remove(video.thumbnail.path)
            except:
                pass
        
        video.thumbnail = thumbnail_file
        video.save()
        
        serializer = VideoSerializer(video, context={'request': request})
        return Response(serializer.data)

class ComplaintViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Complaint.objects.all().order_by('-created_at')
    serializer_class = ComplaintSerializer
    permission_classes = (permissions.IsAdminUser,)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        complaint = self.get_object()
        status_type = request.data.get('status')
        
        if status_type in ['reviewed', 'rejected', 'resolved']:
            complaint.status = status_type
            complaint.save()
            return Response({'status': 'updated'})
        
        return Response({'error': 'Invalid status'}, status=400)
