namespace Ui
{
    export interface AppInit extends ContainerInit {
        content?: Element;
    }

    export class App extends Container {
        private _loaded: boolean = false;
        static focusElement: any = undefined;
        arguments: any = undefined;
        private static _ready: boolean = false;
        static orientation: number = 0;
        webApp: boolean = true;
        lastArrangeHeight: number = 0;

        private static updateTask: boolean = false;
        private static drawList?: Element;
        private static layoutList?: Element;

        static windowWidth: number = 0;
        static windowHeight: number = 0;

        private contentBox: Box;
        private _content?: Element;

        private static dialogs: Element[] = [];
        private static dialogsFocus = [];
        private static topLayers: Element[] = [];

        static requireFonts: any;
        static testFontTask: any;

        selection: Selection;

        readonly resized = new Core.Events<{ target: App, width: number, height: number }>();
        set onresized(value: (event: { target: App, width: number, height: number }) => void) { this.resized.connect(value); }

        static readonly ready = new Core.Events<{}>();
        static set onready(value: (event: {}) => void) { this.ready.connect(value); }

        readonly parentmessage = new Core.Events<{ target: App, message: any }>();
        set onparentmessage(value: (event: { target: App, message: any }) => void) { this.parentmessage.connect(value); }

        static readonly orientationchanged = new Core.Events<{ orientation: number }>();
        static set onorientationchanged(value: (event: { orientation: number }) => void) { this.orientationchanged.connect(value); }

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
            if (App.style)
                this.setParentStyle(App.style);
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

//            window.addEventListener('load', () => this.onWindowLoad());
            window.addEventListener('beforeprint', () => { Ui.App.isPrint = true; this.invalidateMeasure(); App.update(); });
            window.addEventListener('afterprint', () => { Ui.App.isPrint = false; this.invalidateMeasure(); });

            // handle messages
            window.addEventListener('message', (e) => this.onMessage(e));

            if (App.isReady)
                this.onReady();
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

        static forceInvalidateMeasure(element: Ui.Element) {
            if (element === undefined)
                element = Ui.App.current;
            if (element instanceof Ui.Container)
                for (let i = 0; i < element.children.length; i++)
                    this.forceInvalidateMeasure(element.children[i]);
            element.invalidateMeasure();
            if ('invalidateTextMeasure' in element)
                (element as any).invalidateTextMeasure();
        }

        static requireFont(fontFamily: string, fontWeight: string) {
            let fontKey = fontFamily + ':' + fontWeight;
            if (this.requireFonts === undefined)
                this.requireFonts = {};
            if (!this.requireFonts[fontKey]) {
                let test = false;
                if (this.isReady)
                    test = Ui.Label.isFontAvailable(fontFamily, fontWeight);
                this.requireFonts[fontKey] = test;
                if (test)
                    App.invalidateAllTextMeasure();
                else if (this.isReady && !test && (this.testFontTask === undefined))
                    this.testFontTask = new Core.DelayedTask(0.25, () => this.testRequireFonts());
            }
        }

