namespace Ui
{
    export interface AppInit extends ContainerInit {
        content?: Element;
    }

    export class App extends Container {
        private updateTask: boolean = false;
        private _loaded: boolean = false;
        focusElement: any = undefined;
        arguments: any = undefined;
        private _ready: boolean = false;
        orientation: number = 0;
        webApp: boolean = true;
        lastArrangeHeight: number = 0;

        private drawList?: Element;
        private layoutList?: Element;
        windowWidth: number = 0;
        windowHeight: number = 0;

        private contentBox: Box;
        private _content?: Element;

        private dialogs?: LBox;
        private dialogsFocus = [];
        private topLayers?: LBox;

        requireFonts: any;
        testFontTask: any;

        selection: Selection;

        readonly resized = new Core.Events<{ target: App, width: number, height: number }>();
        set onresized(value: (event: { target: App, width: number, height: number }) => void) { this.resized.connect(value); }

        readonly ready = new Core.Events<{ target: App }>();
        set onready(value: (event: { target: App }) => void) { this.ready.connect(value); }

        readonly parentmessage = new Core.Events<{ target: App, message: any }>();
        set onparentmessage(value: (event: { target: App, message: any }) => void) { this.parentmessage.connect(value); }

        readonly orientationchanged = new Core.Events<{ target: App, orientation: number }>();
        set onorientationchanged(value: (event: { target: App, orientation: number }) => void) { this.orientationchanged.connect(value); }

        //
        // @constructs
        // @class Define the App class. A web application always start
        // with a App class as the main container
        // @extends Ui.LBox
        //
        constructor(init?: AppInit) {
            super(init);
            let args;

            Ui.App.current = this;
            this.drawing.style.cursor = 'default';

            this.selection = new Ui.Selection();
            this.selection.changed.connect(e => this.onSelectionChange(e.target));

            // check if arguments are available
            if ((window.location.search !== undefined) && (window.location.search !== '')) {
                let base64;
                args = {};
                let tab = window.location.search.substring(1).split('&');
                for (let i = 0; i < tab.length; i++) {
                    let tab2 = tab[i].split('=');
                    if (tab2.length == 2) {
                        let key = decodeURIComponent(tab2[0]);
                        let val = decodeURIComponent(tab2[1]);
                        if (key === 'base64')
                            base64 = JSON.parse(Core.Util.fromBase64(val));
                        else
                            args[key] = val;
                    }
                }
                if (base64 !== undefined) {
                    this.arguments = base64;
                    for (let prop in args)
                        this.arguments[prop] = args[prop];
                }
                else
                    this.arguments = args;
            }
            else
                this.arguments = {};
            // handle remote debugging
            if (this.arguments.remotedebug !== undefined) {
                args = this.arguments.remotedebug.split(':');
                new Core.RemoteDebug({ host: args[0], port: args[1] });
            }

            this.contentBox = new Ui.VBox();
            this.appendChild(this.contentBox);

            this.setTransformOrigin(0, 0);

            window.addEventListener('load', () => this.onWindowLoad());
            window.addEventListener('resize', e => this.onWindowResize(e));
            window.addEventListener('keyup', e => this.onWindowKeyUp(e));
            window.addEventListener('beforeprint', () => { Ui.App.isPrint = true; this.invalidateMeasure(); this.update(); });
            window.addEventListener('afterprint', () => { Ui.App.isPrint = false; this.invalidateMeasure(); });

            window.addEventListener('focus', (event: FocusEvent) => {
                if (event.target == undefined)
                    return;
                this.focusElement = event.target;
            }, true);

            window.addEventListener('blur', (event: FocusEvent) => {
                this.focusElement = undefined;
            }, true);

            window.addEventListener('dragstart', (event) => event.preventDefault());
            window.addEventListener('dragenter', (event) => { event.preventDefault(); return false; });
            window.addEventListener('dragover', (event) => {
                event.dataTransfer.dropEffect = 'none';
                event.preventDefault(); return false;
            });
            window.addEventListener('drop', (event) => { event.preventDefault(); return false; });

            if ('onorientationchange' in window)
                window.addEventListener('orientationchange', (e) => this.onOrientationChange(e));

            // handle messages
            window.addEventListener('message', (e) => this.onMessage(e));

            if (window['loaded'] === true)
                this.onWindowLoad();
            if (init) {
                if (init.content !== undefined)
                    this.content = init.content;
            }
        }

