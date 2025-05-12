
export const isAllNull = function (a: any, b: any) {
  return a == null && b == null
}

export const getTOutPromise = function (counter: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('timeout is ended!'), counter)
  })
}