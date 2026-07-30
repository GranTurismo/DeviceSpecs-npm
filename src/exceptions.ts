export class DeviceSpecsApiException extends Error {
  public readonly statusCode: number;
  public readonly responseContent: string;

  constructor(statusCode: number, responseContent: string, message?: string) {
    super(
      message ||
        `DeviceSpecs API returned status code ${statusCode}: ${responseContent}`
    );
    this.name = "DeviceSpecsApiException";
    this.statusCode = statusCode;
    this.responseContent = responseContent;
    Object.setPrototypeOf(this, DeviceSpecsApiException.prototype);
  }
}
