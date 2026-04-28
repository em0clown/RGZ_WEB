from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .serializers import UserSerializer, RegisterSerializer, UserProfileUpdateSerializer
import os

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(username__icontains=search)
        return queryset
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return Response({'error': 'Not authenticated'}, status=401)
    
    @action(detail=True, methods=['post'])
    def subscribe(self, request, pk=None):
        user = self.get_object()
        if request.user.is_authenticated and request.user != user:
            if request.user in user.subscribers.all():
                user.subscribers.remove(request.user)
                return Response({'status': 'unsubscribed', 'count': user.subscriber_count})
            else:
                user.subscribers.add(request.user)
                return Response({'status': 'subscribed', 'count': user.subscriber_count})
        return Response({'error': 'Invalid action'}, status=400)
    
    @action(detail=True, methods=['get'])
    def videos(self, request, pk=None):
        user = self.get_object()
        videos = user.videos.all().order_by('-created_at')
        from videos.serializers import VideoSerializer
        serializer = VideoSerializer(videos, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], url_path='update-profile')
    def update_profile(self, request, pk=None):
        user = self.get_object()
        
        if request.user != user:
            return Response(
                {'error': 'Вы можете редактировать только свой профиль'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            user_serializer = UserSerializer(user)
            return Response(user_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='upload-avatar')
    def upload_avatar(self, request, pk=None):
        user = self.get_object()
        
        if request.user != user:
            return Response(
                {'error': 'Вы можете менять только свой аватар'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if 'avatar' not in request.FILES:
            return Response(
                {'error': 'Файл не найден'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        avatar_file = request.FILES['avatar']
        
        if not avatar_file.content_type.startswith('image/'):
            return Response(
                {'error': 'Можно загружать только изображения'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if avatar_file.size > 5 * 1024 * 1024:
            return Response(
                {'error': 'Размер файла не должен превышать 5MB'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if user.avatar and user.avatar.name:
            try:
                if os.path.isfile(user.avatar.path):
                    os.remove(user.avatar.path)
            except:
                pass
        
        user.avatar = avatar_file
        user.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='upload-banner')
    def upload_banner(self, request, pk=None):
        user = self.get_object()
        
        if request.user != user:
            return Response(
                {'error': 'Вы можете менять только свой баннер'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if 'banner' not in request.FILES:
            return Response(
                {'error': 'Файл не найден'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        banner_file = request.FILES['banner']
        
        if not banner_file.content_type.startswith('image/'):
            return Response(
                {'error': 'Можно загружать только изображения'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if banner_file.size > 10 * 1024 * 1024:
            return Response(
                {'error': 'Размер файла не должен превышать 10MB'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if user.banner and user.banner.name:
            try:
                if os.path.isfile(user.banner.path):
                    os.remove(user.banner.path)
            except:
                pass
        
        user.banner = banner_file
        user.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data)
