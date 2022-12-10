
const keywords = ['_scope', '_exclude', '_alias', '_pipe', '_endpoint']

/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

/**
 * JSONP deep copy
 */

function deepCopy (obj) {
	return JSON.parse(JSON.stringify(obj))
}

/**
 * Cluster object normalization
 *
 * Params type
 * -----------
 * name: String
 * value: Everything
 * subset: Array | Object
 * scope: Array | Object
 *
 * Object style { <name>: { <name>: <value>, _scope: <scope>, <subset...> }}
 * Array style [<String:name>, <Everything:value>, <Object:subset>, <Object:scope>]
 *
 * Hybrid style { a: [value, [{ b }, ['b', b]], [scope]] }
 */
function normalize (object, name) {

	if (typeof object !== 'object') {
		let name = object,
				value = object
		if (typeof object === 'function') name = object.name

		object = {}
		object[name] = value
		return object
	} else if (!Array.isArray(object)) {
		if (object._scope) object._scope = [, object._scope]
		object = [name, object[name], object]
	}

	name = name || undefined
	let value = undefined,
			subset = [],
			scope = []

	if (Array.isArray(object[0])) object = [name, value].concat([object]) // [[subset]]
	else if (typeof object[0] !== 'string') object.unshift(name) // [value, [subset]]

	name = object[0]
	value = object[1]
	subset = object[2]
	scope = object[3] || {}

	if (typeof subset !== 'object') subset = normalize(subset)
	else if (Array.isArray(subset)) {
		let ss = {}
		subset.forEach((item, key) => {
			let n = item
			if (typeof item === 'function') n = item.name
			else if (Array.isArray(item)) {
				n = item[0]
				if (item.length > 2) item = normalize(item.splice(1), n)[n]
				else if (item.length === 2) item = item[1]
				else if (item.length === 1) item = item[0]
			}
			ss[n] = item
		})
	
		subset = ss
	}

	forEachValue(subset, (value, key) => {
		if (Array.isArray(value) || typeof value === 'object')
			subset[key] = normalize(value, key)[key]
	})

	if (Array.isArray(scope))
		scope = normalize([undefined, scope], '_scope')['_scope']

	forEachValue(scope, (value, key) => {
		if (Array.isArray(value))
			scope[key] = normalize(value, key)[key]
	})

	object = {}
	object[name] = subset
	if (Object.keys(scope).length > 0)
		object[name]['_scope'] = scope
	if (value != undefined || value != null)
		object[name][name] = value
	
	return object
}

/* Constructor
 * Makes functions to work
 */
let latest = {}, stack = []
function Constructor (fn, object) {

	if (fn._constructed === true) return fn

	function handler () {

		if (typeof fn !== 'function') {
			fn = function () { return 'fnf' }
		}

		let args = Array.from(arguments),
				preHook = function () {},
				postHook = function () {}

		args.forEach((item, ai) => {
			if (typeof item !== 'function') return
			else if (item.name === 'pre') preHook = item
			else if (item.name === 'post') postHook = item
			else return
			args = args.splice(0, ai).concat(args.splice(ai + 1))
		})

		preHook(latest, stack)

		let reply = {},
				config = {},
				value = fn(args, latest, stack, globalOptions)

		if (value !== undefined && value.value !== undefined) {
			config = value
			value = value.value
		}

		latest = { fn, value, args, name: fn.name }
		stack.unshift(latest)

		postHook(latest, stack)

		forEachValue(object, (item, key) => {
			if (fn.name === key) return
			else if (!item || !!~keywords.indexOf(key)) return
			else if (typeof item === 'function') item = Constructor(item, {})
			else if (typeof item === 'object') item = Clustr(item, key)
			reply[key] = item
		})

		if (fn._pipe) reply[fn.name] = Constructor(fn, object)

		return fn._endpoint || Object.keys(reply).length < 1 ?
			value : Object.assign(reply, { value })
	}

	handler._constructed = true

	return handler
}

/**
 * object propagation (apply scope, alias etc.)
 */
function propagation (object, stack, name) {
	stack = stack || {}
	let obj = {}

	stack = Object.assign(stack, object._scope || {})
	let excluded = (object._exclude || '').split(' ')

	/* exclude scopes */
	function resolveStack (stack, excluded) {
		let st = {}
		forEachValue(stack, (item, key) => {
			if (!!~excluded.indexOf(key)) return
			if (typeof item === 'object') {
				item = resolveStack(item, excluded)
				item = Clustr(item, key)
			}
			st[key] = item
		})
		return st
	}

	stack = resolveStack(stack, excluded)

	obj = Object.assign(obj, stack)

	forEachValue(object, (item, key) => {
		if (!item || !!~keywords.indexOf(key)) return

		obj[key] = typeof item === 'object' ? propagation(item, stack, key) : item

		/* Apply aliases */
		let aliases = (item._alias || '').split(' ')
		aliases.forEach(alias => {
			if(alias.length < 1 || key === alias) return
			obj[alias] = obj[key]
		})

		if (typeof obj[key] === 'function') {
			/* Available scopes in functions */
			if (key === name) return
			let excluded = (obj[key]._exclude || '').split(' ')
			let st = resolveStack(stack, excluded)
			let fn = obj[key]
			obj[key] = Object.assign({}, fn, st)
			obj[key][key] = fn
		}
	})

	return obj
}


/**
 * Clustr main function
 */
function Clustr (object, name) {
	if (object._mapped === true) return object
	else if (typeof object === 'function') return Constructor(object, {})
	else if (typeof object !== 'object') return object

	let Construct = {},
			self = object[name]

	/* merge self subset */
	if (typeof self === 'object')
		object = Object.assign(object, Clustr(self, name))
	
	else if (typeof self === 'function')
		Construct = Constructor(self, object)

	/* wrap single value */
	else Construct = eval(`Constructor(function ${name} () { return self }, object)`)

	forEachValue(object, (item, key) => {
		if (name === key) return
		Construct[key] = Clustr(item, key)
	})

	Construct._mapped = true
	return Construct
}

function globalOptions () {
	return {
		_resetStack () {
			stack = []
		},
		_stack () { return stack },
		_latest () { return latest },
	}
}


function init (name, object) {
	if (typeof object !== 'object') return object
	stack = []; latest = {}
	// object = normalize(object, name)[name]
	object = propagation(object, [], name)
	return Object.assign(Clustr(object, name), globalOptions())
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = init
} else {
	if (typeof define === 'function' && define.amd) {
		define([], () => init)
	} else { window.clustr = init }
}
