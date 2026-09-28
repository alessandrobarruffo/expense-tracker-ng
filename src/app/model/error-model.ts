
export enum ErrorCode {
  ENTITY_NOT_FOUND = "ERR_404_NOT_FOUND",
  DATA_INTEGRITY_VIOLATION = "ERR_500_DATA_INTEGRITY",
  INTERNAL_SERVER_ERROR = "ERR_500_GENERIC",
  INVALID_PROPERTY_REFERENCE = "ERR_400_INVALID_PROPERTY"
}

export interface ErrorResponse {
  code: ErrorCode;
  requestId: string;
  message: string;
  timestamp: string;
}
