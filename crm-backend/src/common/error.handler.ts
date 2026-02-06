export function getErrorMessage(
  error: unknown,
  defaultMessage: string = 'An error occurred',
): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const err = error as Record<string, unknown>;
    if (typeof err.message === 'string') {
      return err.message;
    }
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
}
