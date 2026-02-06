class Response {
  static success<T, U>(message: string = 'Success', data: T, additional?: U) {
    return {
      success: true,
      message,
      data,
      ...additional,
    };
  }
}

export default Response;
