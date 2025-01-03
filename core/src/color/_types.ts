export type RgbTuple = [number, number, number]
export type RgbaTuple = [number, number, number, number]
export type HslTuple = [number, number, number]

export type RgbResultMap = {
	string: string
	array: RgbTuple | RgbaTuple
	object: { r: number; g: number; b: number; a?: number }
}
