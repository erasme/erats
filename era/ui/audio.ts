namespace Ui {

    export type MediaState = 'initial' | 'playing' | 'paused' | 'buffering' | 'error';

    export interface AudioInit extends ElementInit {
        src?: string;
        oggSrc?: string;
        mp3Src?: string;
        aacSrc?: string;
        volume?: number;
        controls?: boolean;
        controlsList?: Array<string>;
        currentTime?: number;
        onready?: (event: { target: Audio, code: number }) => void;
        onerror?: (event: { target: Audio, code: number }) => void;
    }

    export class Audio extends Element {
        private _src: string;
        protected audioDrawing!: HTMLAudioElement;
        private canplaythrough: boolean = false;
        private _state: MediaState = 'initial';
        private audioMeasureValid: boolean = false;
        private audioSize = { width: 0, height: 0 }
        static measureBox: HTMLAudioElement = undefined;

        readonly ready = new Core.Events<{ target: Audio }>();
        set onready(value: (event: { target: Audio }) => void) { this.ready.connect(value); }

        readonly ended = new Core.Events<{ target: Audio }>();
        set onended(value: (event: { target: Audio }) => void) { this.ended.connect(value); }

        readonly timeupdate = new Core.Events<{ target: Audio, time: number }>();
        set ontimeupdate(value: (event: { target: Audio, time: number }) => void) { this.timeupdate.connect(value); }

        readonly bufferingupdate = new Core.Events<{ target: Audio, buffer: number }>();
        set onbufferingupdate(value: (event: { target: Audio, buffer: number }) => void) { this.bufferingupdate.connect(value); }

        readonly statechange = new Core.Events<{ target: Audio, state: MediaState }>();
        set onstatechange(value: (event: { target: Audio, state: MediaState }) => void) { this.statechange.connect(value); }

        readonly error = new Core.Events<{ target: Audio, code: number }>();
        set onerror(value: (event: { target: Audio, code: number }) => void) { this.error.connect(value); }

        // detect what audio system is supported
        static htmlAudio: boolean = false;
        static supportOgg: boolean = false;
        static supportMp3: boolean = false;
        static supportWav: boolean = false;
        static supportAac: boolean = false;

        constructor(init?: AudioInit) {
            super();
            // this.verticalAlign = 'top';
            // this.horizontalAlign = 'left';
            if (init) {
                if (init.oggSrc || init.mp3Src || init.aacSrc) {
                    if (init.oggSrc && Ui.Audio.supportOgg)
                        this.src = init.oggSrc;
                    else if (init.mp3Src && Ui.Audio.supportMp3)
                        this.src = init.mp3Src;
                    else if (init.aacSrc && Ui.Audio.supportAac)
                        this.src = init.aacSrc;
                }
                else if (init.src)
                    this.src = init.src;
                if (init.volume !== undefined)
                    this.volume = init.volume;
                if (init.currentTime !== undefined)
                    this.currentTime = init.currentTime;
                if (init.controls !== undefined)
                    this.controls = init.controls;
                if (init.controlsList !== undefined)
                    this.controlsList = init.controlsList;
                if (init.onerror !== undefined)
                    this.onerror = init.onerror
                if (init.onready !== undefined)
                    this.onready = init.onready
            }
        }

        //
        // Set the file URL for the current audio element
        //
        set src(src: string | undefined) {
            this.canplaythrough = false;
            this._state = 'initial';
            this._src = src;
            if (src === undefined)
                this.audioDrawing.removeAttribute('src');
            else
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
            this.statechange.fire({ target: this, state: this._state });
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
            this.statechange.fire({ target: this, state: this._state });
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
        // Show or hide audio controls
        //
        set controls(value: boolean) {
            if (value)
                this.audioDrawing.controls = true;
            else
                delete (this.audioDrawing.controls);
            this.audioMeasureValid = false;
            this.invalidateMeasure();
        }

        //
        // Get the audio controls value
        //
        get controls(): boolean {
            return this.audioDrawing.controls;
        }

        set controlsList(value: Array<string>) {
            if ('controlsList' in this.audioDrawing) {
                let tokenList = this.audioDrawing['controlsList'] as DOMTokenList;
                for (const element of value) {
                    if (!tokenList.supports(element)) continue;
                    tokenList.add(element);
                }

                this.audioMeasureValid = false;
                this.invalidateMeasure();
            }
        }

        get controlsList(): Array<string> {
            if (this.audioDrawing['controlsList'] === undefined)
                return [];
            let controlsList = [];
            (this.audioDrawing['controlsList'] as DOMTokenList).forEach(token => controlsList.push(token));
            return controlsList;
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
        get duration(): number | undefined {
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
            this.ready.fire({ target: this });
        }

        protected onTimeUpdate(): void {
            this.timeupdate.fire({ target: this, time: this.audioDrawing.currentTime });
            this.checkBuffering();
        }

        protected onEnded(): void {
            this.audioDrawing.pause();
            this._state = 'initial';
            this.audioDrawing.currentTime = 0;
            this.ended.fire({ target: this });
            this.statechange.fire({ target: this, state: this._state });
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
                            this.statechange.fire({ target: this, state:  this.state });
                        }
                    }
                    else if(this.state == 'playing') {
                        // if remains less than 100ms in the buffer, pause
                        // to let enought time for the buffer to grow
                        if((timebuffer <= 0.1) && (time + timebuffer < duration)) {
                            this.state = 'buffering';
                            this.audioDrawing.pause();
                            this.statechange.fire({ target: this, state: this.state });
                        }
                    }*/
            this.bufferingupdate.fire({ target: this, buffer: timebuffer });
        }

        protected onError(): void {
            this._state = 'error';
            this.error.fire({ target: this, code: this.audioDrawing.error.code });
            this.statechange.fire({ target: this, state: this._state });
        }

        protected onWaiting(): void {
            if (!this.canplaythrough)
                this.audioDrawing.load();
        }

        protected onUnload(): void {
            super.onUnload();
            if (this.canplaythrough)
                this.pause();
        }

        protected renderDrawing() {
            let drawing;
            if (Ui.Audio.htmlAudio) {
                this.audioDrawing = document.createElement('audio');
                // this.audioDrawing.style.display = 'none';
                this.audioDrawing.addEventListener('canplaythrough', () => this.onReady());
                this.audioDrawing.addEventListener('ended', () => this.onEnded());
                this.audioDrawing.addEventListener('timeupdate', () => this.onTimeUpdate());
                this.audioDrawing.addEventListener('error', () => this.onError());
                this.audioDrawing.addEventListener('progress', () => this.onProgress());
                this.audioDrawing.addEventListener('waiting', () => this.onWaiting());
                this.audioDrawing.setAttribute('preload', 'auto');
                this.audioDrawing.load();
                this.audioDrawing.style.position = 'absolute';
                this.audioDrawing.style.left = '0px';
                this.audioDrawing.style.top = '0px';
                drawing = this.audioDrawing;
            }
            else {
                drawing = super.renderDrawing();
            }
            return drawing;
        }

        measureCore(width: number, height: number): { width: number, height: number } {
            if (!this.audioMeasureValid) {
                this.audioMeasureValid = true;
                let size = Ui.Audio.measure(this.controls);
                this.audioSize = size
            }
            return this.audioSize;
        }

        static measure(isPlayerVisible: boolean): { width: number, height: number } {
            if (!isPlayerVisible)
                return { width: 0, height: 0 };
            return Ui.Audio.measureTextHtml();
        }

        private static measureTextHtml() {
            if (Ui.Audio.measureBox === undefined)
                this.createMeasureHtml();
            return { width: Ui.Audio.measureBox.offsetWidth, height: Ui.Audio.measureBox.offsetHeight };
        }

        private static createMeasureHtml() {
            let measureWindow = window as Window;
            if (Core.Navigator.isGecko)
                measureWindow = Ui.App.getRootWindow();

            if (measureWindow.document.body === undefined) {
                let body = measureWindow.document.createElement('body');
                measureWindow.document.body = body;
            }
            Ui.Audio.measureBox = measureWindow.document.createElement('audio');
            Ui.Audio.measureBox.controls = true;
            Ui.Audio.measureBox.style.whiteSpace = 'nowrap';
            Ui.Audio.measureBox.style.position = 'absolute';
            Ui.Audio.measureBox.style.left = '0px';
            Ui.Audio.measureBox.style.top = '0px';
            Ui.Audio.measureBox.style.position = 'absolute';
            Ui.Audio.measureBox.style.display = 'inline';
            Ui.Audio.measureBox.style.visibility = 'hidden';
            measureWindow.document.body.appendChild(Ui.Audio.measureBox);
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