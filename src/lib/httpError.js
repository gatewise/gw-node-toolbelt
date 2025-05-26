const has = Object.hasOwnProperty
const proto = Object.getPrototypeOf
const trace = Error.captureStackTrace

function HttpError(code, message, baseError) {
  // Let all properties be enumerable for easier serialization
  this.message = message || HttpError.getDefaultMessage(code)
  this.code = code

  // Name has to be an own property for the stack to be printed
  // with the correct name
  if (!has.call(this, 'name')) {
    this.name = has.call(proto(this), 'name') ?
      this.name : this.constructor.name
  }

  // Copy properties from baseError if provided
  if (baseError && typeof baseError === 'object') {
    Object.keys(baseError).forEach((key) => {
      if (key !== 'message' && key !== 'name' && key !== 'stack') {
        this[key] = baseError[key]
      }
    })
  }

  // Capture stack trace
  if (trace && !('stack' in this)) {
    trace(this, this.constructor)
  }
}

HttpError.prototype = Object.create(Error.prototype, {
  constructor: {value: HttpError, configurable: true, writable: true},
})

// Set name explicitly
HttpError.prototype.name = 'HttpError'

HttpError.getDefaultMessage = function getDefaultMessage(code) {
  const messages = {
    400: 'Bad Request',
    401: 'Unauthorized',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
  }
  return messages[code] || 'Unknown Error'
}

// HTTP status code constants
HttpError.BAD_REQUEST = 400
HttpError.UNAUTHORIZED = 401
HttpError.NOT_FOUND = 404
HttpError.CONFLICT = 409
HttpError.INTERNAL_SERVER_ERROR = 500

module.exports = HttpError
