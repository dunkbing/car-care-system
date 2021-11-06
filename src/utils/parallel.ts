export declare type Parallelizable<T> = Promise<T> | Promise<T>[] | (() => Promise<T> | Promise<T>[]);

function parallelizableToPromise<T>(parallelizable: Parallelizable<T>): Promise<T | T[]> {
  let promise: Promise<T> | Promise<T>[];
  if (typeof parallelizable === 'function') {
    promise = parallelizable();
  } else {
    promise = parallelizable;
  }
  if (Array.isArray(promise)) {
    return Promise.all(promise);
  } else {
    return promise;
  }
}

export async function parallel(...procs: Parallelizable<void>[]): Promise<void>;
export async function parallel<T1>(...procs: [Parallelizable<T1>]): Promise<[T1]>;
export async function parallel<T1, T2>(...procs: [Parallelizable<T1>, Parallelizable<T2>]): Promise<[T1, T2]>;
export async function parallel<T1, T2, T3>(...procs: [Parallelizable<T1>, Parallelizable<T2>, Parallelizable<T3>]): Promise<[T1, T2, T3]>;
export async function parallel<T1, T2, T3, T4>(
  ...procs: [Parallelizable<T1>, Parallelizable<T2>, Parallelizable<T3>, Parallelizable<T4>]
): Promise<[T1, T2, T3, T4]>;
export async function parallel<T1, T2, T3, T4, T5>(
  ...procs: [Parallelizable<T1>, Parallelizable<T2>, Parallelizable<T3>, Parallelizable<T4>, Parallelizable<T5>]
): Promise<[T1, T2, T3, T4, T5]>;
export async function parallel(...procs: Parallelizable<any>[]): Promise<any>;
export async function parallel(...procs: Parallelizable<any>[]): Promise<any[] | void> {
  const promises = procs.map(parallelizableToPromise);
  return Promise.all(promises);
}