        setWebApp(webApp: boolean) {
            this.webApp = webApp;
        }

        // implement a selection handler for Selectionable elements
        getSelectionHandler() {
            return this.selection;
        }

        forceInvalidateMeasure(element: Ui.Element) {
            if (element === undefined)
                element = this;
            if (element instanceof Ui.Container)
                for (let i = 0; i < element.children.length; i++)
                    this.forceInvalidateMeasure(element.children[i]);
            element.invalidateMeasure();
            if ('invalidateTextMeasure' in element)
                (element as any).invalidateTextMeasure();
        }

        requireFont(fontFamily: string, fontWeight: string) {
            let fontKey = fontFamily + ':' + fontWeight;
            if (this.requireFonts === undefined)
                this.requireFonts = {};
            if (!this.requireFonts[fontKey]) {
                let test = false;
                if (this.isReady)
                    test = Ui.Label.isFontAvailable(fontFamily, fontWeight);
                this.requireFonts[fontKey] = test;
                if (test)
                    this.forceInvalidateMeasure(this);
                else if (this.isReady && !test && (this.testFontTask === undefined))
                    this.testFontTask = new Core.DelayedTask(0.25, () => this.testRequireFonts());
            }
        }

        testRequireFonts() {
            let allDone = true;
            for (let fontKey in this.requireFonts) {
                let test = this.requireFonts[fontKey];
                if (!test) {
                    let fontTab = fontKey.split(':');
                    test = Ui.Label.isFontAvailable(fontTab[0], fontTab[1]);
                    if (test) {
                        this.requireFonts[fontKey] = true;
                        let app = this;
                        this.forceInvalidateMeasure(this);
                    }
                    else
                        allDone = false;
                }
            }
            if (!allDone)
                this.testFontTask = new Core.DelayedTask(0.25, () => this.testRequireFonts());
            else
                this.testFontTask = undefined;
        }

        checkWindowSize() {
            let innerWidth = document.body.clientWidth;
            let innerHeight = document.body.clientHeight;
            if ((innerWidth !== this.layoutWidth) || (innerHeight !== this.layoutHeight))
                this.invalidateMeasure();
        }

        getOrientation() {
            return this.orientation;
        }

        //
        // Return the required size for the current element
        //
        protected measureCore(width: number, height: number) {
            let minWidth = 0;
            let minHeight = 0;
            for (let child of this.children) {
                let size = child.measure(width, height);
                if (size.width > minWidth)
                    minWidth = size.width;
                if (size.height > minHeight)
                    minHeight = size.height;
            }
            return { width: minWidth, height: minHeight };
        }

        protected onSelectionChange(selection) {
        }

        protected onWindowLoad() {
            let meta; let style;
            if (Core.Navigator.iPad || Core.Navigator.iPhone || Core.Navigator.Android) {
                if (this.webApp) {
                    // support app mode for iPad, iPod and iPhone
                    meta = document.createElement('meta');
                    meta.name = 'apple-mobile-web-app-capable';
                    meta.content = 'yes';
                    document.getElementsByTagName("head")[0].appendChild(meta);
                    // black status bar for iPhone
                    meta = document.createElement('meta');
                    meta.name = 'apple-mobile-web-app-status-bar-style';
                    meta.content = 'black';
                    document.getElementsByTagName("head")[0].appendChild(meta);
                    // support for Chrome
                    meta = document.createElement('meta');
                    meta.name = 'mobile-web-app-capable';
                    meta.content = 'yes';
                    document.getElementsByTagName("head")[0].appendChild(meta);
                }
            }
            // set initial device scale for mobile app
            meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, minimum-scale=1';
            document.getElementsByTagName("head")[0].appendChild(meta);

            // hide scroll tap focus (webkit)
            if (Core.Navigator.isWebkit) {
                style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '* { -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }';
                document.getElementsByTagName('head')[0].appendChild(style);
            }
            // disable page zoom and auto scale for IE
            else if (Core.Navigator.isIE) {
                style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML =
                    '@-ms-viewport { width: device-width; } ' +
                    'body { -ms-content-zooming: none; } '; //+
                    //'* { touch-action: none; } ';
                document.getElementsByTagName('head')[0].appendChild(style);
            }
            this._loaded = true;
            this.onReady();
        }

