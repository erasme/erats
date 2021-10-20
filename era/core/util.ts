
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

        static isOpera: boolean =  ((navigator.userAgent === undefined) || (navigator.userAgent.match(/Opera\//i) !== null));

        static isChrome: boolean = (navigator.userAgent.match(/ Chrome\//) !== null);

        static isSafari: boolean = (navigator.userAgent.match(/ Safari\//) !== null);

        static isFirefox: boolean = (navigator.userAgent.match(/ Firefox\//) !== null);

        static iPad: boolean = (navigator.userAgent.match(/iPad/i) !== null);
        static iPhone: boolean = (navigator.userAgent.match(/iPhone/i) !== null);
        static iOs: boolean = Navigator.iPad || Navigator.iPhone;

        static Android: boolean = (navigator.userAgent.match(/Android/i) !== null);

        static supportWebP: boolean = true;
    }
}

(function() {
    let testCanvas = document.createElement('canvas');
    if (!!(testCanvas.getContext && testCanvas.getContext('2d'))) {
        // was able or not to get WebP representation
        Core.Navigator.supportWebP = testCanvas.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }
    else
        Core.Navigator.supportWebP = false;
})();

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
