export class ResponseDto {
    /**
     * Response DTO
     * @param {number} status
     * @param {string} message
     * @param {any} data
     */

    constructor(status, message, data = null) {
      this.status = status;
      this.message = message;
      this.data = data;
      this.error = null;
    }

    setError(errorObject) {
      this.error = errorObject;
    }
  }