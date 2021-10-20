
var DEBUG = true;
var htmlNS = "http://www.w3.org/1999/xhtml";
var svgNS = "http://www.w3.org/2000/svg";

namespace Core
{
    export interface HashTable<T> {
        [key: string]: T;
    }

    export class Util
    {
        static clone(obj : object)
        {
            if(obj === undefined)
                return undefined;
            if(obj === null || typeof(obj) !== 'object')
                return null;
            var clone = {};
            for(var prop in obj)
                clone[prop] = obj[prop];
            return clone;
        }

        static encodeURIQuery(obj : any) : string
        {
            // encode arguments
            let args = '';

            let encodeArg = (arg: string, value: any) => {
                if((typeof(value) !== 'number') && (typeof(value) !== 'string') &&  (typeof(value) !== 'boolean') && (typeof(value) !== 'object'))
                    return;
                if (args !== '')
                    args += '&';
                args += encodeURIComponent(arg)+'=';
                if(typeof(value) === 'object')
                    args += encodeURIComponent(JSON.stringify(value));
                else
                    args += encodeURIComponent(value);
            };

            if((obj !== undefined) && (obj !== null)) {
                for(let prop in obj) {
                    let propValue = obj[prop];
                    if (propValue instanceof Array) {
                        for (let value of (propValue as Array<any>))
                            encodeArg(prop, value);
                    }
                    else
                        encodeArg(prop, propValue);
                }
            }
            return args;
        }

        static utf8Encode(value: string) : string
        {
            var res = '';
            for(var i = 0; i < value.length; i++) {
                var c = value.charCodeAt(i);
                if(c < 128)
                    res += String.fromCharCode(c);
                else if((c >= 128) && (c < 2048)) {
                    res += String.fromCharCode((c >> 6) | 192);
                    res += String.fromCharCode((c & 63) | 128);
                }
                else {
                    res += String.fromCharCode((c >> 12) | 224);
                    res += String.fromCharCode(((c >> 6) & 63) | 128);
                    res += String.fromCharCode((c & 63) | 128);
                }
            }
            return res;
        }

        static utf8Decode(value: string) : string
        {
            let res = '';
            let i = 0;
            let c;
            while(i < value.length) {
                c = value.charCodeAt(i++);
                if(c < 128)
                    res += String.fromCharCode(c);
                else if((c >= 192) && (c < 224))
                    res += String.fromCharCode(((c & 31) << 6) | (value.charCodeAt(i++) & 63));
                else
                    res += String.fromCharCode(((c & 15) << 12) | ((value.charCodeAt(i++) & 63) << 6) | (value.charCodeAt(i++) & 63));
            }
            return res;
        }

        static toBase64(stringValue: string) : string
        {
            let val1; let val2; let val3;
            let enc1; let enc2; let enc3; let enc4;
            let value = Util.utf8Encode(stringValue);
            let code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            let res = '';
            let i = 0;
            while (i + 2 < value.length)
            {
                val1 = value.charCodeAt(i++) & 0xff;
                val2 = value.charCodeAt(i++) & 0xff;
                val3 = value.charCodeAt(i++) & 0xff;
                enc1 = code.charAt(val1 >> 2);
                enc2 = code.charAt(((val1 & 3) << 4) | (val2 >> 4));
                enc3 = code.charAt(((val2 & 15) << 2) | (val3 >> 6));
                enc4 = code.charAt(val3 & 63);
                res += enc1+enc2+enc3+enc4;
            }
            // 2 bytes
            if (i + 1 < value.length)
            {
                val1 = value.charCodeAt(i++) & 0xff;
                val2 = value.charCodeAt(i++) & 0xff;
                enc1 = code.charAt(val1 >> 2);
                enc2 = code.charAt(((val1 & 3) << 4) | (val2 >> 4));
                enc3 = code.charAt((val2 & 15) << 2);
                res += enc1+enc2+enc3+'=';
            }
            // 1 byte
            else if (i < value.length)
            {
                val1 = value.charCodeAt(i++) & 0xff;
                enc1 = code.charAt(val1 >> 2);
                enc2 = code.charAt((val1 & 3) << 4);
                res += enc1+enc2+'==';
            }
            return res;
        }

