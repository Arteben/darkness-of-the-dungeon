
export const isAllNull = (a: any, b: any) => {
  return a == null && b == null
}

export const getTOutPromise = (counter: number) =>{
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('timeout is ended!'), counter)
  })
}

export const getRandomIntNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getZerosStringFromNum = (num: number): string => {
  const powerCount = 5
  const numString = String(num)
  const zeroCount = powerCount - numString.length
  return new Array(zeroCount + 1).join('0') + numString
}
