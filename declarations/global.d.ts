declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.json?url' {
  const content: string
  export default content
}

declare module '*.json.txt' {
  const value: string
  export default value
}

declare module '*.txt?url' {
  const content: string
  export default content
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.ogg' {
  const value: string
  export default value
}

declare module '*.css?inline';
