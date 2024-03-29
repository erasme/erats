module Core {
    export type MethodType = 'POST' | 'PUT' | 'GET' | 'DELETE';

    export interface HttpRequestInit {
        url?: string;
        method?: MethodType;
        binary?: boolean;
        arguments?: object;
        content?: any;
        headers?: object;
        onerror?: (event: { target: HttpRequest, code: number }) => void;
        ondone?: (event: { target: HttpRequest }) => void;
    }

    export class HttpRequest extends Object {
        url: string | null = null;
        method: MethodType = 'GET';
        binary: boolean = false;
        arguments: object | undefined;
        content: any = undefined;
        _headers: object;
        private request: XMLHttpRequest;
        static requestHeaders: object | undefined = undefined;
        readonly error = new Core.Events<{ target: HttpRequest, code: number }>();
        set onerror(value: (event: { target: HttpRequest, code: number }) => void) { this.error.connect(value); }

        readonly done = new Core.Events<{ target: HttpRequest }>();
        set ondone(value: (event: { target: HttpRequest }) => void) { this.done.connect(value); }

        constructor(init?: HttpRequestInit) {
            super();
            this.request = new XMLHttpRequest();

            let wrapper = () => {
                if (this.request.readyState == 4) {
                    if ((this.request.status >= 200) && (this.request.status < 300))
                        this.done.fire({ target: this });
                    else
                        this.error.fire({ target: this, code: this.request.status });
                }
            };
            this.request.onreadystatechange = wrapper;
            if (init) {
                if (init.url !== undefined)
                    this.url = init.url;
                if (init.method !== undefined)
                    this.method = init.method;
                if (init.binary !== undefined)
                    this.binary = init.binary;
                if (init.arguments !== undefined)
                    this.arguments = init.arguments;
                if (init.content !== undefined)
                    this.content = init.content;
                if (init.headers !== undefined)
                    this.headers = init.headers;
                if (init.ondone)
                    this.done.connect(init.ondone);
                if (init.onerror)
                    this.error.connect(init.onerror);
            }
        }

        set headers(headers: object) {
            this._headers = Core.Util.clone(headers) as object;
        }

        get headers(): object {
            return this._headers;
        }

        setRequestHeader(header, value) {
            if (this.headers === undefined)
                this.headers = {};
            this.headers[header] = value;
        }

        addArgument(argName, argValue) {
            if (this.arguments === undefined)
                this.arguments = {};
            this.arguments[argName] = argValue;
        }

        abort() {
            this.request.abort();
        }

        send() {
            if (this.url == undefined)
                throw ('url MUST be given for an HttpRequest');
            let header;
            // encode arguments
            let args = '';
            if (this.arguments !== undefined)
                args = Util.encodeURIQuery(this.arguments);
            let url = this.url;

            if (((this.method === 'GET') || (this.method === 'DELETE') || (this.content !== undefined)) && (args !== '')) {
                if (this.url.indexOf('?') === -1)
                    url += '?' + args;
                else
                    url += '&' + args;
            }
            this.request.open(this.method, url, true);
            if (this.binary)
                this.request.overrideMimeType('text/plain; charset=x-user-defined');
            if (HttpRequest.requestHeaders !== undefined) {
                for (header in HttpRequest.requestHeaders)
                    this.request.setRequestHeader(header, HttpRequest.requestHeaders[header]);
            }
            if (this.headers !== undefined) {
                for (header in this.headers)
                    this.request.setRequestHeader(header, this.headers[header]);
            }
            if (this.content !== undefined) {
                if ((this.headers === undefined) || (this.headers["Content-Type"] === undefined))
                    this.request.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
                this.request.send(this.content);
            }
            else if ((args !== '') && ((this.method === 'POST') || (this.method === 'PUT'))) {
                if ((this.headers === undefined) || (this.headers["Content-Type"] === undefined))
                    this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                this.request.send(args);
            }
            else
                this.request.send();
        }

        sendAsync() {
            return new Promise<Core.HttpRequest>(resolve => {
                this.done.connect(() => resolve(this));
                this.error.connect(() => resolve(this));
                this.send();
            });
        }

        waitAsync() {
            return new Promise<Core.HttpRequest>(resolve => {
                this.done.connect(() => resolve(this));
                this.error.connect(() => resolve(this));
            });
        }

        getResponseHeader(header: string) {
            return this.request.getResponseHeader(header);
        }

        get responseType() {
            return this.request.responseType;
        }

        set responseType(value) {
            this.request.responseType = value;
        }

        get response(): any {
            return this.request.response;
        }

        get responseText(): string {
            return this.request.responseText;
        }

        get responseBase64(): string {
            return Util.toBase64(this.request.responseText);
        }

        get responseJSON(): any {
            let res;
            try {
                res = JSON.parse(this.responseText);
            }
            catch (err) {
                res = undefined;
            }
            return res;
        }

        get responseXML(): Document {
            let parser = new DOMParser();
            try {
                let xmlDoc = parser.parseFromString(this.responseText, 'text/xml');
                return xmlDoc;
            } catch (e) { }
            return parser.parseFromString('', 'text/xml');
        }

        get status(): number {
            return this.request.status;
        }

        static setRequestHeader(header, value) {
            if (HttpRequest.requestHeaders === undefined)
                HttpRequest.requestHeaders = {};
            HttpRequest.requestHeaders[header] = value;
        }
    }
}
