/**
 * 在原生 JavaScript 中，input 事件监听器是处理用户输入的常见方式。然而，由于中文输入法（如拼音输入法）会涉及候选词的选择，因此在中文输入时，input 事件可能在用户选择候选词之前触发，导致输入处理不完整。为了解决这个问题，可以利用合成事件（通过 compositionstart、compositionupdate 和 compositionend 事件）与 input 事件的结合来确保完整的输入内容被正确处理。
 *
 * 利用合成事件追踪输入法的组合状态：
 * 1. compositionstart: 当用户开始使用输入法输入时触发
 * 2. compositionupdate: 当输入法的组合文字更新时触发
 * 3. compositionend: 当用户完成输入法输入（选择候选词）时触发
 * 4. 使用 composing 标志来追踪当前是否正在进行输入法输入
 */

/**
 * handle input event with composition events
 * @param inputEl input element
 * @param callback callback
 */
function addInputListener(
	inputEl: string | HTMLInputElement,
	callback: (value: string, event: Event) => void
) {
	const $el = (
		typeof inputEl === 'string' ? document.querySelector(inputEl) : inputEl
	) as HTMLInputElement

	if (!$el) throw new Error('Element not found')

	// 是否正在进行合成输入
	let composing = false

	// 处理值的变化
	function handleValueChange(e: Event) {
		if (composing) return
		callback.call($el, $el.value, e)
	}
	function handleStart() {
		composing = true
	}
	function handleEnd(e: Event) {
		composing = false
		handleValueChange(e)
	}

	// 处理合成输入开始
	$el.addEventListener('compositionstart', handleStart)
	// 处理合成输入结束
	$el.addEventListener('compositionend', handleEnd)
	// 处理输入事件
	$el.addEventListener('input', handleValueChange)

	return () => {
		$el.removeEventListener('compositionstart', handleStart)
		$el.removeEventListener('compositionend', handleEnd)
		$el.removeEventListener('input', handleValueChange)
	}
}

export default addInputListener
