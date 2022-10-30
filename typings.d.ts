declare module "canvas-sketch-util/math" {
  export const clamp: (value: number, min: number, max: number) => number;
  export const mapRange: (
    input: number,
    inputMin: number,
    inputMax: number,
    outputMin: number,
    outputMax: number
  ) => number;
}
