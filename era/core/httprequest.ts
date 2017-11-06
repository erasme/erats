module Core
{
	export interface HttpRequestInit {
		url: string;
		method: string;
		binary: boolean;
		arguments: object;
		content: any;
		headers: object;
	}

	export class HttpRequest extends Object
	{
		url: string = null;
		method: string = "GET";
		binary: boolean = false;
		arguments: object = undefined;
		content: any = undefined;
		headers: object = undefined;
		private request: XMLHttpRequest;
		static requestHeaders: object = undefined;

		/**
		*	@constructs
		*	@class
		*	@extends Core.Object
		*/
		constructor(init?: Partial<HttpRequestInit>)
		{
			super();
			this.addEvents('error', 'done');

			this.request = new XMLHttpRequest();

			let wrapper = () => {
				if(this.request.readyState == 4)
				{
					if((this.request.status >= 200) && (this.request.status < 300))
						this.fireEvent('done', this);
					else
						this.fireEvent('error', this, this.request.status);
				}
			};
			this.request.onreadystatechange = wrapper;
			this.assign(init);
		}

		setRequestHeader(header, value)
		{
			if(this.headers === undefined)
				this.headers = {};
			this.headers[header] = value;
		}

		addArgument(argName, argValue)
		{
			if(this.arguments === undefined)
				this.arguments = {};
			this.arguments[argName] = argValue;
		}

		abort()
		{
			this.request.abort();
		}

		send()
		{
			if(this.url === undefined)
				throw('url MUST be given for an HttpRequest');
			let header;
			// encode arguments
			let args = '';
			if (this.arguments !== undefined)
				args = Util.encodeURIQuery(this.arguments);
			let url = this.url;

			if(((this.method === 'GET') || (this.method === 'DELETE') || (this.content !== undefined)) && (args !== ''))
			{
				if(this.url.indexOf('?') === -1)
					url += '?'+args;
				else
					url += '&'+args;
			}
			this.request.open(this.method, url, true);
			if(this.binary)
				this.request.overrideMimeType('text/plain; charset=x-user-defined');
				this.request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				if (HttpRequest.requestHeaders !== undefined)
				{
					for(header in HttpRequest.requestHeaders)
						this.request.setRequestHeader(header, HttpRequest.requestHeaders[header]);
				}
				if (this.headers !== undefined)
				{
					for(header in this.headers)
						this.request.setRequestHeader(header, this.headers[header]);
				}
				if(this.content !== undefined)
				{
					if((this.headers === undefined) || (this.headers["Content-Type"] === undefined))
						this.request.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
					this.request.send(this.content);
				}
				else if((args !== '') && ((this.method === 'POST') || (this.method === 'PUT')))
				{
					if((this.headers === undefined) || (this.headers["Content-Type"] === undefined))
						this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					this.request.send(args);
				}
				else
					this.request.send();
		}

		sendAsync() {
			return new Promise<Core.HttpRequest>(resolve => {
				this.connect(this, 'done', () => {
					resolve(this);
				});
				this.send();
			});
		}

		getResponseHeader(header: string)
		{
			return this.request.getResponseHeader(header);
		}

		get responseText(): string
		{
			return this.request.responseText;
		}

		get responseBase64(): string
		{
			return Util.toBase64(this.request.responseText);
		}

		get responseJSON(): any
		{
			let res;
			try {
				res = JSON.parse(this.responseText);
			}
			catch(err) {
				res = undefined;
			}
			return res;
		}

		get responseXML(): Document
		{
			let parser = new DOMParser();
			try {
				let xmlDoc = parser.parseFromString(this.responseText, 'text/xml');
				return xmlDoc;
			} catch(e) {}
			return undefined;
		}

		get status(): number
		{
			return this.request.status;
		}

		static setRequestHeader(header, value)
		{
			if(HttpRequest.requestHeaders === undefined)
				HttpRequest.requestHeaders =  {};
			HttpRequest.requestHeaders[header] = value;
		}
	}
}
