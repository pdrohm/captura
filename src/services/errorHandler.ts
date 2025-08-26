import { ApiError, IErrorHandler } from '@/src/types/repositories';

export class AppErrorHandler implements IErrorHandler {
  private errorLog: { error: Error | ApiError; timestamp: Date; context?: string }[] = [];

  handle(error: Error | ApiError): void {
    this.log(error);
    
    if (this.isApiError(error)) {
      this.handleApiError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  log(error: Error | ApiError): void {
    const logEntry = {
      error,
      timestamp: new Date(),
      context: this.getErrorContext(error)
    };
    
    this.errorLog.push(logEntry);
    
    if (__DEV__) {
      console.error('Error logged:', logEntry);
    }
  }

  getUserFriendlyMessage(error: Error | ApiError): string {
    if (this.isApiError(error)) {
      return this.getApiErrorMessage(error);
    }
    
    if (error.name === 'NetworkError') {
      return 'Network connection error. Please check your internet connection.';
    }
    
    if (error.name === 'ValidationError') {
      return 'Invalid data provided. Please check your input.';
    }
    
    if (error.name === 'AuthenticationError') {
      return 'Authentication failed. Please log in again.';
    }
    
    if (error.name === 'PermissionError') {
      return 'You don\'t have permission to perform this action.';
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  isRetryable(error: Error | ApiError): boolean {
    if (this.isApiError(error)) {
      const code = parseInt(error.code);
      return code >= 500 || code === 429 || code === 408;
    }
    
    if (error.name === 'NetworkError') {
      return true;
    }
    
    if (error.name === 'ValidationError' || error.name === 'PermissionError') {
      return false;
    }
    
    return false;
  }

  getErrorLog(): { error: Error | ApiError; timestamp: Date; context?: string }[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }

  private isApiError(error: Error | ApiError): error is ApiError {
    return 'code' in error && 'message' in error;
  }

  private handleApiError(error: ApiError): void {
    switch (error.code) {
      case 'auth/user-not-found':
        break;
      case 'auth/wrong-password':
        break;
      case 'auth/too-many-requests':
        break;
      case 'permission-denied':
        break;
      default:
        break;
    }
  }

  private handleGenericError(error: Error): void {
    switch (error.name) {
      case 'TypeError':
        break;
      case 'ReferenceError':
        break;
      case 'RangeError':
        break;
      default:
        break;
    }
  }

  private getApiErrorMessage(error: ApiError): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'User account not found.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/email-already-in-use': 'Email is already registered.',
      'auth/weak-password': 'Password is too weak.',
      'permission-denied': 'You don\'t have permission to perform this action.',
      'not-found': 'The requested resource was not found.',
      'already-exists': 'The resource already exists.',
      'invalid-argument': 'Invalid data provided.',
      'unavailable': 'Service is currently unavailable.',
      'internal': 'An internal error occurred.',
      'deadline-exceeded': 'Request timed out.',
      'resource-exhausted': 'Resource limit exceeded.',
      'failed-precondition': 'Operation cannot be completed.',
      'aborted': 'Operation was aborted.',
      'out-of-range': 'Value is out of range.',
      'unimplemented': 'Operation not implemented.',
      'data-loss': 'Data loss occurred.',
      'unauthenticated': 'Authentication required.'
    };

    return errorMessages[error.code] || error.message || 'An error occurred.';
  }

  private getErrorContext(error: Error | ApiError): string {
    if (this.isApiError(error)) {
      return `API Error: ${error.code}`;
    }
    
    return `Error: ${error.name}`;
  }
}

export const errorHandler = new AppErrorHandler();