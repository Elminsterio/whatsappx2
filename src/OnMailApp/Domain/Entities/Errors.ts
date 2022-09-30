export class ErrorBDEntityNotFound extends Error {
  public status: number  
  constructor(message: string, status: number = 404) {
    super(message)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = status;
  }

  public statusCode() {
    return this.status;
  }
}

export class ErrorPwdOrUserNotFound extends Error {  
  public status: number  
  constructor(message: string, status: number = 404) {
    super(message)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = status;
  }

  public statusCode() {
    return this.status;
  }
}

export class OfferStatusError extends Error {  
  public status: number  
  constructor(message: string, status: number = 400) {
    super(message)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = status;
  }

  public statusCode() {
    return this.status;
  }
}
export class ErrorBDEntityFound extends Error {  
  public status: number  
  constructor(message: string, status: number = 400) {
    super(message)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = status;
  }

  public statusCode() {
    return this.status;
  }
}
export class ValidationDataError extends Error {  
  public status: number  
  constructor(message: string, status: number = 400) {
    super(message)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = status;
  }

  public statusCode() {
    return this.status;
  }
}

export class MultipleValidationDataError extends Error {  
  public status: number  
  constructor(message: string, status: number = 400) {
    super(message)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = status;
  }

  public statusCode() {
    return this.status;
  }
}

export class InsufficientPermisionError extends Error {  
  public status: number  
  constructor(message: string, status: number = 403) {
    super(message)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = status;
  }

  public statusCode() {
    return this.status;
  }
}

export class UnathorizedError extends Error {  
  public status: number  
  constructor(message: string, status: number = 401) {
    super(message)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = status;
  }

  public statusCode() {
    return this.status;
  }
}
export class ErrorLimitRateExceeded extends Error {  
  public status: number  
  constructor(message: string, status: number = 429) {
    super(message)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = status;
  }

  public statusCode() {
    return this.status;
  }
}