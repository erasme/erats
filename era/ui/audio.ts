namespace Ui {

	export type MediaState = 'initial' | 'playing' | 'paused' | 'buffering' | 'error';

	export interface AudioInit extends ElementInit {
		src?: string;
		oggSrc?: string;
		mp3Src?: string;
		aacSrc?: string;
		volume?: number;
		currentTime?: number;
	}

	export class Audio extends Element {
		private _src: string;
		protected audioDrawing: HTMLAudioElement;
		private canplaythrough: boolean = false;
		private _state: MediaState = 'initial';

		// detect what audio system is supported
		static htmlAudio: boolean = false;
		static supportOgg: boolean = false;
		static supportMp3: boolean = false;
		static supportWav: boolean = false;
		static supportAac: boolean = false;

		constructor(init?: AudioInit) {
			super();
			this.addEvents('ready', 'ended', 'timeupdate', 'bufferingupdate', 'statechange', 'error');
			this.connect(this, 'unload', this.onAudioUnload);
			this.verticalAlign = 'top';
			this.horizontalAlign = 'left';
			if (init) {
				if (init.oggSrc || init.mp3Src || init.aacSrc) {
					if (init.oggSrc && Ui.Audio.supportOgg)
						this.src = init.oggSrc;
					else if (init.mp3Src && Ui.Audio.supportMp3)
						this.src = init.mp3Src;
					else if (init.aacSrc && Ui.Audio.supportAac)
						this.src = init.aacSrc;
				}
				if (init.volume !== undefined)
					this.volume = init.volume;
				if (init.currentTime !== undefined)
					this.currentTime = init.currentTime;
			}
		}

		//
		// Set the file URL for the current audio element
		//
		set src(src: string) {
			this.canplaythrough = false;
			this._state = 'initial';
			this._src = src;
			this.audioDrawing.setAttribute('src', src);
			try {
				this.audioDrawing.load();
			} catch (e) { }
		}

		//
		// Play the audio element. If the element is already playing
		// stop it and restart from the begining.
		//
		play() {
			this._state = 'playing';
			this.fireEvent('statechange', this, this._state);
			if (this.canplaythrough)
				this.audioDrawing.play();
			else
				this.audioDrawing.load();
		}

		//
		// Pause the audio element. If the element is not
		// currently playing, do nothing.
		//
		pause() {
			this._state = 'paused';
			this.fireEvent('statechange', this, this._state);
			if (this.canplaythrough)
				this.audioDrawing.pause();
			else
				this.audioDrawing.load();
		}

		//
		// Stop the sound if playing.
		//
		stop() {
			this.audioDrawing.pause();
			this.onEnded();
		}

		//
		// Set the audio volume between 0 and 1
		//
		set volume(volume: number) {
			this.audioDrawing.volume = volume;
		}

		//
		// Get the audio volume between 0 and 1
		//
		get volume(): number {
			return this.audioDrawing.volume;
		}

		//
		// @return the duration in seconds of the audio file
		// or undefined if unknown. This value is only known
		// after the ready event.
		//
		get duration(): number {
			var duration = this.audioDrawing.duration;
			if ((duration === undefined) || isNaN(duration) || (duration === null))
				return undefined;
			else
				return duration;
		}

		//
		// Seek the current position of the audio file.
		//
		set currentTime(time: number) {
			this.audioDrawing.currentTime = time;
		}

		//
		// Return the current position in seconds.
		// This value is only known after the ready event.
		//
		get currentTime(): number {
			if (this.audioDrawing.currentTime === undefined)
				return 0;
			else
				return this.audioDrawing.currentTime;
		}

		//
		// Return the current state of the media
		//
		get state(): MediaState {
			return this._state;
		}

		//
		// Return true if the audio is ready to play
		// and infos like duration, currentTime... are
		// known
		//
		get isReady(): boolean {
			return this.canplaythrough;
		}

		protected onReady(): void {
			this.canplaythrough = true;
			if (this._state == 'playing')
				this.audioDrawing.play();
			else if (this._state == 'paused')
				this.audioDrawing.pause();
			this.fireEvent('ready');
		}

		protected onTimeUpdate(): void {
			this.fireEvent('timeupdate', this, this.audioDrawing.currentTime);
			this.checkBuffering();
		}

		protected onEnded(): void {
			this.audioDrawing.pause();
			this._state = 'initial';
			this.audioDrawing.currentTime = 0;
			this.fireEvent('ended', this);
			this.fireEvent('statechange', this, this._state);
		}

		protected onProgress(): void {
			this.checkBuffering();
		}

		get currentBufferSize(): number {
			var buffered = this.audioDrawing.buffered;
			var timebuffer = 0;
			var time = this.audioDrawing.currentTime;
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

		checkBuffering() {
			var timebuffer = this.currentBufferSize;
			var time = this.audioDrawing.currentTime;
			var duration = this.audioDrawing.duration;

			/*		if(this.state == 'buffering') {
						// if we have 5s in the buffer or if the browser already decided
						// to stop buffering or if we are at the end
						if((timebuffer >= 5) || (this.audioDrawing.networkState == 1) || (time + timebuffer >= duration)) {
							this.state = 'playing';
							this.audioDrawing.play();
							this.fireEvent('statechange', this, this.state);
						}
					}
					else if(this.state == 'playing') {
						// if remains less than 100ms in the buffer, pause
						// to let enought time for the buffer to grow
						if((timebuffer <= 0.1) && (time + timebuffer < duration)) {
							this.state = 'buffering';
							this.audioDrawing.pause();
							this.fireEvent('statechange', this, this.state);
						}
					}*/
			this.fireEvent('bufferingupdate', this, timebuffer);
		}

		protected onError(): void {
			this._state = 'error';
			this.fireEvent('error', this, this.audioDrawing.error.code);
			this.fireEvent('statechange', this, this._state);
		}

		protected onWaiting(): void {
			if (!this.canplaythrough)
				this.audioDrawing.load();
		}

		protected onAudioUnload(): void {
			if (this.canplaythrough)
				this.pause();
			// to force closing the possible connection to the server
			// (Chrome BUG: https://code.google.com/p/chromium/issues/detail?id=234779)
			this.audioDrawing.removeAttribute('src');
			try {
				this.audioDrawing.load();
			} catch (e) { }
		}

		protected renderDrawing() {
			var drawing;
			if (Ui.Audio.htmlAudio) {
				this.audioDrawing = document.createElement('audio');
				this.audioDrawing.style.display = 'none';
				this.connect(this.audioDrawing, 'canplaythrough', this.onReady);
				this.connect(this.audioDrawing, 'ended', this.onEnded);
				this.connect(this.audioDrawing, 'timeupdate', this.onTimeUpdate);
				this.connect(this.audioDrawing, 'error', this.onError);
				this.connect(this.audioDrawing, 'progress', this.onProgress);
				this.connect(this.audioDrawing, 'waiting', this.onWaiting);
				this.audioDrawing.setAttribute('preload', 'auto');
				this.audioDrawing.load();
				drawing = this.audioDrawing;
			}
			else {
				drawing = super.renderDrawing();
			}
			return drawing;
		}

		static initialize() {
			// check for HTMLAudioElement
			let audioTest = document.createElement('audio');
			if (audioTest.play !== undefined) {
				this.htmlAudio = true;
				this.supportWav = !!audioTest.canPlayType && '' !== audioTest.canPlayType('audio/wav');
				this.supportMp3 = !!audioTest.canPlayType && '' !== audioTest.canPlayType('audio/mpeg');
				this.supportOgg = !!audioTest.canPlayType && '' !== audioTest.canPlayType('audio/ogg; codecs="vorbis"');
				this.supportAac = !!audioTest.canPlayType && '' !== audioTest.canPlayType('audio/mp4; codecs="mp4a.40.2"');
			}
		}
	}
}

Ui.Audio.initialize();