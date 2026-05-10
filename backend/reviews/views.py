from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Review
from .serializers import ReviewSerializer
from core.permissions import IsOwnerOrAdmin

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = Review.objects.all()

        # If not admin, only show approved reviews
        if not (self.request.user.is_authenticated and self.request.user.role == 'admin'):
            queryset = queryset.filter(status='approved')

        product_id = self.request.query_params.get('product', None)
        if product_id:
            queryset = queryset.filter(product_id=product_id)

        status_param = self.request.query_params.get('status', None)
        if status_param and self.request.user.is_authenticated and self.request.user.role == 'admin':
            queryset = queryset.filter(status=status_param)

        return queryset

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        if self.action in ['update', 'partial_update', 'destroy', 'reply']:
            return [IsOwnerOrAdmin()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Default status for new reviews can be pending
        serializer.save(user=self.request.user, status='pending')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reply(self, request, pk=None):
        review = self.get_object()
        admin_reply = request.data.get('admin_reply')

        if not admin_reply:
            return Response({'error': 'admin_reply is required'}, status=status.HTTP_400_BAD_REQUEST)

        review.admin_reply = admin_reply
        review.replied_at = timezone.now()
        review.save()

        serializer = self.get_serializer(review)
        return Response(serializer.data)
