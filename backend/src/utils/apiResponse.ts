export const successResponse = <T>(data: T) => ({
  success: true,
  data
});

export const errorResponse = (message: string) => ({
  success: false,
  message
});
