namespace Anim
{
    export interface Target {
        setAnimClock(clock: Clock): void;
    }

    export interface ClockInit {
        animation?: boolean;
        repeat?: 'forever' | number;
        speed?: number;
        autoReverse?: boolean;
        beginTime?: number;
        ease?: EasingFunction | string;
        target?: Target;
        duration?: number | 'forever' | 'automatic';
        parent?: Clock;
        ontimeupdate?: (event: { target: Clock, progress: number, deltaTick: number }) => void;
        oncompleted?:  (event: { target: Clock }) => void;
    }

    export class Clock extends Core.Object implements ClockInit {
        /**
         * Fires when an anim is complete
         * @name Anim.Clock#complete
         * @event
         * @param {Anim.Clock} clock The animclock itself
         */
        /**
         * Fires on animation update
         * @name Anim.Clock#timeupdate
         * @event
         * @param {Anim.Clock} clock The animclock itself
         * @param {number} progress Progression's level of the animation (between 0 and 1)
         * @param {number} delta Time (in second) between two update calls.
         */
        private _animation: boolean = true;
        private _parent?: Clock = undefined;
        private _time?: number = undefined;
        private _iteration?: number = undefined;
        private _progress?: number = 0;
        private _isActive: boolean = false;
        private _globalTime: number = 0;
        private startTime: number = 0;
        private lastTick: number = 0;
        private _beginTime: number = 0;
        private isPaused: boolean = false;
        private _speed: number = 1;
        // [forever|automatic|nbsec]
        private _duration: number | 'forever' | 'automatic' = 'forever';
        pendingState: 'none'|'active'|'paused'|'resumed'|'stopped' = 'none';

        private _autoReverse: boolean = false;
        // [forever|count]
        private _repeat: 'forever' | number = 1;
        private _target?: Target = undefined;
        private _ease?: EasingFunction = undefined;
        readonly timeupdate = new Core.Events<{ target: Clock, progress: number, deltaTick: number }>();
        readonly completed = new Core.Events<{ target: Clock }>();

        constructor(init?: ClockInit) {
            super();
            if (init) {
                if (init.animation !== undefined)
                    this.animation = init.animation;
                if (init.repeat !== undefined)
                    this.repeat = init.repeat;
                if (init.speed !== undefined)
                    this.speed = init.speed;
                if (init.autoReverse !== undefined)
                    this.autoReverse = init.autoReverse;
                if (init.beginTime !== undefined)
                    this.beginTime = init.beginTime;
                if (init.ease !== undefined)
                    this.ease = init.ease;
                if (init.target !== undefined)
                    this.target = init.target;
                if (init.duration !== undefined)
                    this.duration = init.duration;
                if (init.parent !== undefined)
                    this.parent = init.parent;
                if (init.ontimeupdate)
                    this.timeupdate.connect(init.ontimeupdate);
                if (init.oncompleted)
                    this.completed.connect(init.oncompleted);
            }
        }

        set animation(animation: boolean) {
            this._animation = animation;
        }

        set repeat(repeat: 'forever' | number) {
            this._repeat = repeat;
        }

        set speed(speed: number) {
            this._speed = speed;
        }

        set autoReverse(autoReverse: boolean) {
            this._autoReverse = autoReverse;
        }

        set beginTime(beginTime: number) {
            this._beginTime = beginTime;
        }

        set ease(ease: EasingFunction | string) {
            this._ease = Anim.EasingFunction.create(ease);
        }

        set target(target: Target) {
            this._target = target;
        }

        set duration(duration: number | 'forever' | 'automatic') {
            if (duration == 'automatic')
                this._duration = 'forever';
            else
                this._duration = duration;
        }

        set parent(parent: Clock | undefined) {
            this._parent = parent;
        }

        get parent(): Clock | undefined {
            return this._parent;
        }

        get globalTime(): number {
            return this._globalTime + (this.lastTick - this.startTime) * this._speed;
        }

        get isActive(): boolean {
            return this._isActive || (this.pendingState === 'active');
        }

        get time(): number {
            return this._time??0;
        }

        get iteration(): number {
            return this._iteration??0;
        }

        get progress(): number {
            return this._progress??0;
        }

