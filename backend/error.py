from werkzeug.exceptions import HTTPException


class Error400(HTTPException):
    code = 400  # Bad Request


class Error401(HTTPException):
    code = 401  # Unauthorized


class Error403(HTTPException):
    code = 403  # Forbidden


class Error404(HTTPException):
    code = 404  # Not Found


class Error409(HTTPException):
    code = 409  # Conflict


class Error422(HTTPException):
    code = 422  # Unprocessable Entity
