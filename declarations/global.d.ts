declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const value: string
  export default value
}

declare module 'big.js' {
  const Big: BigJsLibrary.BigJS
  export = Big
}