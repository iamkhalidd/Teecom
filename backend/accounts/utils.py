from .models import AuditLog

def log_action(user, action_type, entity_type=None, entity_id=None, description='', request=None, previous_value=None, new_value=None):
    ip_address = None
    user_agent = None

    if request:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT')

    return AuditLog.objects.create(
        user=user,
        action_type=action_type,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id else None,
        description=description,
        ip_address=ip_address,
        user_agent=user_agent,
        previous_value=previous_value,
        new_value=new_value
    )
