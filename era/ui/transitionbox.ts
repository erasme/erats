namespace Ui {
    export interface TransitionBoxInit extends LBoxInit {
        duration?: number;
        ease?: Anim.EasingFunction | string;
        transition?: Transition | string;
        position?: number;
        current?: Element;
    }

    export class TransitionBox extends LBox {
        protected _transition: Transition;
        protected _duration: number = 0.5;
        protected _ease: Anim.EasingFunction;
        protected _position: number = -1;
        protected transitionClock?: Anim.Clock;
        protected _current: Element | undefined;
        protected next: Element | undefined;
        protected replaceMode: boolean = false;
        protected progress: number;
        readonly changed = new Core.Events<{ target: TransitionBox, position: number }>();
        set onchanged(value: (event: { target: TransitionBox, position: number }) => void) { this.changed.connect(value); }

        /**
         * @constructs
         * @class Container that displays only one element at a time and allows differents kind of transition between elements
         * @extends Ui.LBox
         * @param {number} [config.duration] Transition duration in second (can be float)
         * @param {string} [config.ease] Transition ease behaviour [linear|bounce|elastic]
         * @param {string} [config.transition] Transition type [slide|fade|flip]
         */
        constructor(init?: TransitionBoxInit) {
            super(init);

            this.clipToBounds = true;
            this.transition = 'fade';
            if (init) {
                if (init.duration !== undefined)
                    this.duration = init.duration;
                if (init.ease !== undefined)
                    this.ease = init.ease;
                if (init.transition !== undefined)
                    this.transition = init.transition;
                if (init.position !== undefined)
                    this.position = init.position;
                if (init.current !== undefined)
                    this.current = init.current;
            }
        }

        get position(): number {
            return this._position;
        }

        set position(position: number) {
            this.setCurrentAt(position);
        }

        set duration(duration: number) {
            this._duration = duration;
        }

        set ease(ease: Anim.EasingFunction | string) {
            this._ease = Anim.EasingFunction.create(ease);
        }

        /**
         * @param {Ui.Transition|object|string} transition Type of transition use 
         * @example
         * t = new TransitionBox();
         * t.setTransition('slide');
         * t.setTransition({ type: Ui.Slide, direction: 'left' });
         * t.setTransition(new Ui.Transition({ type: Ui.Slide, direction: 'left' }));
         */
        set transition(transition: Transition | string) {
            this._transition = Ui.Transition.create(transition);
        }

        get current(): Element | undefined {
            if (this._position == -1)
                return undefined;
            else
                return (this.children[this._position] as TransitionBoxContent).children[0];
        }

        set current(child: Element | undefined) {
            let pos = child ? this.getChildPosition(child) : -1;
            if (pos != -1)
                this.setCurrentAt(pos);
        }

        setCurrentAt(position: number) {
            if (this._position != position) {
                if (this.next !== undefined) {
                    if (this._current !== undefined) {
                        this._current.hide();
                        this._current = this.next;
                        this._current.show();
                        this.next = undefined;
                    }
                }
                if (this.transitionClock !== undefined) {
                    this.transitionClock.completed.disconnect(this.onTransitionComplete);
                    this.transitionClock.stop();
                    this.transitionClock = undefined;
                }

                if (this._position != -1)
                    this._current = this.children[this._position];
                else
                    this._current = undefined;

                this.next = this.children[position];
                this.next.show();

                this._transition.run(this._current, this.next, 0);

                this.transitionClock = new Anim.Clock({ duration: this._duration, ease: this._ease });
                this.transitionClock.timeupdate.connect((e) => this.onTransitionTick(e.target, e.progress));
                this.transitionClock.completed.connect(this.onTransitionComplete);
                this.transitionClock.begin();

                this._position = position;
            }
        }

        replaceContent(content) {
            this.replaceMode = true;
            this.append(content);
            this.current = content;
        }

        protected onLoad() {
            super.onLoad();
            this.onTransitionBoxLoad();
        }

        protected onTransitionBoxLoad() {
        }

        protected onUnload() {
            super.onUnload();
            this.onTransitionBoxUnload();
        }

        protected onTransitionBoxUnload() {
            if (this.transitionClock !== undefined) {
                this.transitionClock.stop();
                this.transitionClock = undefined;
            }
        }

        protected onTransitionTick(clock: Anim.Clock, progress: number) {
            this.progress = progress;
            this._transition.run(this._current, this.next, progress);
        }

        protected onTransitionComplete = () => {
            let i;
            this.transitionClock = undefined;
            let current = this.next;

            if (this._current !== undefined)
                this._current.hide();
            this.next = undefined;
            if (this.replaceMode) {
                this.replaceMode = false;

                let removeList : Element[] = [];
                for (i = 0; i < this.children.length; i++) {
                    let item = this.children[i];
                    if (item !== current) {
                        let firstChild = (item as TransitionBoxContent).firstChild;
                        if (firstChild)
                            removeList.push(firstChild);
                    }
                }
                for (i = 0; i < removeList.length; i++)
                    this.remove(removeList[i]);
            }
            this.changed.fire({ target: this, position: this._position });
        }

        protected arrangeCore(width: number, height: number) {
            super.arrangeCore(width, height);
            // update the transition if needed
            if (this.transitionClock !== undefined)
                this._transition.run(this._current, this.next, this.transitionClock.progress);
        }

        append(child: Element) {
            if (this.getChildPosition(child) != -1)
                return;
            let content = new TransitionBoxContent();
            content.append(child);
            content.hide();
            super.append(content);
        }

        prepend(child: Element) {
            if (this.getChildPosition(child) != -1)
                return;
            if (this._position !== -1)
                this._position++;
            let content = new TransitionBoxContent();
            content.append(child);
            content.hide();
            super.prepend(child);
        }

        remove(child) {
            for (let i = 0; i < this.children.length; i++) {
                if ((this.children[i] as TransitionBoxContent).firstChild == child) {
                    if (i < this._position)
                        this._position--;
                    else if (i == this._position)
                        this._position = -1;
                    (this.children[i] as TransitionBoxContent).remove(child);
                    super.remove(this.children[i]);
                    break;
                }
            }
        }

        getChildPosition(child: Element) {
            for (let i = 0; i < this.children.length; i++) {
                if ((this.children[i] as TransitionBoxContent).children[0] == child)
                    return i;
            }
            return -1;
        }
    }

    export class TransitionBoxContent extends LBox { }
}

