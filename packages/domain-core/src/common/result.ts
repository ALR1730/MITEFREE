/**
 * Result Pattern Implementation
 * Turing-Grade Software Engineering — ALR COMPANY
 *
 * Mandato Filosófico (Dijkstra, 1972):
 * "El flujo de control debe ser predecible. No utilizar excepciones para modelar
 * errores de negocio esperados. Los errores se modelan como valores de retorno."
 */

export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly isSuccess = true as const;
  readonly isFailure = false as const;

  constructor(readonly value: T) {}

  map<U>(fn: (value: T) => U): Result<U, never> {
    return new Success(fn(this.value));
  }

  flatMap<U, E2>(fn: (value: T) => Result<U, E2>): Result<U, E2> {
    return fn(this.value);
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }
}

export class Failure<E> {
  readonly isSuccess = false as const;
  readonly isFailure = true as const;

  constructor(readonly error: E) {}

  map<U>(_fn: (value: never) => U): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  flatMap<U, E2>(_fn: (value: never) => Result<U, E2>): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  unwrap(): never {
    if (this.error instanceof Error) {
      throw this.error;
    }
    throw new Error(`Attempted to unwrap a Failure Result: ${JSON.stringify(this.error)}`);
  }

  unwrapOr<T>(defaultValue: T): T {
    return defaultValue;
  }
}

export const ok = <T>(value: T): Result<T, never> => new Success(value);
export const fail = <E>(error: E): Result<never, E> => new Failure(error);
