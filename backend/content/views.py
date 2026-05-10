from rest_framework import viewsets, permissions
from .models import HeroBanner, AnnouncementBar, ContentBlock
from .serializers import HeroBannerSerializer, AnnouncementBarSerializer, ContentBlockSerializer
from core.permissions import IsAdminUser
from accounts.utils import log_action

class HeroBannerViewSet(viewsets.ModelViewSet):
    queryset = HeroBanner.objects.all()
    serializer_class = HeroBannerSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        banner = serializer.save()
        log_action(self.request.user, 'CONTENT_BANNER_CREATE', 'content', banner.id, f"Created hero banner: {banner.title}", self.request)

    def perform_update(self, serializer):
        banner = serializer.save()
        log_action(self.request.user, 'CONTENT_BANNER_UPDATE', 'content', banner.id, f"Updated hero banner: {banner.title}", self.request)

    def perform_destroy(self, instance):
        log_action(self.request.user, 'CONTENT_BANNER_DELETE', 'content', instance.id, f"Deleted hero banner: {instance.title}", self.request)
        instance.delete()

class AnnouncementBarViewSet(viewsets.ModelViewSet):
    queryset = AnnouncementBar.objects.all()
    serializer_class = AnnouncementBarSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        announcement = serializer.save()
        log_action(self.request.user, 'CONTENT_ANNOUNCEMENT_CREATE', 'content', announcement.id, f"Created announcement bar: {announcement.text[:30]}", self.request)

    def perform_update(self, serializer):
        announcement = serializer.save()
        log_action(self.request.user, 'CONTENT_ANNOUNCEMENT_UPDATE', 'content', announcement.id, f"Updated announcement bar: {announcement.text[:30]}", self.request)

    def perform_destroy(self, instance):
        log_action(self.request.user, 'CONTENT_ANNOUNCEMENT_DELETE', 'content', instance.id, f"Deleted announcement bar: {instance.text[:30]}", self.request)
        instance.delete()

class ContentBlockViewSet(viewsets.ModelViewSet):
    queryset = ContentBlock.objects.all()
    serializer_class = ContentBlockSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        block = serializer.save()
        log_action(self.request.user, 'CONTENT_BLOCK_CREATE', 'content', block.id, f"Created content block: {block.name}", self.request)

    def perform_update(self, serializer):
        block = serializer.save()
        log_action(self.request.user, 'CONTENT_BLOCK_UPDATE', 'content', block.id, f"Updated content block: {block.name}", self.request)

    def perform_destroy(self, instance):
        log_action(self.request.user, 'CONTENT_BLOCK_DELETE', 'content', instance.id, f"Deleted content block: {instance.name}", self.request)
        instance.delete()
