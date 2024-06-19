/**
 * CustomError class that provides additional properties like status, statusCode and isOperational.
 */
class CustomError extends Error {
  /**
   * HTTP status code for the error.
   */
  statusCode: number;

  /**
   * Status of the error. It's 'fail' for 4xx errors and 'error' for 5xx errors.
   */
  status: string;

  /**
   * Indicates if the error is operational. It's always true for instances of this class.
   */
  isOperational: boolean;

  /**
   * Constructs a new CustomError instance.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code for the error.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