        protected onWindowResize(event) {
            this.checkWindowSize();
        }

        protected onOrientationChange(event) {
            this.orientation = window.orientation as number;
            this.orientationchanged.fire({ target: this, orientation: this.orientation });
            this.checkWindowSize();
        }

        update = () => {
            // update measure
            let innerWidth = document.body.clientWidth;
            let innerHeight = document.body.clientHeight;
            this.updateTask = false;

            // to work like Windows 8 and iOS. Take outer size for not
            // taking care of the virtual keyboard size
            //		if(navigator.Android) {
            //			innerWidth = window.outerWidth;
            //			innerHeight = window.outerHeight;
            //		}

            if ((this.windowWidth !== innerWidth) || (this.windowHeight !== innerHeight)) {
                this.windowWidth = innerWidth;
                this.windowHeight = innerHeight;
                this.resized.fire({ target: this, width: this.windowWidth, height: this.windowHeight });
                this.invalidateLayout();
            }

            // update measure/arrange
            let layoutList = this.layoutList;
            this.layoutList = undefined;
            while (layoutList != undefined) {
                let current = layoutList;
                layoutList = layoutList.layoutNext;
                current.layoutValid = true;
                current.layoutNext = undefined;
                current.updateLayout(this.windowWidth, this.windowHeight);
            }

            // update draw
            let drawList = this.drawList;
            this.drawList = undefined;
            while (drawList != undefined) {
                let next = drawList.drawNext;
                drawList.drawNext = undefined;
                drawList.draw();
                drawList = next;
            }
        }

        get content(): Element | undefined {
            return this._content;
        }

        set content(content: Element | undefined) {
            if (this._content !== content) {
                if (this._content !== undefined)
                    this.contentBox.remove(this._content);
                if (content !== undefined)
                    this.contentBox.prepend(content, true);
                this._content = content;
            }
        }

        getFocusElement() {
            return this.focusElement;
        }

        appendDialog(dialog) {
            dialog.invalidateLayout();
            if (this.dialogs === undefined) {
                this.dialogs = new Ui.LBox();
                this.dialogs.eventsHidden = true;
                if (this.topLayers !== undefined)
                    this.insertChildBefore(this.dialogs, this.topLayers);
                else
                    this.appendChild(this.dialogs);
            }
            this.dialogsFocus.push(this.focusElement);
            this.dialogs.append(dialog);
            this.contentBox.disable();
            for (let i = 0; i < this.dialogs.children.length - 1; i++)
                this.dialogs.children[i].disable();
        }

        removeDialog(dialog) {
            if (this.dialogs !== undefined) {
                let dialogFocus = this.dialogsFocus.pop();
                this.dialogs.remove(dialog);
                dialog.layoutValid = true;
                if (this.dialogs.children.length === 0) {
                    this.removeChild(this.dialogs);
                    this.dialogs = undefined;
                    this.contentBox.enable();
                }
                else if (this.dialogs.lastChild)
                    this.dialogs.lastChild.enable();
                if (dialogFocus && dialogFocus.focus && (typeof(dialogFocus.focus) == 'function'))
                    dialogFocus.focus();
            }
        }

        appendTopLayer(layer) {
            if (this.topLayers === undefined) {
                this.topLayers = new Ui.LBox();
                this.topLayers.eventsHidden = true;
                this.appendChild(this.topLayers);
            }
            this.topLayers.append(layer);
        }

