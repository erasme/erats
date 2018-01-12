namespace Ui {
	export interface VideoInit extends ElementInit {
		oggSrc?: string;
		mp4Src?: string;
		webmSrc?: string;
		src?: string;
		poster?: string;
		autoplay?: boolean;
		volume?: number;
		currentTime?: number;
	}

	export class Video extends Element {
		oggSrc: string;
		mp4Src: string;
		webmSrc: string;
		private loaddone: boolean = false;
		private videoDrawing: HTMLVideoElement;
		canplaythrough: boolean = false;
		// possible values [initial|playing|paused|buffering|error]
		private _state: MediaState = 'initial';
		readonly statechanged = new Core.Events<{ target: Video, state: MediaState }>();
		readonly ready = new Core.Events<{ target: Video }>();
		readonly ended = new Core.Events<{ target: Video }>();
		readonly error = new Core.Events<{ target: Video, code: number }>();
		readonly timeupdated = new Core.Events<{ target: Video, time: number }>();
		readonly bufferingupdated = new Core.Events<{ target: Video, buffer: number }>();

		// detect what video system is supported
		static htmlVideo: boolean = false;
		static flashVideo:boolean = false;
		static supportOgg:boolean = false;
		static supportMp4:boolean = false;
		static supportWebm:boolean = false;

		constructor(init?: VideoInit) {
			super(init);
			if (init) {
				if (init.src !== undefined)
					this.src = init.src;	
				if (init.oggSrc || init.mp4Src || init.webmSrc) {
					if (init.mp4Src && Ui.Video.supportMp4)
						this.src = init.mp4Src;
					else if (init.webmSrc && Ui.Video.supportWebm)
						this.src = init.webmSrc;
					else if (init.oggSrc && Ui.Video.supportOgg)
						this.src = init.oggSrc;
				}
				if (init.poster !== undefined)
					this.poster = init.poster;	
				if (init.autoplay !== undefined)
					this.autoplay = init.autoplay;
				if (init.volume !== undefined)
					this.volume = init.volume;	
				if (init.currentTime !== undefined)
					this.currentTime = init.currentTime;
			}	
		}

		//
		// Set the file URL for the current video element
		//
		set src(src: string) {
			this.canplaythrough = false;
			this._state = 'initial';
			if (typeof (src) === 'object')
				this.videoDrawing.src = URL.createObjectURL(src);
			else
				this.videoDrawing.setAttribute('src', src);
			try {
				this.videoDrawing.load();
			} catch (e) { }
		}
	
		//
		// Set the file URL for the current video poster (preview)
		//
		set poster(src: string) {
			this.videoDrawing.setAttribute('poster', src);
		}

		//
		// Whether or not to autoplay videos
		//
		set autoplay(autoplay: boolean) {
			this.videoDrawing.autoplay = autoplay;
		}

		//
		// Play the video element. If the element is already playing
		// stop it and restart from the begining.
		//
		play() {
			this._state = 'playing';
			this.statechanged.fire({ target: this, state: this._state });
			if (this.canplaythrough)
				this.videoDrawing.play();
			else
				this.videoDrawing.load();
		}

		//
		// Pause the video element. If the element is not
		// currently playing, do nothing.
		//
		pause() {
			this._state = 'paused';
			this.statechanged.fire({ target: this, state: this._state });
			if (this.canplaythrough)
				this.videoDrawing.pause();
			else
				this.videoDrawing.load();
		}

		//
		// Stop the video if playing.
		//
		stop() {
			this.videoDrawing.pause();
			this.onEnded();
		}

		//
		// Set the video volume between 0 and 1
		//
		set volume(volume: number) {
			this.videoDrawing.volume = volume;
		}

		//
		// Get the video volume between 0 and 1
		//
		get volume(): number {
			return this.videoDrawing.volume;
		}

		//
		// @return the duration in seconds of the video file
		// or undefined if unknown. This value is only known
		// after the ready event.
		//
		get duration(): number {
			return this.videoDrawing.duration;
		}

		//
		// Seek the current position of the video file.
		//
		set currentTime(time: number) {
			this.videoDrawing.currentTime = time;
		}

		//
		// Return the current position in seconds.
		// This value is only known after the ready event.
		//
		get currentTime(): number {
			if (this.videoDrawing.currentTime === undefined)
				return 0;
			else
				return this.videoDrawing.currentTime;
		}

		//
		// Return the current state of the media
		//
		get state(): MediaState {
			return this._state;
		}

		//
		// Return true if the video is ready to play
		// and infos like duration, currentTime... are
		// known
		//
		get isReady(): boolean {
			return this.canplaythrough;
		}

		//
		// Return the natural width of the video as defined
		// in the video file. Return undefined if the video is
		// not ready
		//
		get naturalWidth(): number {
			return this.videoDrawing.videoWidth;
		}

		//
		// Return the natural height of the video as defined
		// in the video file. Return undefined if the video is
		// not ready
		//
		get naturalHeight(): number {
			return this.videoDrawing.videoHeight;
		}

		protected onReady(): void {
			this.canplaythrough = true;
			this.videoDrawing.videoWidth;
			this.videoDrawing.videoHeight;
			if (this._state == 'playing')
				this.videoDrawing.play();
			else if (this._state == 'paused')
				this.videoDrawing.pause();
			this.ready.fire({ target: this });
		}

		protected onTimeUpdate(): void {
			this.timeupdated.fire({ target: this, time: this.videoDrawing.currentTime });
			this.checkBuffering();
		}

		protected onEnded(): void {
			this.videoDrawing.pause();
			this._state = 'initial';
			this.videoDrawing.currentTime = 0;
			this.ended.fire({ target: this });
			this.statechanged.fire({ target: this, state: this._state });
		}

		protected onProgress(): void {
			this.checkBuffering();
		}

		get currentBufferSize(): number {
			var buffered = this.videoDrawing.buffered;
			var timebuffer = 0;
			var time = this.videoDrawing.currentTime;
			if (time === undefined)
				time = 0;
			var lastEnd;
			for (var i = 0; i < buffered.length; i++) {
				var start = buffered.start(i);
				var end = buffered.end(i);
				if (lastEnd === undefined) {
					if ((start <= time) && (end >= time)) {
						timebuffer = end - time;
						lastEnd = end;
					}
				}
				else {
					if ((lastEnd >= (start - 0.01)) && (lastEnd <= end)) {
						timebuffer += (end - lastEnd);
						lastEnd = end;
					}
				}
			}
			return timebuffer;
		}

		checkBuffering(): void {
			var timebuffer = this.currentBufferSize;
			var time = this.videoDrawing.currentTime;
			var duration = this.videoDrawing.duration;
			/*		if(this.state == 'buffering') {
						// if we have 5s in the buffer or if the browser already decided
						// to stop buffering or if we are at the end
						if((timebuffer >= 5) || (this.videoDrawing.networkState == 1) || (time + timebuffer >= duration)) {
							this.state = 'playing';
							this.videoDrawing.play();
							this.statechanged.fire({ target: this, state: this.state });
						}
					}
					else if(this.state == 'playing') {
						// if remains less than 100ms in the buffer, pause
						// to let enought time for the buffer to grow
						if((timebuffer <= 0.1) && (time + timebuffer < duration)) {
							this.state = 'buffering';
							this.videoDrawing.pause();
							this.statechanged.fire({ target: this, state: this.state });
						}
					}*/
			this.bufferingupdated.fire({ target: this, buffer: timebuffer });
		}

		protected onError(): void {
			this._state = 'error';
			this.error.fire({ target: this, code: this.videoDrawing.error.code });
			this.statechanged.fire({ target: this, state: this._state });
		}

		protected onWaiting(): void {
			if (!this.canplaythrough)
				this.videoDrawing.load();
		}

		protected onUnload(): void {
			super.onUnload();
			if (this.canplaythrough)
				this.pause();
			// to force closing the possible connection to the server
			// (Chrome BUG: https://code.google.com/p/chromium/issues/detail?id=234779)
			this.videoDrawing.removeAttribute('src');
			try {
				this.videoDrawing.load();
			} catch (e) { }
		}

		protected renderDrawing() {
			if (Ui.Video.htmlVideo) {
				this.videoDrawing = document.createElement('video');
				this.videoDrawing.addEventListener('canplaythrough', () => this.onReady());
				this.videoDrawing.addEventListener('ended', () => this.onEnded());
				this.videoDrawing.addEventListener('timeupdate', () => this.onTimeUpdate());
				this.videoDrawing.addEventListener('error', () => this.onError());
				this.videoDrawing.addEventListener('progress', () => this.onProgress());
				this.videoDrawing.addEventListener('waiting', () => this.onWaiting());
				this.videoDrawing.setAttribute('preload', 'auto');
				this.videoDrawing.load();
				this.videoDrawing.style.position = 'absolute';
				this.videoDrawing.style.left = '0px';
				this.videoDrawing.style.top = '0px';
			}
			return this.videoDrawing;
		}


		protected arrangeCore(width: number, height: number): void {
			if (Ui.Video.htmlVideo) {
				this.videoDrawing.setAttribute('width', width.toString());
				this.videoDrawing.setAttribute('height', height.toString());
			}
		}

		static initialize() {
			// check for HTMLVideoElement
			let videoTest = document.createElement('video');
			if(videoTest.play !== undefined) {
				this.htmlVideo = true;
				this.supportMp4 = !!videoTest.canPlayType && '' !== videoTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
				this.supportOgg = !!videoTest.canPlayType && '' !== videoTest.canPlayType('video/ogg; codecs="theora, vorbis"');
				this.supportWebm = !!videoTest.canPlayType && '' !== videoTest.canPlayType('video/webm; codecs="vp8, vorbis"');
			}
		}
	}
}

Ui.Video.initialize();
