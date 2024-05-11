from rest_framework.views import exception_handler
from .exceptions import CustomValidationError

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    print(response)
    if isinstance(exc, CustomValidationError):
        response.data = {
            'status': response.status_code,
            'errors': response.data['errors']
        }
        print(response.data)

    return response