        removeTopLayer(layer) {
            if (this.topLayers !== undefined) {
                this.topLayers.remove(layer);
                if (this.topLayers.children.length === 0) {
                    this.removeChild(this.topLayers);
                    this.topLayers = undefined;
                }
            }
        }

        //
        // Return the arguments given if any
        //
        getArguments() {
            return this.arguments;
        }

        get isReady(): boolean {
            return this._ready;
        }

        protected onReady() {
            if (this._loaded) {
                document.documentElement.style.position = 'absolute';
                document.documentElement.style.padding = '0px';
                document.documentElement.style.margin = '0px';
                document.documentElement.style.border = '0px solid black';
                document.documentElement.style.width = '100%';
                document.documentElement.style.height = '100%';

                document.body.style.position = 'absolute';
                document.body.style.overflow = 'hidden';
                document.body.style.padding = '0px';
                document.body.style.margin = '0px';
                document.body.style.border = '0px solid black';
                document.body.style.outline = 'none';
                document.body.style.width = '100%';
                document.body.style.height = '100%';

                document.body.appendChild(this.drawing);

                //this.handleScrolling(document.body);

                if ((this.requireFonts !== undefined) && (this.testFontTask === undefined))
                    this.testRequireFonts();

                this.isLoaded = true;
                this.parentVisible = true;
                this.ready.fire({ target: this });

                this._ready = true;
                if ((this.updateTask === false) && this._ready) {
                    this.updateTask = true;
                    requestAnimationFrame(this.update);
                }

                // create a WheelManager to handle wheel events
                new Ui.WheelManager(this);

                // handle pointer events
                //new Ui.PointerManager(this);

                // handle native drag & drop
                new Ui.DragNativeManager(this);
            }
        }

