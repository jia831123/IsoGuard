const AsyncFunction = (async () => {}).constructor;

export function isAsync(func: Function): boolean {
  return func.constructor === AsyncFunction;
}