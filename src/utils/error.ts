export default function handleError(error: Error | any) {
  let errorMessage = '';
  if (Array.isArray(error)) {
    if (error.length > 0) {
      if (error[0].message) {
        errorMessage = error.map((e) => e.message).join('\n');
      }
    }
  } else {
    if (error.message) {
      errorMessage = `Có lỗi xảy ra: ${error.message}`;
    } else {
      errorMessage = `${JSON.stringify(error)}`;
    }
  }
  return errorMessage;
}
