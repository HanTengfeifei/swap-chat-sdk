export function addEvent(ele, type, handle) {
  if (Object.prototype.hasOwnProperty.call(ele, "addEventListener")) {
    ele.addEventListener(type, handle, false);
  } else if (Object.prototype.hasOwnProperty.call(ele, "attachEvent")) {
    ele.attachEvent("on" + type, function () {
      handle.call(ele);
    });
  } else {
    ele["on" + type] = handle;
  }
}
export function isDOM() {
  return typeof HTMLElement === "object"
    ? function (obj) {
        return obj instanceof HTMLElement;
      }
    : function (obj) {
        return (
          obj &&
          typeof obj === "object" &&
          obj.nodeType === 1 &&
          typeof obj.nodeName === "string"
        );
      };
}
export const createElement = (htmlTemplate = "") => {
  const div = document.createElement("div");
  div.innerHTML = htmlTemplate;
  return div.childNodes[0];
};
export const getElementById = (className = "") => {
  if (typeof className !== "string") {
    return;
  }
  return document.getElementById(className);
};
export const isObj = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};
//工具函数
export function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source) {
    if (isPlainObject(target) && isPlainObject(source)) {
      return merge(target, source);
    } else if (isPlainObject(source)) {
      return merge({}, source);
    } else if (isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  const mergeMap = {
    plafom: valueFromConfig2,
    user: valueFromConfig2,
    friend: valueFromConfig2,
    space: defaultToConfig2,
  };

  forEach(
    Object.keys(config1).concat(Object.keys(config2)),
    function computeConfigValue(prop) {
      const merge = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge(prop);
      (isUndefined(configValue) && merge !== mergeDirectKeys) ||
        (config[prop] = configValue);
    }
  );

  return config;
}
export function typeOfTest(type) {
  return (thing) => {
    return typeof thing === type;
  };
}
export const isUndefined = typeOfTest("undefined");
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
export function forEach(obj, fn, { allOwnKeys = false } = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === "undefined") {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== "object") {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys
      ? Object.getOwnPropertyNames(obj)
      : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
export const kindOf = ((cache) => {
  // eslint-disable-next-line func-names
  return (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));
export function isPlainObject(val) {
  if (kindOf(val) !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
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
export function merge(/* obj1, obj2, obj3, ... */) {
  const result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
export function isArray(val) {
  return Array.isArray(val);
}
