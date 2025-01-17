import {
	isString,
	isNumber,
	isBoolean,
	isArray,
	isFunction,
	isUndefined,
	isNull,
	isSymbol,
	isBigInt,
	isObject,
	isPlainObject,
	isNil,
	isEmpty,
	isInvalid,
	isType,
} from '../type'

describe('Type Checking Functions', () => {
	test('isString', () => {
		expect(isString('hello')).toBe(true)
		expect(isString(123)).toBe(false)
	})

	test('isNumber', () => {
		expect(isNumber(123)).toBe(true)
		expect(isNumber('123')).toBe(false)
	})

	test('isBoolean', () => {
		expect(isBoolean(true)).toBe(true)
		expect(isBoolean('true')).toBe(false)
	})

	test('isArray', () => {
		expect(isArray([1, 2, 3])).toBe(true)
		expect(isArray({})).toBe(false)
	})

	test('isFunction', () => {
		expect(isFunction(() => {})).toBe(true)
		expect(isFunction({})).toBe(false)
	})

	test('isUndefined', () => {
		expect(isUndefined(undefined)).toBe(true)
		expect(isUndefined(null)).toBe(false)
	})

	test('isNull', () => {
		expect(isNull(null)).toBe(true)
		expect(isNull(undefined)).toBe(false)
	})

	test('isSymbol', () => {
		expect(isSymbol(Symbol())).toBe(true)
		expect(isSymbol('symbol')).toBe(false)
	})

	test('isBigInt', () => {
		expect(isBigInt(BigInt(123))).toBe(true)
		expect(isBigInt(123)).toBe(false)
	})

	test('isObject', () => {
		expect(isObject({})).toBe(true)
		expect(isObject(null)).toBe(false)
	})

	test('isPlainObject', () => {
		expect(isPlainObject({})).toBe(true)
		expect(isPlainObject([])).toBe(false)
	})

	test('isNil', () => {
		expect(isNil(null)).toBe(true)
		expect(isNil(undefined)).toBe(true)
		expect(isNil(0)).toBe(false)
	})

	test('isEmpty', () => {
		expect(isEmpty(null)).toBe(true)
		expect(isEmpty(undefined)).toBe(true)
		expect(isEmpty('')).toBe(true)
		expect(isEmpty([])).toBe(true)
		expect(isEmpty({})).toBe(true)
		expect(isEmpty('hello')).toBe(false)
		expect(isEmpty([1, 2, 3])).toBe(false)
		expect(isEmpty({ key: 'value' })).toBe(false)
	})

	test('isInvalid', () => {
		expect(isInvalid(null)).toBe(true)
		expect(isInvalid(undefined)).toBe(true)
		expect(isInvalid(NaN)).toBe(true)
		expect(isInvalid(0)).toBe(false)
		expect(isInvalid('')).toBe(false)
	})

	test('isType', () => {
		expect(isType('string')).toBe('string')
		expect(isType({})).toBe('object')
		expect(isType(new Date())).toBe('date')
		expect(isType('hello', 'string')).toBe(true)
		expect(isType(123, 'number')).toBe(true)
		expect(isType(true, 'boolean')).toBe(true)
	})
})
