# Color Utility Library

Processing `color` utility functions. providing functions for color validation, conversion, manipulation, and property retrieval.

## Usage

```typescript
import {
	isHexColor,
	isRgbColor,
	isHslColor,
	isDarkColor,
	isLightColor,
	hexToRgb,
	rgbToHex,
	colorRgb,
	setColorOpacity,
	setColorBrightness,
	darkenColor,
	lightenColor,
	mixColors,
	colorComplementary,
	colorLuminance,
	colorContrast,
} from 'kitify'

// or

import { ... } from 'kitify/color'

// or
import isHexColor from 'kitify/isHexColor'
import mixColors from 'kitify/mixColors'
```

## API

### Color Validation Functions

#### `isHexColor`

Validates if a string is a valid hexadecimal color.

```typescript
/**
 * Validates if a string is a valid hexadecimal color.
 * @param color - The color string to validate.
 * @returns Whether the string is a valid hexadecimal color.
 * @example
 * isHexColor('#ffffff'); // true
 * isHexColor('#zzz'); // false
 */
isHexColor(color: string): boolean;
```

#### `isRgbColor`

Validates if a string is a valid RGB color.

```typescript
/**
 * Validates if a string is a valid RGB color.
 * @param color - The color string to validate.
 * @returns Whether the string is a valid RGB color.
 * @example
 * isRgbColor('rgb(255, 255, 255)'); // true
 * isRgbColor('rgb(300, 300, 300)'); // false
 */
isRgbColor(color: string): boolean;
```

#### `isHslColor`

Validates if a string is a valid HSL color.

```typescript
/**
 * Validates if a string is a valid HSL color.
 * @param color - The color string to validate.
 * @returns Whether the string is a valid HSL color.
 * @example
 * isHslColor('hsl(0, 100%, 50%)'); // true
 * isHslColor('hsl(0, 100%, 150%)'); // false
 */
isHslColor(color: string): boolean;
```

#### `isDarkColor`

Checks if a color is dark.

```typescript
/**
 * Checks if a color is dark.
 * @param color - The color string to check.
 * @returns Whether the color is dark.
 * @example
 * isDarkColor('#000000'); // true
 * isDarkColor('#ffffff'); // false
 */
isDarkColor(color: string): boolean;
```

#### `isLightColor`

Checks if a color is light.

```typescript
/**
 * Checks if a color is light.
 * @param color - The color string to check.
 * @returns Whether the color is light.
 * @example
 * isLightColor('#ffffff'); // true
 * isLightColor('#000000'); // false
 */
isLightColor(color: string): boolean;
```

### Color Conversion Functions

#### `hexToRgb`

Converts a hexadecimal color to an RGB color.

```typescript
/**
 * Converts a hexadecimal color to an RGB color.
 * @param hex - The hexadecimal color string.
 * @param type - return type. Can be 'string' | 'array' | 'object'. Default is 'array'.
 * @returns The RGB color string.
 * @example
 * hexToRgb('#ffffff'); // 'rgb(255, 255, 255)'
 */
hexToRgb(hex: string, type): string | number[] | {r: number, g: number, b: number};
```

#### `rgbToHex`

Converts an RGB color to a hexadecimal color.

```typescript
/**
 * Converts an RGB color to a hexadecimal color.
 * @param rgb - The RGB color string.
 * @returns The hexadecimal color string.
 * @example
 * rgbToHex('rgb(255, 255, 255)'); // '#ffffff'
 */
rgbToHex(rgb: string): string;
rgbToHex(rgb: RgbTuple): string;
rgbToHex(r: number, g: number, b: number): string;
```

#### `colorRgb`

Converts a color string to an RGB color.

```typescript
/**
 * Converts a color string to an RGB color.
 * @param color - The color string.
 * @param type - return type. Can be 'string' | 'array' | 'object'. Default is 'string'.
 * @returns The RGB color string.
 * @example
 * colorRgb('#ffffff'); // 'rgb(255, 255, 255)'
 * colorRgb('hsl(0, 100%, 50%)'); // 'rgb(255, 0, 0)'
 */
colorRgb(color: string, type): string | number[] | {r: number, g: number, b: number};
```

### Color Manipulation Functions

#### `setColorOpacity`

Sets the opacity of a color.

```typescript
/**
 * Sets the opacity of a color.
 * @param color - The color string.
 * @param opacity - The opacity value (between 0 and 1).
 * @returns The color string with the specified opacity.
 * @example
 * setColorOpacity('#ffffff', 0.5); // 'rgba(255, 255, 255, 0.5)'
 */
setColorOpacity(color: string, opacity: number): string;
```

#### `setColorBrightness`

Adjusts the brightness of a color.

```typescript
/**
 * Adjusts the brightness of a color.
 * @param color - The color string.
 * @param brightness - The brightness value (between 0 and 1).
 * @returns The color string with adjusted brightness.
 * @example
 * setColorBrightness('#ffffff', 0.5); // '#808080'
 */
setColorBrightness(color: string, brightness: number): string;
```

#### `darkenColor`

Darkens a color.

```typescript
/**
 * Darkens a color.
 * @param color - The color string.
 * @param amount - The amount to darken (between 0 and 1).
 * @returns The darkened color string.
 * @example
 * darkenColor('#ffffff', 0.5); // '#808080'
 */
darkenColor(color: string, amount: number): string;
```

#### `lightenColor`

Lightens a color.

```typescript
/**
 * Lightens a color.
 * @param color - The color string.
 * @param amount - The amount to lighten (between 0 and 1).
 * @returns The lightened color string.
 * @example
 * lightenColor('#000000', 0.5); // '#808080'
 */
lightenColor(color: string, amount: number): string;
```

#### `mixColors`

Mixes two colors.

```typescript
/**
 * Mixes two colors.
 * @param color1 - The first color string.
 * @param color2 - The second color string.
 * @param weight - The mixing weight (between 0 and 1).
 * @returns The mixed color string.
 * @example
 * mixColors('#ffffff', '#000000', 0.5); // '#808080'
 */
mixColors(color1: string, color2: string, weight: number): string;
```

### Color Property Functions

#### `colorComplementary`

Gets the complementary color of a given color.

```typescript
/**
 * Gets the complementary color of a given color.
 * @param color - The color string.
 * @returns The complementary color string.
 * @example
 * colorComplementary('#ff0000'); // '#00ffff'
 */
colorComplementary(color: string): string;
```

#### `colorLuminance`

Gets the luminance value of a color.

```typescript
/**
 * Gets the luminance value of a color.
 * @param color - The color string.
 * @returns The luminance value (between 0 and 1).
 * @example
 * colorLuminance('#ffffff'); // 1
 * colorLuminance('#000000'); // 0
 */
colorLuminance(color: string): number;
```

#### `colorContrast`

Gets the contrast ratio between two colors.

```typescript
/**
 * Gets the contrast ratio between two colors.
 * @param color1 - The first color string.
 * @param color2 - The second color string.
 * @returns The contrast ratio.
 * @example
 * colorContrast('#ffffff', '#000000'); // 21
 */
colorContrast(color1: string, color2: string): number;
```
