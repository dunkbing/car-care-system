export default function debounce<T extends unknown[], U>(wait: number, callback: (...args: T) => PromiseLike<U> | U) {
  let timer: NodeJS.Timeout | undefined;

  return (...args: T): Promise<U> => {
    clearTimeout(timer as NodeJS.Timeout);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}
