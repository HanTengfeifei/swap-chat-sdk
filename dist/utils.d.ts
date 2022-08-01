export function addEvent(ele: any, type: any, handle: any): void;
export function isDOM(): (obj: any) => any;
export function mergeConfig(config1: any, config2: any): {};
export function typeOfTest(type: any): (thing: any) => boolean;
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {void}
 */
export function forEach(obj: Object | any[], fn: Function, { allOwnKeys }?: boolean | undefined): void;
export function isPlainObject(val: any): boolean;
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
export function merge(...args: any[]): Object;
export function isArray(val: any): boolean;
export function createElement(htmlTemplate?: string): ChildNode;
export function getElementById(className?: string): HTMLElement | null | undefined;
export function isObj(obj: any): boolean;
export function isUndefined(thing: any): boolean;
export function kindOf(thing: any): any;
