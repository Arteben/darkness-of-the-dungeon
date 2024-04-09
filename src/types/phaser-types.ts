// import Phaser from "phaser"

export interface IPhaserConfig {
  type: number
  width: number
  height: number
  scene: {
    preload: () => void
    create: () => void
    update: () => void
  }
  canvas: HTMLCanvasElement
  parent: HTMLElement
}

export interface IWindowResolution {
  width: number
  height: number
}