from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta
from core.permissions import IsAdminUser
from .services import AnalyticsService

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        days = request.query_params.get('days', 30)
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        try:
            if start_date_str and end_date_str:
                start_date = datetime.fromisoformat(start_date_str)
                end_date = datetime.fromisoformat(end_date_str)
            else:
                days = int(days)
                end_date = timezone.now()
                start_date = end_date - timedelta(days=days)

            stats = AnalyticsService.get_revenue_stats(start_date, end_date)
            return Response(stats)
        except ValueError:
            return Response({'error': 'Invalid date format or days parameter'}, status=400)
