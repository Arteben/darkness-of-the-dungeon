
export const isAllNull = function (a: any, b: any) {
  return a == null && b == null
}

export const getTOutPromise = function (counter: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('timeout is ended!'), counter)
  })
}

export const getRandomIntNumber = function (min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}