        protected onWindowKeyUp(event) {
            let key = event.which;

            // escape
            if ((key == 27) && (this.dialogs !== undefined) && (this.dialogs.children.length > 0)) {
                let element = this.dialogs.children[this.dialogs.children.length - 1];
                if (element instanceof Dialog) {
                    let dialog = element as Dialog;
                    // if selection is not empty, empty the selection
                    if (dialog.dialogSelection.watchers.length > 0)
                        dialog.dialogSelection.watchers = [];
                    else
                        dialog.close();
                }
                else if (element instanceof Popup) {
                    let popup = element as Popup;
                    if (popup.popupSelection.watchers.length > 0)
                        popup.popupSelection.watchers = [];
                    else
                        popup.close();
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }

        protected onLoad() {
            this.onInternalStyleChange();
            super.onLoad();

        }

        protected onMessage(event) {
            if (parent === event.source) {
                event.preventDefault();
                event.stopPropagation();
                let msg = JSON.parse(event.data);
                this.parentmessage.fire({ target: this, message: msg });
            }
        }

        sendMessageToParent(msg) {
            parent.postMessage(msg.serialize(), "*");
        }

        findFocusableDiv(current) {
            if (('tabIndex' in current) && (current.tabIndex >= 0))
                return current;
            if ('childNodes' in current) {
                for (let i = 0; i < current.childNodes.length; i++) {
                    let res = this.findFocusableDiv(current.childNodes[i]);
                    if (res !== undefined)
                        return res;
                }
            }
            return undefined;
        }

        enqueueDraw(element: Element) {
            element.drawNext = this.drawList;
            this.drawList = element;
            if ((this.updateTask === false) && this._ready) {
                this.updateTask = true;
                setTimeout(this.update, 0);
            }
        }

        enqueueLayout(element: Element) {
            element.layoutNext = this.layoutList;
            this.layoutList = element;
            if ((this.updateTask === false) && this._ready) {
                this.updateTask = true;
                requestAnimationFrame(this.update);
            }
        }

        handleScrolling(drawing) {
            this.ptrdowned.connect((event: EmuPointerEvent) => {
                let startOffsetX = drawing.scrollLeft;
                let startOffsetY = drawing.scrollTop;
                let watcher = event.pointer.watch(this);
                watcher.moved.connect(() => {
                    if (!watcher.getIsCaptured()) {
                        if (watcher.pointer.getIsMove()) {
                            let direction = watcher.getDirection();
                            let allowed = false;
                            if (direction === 'left')
                                allowed = (drawing.scrollLeft + drawing.clientWidth) < drawing.scrollWidth;
                            else if (direction === 'right')
                                allowed = drawing.scrollLeft > 0;
                            else if (direction === 'bottom')
                                allowed = drawing.scrollTop > 0;
                            // if scroll down, allways allow it because of virtual keyboards
                            else if (direction === 'top')
                                allowed = true;// (drawing.scrollTop + drawing.clientHeight) < drawing.scrollHeight;
                            if (allowed)
                                watcher.capture();
                            else
                                watcher.cancel();
                        }
                    }
                    else {
                        let delta = watcher.getDelta();
                        drawing.scrollLeft = startOffsetX - delta.x;
                        drawing.scrollTop = startOffsetY - delta.y;
                    }
                });
            });
        }

        getElementsByClass(className: Function) {
            let res = new Array<Element>();
            let reqSearch = function (current: Element) {
                if (current instanceof className)
                    res.push(current);
                if (current instanceof Container) {
                    for (let i = 0; i < current.children.length; i++)
                        reqSearch(current.children[i]);
                }
            };
            reqSearch(this);
            return res;
        }

        getElementByDrawing(drawing) {
            let reqSearch = function (current) {
                if (current.drawing === drawing)
                    return current;
                if (current.children !== undefined) {
                    for (let i = 0; i < current.children.length; i++) {
                        let res = reqSearch(current.children[i]);
                        if (res !== undefined)
                            return res;
                    }
                }
            };
            return reqSearch(this);
        }

        getInverseLayoutTransform() {
            return Ui.Matrix.createTranslate(-document.body.scrollLeft, -document.body.scrollTop).
                multiply(super.getInverseLayoutTransform());
        }

        getLayoutTransform() {
            return super.getLayoutTransform().translate(document.body.scrollLeft, document.body.scrollTop);
        }

        invalidateMeasure() {
            // Ui.App is layout root, handle the layout here
            this.invalidateLayout();
        }

        invalidateArrange() {
            // Ui.App is layout root, handle the layout here
            this.invalidateLayout();
        }

        protected arrangeCore(w: number, h: number) {
            // on Android, remove focus of text elements when
            // the virtual keyboard is closed. Else it will re-open at each touch
            if (Core.Navigator.Android && Core.Navigator.isWebkit) {
                if ((this.focusElement != undefined) && ((this.focusElement.tagName === 'INPUT') || (this.focusElement.tagName === 'TEXTAREA') || (this.focusElement.contenteditable))) {
                    if (h - 100 > this.lastArrangeHeight)
                        this.focusElement.blur();
                }
            }
            this.lastArrangeHeight = h;

            for (let child of this.children)
                child.arrange(0, 0, w, h);
        }

        // {Ui.App} Reference to the current application instance
        static current: App = undefined;

        static isPrint = false;

        static getWindowIFrame(currentWindow) {
            if (currentWindow === undefined)
                currentWindow = window;
            let iframe;
            if (currentWindow.parent !== currentWindow) {
                try {
                    let frames = currentWindow.parent.document.getElementsByTagName("IFRAME");
                    for (let i = 0; i < frames.length; i++) {
                        if (frames[i].contentWindow === currentWindow) {
                            iframe = frames[i];
                            break;
                        }
                    }
                } catch (e) { }
            }
            return iframe;
        }

        static getRootWindow(): Window {
            let rootWindow = window as Window;
            while (rootWindow.parent != rootWindow)
                rootWindow = rootWindow.parent;
            return rootWindow;
        }
    }
}

window.addEventListener('load', () => window['loaded'] = true);