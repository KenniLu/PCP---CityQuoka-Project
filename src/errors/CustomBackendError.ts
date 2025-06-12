import { APIError } from "payload"

export class CustomBackendError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
}