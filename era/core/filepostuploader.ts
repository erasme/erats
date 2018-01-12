namespace Core {
	export interface FilePostUploaderInit {
		method?: string;
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
		/**
		 * Fires when each time upload progress, usefull to create a upload progress bar
		 * @name Core.FilePostUploader#progress
		 * @event
		 * @param {Core.FilePostUploader} uploader The uploader itself
		 * @param {number} loaded Amount of bytes loaded
		 * @param {number} total Total amount of bytes to load
		 */
		/**
		 * Fires when upload request got status == 200
		 * @name Core.FilePostUploader#complete
		 * @event
		 * @param {Core.FilePostUploader} uploader The uploader itself
		 */
		/**
		 * Fires when upload request got status != 200 or when there is a error while reading the file
		 * @name Core.FilePostUploader#complete
		 * @event
		 * @param {Core.FilePostUploader} uploader The uploader itself
		 */

		protected _file: File;
		protected _service: string;
		protected reader: undefined;
		protected request: XMLHttpRequest;
		protected binaryString: boolean = false;
		protected _responseText: string;
		protected fileReader: FileReader;
		protected boundary: string;
		protected _method: string = 'POST';
		protected fields: object;
		protected _isCompleted: boolean = false;
		field: string = 'file';

		protected loadedOctets: number;
		protected totalOctets: number;

		readonly progress = new Core.Events<{ target: FilePostUploader, loaded: number, total: number }>();
		readonly completed = new Core.Events<{ target: FilePostUploader }>();
		readonly error = new Core.Events<{ target: FilePostUploader, status: number }>();

		/**
		*	@constructs
		*	@class Helper to allow file uploading with progress report and which
		* use the best technic (FileApi, FormData, input tag) depending on the browser capabilities.
		*	@extends Core.Object
		*/
		constructor(init?: FilePostUploaderInit) {
			super();
			this.fields = {};
			if (init) {
				if (init.method !== undefined)
					this.method = init.method;
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

		setField(name, value) {
			this.fields[name] = value;
		}

		set arguments(args: object) {
			this.fields = args;
		}

		set destination(destination: string) {
			this.setField('destination', destination);
		}

		//
		// Send the file
		//
		send() {
			let wrapper; let field;
			if (this._file.fileApi !== undefined) {
				if (Core.Navigator.supportFormData) {
					let formData = new FormData();
					for (field in this.fields) {
						formData.append(field, this.fields[field]);
					}
					formData.append(this.field, this._file.fileApi);
	
					this.request = new XMLHttpRequest();
					if ('upload' in this.request)
						this.request.upload.addEventListener('progress', e => this.onUpdateProgress(e));
					this.request.open(this._method, this._service);
					this.request.send(formData);
					this.request.onreadystatechange = (event) => this.onStateChange(event);
				}
				else {
					this.fileReader = new FileReader();
					this.request = new XMLHttpRequest();
					if ('upload' in this.request)
						this.request.upload.addEventListener('progress', e => this.onUpdateProgress(e));
					this.request.open(this._method, this._service);

					this.boundary = '----';
					let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
					for (let i = 0; i < 16; i++)
						this.boundary += characters[Math.floor(Math.random() * characters.length)];
					this.boundary += '----';

					this.request.setRequestHeader("Content-Type", "multipart/form-data, boundary=" + this.boundary);
					this.request.setRequestHeader("Content-Length", this._file.fileApi.size);
					this.request.onreadystatechange = (event) => this.onStateChange(event);
					this.fileReader.onload = (event) => this.onFileReaderLoad(event);
					this.fileReader.onerror = (event) => this.onFileReaderError(event);

					this.fileReader.readAsBinaryString(this._file.fileApi);
				}
			}
			else {
				this._file.form.action = this._service;

				for (field in this.fields) {
					let fieldDrawing = document.createElement('input');
					fieldDrawing.type = 'hidden';
					fieldDrawing.setAttribute('name', field);
					fieldDrawing.setAttribute('value', this.fields[field]);
					this._file.form.insertBefore(fieldDrawing, this._file.form.firstChild);
				}
				this._file.iframe.addEventListener('load', e => this.onIFrameLoad(e));
				let errorCount = 0;
				let done = false;
				while (!done && (errorCount < 5)) {
					try {
						this._file.form.submit();
						done = true;
					}
					catch (e) {
						errorCount++;
					}
				}
			}
		}

		sendAsync() {
			return new Promise<Core.FilePostUploader>(resolve => {
				this.completed.connect(() => resolve(this));
				this.send();
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
			if (this.request.readyState == 4) {
				this._isCompleted = true;
				if (this.request.status == 200) {
					this._responseText = this.request.responseText;
					this.completed.fire({ target: this });
				}
				else {
					this._responseText = this.request.responseText;
					this.error.fire({ target: this, status: this.request.status });
				}
				this.request = undefined;
			}
		}

		protected onUpdateProgress(event) {
			this.loadedOctets = event.loaded;
			this.totalOctets = event.total;
			this.progress.fire({ target: this, loaded: event.loaded, total: event.total });
		}

		protected onFileReaderError(event) {
			this.request.abort();
			this.request = undefined;
			this.error.fire({ target: this, status: event.status });
			this.fileReader = undefined;
		}

		protected onFileReaderLoad(event) {
			let body = '--' + this.boundary + '\r\n';
			body += "Content-Disposition: form-data; name='"+this.field+"'; filename='" + this._file.fileApi.name + "'\r\n";
			body += 'Content-Type: ' + this._file.fileApi.type + '\r\n\r\n';
			body += event.target.result + '\r\n';
			body += '--' + this.boundary + '--';
			(this.request as any).sendAsBinary(body);

			this.fileReader = undefined;
		}

		protected onIFrameLoad(event) {
			this._responseText = event.target.contentWindow.document.body.innerText;
			document.body.removeChild(this._file.iframe);
			this.completed.fire({ target: this });
		}
	}
}	

