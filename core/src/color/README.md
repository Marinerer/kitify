## Color 知识

### 1. Brightness（亮度）

**Brightness** 是一种主观测量，用于衡量颜色的明暗程度，通常与显示器上的显示效果有关。它不考虑人眼对颜色的不同敏感度，而是简单地计算颜色的平均亮度。

#### 计算公式

使用以下公式计算亮度：

$$
B = \frac{R \cdot 299 + G \cdot 587 + B \cdot 114}{1000}
$$

这里的系数是基于 `NTSC` 的标准加权值。

#### 函数实现

```javascript
function getBrightness(r, g, b) {
	return (r * 299 + g * 587 + b * 114) / 1000
}
```

---

### 2. Luminance（明度）

**Luminance** 是一种客观的测量，用来描述颜色的明亮程度（相对于人类视觉的响应），它基于人眼对不同波长光线敏感度的不同。计算 Luminance 的公式与 RGB 值相关，并且会将 RGB 转换为线性空间。

#### 计算公式

对于 RGB 值 $(R, G, B)$，首先需要将值归一化到 $[0, 1]$，并根据以下公式计算：

- 如果 $v \leq 0.03928$，则 $v' = \frac{v}{12.92}$
- 如果 $v > 0.03928$，则 $v' = \left(\frac{v + 0.055}{1.055}\right)^{2.4}$

计算后的线性 RGB 值 $(R', G', B')$ 用以下公式求得 Luminance 值：

$$
L = 0.2126 \cdot R' + 0.7152 \cdot G' + 0.0722 \cdot B'
$$

#### 函数实现

```javascript
function getLuminance(r, g, b) {
	const a = [r, g, b].map((v) => {
		v /= 255 // 归一化到 [0, 1]
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
	})
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}
```

---

### 3. Contrast（对比度）

**Contrast** 描述了两种颜色之间的视觉差异，通常用于确保文本与背景之间的可读性。根据 Web 内容无障碍指南（WCAG），对比度的计算基于相对亮度。

#### 计算公式

设两种颜色的相对亮度分别为 $L_1$ 和 $L_2$，且 $L_1 \geq L_2$，对比度的公式为：

$$
C = \frac{L_1 + 0.05}{L_2 + 0.05}
$$

#### 函数实现

```javascript
function getContrast(hex1, hex2) {
	const rgb1 = hexToRgb(hex1)
	const rgb2 = hexToRgb(hex2)
	const luminance1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
	const luminance2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
	return luminance1 > luminance2
		? (luminance1 + 0.05) / (luminance2 + 0.05)
		: (luminance2 + 0.05) / (luminance1 + 0.05)
}
```

---

### 示例

以 `#FFFFFF`（白色）和 `#000000`（黑色）为例：

```javascript
const white = '#FFFFFF'
const black = '#000000'

const luminanceWhite = getLuminance(255, 255, 255) // 输出: 1
const luminanceBlack = getLuminance(0, 0, 0) // 输出: 0

const brightnessWhite = getBrightness(255, 255, 255) // 输出: 255
const brightnessBlack = getBrightness(0, 0, 0) // 输出: 0

const contrast = getContrast(white, black) // 输出: 21
```

---

### 用途

1. **Brightness**
   - 用于评估颜色的视觉亮度或创建暗/亮模式。
2. **Luminance**
   - 用于色彩分析或为生成渐变颜色提供基础。
3. **Contrast**
   - 用于设计界面时确保文字和背景之间的可读性。
