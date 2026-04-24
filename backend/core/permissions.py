from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    Assumes the model has a `user` field or a `wallet__user` field.
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'wallet'):
            return obj.wallet.user == request.user
        if hasattr(obj, 'ticket'):
            return obj.ticket.user == request.user
        return False

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allow owners or admins to access.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role == 'admin':
            return True

        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'wallet'):
            return obj.wallet.user == request.user
        if hasattr(obj, 'ticket'):
            return obj.ticket.user == request.user
        return False

class IsAdminUser(permissions.BasePermission):
    """
    Strict admin check using custom role.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_staff or request.user.role == 'admin')
