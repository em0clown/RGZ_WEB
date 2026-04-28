from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'Video Platform API',
        'endpoints': {
            'videos': '/api/videos/',
            'users': '/api/users/',
            'admin': '/admin/',
        }
    })

urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/', include('videos.urls')),
    path('api/users/', include('users.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