        static fromBase64(value: string) : string
        {
            let char1; let char2; let char3;
            let enc1; let enc2; let enc3; let enc4;
            let code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            let res = '';
            let i = 0;
            while (i < value.length)
            {
                enc1 = code.indexOf(value.charAt(i++));
                enc2 = code.indexOf(value.charAt(i++));
                enc3 = code.indexOf(value.charAt(i++));
                enc4 = code.indexOf(value.charAt(i++));

                char1 = (enc1 << 2) | (enc2 >> 4);
                char2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                char3 = ((enc3 & 3) << 6) | enc4;

                res += String.fromCharCode(char1);
                if(enc3 !== 64) {
                    res += String.fromCharCode(char2);
                    if(enc4 !== 64)
                        res += String.fromCharCode(char3);
                }
            }
            return Util.utf8Decode(res);
        }

        static toNoDiacritics(value : string) : string
        {
          return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
    }

    export class Navigator
    {
        static isGecko: boolean = (navigator.userAgent.match(/Gecko\//i) !== null);
        static isWebkit: boolean = (navigator.userAgent.match(/WebKit\//i) !== null);

        static isIE: boolean = (navigator.userAgent.match(/MSIE/i) !== null) || (navigator.userAgent.match(/Trident/i) !== null);

        static isOpera: boolean =  ((navigator.userAgent === undefined) || (navigator.userAgent.match(/Opera\//i) !== null));

        static isChrome: boolean = (navigator.userAgent.match(/ Chrome\//) !== null);

        static isSafari: boolean = (navigator.userAgent.match(/ Safari\//) !== null);

        static isFirefox: boolean = (navigator.userAgent.match(/ Firefox\//) !== null);

        static iPad: boolean = (navigator.userAgent.match(/iPad/i) !== null);
        static iPhone: boolean = (navigator.userAgent.match(/iPhone/i) !== null);
        static iOs: boolean = Navigator.iPad || Navigator.iPhone;

        static Android: boolean = (navigator.userAgent.match(/Android/i) !== null);

        static supportSVG: boolean = true;
        static supportCanvas: boolean = true;
        static supportRgba: boolean = true;
        static supportRgb: boolean = true;
        static supportWebP: boolean = true;

        static supportFormData: boolean = true;
        static supportFileAPI: boolean = true;
        static supportUploadDirectory: boolean = false;
    }
}

(function() {
    let test;
    Core.Navigator.supportSVG = false;
    try {
        test = document.createElementNS(svgNS, 'g');
        if('ownerSVGElement' in test)
            Core.Navigator.supportSVG = true;
    } catch(e) {}

    test = document.createElement('canvas');
    Core.Navigator.supportCanvas = 'getContext' in test;

    Core.Navigator.supportRgba = true;
    Core.Navigator.supportRgb = true;
    test = document.createElement('div');
    try {
        test.style.background = 'rgba(0, 0, 0, 0.5)';
    } catch(e) {
        Core.Navigator.supportRgba = false;
    }
    try {
        test.style.background = 'rgb(0, 0, 0)';
    } catch(e) {
        Core.Navigator.supportRgb = false;
    }

    try {
        new FormData();
    }
    catch(err) {
        Core.Navigator.supportFormData = false;
    }
    let testInput = document.createElement('input');
    Core.Navigator.supportFileAPI = 'files' in testInput;
    Core.Navigator.supportUploadDirectory = 'webkitdirectory' in testInput;


    let testCanvas = document.createElement('canvas');
    if (!!(testCanvas.getContext && testCanvas.getContext('2d'))) {
        // was able or not to get WebP representation
        Core.Navigator.supportWebP = testCanvas.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }
    else 
        Core.Navigator.supportWebP = false;
})();

// provide polyfill Object.assign if needed
if (Object.assign == undefined) {
    Object.assign = function() {
        var target = arguments[0];
        var i; var key;
        for (i = 1; i < arguments.length; i++) {
            for (key in arguments[i]) {
                target[key] = arguments[i][key];
            }
        }
        return target;
    }
}

// Polyfill for Promise
(function () { 'use strict';

var promiseFinally = function(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
};

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  this._state = 0;
  this._handled = false;
  this._value = undefined;
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  (Promise as any)._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    (Promise as any)._immediateFn(function() {
      if (!self._handled) {
        (Promise as any)._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

//
// Take a potentially misbehaving resolver function and make sure
// onFulfilled and onRejected are only called once.
//
// Makes no guarantees about asynchrony.
//
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = promiseFinally;

(Promise as any).all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

(Promise as any).resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

(Promise as any).reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

(Promise as any).race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
(Promise as any)._immediateFn =
  (window as any).setImmediate && (typeof((window as any).setImmediate) === 'function') ? function(fn) { (window as any).setImmediate(fn); } : function(fn) { setTimeoutFunc(fn, 0); };

(Promise as any)._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

if (!(window as any).Promise)
  (window as any).Promise = Promise;
})();


// Provide a polyfill for findIndex
// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
      if (this == null)
        throw new TypeError('"this" is null or not defined');
      var o = Object(this);
      var len = o.length >>> 0;
      if (typeof predicate !== 'function')
        throw new TypeError('predicate must be a function');
      var thisArg = arguments[1];
      var k = 0;
      while (k < len) {
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o))
          return k;
        k++;
      }
      return -1;
    },
    configurable: true,
    writable: true
  });
}

// Provide a polyfill for Array.find
if (!Array.prototype.find) {
  (Array.prototype as any).find = function(callback, thisArg) {
    thisArg = thisArg ? thisArg : window;
    let i = 0;
    for (let item of this) {
      if (callback.call(thisArg, item, i, this))
        return item;
    }
    return undefined;
  };
}

// Provide a polyfill for Array.from
// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Référence : https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) { 
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) { 
      var number = Number(value); 
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number)); 
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) { 
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    }; 
    return function from(arrayLike/*, mapFn, thisArg */) { 
      var C = this;
      var items = Object(arrayLike); 
      if (arrayLike == null)
        throw new TypeError("Array.from doit utiliser un objet semblable à un tableau - null ou undefined ne peuvent pas être utilisés");
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {  
        if (!isCallable(mapFn))
          throw new TypeError('Array.from: lorsqu il est utilisé le deuxième argument doit être une fonction'); 
        if (arguments.length > 2)
          T = arguments[2];
      }
      var len = toLength(items.length);  
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);
      var k = 0;
      var kValue;
      while (k < len) {
        kValue = items[k]; 
        if (mapFn)
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k); 
        else
          A[k] = kValue;
        k += 1;
      }
      A.length = len;
      return A;
    };
  }());
}

// Production steps / ECMA-262, Edition 5, 15.4.4.19
// Référence : https://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

