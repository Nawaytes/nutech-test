export class ForbiddenException extends Error {
  constructor(message: string, status: number, public readonly errors?: any) {
    super(message);
    this.name = "ForbiddenException";
    this.message = message || "Forbidden";
    this.errors = {
      status,
      errors,
    } || { status };
  }
}
