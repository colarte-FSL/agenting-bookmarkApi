export class BadRequestException extends Error {
  readonly httpStatus = 400;
  readonly errors: string[];

  constructor(errors: string | string[]) {
    const errArray = Array.isArray(errors) ? errors : [errors];
    super(errArray[0]);
    this.errors = errArray;
    this.name = 'BadRequestException';
  }
}

export class BookmarkNotFoundException extends Error {
  readonly httpStatus = 404;
  readonly errors: string[];

  constructor(errors: string | string[]) {
    const errArray = Array.isArray(errors) ? errors : [errors];
    super(errArray[0]);
    this.errors = errArray;
    this.name = 'BookmarkNotFoundException';
  }
}

export class BookmarkException extends Error {
  readonly httpStatus: number;
  readonly errors: string[];

  constructor(errors: string | string[], httpStatus: number) {
    const errArray = Array.isArray(errors) ? errors : [errors];
    super(errArray[0]);
    this.errors = errArray;
    this.httpStatus = httpStatus;
    this.name = 'BookmarkException';
  }
}