  Array.prototype.map = function(callback /*, thisArg*/) {
    var T, A, k;
    if (this == null)
      throw new TypeError(' this est null ou non défini');
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== 'function')
      throw new TypeError(callback + ' n est pas une fonction');
    if (arguments.length > 1)
      T = arguments[1];
    A = new Array(len);
    k = 0;
    while (k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[k];
        mappedValue = callback.call(T, kValue, k, O);
        A[k] = mappedValue;
      }
      k++;
    }
    return A;
  };
}

// Provide a polyfill for Array.keys
if (!Array.prototype.keys) {
  (Array.prototype as any).keys = function() {
    let i = 0;
    let res = [];
    for (let item of this) {
      res.push(i++);
    }
    return res;
  };
}


// Provide a polyfill for log10
if (!Math.log10) {
  Math.log10 = function(x) {
    return Math.log(x) * Math.LOG10E;
  };
}

// Provide a polyfill
if (!(window as any).ResizeObserver) {
    if ((<any>window).MutationObserver) {
        // @ts-ignore
        function EmuResizeObserver(callback: () => void) {
            // @ts-ignore
            this.callback = callback;
            this.observe = function(element: HTMLElement) {
                if (this.elements == undefined)
                    this.elements = [];
                let data = {
                    element: element,
                    width: 0, height: 0,
                }
                let observer = new MutationObserver(() => {
                    if ((data.width != data.element.offsetWidth) || (data.height != data.element.offsetHeight)) {
                        data.width = data.element.offsetWidth;
                        data.height = data.element.offsetHeight;
                        this.callback();
                    }
                });
                observer.observe(element, {
                    attributes: true
                });
            }
            this.disconnect = function() {};
            this.unobserve = function(target: Element) {};
        };
        (window as any).ResizeObserver = EmuResizeObserver;
    }
}
