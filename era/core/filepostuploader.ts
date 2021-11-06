namespace Core {
    export interface FilePostUploaderInit {
        method?: string;
        headers?: object;
        file?: File;
        field?: string;
        service?: string;
        destination?: string;
        arguments?: object;
        onprogress?: (event: { target: FilePostUploader, loaded: number, total: number }) => void;
        oncompleted?: (event: { target: FilePostUploader }) => void;
        onerror?: (event: { target: FilePostUploader, status: number }) => void;
    }

    export class FilePostUploader extends Object {
        _headers: object;
        protected _file: File;
        protected _service: string;
        protected request: XMLHttpRequest | undefined;
        protected _responseText: string;
        protected _method: string = 'POST';
        protected formData: FormData;
        protected _isCompleted: boolean = false;
        protected _isSent: boolean = false;
        protected _lastStatus: number | undefined;
        protected field: string = 'file';

        protected loadedOctets: number;
        protected totalOctets: number;

        /**
         * Fires when each time upload progress, usefull to create a upload progress bar
         * @name Core.FilePostUploader#progress
         * @event
         * @param {Core.FilePostUploader} uploader The uploader itself
         * @param {number} loaded Amount of bytes loaded
         * @param {number} total Total amount of bytes to load
         */
        readonly progress = new Core.Events<{ target: FilePostUploader, loaded: number, total: number }>();
        set onprogress(value: (event: { target: FilePostUploader, loaded: number, total: number }) => void) { this.progress.connect(value); }

        /**
        * Fires when upload request got status == 200
        * @name Core.FilePostUploader#complete
        * @event
        * @param {Core.FilePostUploader} uploader The uploader itself
        */
        readonly completed = new Core.Events<{ target: FilePostUploader }>();
        set oncompleted(value: (event: { target: FilePostUploader }) => void) { this.completed.connect(value); }

        /**
        * Fires when upload request got status != 200 or when there is a error while reading the file
        * @name Core.FilePostUploader#complete
        * @event
        * @param {Core.FilePostUploader} uploader The uploader itself
        */
        readonly error = new Core.Events<{ target: FilePostUploader, status: number }>();
        set onerror(value: (event: { target: FilePostUploader, status: number }) => void) { this.error.connect(value); }

        /**
        *	@constructs
        *	@class Helper to allow file uploading with progress report and which
        * use the best technic (FileApi, FormData, input tag) depending on the browser capabilities.
        *	@extends Core.Object
        */
        constructor(init?: FilePostUploaderInit) {
            super();
            this.formData = new FormData();
            if (init) {
                if (init.method !== undefined)
                    this.method = init.method;
                if (init.headers !== undefined)
                    this.headers = init.headers;
                if (init.file !== undefined)
                    this.file = init.file;
                if (init.field !== undefined)
                    this.field = init.field;
                if (init.service !== undefined)
                    this.service = init.service;
                if (init.destination !== undefined)
                    this.destination = init.destination;
                if (init.arguments !== undefined)
                    this.arguments = init.arguments;
                if (init.onprogress)
                    this.progress.connect(init.onprogress);
                if (init.oncompleted)
                    this.completed.connect(init.oncompleted);
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

        setRequestHeader(header: string, value: string) {
            if (this.headers === undefined)
                this.headers = {};
            this.headers[header] = value;
        }

        set method(method: string) {
            this._method = method;
        }

        get file(): File {
            return this._file;
        }

        set file(file: File) {
            this._file = file;
        }

        set service(service: string) {
            this._service = service;
        }

        setField(name: string, value: string | Blob, fileName?: string) {
            this.formData.set(name, value, fileName)
        }

        appendField(name: string, value: string | Blob, fileName?: string) {
            this.formData.append(name, value, fileName)
        }

        deleteField(name: string) {
            this.formData.delete(name);
        }

        set arguments(args: object) {
            for (const key in args) {
                if (Array.isArray(args[key])) {
                    for (const data of args[key]) {
                        this.formData.append(key, data);
                    }
                } else {
                    this.formData.append(key, args[key]);
                }
            }
        }

        set destination(destination: string) {
            this.setField('destination', destination);
        }

        //
        // Send the file
        //
        send() {
            this._isSent = true;
            if (this._file)
                this.formData.append(this.field, this._file);

            this.request = new XMLHttpRequest();
            if ('upload' in this.request)
                this.request.upload.addEventListener('progress', e => this.onUpdateProgress(e));
            this.request.open(this._method, this._service);
            if (this.headers !== undefined) {
                for (let header in this.headers)
                    this.request.setRequestHeader(header, this.headers[header]);
            }
            this.request.send(this.formData);
            this.request.onreadystatechange = (event) => this.onStateChange(event);
        }

        get status(): number {
            return this.request ? this.request.status : (this._lastStatus??-1);
        }

        sendAsync() {
            return new Promise<Core.FilePostUploader>(resolve => {
                this.completed.connect(() => resolve(this));
                this.error.connect(() => resolve(this));
                this.send();
            });
        }

        waitAsync() {
            return new Promise<Core.FilePostUploader>(resolve => {
                if (this.isCompleted)
                    resolve(this);
                else {
                    this.completed.connect(() => resolve(this));
                    if (!this._isSent)
                        this.send();
                }
            });
        }

        abort() {
            if (this.request !== undefined) {
                this.request.abort();
                this.request = undefined;
            }
        }

        get responseText(): string {
            return this._responseText;
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

        get isCompleted(): boolean {
            return this._isCompleted;
        }

        get total(): number {
            return this.totalOctets;
        }

        get loaded(): number {
            return this.loadedOctets;
        }

        protected onStateChange(event) {
            this._lastStatus = this.request!.status;
            if (this.request!.readyState == 4) {
                this._isCompleted = true;
                if (this.request!.status == 200) {
                    this._responseText = this.request!.responseText;
                    this.completed.fire({ target: this });
                }
                else {
                    this._responseText = this.request!.responseText;
                    this.error.fire({ target: this, status: this.request!.status });
                }
                this.request = undefined;
            }
        }

        protected onUpdateProgress(event) {
            this.loadedOctets = event.loaded;
            this.totalOctets = event.total;
            this.progress.fire({ target: this, loaded: event.loaded, total: event.total });
        }
    }
}