        begin() {
            if (this.isActive)
                return;

            // if this clock is the root clock, add to the TimeManager
            if (this._parent === undefined) {
                if (this._animation)
                    Anim.AnimationManager.current.add(this);
                else
                    Anim.TimeManager.current.add(this);
            }

            this.pendingState = 'active';
            // attach the clock to an element
            if ((this._target !== undefined) && (this._target.setAnimClock !== undefined))
                this._target.setAnimClock(this);
        }

        pause() {
            this.pendingState = 'paused';
        }

        resume() {
            this.pendingState = 'resumed';
        }

        stop() {
            this.pendingState = 'stopped';
        }

        complete() {
            // if the current clock is the root clock, remove it from the timemanager
            if (this._parent === undefined) {
                if (this._animation)
                    Anim.AnimationManager.current.remove(this);
                else
                    Anim.TimeManager.current.remove(this);
            }
            this.completed.fire({ target: this });
        }

        protected onTimeUpdate(deltaTick) {
            var progress = this.progress;
            if (this._ease !== undefined)
                progress = this._ease.ease(progress);
            this.timeupdate.fire({ target: this, progress: progress, deltaTick: deltaTick });
        }

        update(parentGlobalTime: number) {
            do {
                let state = this.pendingState;
                this.pendingState = 'none';

                // handle pending state
                if (state === 'none') {
                    if (this._isActive && !this.isPaused) {
                        // update time
                        var deltaTick = parentGlobalTime - this.lastTick;
                        this.lastTick = parentGlobalTime;
                        var globalTime = this.globalTime;
                        globalTime -= this._beginTime;

                        if (globalTime >= 0) {
                            if ((this._duration !== 'forever') && (this._duration !== 'automatic')) {
                                var iteration = globalTime / (this._duration as number);
                                var iterationRounded = Math.floor(iteration + 1);
                                var time = globalTime % (this._duration as number);

                                if (this._autoReverse) {
                                    if ((iterationRounded & 1) === 0)
                                        time = (this._duration as number) - time;
                                    iteration /= 2;
                                    iterationRounded = Math.floor(iteration + 1);
                                }
                                if (this._repeat == 'forever') {
                                    this._iteration = iterationRounded;
                                    this._time = time;
                                    this._progress = time / (this._duration as number);
                                    this.onTimeUpdate(deltaTick);
                                }
                                else {
                                    if (iteration >= this._repeat) {
                                        // goto to stopped state
                                        this.pendingState = 'stopped';
                                        // force last anim state
                                        this._iteration = this._repeat as number;
                                        this._time = this._duration as number;
                                        if (this._autoReverse)
                                            this._progress = 0;
                                        else
                                            this._progress = 1;
                                        this.onTimeUpdate(0);
                                    }
                                    else {
                                        this._iteration = iterationRounded;
                                        this._time = time;
                                        this._progress = time / (this._duration as number);
                                        this.onTimeUpdate(deltaTick);
                                    }
                                }
                            }
                            else {
                                this._time = globalTime;
                                this._progress = 0;
                                this._iteration = undefined;
                                this.onTimeUpdate(deltaTick);
                            }
                        }
                    }
                }
                else if (state == 'active') {
                    if (!this._isActive) {
                        this._isActive = true;
                        this._globalTime = 0;
                        this.startTime = parentGlobalTime;
                        this.lastTick = this.startTime;
                        if (this._beginTime > 0) {
                            this._time = undefined;
                            this._progress = 0;
                            this._iteration = undefined;
                        }
                        else {
                            this._time = 0;
                            this._progress = 0;
                            this._iteration = 1;
                            this.onTimeUpdate(0);
                        }
                    }
                }
                else if (state == 'paused') {
                    if (!this.isPaused && this._isActive) {
                        this.isPaused = true;
                        this._globalTime = this.globalTime;
                        this.startTime = 0;
                        this.lastTick = 0;
                    }
                }
                else if (state == 'resumed') {
                    if (this.isPaused && this._isActive) {
                        this.isPaused = false;
                        this.startTime = parentGlobalTime;
                        this.lastTick = parentGlobalTime;
                    }
                }
                else if (state == 'stopped') {
                    if (this._isActive) {
                        this._progress = undefined;
                        this._time = undefined;
                        this._iteration = undefined;
                        this._isActive = false;
                    }
                }
            } while (this.pendingState != 'none');
            // check if clock completed (= root and no more active)
            if ((this._parent === undefined) && !this._isActive)
                this.complete();
        }
    }
}