        static testRequireFonts() {
            let allDone = true;
            for (let fontKey in this.requireFonts) {
                let test = this.requireFonts[fontKey];
                if (!test) {
                    let fontTab = fontKey.split(':');
                    test = Ui.Label.isFontAvailable(fontTab[0], fontTab[1]);
                    if (test) {
                        this.requireFonts[fontKey] = true;
                        App.invalidateAllTextMeasure();
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

        static invalidateAllTextMeasure() {
            for (let dialog of this.dialogs)
                App.forceInvalidateMeasure(dialog);
            for (let layer of this.topLayers)
                App.forceInvalidateMeasure(layer);
            if (Ui.App.current)
                App.forceInvalidateMeasure(Ui.App.current);
        }

        static checkWindowSize() {
            let innerWidth = document.body.clientWidth;
            let innerHeight = document.body.clientHeight;
            if ((innerWidth !== this.windowWidth) || (innerHeight !== this.windowWidth)) {
                if (Ui.App.current)
                    Ui.App.current.invalidateLayout();
                for (let dialog of Ui.App.dialogs)
                    dialog.invalidateLayout();
                for (let topLayer of Ui.App.topLayers)
                    topLayer.invalidateLayout();
            }
                
        }

        getOrientation() {
            return App.orientation;
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

        protected static onWindowLoad() {
            if (Core.Navigator.iPad || Core.Navigator.iPhone || Core.Navigator.Android) {
                if (Ui.App.current && Ui.App.current.webApp) {
                    // support app mode for iPad, iPod and iPhone
                    let meta = document.createElement('meta');
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
            let meta = document.createElement('meta');
            meta.name = 'viewport';
            // disable user scalable for iOS because it create problem with double tap actions
            if (Core.Navigator.iOs)
                meta.content = 'width=device-width, user-scalable=no';
            else
                meta.content = 'width=device-width, initial-scale=1.0, minimum-scale=1';
            document.getElementsByTagName("head")[0].appendChild(meta);

            // hide scroll tap focus (webkit)
            if (Core.Navigator.isWebkit) {
                let style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '* { -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }';
                document.getElementsByTagName('head')[0].appendChild(style);
            }
            // disable page zoom and auto scale for IE
            else if (Core.Navigator.isIE) {
                let style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML =
                    '@-ms-viewport { width: device-width; } ' +
                    'body { -ms-content-zooming: none; } '; //+
                    //'* { touch-action: none; } ';
                document.getElementsByTagName('head')[0].appendChild(style);
            }

            window.addEventListener('resize', e => App.onWindowResize(e));
            window.addEventListener('keyup', e => App.onWindowKeyUp(e));

            if ('onorientationchange' in window)
                window.addEventListener('orientationchange', (e) => App.onOrientationChange(e));

            window.addEventListener('focus', (event: FocusEvent) => {
                if (event.target == undefined)
                    return;
                App.focusElement = event.target;
            }, true);

            window.addEventListener('blur', (event: FocusEvent) => {
                App.focusElement = undefined;
            }, true);

            window.addEventListener('dragstart', (event) => event.preventDefault());
            window.addEventListener('dragenter', (event) => { event.preventDefault(); return false; });
            window.addEventListener('dragover', (event) => {
                event.dataTransfer.dropEffect = 'none';
                event.preventDefault(); return false;
            });
            window.addEventListener('drop', (event) => { event.preventDefault(); return false; });

            if ((this.requireFonts !== undefined) && (this.testFontTask === undefined))
                this.testRequireFonts();

            for (let dialog of this.dialogs) {
                document.body.appendChild(dialog.drawing);
                dialog.isLoaded = true;
                dialog.parentVisible = true;
            }
            for (let layer of this.topLayers) {
                document.body.appendChild(layer.drawing);
                layer.isLoaded = true;
                layer.parentVisible = true;
            }

            if (Ui.App.current)
                Ui.App.current.onReady();

            App.checkWindowSize();

            if (App.updateTask === false) {
                App.updateTask = true;
                requestAnimationFrame(App.update);
            }

            // handle native drag & drop
            new Ui.DragNativeManager();

            // signal ERAts is ready
            this.ready.fire({ target: this });
            this._ready = true;

//            this.onReady();
        }

        protected static onWindowResize(event) {
            this.checkWindowSize();
        }

        protected static onOrientationChange(event) {
            this.orientation = window.orientation as number;
            this.orientationchanged.fire({ orientation: this.orientation });
            this.checkWindowSize();
        }

        static update = () => {
            // update measure
            //let innerWidth = document.body.clientWidth;
            //let innerHeight = document.body.clientHeight;
            let innerWidth = window.innerWidth;
            let innerHeight = window.innerHeight;
            App.updateTask = false;

            // to work like Windows 8 and iOS. Take outer size for not
            // taking care of the virtual keyboard size
            //		if(navigator.Android) {
            //			innerWidth = window.outerWidth;
            //			innerHeight = window.outerHeight;
            //		}

            if ((App.windowWidth !== innerWidth) || (App.windowHeight !== innerHeight)) {
                App.windowWidth = innerWidth;
                App.windowHeight = innerHeight;

                if (Ui.App.current) {
                    App.current.resized.fire({ target: App.current, width: App.windowWidth, height: App.windowHeight });
                    App.current.invalidateLayout();
                }
                for (let dialog of App.dialogs)
                    dialog.invalidateLayout();
            }

            // update measure/arrange
            let layoutList = App.layoutList;
            App.layoutList = undefined;
            while (layoutList != undefined) {
                let current = layoutList;
                layoutList = layoutList.layoutNext;
                current.layoutValid = true;
                current.layoutNext = undefined;
                current.updateLayout(App.windowWidth, App.windowHeight);
            }

            // update draw
            let drawList = App.drawList;
            App.drawList = undefined;
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

        static appendDialog(dialog: Element) {
            if (App.style)
                dialog.setParentStyle(App.style);
            this.dialogsFocus.push(this.focusElement);
            this.dialogs.push(dialog);
            if (Ui.App.current)
                Ui.App.current.contentBox.disable();
            for (let i = 0; i < this.dialogs.length - 1; i++)
                this.dialogs[i].disable();
            if (document.readyState == 'complete') {
                if (App.topLayers.length > 0)
                    document.body.insertBefore(dialog.drawing, this.topLayers[0].drawing);
                else
                    document.body.appendChild(dialog.drawing);
                dialog.isLoaded = true;
                dialog.parentVisible = true;
            }
            dialog.invalidateLayout();
        }

        static removeDialog(dialog: Element) {
            let dialogFocus = App.dialogsFocus.pop();
            this.dialogs = this.dialogs.filter(d => d !== dialog);
            dialog.layoutValid = true;
            dialog.isLoaded = false;
            dialog.parentVisible = false;
            if (document.readyState == 'complete')
                document.body.removeChild(dialog.drawing);
            if (this.dialogs.length === 0) {
                if (Ui.App.current)
                    Ui.App.current.contentBox.enable();
            }
            else if (this.dialogs.length > 0)
                this.dialogs[this.dialogs.length - 1].enable();
            if (dialogFocus && dialogFocus.focus && (typeof(dialogFocus.focus) == 'function'))
                dialogFocus.focus();
        }

        static appendTopLayer(layer: Element) {
            if (App.style)
                layer.setParentStyle(App.style);
            layer.invalidateLayout();
            this.topLayers.push(layer);
            if (document.readyState == 'complete') {
                document.body.appendChild(layer.drawing);
                layer.isLoaded = true;
                layer.parentVisible = true;
            }
            layer.invalidateLayout();
        }

        static removeTopLayer(layer: Element) {
            App.topLayers = App.topLayers.filter(l => l !== layer);
            if (document.readyState == 'complete')
                document.body.removeChild(layer.drawing);
            layer.isLoaded = false;
            layer.parentVisible = false;
        }

        //
        // Return the arguments given if any
        //
        getArguments() {
            return this.arguments;
        }

        static get isReady(): boolean {
            return this._ready;
        }

        protected onReady() {
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

            if (document.body.children.length > 0)
                document.body.insertBefore(this.drawing, document.body.children[0]);
            else
                document.body.appendChild(this.drawing);

            this.isLoaded = true;
            this.parentVisible = true;
        }

        protected static onWindowKeyUp(event) {
            let key = event.which;

            // escape
            if ((key == 27) && (App.dialogs !== undefined) && (App.dialogs.length > 0)) {
                let element = App.dialogs[App.dialogs.length - 1];
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

        static enqueueDraw(element: Element) {
            element.drawNext = App.drawList;
            App.drawList = element;
            if (App.isReady && App.updateTask === false) {
                App.updateTask = true;
                setTimeout(App.update, 0);
            }
        }

        static enqueueLayout(element: Element) {
            element.layoutNext = App.layoutList;
            App.layoutList = element;
            if (App.isReady && App.updateTask === false) {
                App.updateTask = true;
                requestAnimationFrame(App.update);
            }
        }

        static _style: object | undefined;

        static get style(): object | undefined {
            return this._style;
        }

        static set style(style: object | undefined) {
            this._style = style;
            for (let dialog of this.dialogs)
                dialog.setParentStyle(style);
            for (let layer of this.topLayers)
                layer.setParentStyle(style);
            if (Ui.App.current)
                Ui.App.current.setParentStyle(style);
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
                if ((App.focusElement != undefined) && ((App.focusElement.tagName === 'INPUT') || (App.focusElement.tagName === 'TEXTAREA') || (App.focusElement.contenteditable))) {
                    if (h - 100 > this.lastArrangeHeight)
                        App.focusElement.blur();
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

        static initialize() {
            if(document.readyState == 'complete')
                App.onWindowLoad();
            else 
                window.addEventListener('load', () => App.onWindowLoad());
        }
    }
}

Ui.App.initialize();

