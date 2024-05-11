from rest_framework.exceptions import APIException

class CustomValidationError(APIException):
    default_status_code = 400
    default_detail = 'Validation failed.'

    def __init__(self, detail=None, status_code=None):
        self.status_code = status_code or self.default_status_code

        if detail is None:
            self.detail = self.default_detail
        else:
            self.detail = {'errors': detail}
