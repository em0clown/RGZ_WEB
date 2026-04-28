from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from .models import Video, Comment, Complaint
from .serializers import VideoSerializer, CommentSerializer, ComplaintSerializer

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
        """Рекомендации на основе просмотров и лайков"""
        from django.db.models import Count, F
        videos = Video.objects.filter(is_published=True).annotate(
            score=Count('likes') + F('views')
        ).order_by('-score')[:20]
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
        video.views += 1
        video.save()
        
        # Обновляем общее количество просмотров автора
        author = video.author
        author.total_views += 1
        author.save()
        
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
    def complaint(self, request, pk=None):
        """Пожаловаться на видео"""
        video = self.get_object()
        
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Требуется авторизация'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        complaint_type = request.data.get('complaint_type')
        description = request.data.get('description', '')
        
        if not complaint_type:
            return Response(
                {'error': 'Укажите тип жалобы'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Проверяем, не жаловался ли уже пользователь
        if Complaint.objects.filter(video=video, user=request.user).exists():
            return Response(
                {'error': 'Вы уже жаловались на это видео'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        complaint = Complaint.objects.create(
            video=video,
            user=request.user,
            complaint_type=complaint_type,
            description=description
        )
        
        serializer = ComplaintSerializer(complaint)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ComplaintViewSet(viewsets.ReadOnlyModelViewSet):
    """Просмотр жалоб (только для админов)"""
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
