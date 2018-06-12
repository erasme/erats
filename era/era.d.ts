declare function create<T>(ctor: new () => T, props: Partial<T>): T;
declare function assign<T>(obj: T, props: Partial<T>): T;
declare namespace Core {
    class Object {
        serialize(): string;
        getClassName(): string;
        assign(props: Partial<this>): this;
        toString(): string;
    }
}
declare namespace Core {
    class Events<T> {
        private static handlerGenerator;
        readonly list: {
            handler: (event: T) => void;
            capture: boolean;
            id: number;
        }[];
        connect(handler: (event: T) => void, capture?: boolean): number;
        disconnect(handler: ((event: T) => void) | number): void;
        fire(event: T): void;
    }
}
declare var DEBUG: boolean;
declare var htmlNS: string;
declare var svgNS: string;
declare namespace Core {
    interface HashTable<T> {
        [key: string]: T;
    }
    class Util {
        static clone(obj: object): {};
        static encodeURIQuery(obj: any): string;
        static utf8Encode(value: string): string;
        static utf8Decode(value: string): string;
        static toBase64(stringValue: string): string;
        static fromBase64(value: string): string;
        static toNoDiacritics(value: string): string;
    }
    class Navigator {
        static isGecko: boolean;
        static isWebkit: boolean;
        static isIE: boolean;
        static isIE7: boolean;
        static isIE8: boolean;
        static isIE10: boolean;
        static isIE11: boolean;
        static isOpera: boolean;
        static isChrome: boolean;
        static isSafari: boolean;
        static isFirefox: boolean;
        static isFirefox3: boolean;
        static isFirefox3_5: boolean;
        static isFirefox3_6: boolean;
        static iPad: boolean;
        static iPhone: boolean;
        static iOs: boolean;
        static Android: boolean;
        static supportSVG: boolean;
        static supportCanvas: boolean;
        static supportRgba: boolean;
        static supportRgb: boolean;
        static supportOpacity: boolean;
        static supportFormData: boolean;
        static supportFileAPI: boolean;
        static supportUploadDirectory: boolean;
    }
}
declare namespace Core {
    class Uri extends Object {
        scheme: string;
        user: string;
        password: string;
        host: string;
        port: number;
        path: string;
        query: string;
        fragment: string;
        constructor(uri?: string);
        getScheme(): string;
        getUser(): string;
        getPassword(): string;
        getHost(): string;
        getPort(): number;
        getPath(): string;
        getQuery(): string;
        getFragment(): string;
        toString(): string;
        static cleanPath(path: string): string;
        static mergePath(base: string, relative: string): string;
    }
}
declare namespace Core {
    class DoubleLinkedListNode {
        previous?: DoubleLinkedListNode;
        next?: DoubleLinkedListNode;
        data: any;
        constructor(data: any);
    }
    class DoubleLinkedList {
        root: DoubleLinkedListNode;
        length: 0;
        getLength(): 0;
        getFirstNode(): DoubleLinkedListNode;
        getLastNode(): DoubleLinkedListNode;
        appendNode(node: DoubleLinkedListNode): DoubleLinkedListNode;
        prependNode(node: DoubleLinkedListNode): DoubleLinkedListNode;
        removeNode(node: DoubleLinkedListNode): void;
        findNode(data: any): DoubleLinkedListNode;
        getFirst(): any;
        getLast(): any;
        append(data: any): DoubleLinkedListNode;
        prepend(data: any): DoubleLinkedListNode;
        remove(data: any): void;
        clear(): void;
        static moveNext(node: DoubleLinkedListNode): DoubleLinkedListNode;
        isLast(node: DoubleLinkedListNode): boolean;
    }
}
declare namespace Core {
    interface FileInit {
        form?: HTMLFormElement;
        iframe?: HTMLIFrameElement;
        fileInput?: HTMLInputElement;
        fileApi?: any;
    }
    class File extends Object {
        iframe?: HTMLIFrameElement;
        form?: HTMLFormElement;
        fileInput?: HTMLInputElement;
        fileApi?: any;
        constructor(init: FileInit);
        getFileName(): any;
        getRelativePath(): any;
        getMimetype(): any;
        static types: any;
        static getMimetypeFromName(fileName: any): any;
    }
}
declare module Core {
    type MethodType = 'POST' | 'PUT' | 'GET' | 'DELETE';
    interface HttpRequestInit {
        url?: string;
        method?: MethodType;
        binary?: boolean;
        arguments?: object;
        content?: any;
        headers?: object;
        onerror?: (event: {
            target: HttpRequest;
            code: number;
        }) => void;
        ondone?: (event: {
            target: HttpRequest;
        }) => void;
    }
    class HttpRequest extends Object {
        url: string;
        method: MethodType;
        binary: boolean;
        arguments: object;
        content: any;
        headers: object;
        private request;
        static requestHeaders: object;
        readonly error: Events<{
            target: HttpRequest;
            code: number;
        }>;
        onerror: (event: {
            target: HttpRequest;
            code: number;
        }) => void;
        readonly done: Events<{
            target: HttpRequest;
        }>;
        ondone: (event: {
            target: HttpRequest;
        }) => void;
        constructor(init?: HttpRequestInit);
        setRequestHeader(header: any, value: any): void;
        addArgument(argName: any, argValue: any): void;
        abort(): void;
        send(): void;
        sendAsync(): Promise<HttpRequest>;
        getResponseHeader(header: string): string;
        readonly responseText: string;
        readonly responseBase64: string;
        readonly responseJSON: any;
        readonly responseXML: Document;
        readonly status: number;
        static setRequestHeader(header: any, value: any): void;
    }
}
declare namespace Core {
    class DelayedTask extends Object {
        delay: number;
        callback: (task: DelayedTask) => void;
        isDone: boolean;
        handle?: number;
        constructor(delay: number, callback: (task: DelayedTask) => void);
        abort(): void;
    }
}
declare namespace Core {
    interface TimerInit {
        interval?: number;
        arguments?: Array<any>;
    }
    class Timer extends Object {
        interval: number;
        arguments: Array<any>;
        handle: any;
        readonly timeupdated: Events<{
            target: Timer;
            arguments: any[];
        }>;
        ontimeupdated: (event: {
            target: Timer;
            arguments: Array<any>;
        }) => void;
        constructor(init?: TimerInit);
        abort(): void;
    }
}
declare namespace Core {
    interface SocketInit {
        host?: string;
        secure?: boolean;
        port?: number;
        service?: string;
        mode?: 'websocket' | 'poll';
    }
    class Socket extends Object {
        host: string;
        service: string;
        port: number;
        mode: 'websocket' | 'poll';
        secure: boolean;
        websocket: WebSocket;
        websocketdelay: any;
        emuopenrequest: any;
        emupollrequest: any;
        emusendrequest: any;
        emuid: any;
        emumessages: any;
        lastPosition: number;
        readSize: boolean;
        size: number;
        data: any;
        isClosed: boolean;
        closeSent: boolean;
        sep: string;
        lastPoll: any;
        delayPollTask: any;
        pollInterval: number;
        readonly error: Events<{
            target: Socket;
        }>;
        onerror: (event: {
            target: Socket;
        }) => void;
        readonly message: Events<{
            target: Socket;
            message: any;
        }>;
        onmessage: (event: {
            target: Socket;
            message: any;
        }) => void;
        readonly closed: Events<{
            target: Socket;
        }>;
        onclosed: (event: {
            target: Socket;
        }) => void;
        readonly opened: Events<{
            target: Socket;
        }>;
        onopened: (event: {
            target: Socket;
        }) => void;
        static supportWebSocket: boolean;
        constructor(init: SocketInit);
        send(msg: any): void;
        close(): void;
        private onWebSocketOpenTimeout;
        private onWebSocketOpen;
        private onWebSocketError;
        private onWebSocketMessage;
        private onWebSocketClose;
        private emuSocketDataAvailable;
        private emuSocketUpdate;
        private onEmuSocketSendDone;
        private onEmuSocketSendError;
        private onEmuSocketOpenDone;
        onEmuSocketOpenError(request: any, status: any): void;
        onEmuSocketPollDone(): void;
        onEmuSocketPollError(): void;
        delayPollDone(): void;
        sendPoll(): void;
    }
}
declare namespace Core {
    interface RemoteDebugInit {
        host: string;
        port: number;
    }
    class RemoteDebug extends Object {
        host: string;
        port: number;
        socket: Socket;
        socketAlive: boolean;
        retryTask: any;
        nativeConsole: any;
        buffer: Array<any>;
        constructor(init: RemoteDebugInit);
        startSocket(): void;
        protected onSocketOpen: () => void;
        protected onSocketMessage: (e: {
            target: any;
            message: string;
        }) => void;
        protected onSocketError: () => void;
        protected onSocketClose: () => void;
        onConsoleLog(message: any): void;
        onConsoleError(message: any): void;
        onConsoleWarn(message: any): void;
        onError(message: any, url: any, line: any): void;
        static current: RemoteDebug;
        static onConsoleLog(message: any): void;
        static onConsoleError(message: any): void;
        static onConsoleWarn(message: any): void;
        static onError(message: any, url: any, line: any): void;
    }
}
declare namespace Core {
    interface FilePostUploaderInit {
        method?: string;
        file?: File;
        field?: string;
        service?: string;
        destination?: string;
        arguments?: object;
        onprogress?: (event: {
            target: FilePostUploader;
            loaded: number;
            total: number;
        }) => void;
        oncompleted?: (event: {
            target: FilePostUploader;
        }) => void;
        onerror?: (event: {
            target: FilePostUploader;
            status: number;
        }) => void;
    }
    class FilePostUploader extends Object {
        protected _file: File;
        protected _service: string;
        protected reader: undefined;
        protected request: XMLHttpRequest;
        protected binaryString: boolean;
        protected _responseText: string;
        protected fileReader: FileReader;
        protected boundary: string;
        protected _method: string;
        protected fields: object;
        protected _isCompleted: boolean;
        field: string;
        protected loadedOctets: number;
        protected totalOctets: number;
        readonly progress: Events<{
            target: FilePostUploader;
            loaded: number;
            total: number;
        }>;
        onprogress: (event: {
            target: FilePostUploader;
            loaded: number;
            total: number;
        }) => void;
        readonly completed: Events<{
            target: FilePostUploader;
        }>;
        oncompleted: (event: {
            target: FilePostUploader;
        }) => void;
        readonly error: Events<{
            target: FilePostUploader;
            status: number;
        }>;
        onerror: (event: {
            target: FilePostUploader;
            status: number;
        }) => void;
        constructor(init?: FilePostUploaderInit);
        method: string;
        file: File;
        service: string;
        setField(name: any, value: any): void;
        arguments: object;
        destination: string;
        send(): void;
        sendAsync(): Promise<FilePostUploader>;
        abort(): void;
        readonly responseText: string;
        readonly responseJSON: any;
        readonly isCompleted: boolean;
        readonly total: number;
        readonly loaded: number;
        protected onStateChange(event: any): void;
        protected onUpdateProgress(event: any): void;
        protected onFileReaderError(event: any): void;
        protected onFileReaderLoad(event: any): void;
        protected onIFrameLoad(event: any): void;
    }
}
declare namespace Anim {
    type EaseMode = 'in' | 'out' | 'inout';
    interface EasingFunctionInit {
        mode?: EaseMode;
    }
    class EasingFunction extends Core.Object {
        mode: EaseMode;
        constructor(init?: EasingFunctionInit);
        ease(normalizedTime: number): number;
        protected easeInCore(normalizedTime: number): number;
        static eases: any;
        static register(easeName: string, classType: Function): void;
        static parse(ease: string): any;
        static create(ease: string | EasingFunction): EasingFunction;
    }
}
declare namespace Anim {
    class LinearEase extends EasingFunction {
        easeInCore(normalizedTime: any): any;
    }
}
declare namespace Anim {
    interface PowerEaseInit extends EasingFunctionInit {
        power?: number;
    }
    class PowerEase extends EasingFunction implements PowerEaseInit {
        power: number;
        constructor(init?: PowerEaseInit);
        protected easeInCore(normalizedTime: number): number;
    }
}
declare namespace Anim {
    interface BounceEaseInit extends EasingFunctionInit {
        bounces?: number;
        bounciness?: number;
    }
    class BounceEase extends EasingFunction implements BounceEaseInit {
        bounces: number;
        bounciness: number;
        constructor(init?: BounceEaseInit);
        protected easeInCore(normalizedTime: number): number;
    }
}
declare namespace Anim {
    interface ElasticEaseInit extends EasingFunctionInit {
        oscillations?: number;
        springiness?: number;
    }
    class ElasticEase extends EasingFunction implements ElasticEaseInit {
        oscillations: number;
        springiness: number;
        constructor(init?: ElasticEaseInit);
        protected easeInCore(normalizedTime: number): number;
    }
}
declare namespace Anim {
    class TimeManager extends Core.Object {
        clocks: any;
        timer: any;
        start: number;
        readonly tick: Core.Events<{
            target: TimeManager;
        }>;
        constructor();
        add(clock: any): void;
        remove(clock: any): void;
        private onTick;
        static current: TimeManager;
    }
}
declare namespace Anim {
    class AnimationManager extends Core.Object {
        clocks: any;
        start: number;
        onTickBind: any;
        readonly tick: Core.Events<{
            target: AnimationManager;
        }>;
        constructor();
        add(clock: any): void;
        remove(clock: any): void;
        forceTick(): void;
        private onTick;
        static current: AnimationManager;
    }
}
declare namespace Anim {
    interface Target {
        setAnimClock(clock: Clock): void;
    }
    interface ClockInit {
        animation?: boolean;
        repeat?: 'forever' | number;
        speed?: number;
        autoReverse?: boolean;
        beginTime?: number;
        ease?: EasingFunction | string;
        target?: Target;
        duration?: number | 'forever' | 'automatic';
        parent?: Clock;
        ontimeupdate?: (event: {
            target: Clock;
            progress: number;
            deltaTick: number;
        }) => void;
        oncompleted?: (event: {
            target: Clock;
        }) => void;
    }
    class Clock extends Core.Object implements ClockInit {
        private _animation;
        private _parent;
        private _time;
        private _iteration;
        private _progress;
        private _isActive;
        private _globalTime;
        private startTime;
        private lastTick;
        private _beginTime;
        private isPaused;
        private _speed;
        private _duration;
        pendingState: 'none' | 'active' | 'paused' | 'resumed' | 'stopped';
        private _autoReverse;
        private _repeat;
        private _target;
        private _ease;
        readonly timeupdate: Core.Events<{
            target: Clock;
            progress: number;
            deltaTick: number;
        }>;
        readonly completed: Core.Events<{
            target: Clock;
        }>;
        constructor(init?: ClockInit);
        animation: boolean;
        repeat: 'forever' | number;
        speed: number;
        autoReverse: boolean;
        beginTime: number;
        ease: EasingFunction | string;
        target: Target;
        duration: number | 'forever' | 'automatic';
        parent: Clock;
        readonly globalTime: number;
        readonly isActive: boolean;
        readonly time: number;
        readonly iteration: number;
        readonly progress: number;
        begin(): void;
        pause(): void;
        resume(): void;
        stop(): void;
        complete(): void;
        protected onTimeUpdate(deltaTick: any): void;
        update(parentGlobalTime: number): void;
    }
}
declare namespace Anim {
    class ClockGroup extends Clock {
        children: Clock[];
        appendChild(child: Clock): void;
        content: Clock[];
        begin(): void;
        pause(): void;
        resume(): void;
        stop(): void;
        complete(): void;
        update(parentGlobalTime: any): void;
    }
}
declare namespace Ui {
    class Matrix extends Core.Object {
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
        constructor();
        isTranslateOnly(): boolean;
        isIdentity(): boolean;
        translate(x: number, y: number): Matrix;
        rotate(angle: number): Matrix;
        scale(scaleX: number, scaleY?: number): Matrix;
        multiply(matrix: Matrix): Matrix;
        getDeterminant(): number;
        inverse(): Matrix;
        setMatrix(a: number, b: number, c: number, d: number, e: number, f: number): void;
        getA(): number;
        getB(): number;
        getC(): number;
        getD(): number;
        getE(): number;
        getF(): number;
        clone(): Matrix;
        toString(): string;
        static createMatrix(a: number, b: number, c: number, d: number, e: number, f: number): Matrix;
        static createTranslate(x: number, y: number): Matrix;
        static createScaleAt(scaleX: number, scaleY: number, centerX: number, centerY: number): Matrix;
        static createScale(scaleX: number, scaleY?: number): Matrix;
        static createRotateAt(angle: number, centerX: number, centerY: number): Matrix;
        static createRotate(angle: number): Matrix;
        static parse(stringMatrix: string): Matrix;
    }
}
declare namespace Ui {
    class Point extends Core.Object {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        matrixTransform(matrix: Matrix): Point;
        multiply(value: number | Matrix): Point;
        divide(value: number | Matrix): Point;
        add(value: number | Point): Point;
        substract(value: number | Point): Point;
        setPoint(point: any): void;
        getX(): number;
        setX(x: number): void;
        getY(): number;
        setY(y: number): void;
        getLength(): number;
        clone(): Point;
        toString(): string;
    }
}
declare namespace Ui {
    class Color extends Core.Object {
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(r?: number, g?: number, b?: number, a?: number);
        addA(a: number): Color;
        addY(y: number): Color;
        addH(h: number): Color;
        addS(s: number): Color;
        addL(l: number): Color;
        getCssRgba(): string;
        getCssRgb(): string;
        getCssHtml(): string;
        getRgba(): {
            r: number;
            g: number;
            b: number;
            a: number;
        };
        getRgb(): {
            r: number;
            g: number;
            b: number;
            a: number;
        };
        getHsla(): {
            h: any;
            s: any;
            l: number;
            a: number;
        };
        getHsl(): {
            h: any;
            s: any;
            l: number;
            a: number;
        };
        getYuva(): {
            y: number;
            u: number;
            v: number;
            a: number;
        };
        getYuv(): {
            y: number;
            u: number;
            v: number;
            a: number;
        };
        private initFromHsl;
        private initFromYuv;
        private initFromRgb;
        toString(): string;
        static knownColor: object;
        static parse(color: string): Color;
        static create(color: string | Color): Color;
        static createFromRgb(r: number, g: number, b: number, a?: number): Color;
        static createFromYuv(y: number, u: number, v: number, a?: number): Color;
        static createFromHsl(h: number, s: number, l: number, a?: number): Color;
    }
}
declare namespace Ui {
    interface GradientStop {
        offset: number;
        color: Color | string;
    }
    class LinearGradient extends Core.Object {
        orientation: Orientation;
        stops: GradientStop[];
        image: any;
        constructor(stops?: GradientStop[], orientation?: Orientation);
        getBackgroundImage(): any;
        getSVGGradient(): any;
        getCanvasGradient(context: any, width: any, height: any): any;
    }
}
declare namespace Ui {
    type Size = {
        width: number;
        height: number;
    };
    type VerticalAlign = 'top' | 'center' | 'bottom' | 'stretch';
    type HorizontalAlign = 'left' | 'center' | 'right' | 'stretch';
    interface ElementInit {
        selectable?: boolean;
        id?: string;
        focusable?: boolean;
        resizable?: boolean;
        role?: string;
        width?: number;
        height?: number;
        maxWidth?: number;
        maxHeight?: number;
        verticalAlign?: VerticalAlign;
        horizontalAlign?: HorizontalAlign;
        clipToBounds?: boolean;
        margin?: number;
        marginTop?: number;
        marginBottom?: number;
        marginLeft?: number;
        marginRight?: number;
        opacity?: number;
        transform?: Matrix;
        eventsHidden?: boolean;
        style?: object;
        isDisabled?: boolean;
        isVisible?: boolean;
        onfocused?: (event: {
            target: Element;
        }) => void;
        onblurred?: (event: {
            target: Element;
        }) => void;
        onloaded?: (event: {
            target: Element;
        }) => void;
        onunloaded?: (event: {
            target: Element;
        }) => void;
    }
    class Element extends Core.Object implements Anim.Target {
        name?: string;
        private _marginTop;
        private _marginBottom;
        private _marginLeft;
        private _marginRight;
        private _resizable;
        private _parent?;
        private _width?;
        private _height?;
        private _maxWidth?;
        private _maxHeight?;
        private _drawing;
        private collapse;
        private measureValid;
        private measureConstraintPixelRatio;
        private measureConstraintWidth;
        private measureConstraintHeight;
        private _measureWidth;
        private _measureHeight;
        private arrangeValid;
        private arrangeX;
        private arrangeY;
        private arrangeWidth;
        private arrangeHeight;
        private arrangePixelRatio;
        drawValid: boolean;
        drawNext?: Element;
        layoutValid: boolean;
        layoutNext?: Element;
        private _layoutX;
        private _layoutY;
        private _layoutWidth;
        private _layoutHeight;
        private _isLoaded;
        private _verticalAlign;
        private _horizontalAlign;
        private _clipToBounds;
        clipX?: number;
        clipY?: number;
        clipWidth?: number;
        clipHeight?: number;
        private _visible?;
        private _parentVisible?;
        private _eventsHidden;
        private _focusable;
        private _hasFocus;
        isMouseFocus: boolean;
        isMouseDownFocus: boolean;
        private _selectable;
        private _transform?;
        transformOriginX: number;
        transformOriginY: number;
        transformOriginAbsolute: boolean;
        animClock?: Anim.Clock;
        private _opacity;
        private parentOpacity;
        private _disabled?;
        parentDisabled?: boolean;
        private _style;
        private _parentStyle;
        mergeStyle: object | undefined;
        readonly focused: Core.Events<{
            target: Element;
        }>;
        onfocused: (event: {
            target: Element;
        }) => void;
        readonly blurred: Core.Events<{
            target: Element;
        }>;
        onblurred: (event: {
            target: Element;
        }) => void;
        readonly loaded: Core.Events<{
            target: Element;
        }>;
        onloaded: (event: {
            target: Element;
        }) => void;
        readonly unloaded: Core.Events<{
            target: Element;
        }>;
        onunloaded: (event: {
            target: Element;
        }) => void;
        readonly enabled: Core.Events<{
            target: Element;
        }>;
        onenabled: (event: {
            target: Element;
        }) => void;
        readonly disabled: Core.Events<{
            target: Element;
        }>;
        ondisabled: (event: {
            target: Element;
        }) => void;
        readonly visible: Core.Events<{
            target: Element;
        }>;
        onvisible: (event: {
            target: Element;
        }) => void;
        readonly hidden: Core.Events<{
            target: Element;
        }>;
        onhidden: (event: {
            target: Element;
        }) => void;
        readonly ptrdowned: Core.Events<PointerEvent>;
        onptrdowned: (event: PointerEvent) => void;
        readonly ptrmoved: Core.Events<PointerEvent>;
        onptrmoved: (event: PointerEvent) => void;
        readonly ptrupped: Core.Events<PointerEvent>;
        onptrupped: (event: PointerEvent) => void;
        readonly ptrcanceled: Core.Events<PointerEvent>;
        onptrcanceled: (event: PointerEvent) => void;
        readonly wheelchanged: Core.Events<WheelEvent>;
        onwheelchanged: (event: WheelEvent) => void;
        readonly dragover: Core.Events<DragEvent>;
        ondragover: (event: DragEvent) => void;
        constructor(init?: ElementInit);
        readonly drawing: any;
        selectable: boolean;
        resizable: boolean;
        readonly layoutX: number;
        readonly layoutY: number;
        readonly layoutWidth: number;
        readonly layoutHeight: number;
        id: string;
        focusable: boolean;
        private onMouseDownFocus;
        private onMouseUpFocus;
        getIsMouseFocus(): boolean;
        role: string;
        measure(width: number, height: number): Size;
        protected measureCore(width: number, height: number): Size;
        invalidateMeasure(): void;
        invalidateLayout(): void;
        protected onChildInvalidateMeasure(child: any, event: any): void;
        updateLayout(width: number, height: number): void;
        layoutCore(): void;
        arrange(x: number, y: number, width: number, height: number): void;
        protected arrangeCore(width: number, height: number): void;
        invalidateArrange(): void;
        protected onChildInvalidateArrange(child: any): void;
        draw(): void;
        protected drawCore(): void;
        invalidateDraw(): void;
        protected renderDrawing(): any;
        width: number | undefined;
        height: number | undefined;
        maxWidth: number | undefined;
        maxHeight: number | undefined;
        verticalAlign: VerticalAlign;
        horizontalAlign: HorizontalAlign;
        clipToBounds: boolean;
        setClipRectangle(x: number, y: number, width: number, height: number): void;
        updateClipRectangle(): void;
        margin: number;
        marginTop: number;
        marginBottom: number;
        marginLeft: number;
        marginRight: number;
        opacity: number;
        focus(): void;
        blur(): void;
        transform: Matrix | undefined;
        setTransformOrigin(x: number, y: number, absolute?: boolean): void;
        getInverseLayoutTransform(): Matrix;
        getLayoutTransform(): Matrix;
        transformToWindow(): Matrix;
        transformFromWindow(): Matrix;
        transformToElement(element: Element): Matrix;
        pointToWindow(point: Point): Point;
        pointFromWindow(point: Point): Point;
        pointFromElement(element: Element, point: Point): Point;
        getIsInside(point: Point): boolean;
        eventsHidden: boolean;
        elementFromPoint(point: Point): Element | undefined;
        readonly measureWidth: number;
        readonly measureHeight: number;
        readonly isCollapsed: boolean;
        hide(collapse?: boolean): void;
        show(): void;
        isVisible: boolean;
        parentVisible: boolean;
        protected onInternalHidden(): void;
        protected onHidden(): void;
        protected onInternalVisible(): void;
        checkVisible(): void;
        protected onVisible(): void;
        disable(): void;
        enable(): void;
        setEnable(enable: boolean): void;
        isDisabled: boolean;
        setParentDisabled(disabled: boolean): void;
        protected onInternalDisable(): void;
        protected onDisable(): void;
        protected onInternalEnable(): void;
        protected onEnable(): void;
        private containSubStyle;
        private fusionStyle;
        private getClassStyle;
        private mergeStyles;
        getIsChildOf(parent: Element): boolean;
        parent: Element | undefined;
        getParentByClass<T extends Ui.Element>(classFunc: new (...args: any[]) => T): T | undefined;
        setParentStyle(parentStyle: object | undefined): void;
        style: object | undefined;
        setStyleProperty(property: string, value: any): void;
        getStyleProperty(property: string): any;
        protected onInternalStyleChange(): void;
        protected onStyleChange(): void;
        readonly hasFocus: boolean;
        scrollIntoView(): void;
        protected onScrollIntoView(el: Element): void;
        get(name: string): Element | undefined;
        isLoaded: boolean;
        protected onFocus(event?: any): void;
        protected onBlur(event?: any): void;
        private updateTransform;
        setAnimClock(clock: Anim.Clock): void;
        private onAnimClockComplete;
        protected onLoad(): void;
        protected onUnload(): void;
        static transformToWindow(element: Element): Matrix;
        static transformFromWindow(element: Element): Matrix;
        static elementFromPoint(point: Point): Element;
        static getIsDrawingChildOf(drawing: any, parent: any): boolean;
        static setSelectable(drawing: any, selectable: any): void;
    }
}
declare namespace Ui {
    interface ContainerInit extends ElementInit {
    }
    class Container extends Element implements ContainerInit {
        private _children;
        private _containerDrawing;
        constructor(init?: ContainerInit);
        containerDrawing: any;
        appendChild(child: Element): void;
        prependChild(child: Element): void;
        removeChild(child: Element): void;
        insertChildAt(child: Element, position: number): void;
        insertChildBefore(child: Element, beforeChild: Element): void;
        moveChildAt(child: Element, position: number): void;
        readonly children: Element[];
        readonly firstChild: Element | undefined;
        readonly lastChild: Element | undefined;
        getChildPosition(child: Element): number;
        hasChild(child: Element): boolean;
        clear(): void;
        get(name: string): Element | undefined;
        elementFromPoint(point: Point): Element | undefined;
        protected onLoad(): void;
        protected onUnload(): void;
        protected onInternalStyleChange(): void;
        protected onInternalDisable(): void;
        protected onInternalEnable(): void;
        protected onInternalVisible(): void;
        protected onInternalHidden(): void;
    }
}
declare namespace Ui {
    class SvgParser extends Core.Object {
        path: string;
        pos: number;
        cmd?: string;
        current: any;
        value: boolean;
        end: boolean;
        constructor(path: string);
        isEnd(): boolean;
        next(): void;
        setCmd(cmd: any): void;
        getCmd(): string;
        getCurrent(): any;
        isCmd(): boolean;
        isValue(): boolean;
    }
}
declare namespace Ui {
    interface CanvasRenderingContext2D {
        fillStyle: string;
        strokeStyle: string;
        lineWidth: number;
        lineDash: any;
        globalAlpha: number;
        currentTransform: SVGMatrix;
        font: string;
        textAlign: 'start' | 'end' | 'left' | 'right' | 'center';
        textBaseline: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
        direction: 'ltr' | 'rtl' | 'inherit';
        beginPath(): any;
        moveTo(x: number, y: number): any;
        lineTo(x: number, y: number): any;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): any;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): any;
        rect(x: number, y: number, w: number, h: number): any;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): any;
        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean): any;
        closePath(): any;
        fill(): any;
        stroke(): any;
        clip(): any;
        resetClip(): any;
        getLineDash(): any;
        setLineDash(lineDash: any): any;
        drawImage(image: any, sx?: number, sy?: number, sw?: number, sh?: number, dx?: number, dy?: number, dw?: number, dh?: number): any;
        fillText(text: string, x: number, y: number, maxWidth?: number): any;
        strokeText(text: string, x: number, y: number, maxWidth?: number): any;
        save(): any;
        restore(): any;
        scale(x: number, y: number): any;
        rotate(angle: number): any;
        translate(x: number, y: number): any;
        transform(a: number, b: number, c: number, d: number, e: number, f: number): any;
        setTransform(a: number, b: number, c: number, d: number, e: number, f: number): any;
        resetTransform(): any;
        clearRect(x: number, y: number, w: number, h: number): any;
        fillRect(x: number, y: number, w: number, h: number): any;
        strokeRect(x: number, y: number, w: number, h: number): any;
        createLinearGradient(x0: number, y0: number, x1: number, y1: number): any;
        measureText(text: string): any;
        svgPath(path: string): any;
        roundRect(x: number, y: number, w: number, h: number, radiusTopLeft: number, radiusTopRight: number, radiusBottomRight: number, radiusBottomLeft: number, antiClockwise: boolean): any;
        roundRectFilledShadow(x: any, y: any, width: any, height: any, radiusTopLeft: any, radiusTopRight: any, radiusBottomRight: any, radiusBottomLeft: any, inner: any, shadowWidth: any, color: any): any;
    }
    interface CanvasElementInit extends ContainerInit {
    }
    class CanvasElement extends Container implements CanvasElementInit {
        protected canvasEngine: string | 'canvas' | 'svg';
        private _context;
        private svgDrawing;
        private dpiRatio;
        constructor(init?: ContainerInit);
        update(): void;
        readonly context: CanvasRenderingContext2D;
        protected updateCanvas(context: Ui.CanvasRenderingContext2D): void;
        protected renderDrawing(): any;
        svgToDataURL(): any;
        protected arrangeCore(width: number, height: number): void;
        protected drawCore(): void;
        protected onInternalVisible(): void;
    }
}
declare namespace Core {
    class SVG2DPath extends Object {
        d: any;
        x: number;
        y: number;
        constructor();
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        quadraticCurveTo(cpx: any, cpy: any, x: any, y: any): void;
        bezierCurveTo(cp1x: any, cp1y: any, cp2x: any, cp2y: any, x: any, y: any): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radiusX: number, radiusY: number, angle: number): void;
        closePath(): void;
        rect(x: any, y: any, w: any, h: any): void;
        arc(x: any, y: any, radius: any, startAngle: any, endAngle: any, anticlockwise: any): void;
        ellipse(x: any, y: any, radiusX: any, radiusY: any, rotation: any, startAngle: any, endAngle: any, anticlockwise: any): void;
        roundRect(x: any, y: any, w: any, h: any, radiusTopLeft: any, radiusTopRight: any, radiusBottomRight: any, radiusBottomLeft: any, antiClockwise: any): void;
        getSVG(): Element;
    }
    class SVGGradient extends Object {
        static counter: number;
        gradient: any;
        id: any;
        constructor(x0: number, y0: number, x1: number, y1: number);
        getId(): any;
        addColorStop(offset: any, color: any): void;
        getSVG(): any;
    }
    class SVG2DContext extends Object implements Ui.CanvasRenderingContext2D {
        fillStyle: any;
        strokeStyle: any;
        lineWidth: number;
        lineDash: any;
        globalAlpha: number;
        currentTransform: any;
        font: any;
        textAlign: any;
        textBaseline: any;
        direction: any;
        clipId: any;
        document: any;
        currentPath: any;
        g: any;
        defs: any;
        states: any;
        constructor(svgElement: SVGSVGElement);
        beginPath(): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        quadraticCurveTo(cpx: any, cpy: any, x: any, y: any): void;
        bezierCurveTo(cp1x: any, cp1y: any, cp2x: any, cp2y: any, x: any, y: any): void;
        rect(x: number, y: number, w: number, h: number): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
        roundRect(x: number, y: number, w: number, h: number, radiusTopLeft: number, radiusTopRight: number, radiusBottomRight: number, radiusBottomLeft: number, antiClockwise?: boolean): void;
        closePath(): void;
        fill(): void;
        stroke(): void;
        clip(): void;
        resetClip(): void;
        getLineDash(): any;
        setLineDash(lineDash: any): void;
        drawImage(image: any, sx?: number, sy?: number, sw?: number, sh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void;
        fillText(text: string, x: number, y: number, maxWidth: number): void;
        strokeText(text: string, x: number, y: number, maxWidth: number): void;
        save(): void;
        restore(): void;
        scale(x: number, y: number): void;
        rotate(angle: number): void;
        translate(x: number, y: number): void;
        transform(a: any, b: any, c: any, d: any, e: any, f: any): void;
        setTransform(a: any, b: any, c: any, d: any, e: any, f: any): void;
        resetTransform(): void;
        clearRect(x: any, y: any, w: any, h: any): void;
        fillRect(x: any, y: any, w: any, h: any): void;
        strokeRect(x: any, y: any, w: any, h: any): void;
        createLinearGradient(x0: any, y0: any, x1: any, y1: any): SVGGradient;
        measureText(text: any): any;
        svgPath(path: any): void;
        parseFont(font: any): {
            style: any;
            weight: any;
            size: number;
            family: any;
        };
        roundRectFilledShadow(x: any, y: any, width: any, height: any, radiusTopLeft: any, radiusTopRight: any, radiusBottomRight: any, radiusBottomLeft: any, inner: any, shadowWidth: any, color: any): void;
        getSVG(): any;
        static counter: number;
    }
}
declare namespace Ui {
    interface RectangleInit extends CanvasElementInit {
        fill?: Color | LinearGradient | string;
        radius?: number;
        radiusTopLeft?: number;
        radiusTopRight?: number;
        radiusBottomLeft?: number;
        radiusBottomRight?: number;
    }
    class Rectangle extends CanvasElement implements RectangleInit {
        private _fill;
        private _radiusTopLeft;
        private _radiusTopRight;
        private _radiusBottomLeft;
        private _radiusBottomRight;
        constructor(init?: RectangleInit);
        fill: Color | LinearGradient | string;
        radius: number;
        radiusTopLeft: number;
        radiusTopRight: number;
        radiusBottomLeft: number;
        radiusBottomRight: number;
        updateCanvas(ctx: any): void;
    }
}
declare namespace Ui {
    class Separator extends Rectangle {
        constructor();
        onStyleChange(): void;
        static style: any;
    }
}
declare namespace Ui {
    interface ShapeInit extends CanvasElementInit {
        scale?: number;
        fill?: string | undefined | Color | LinearGradient;
        path?: string;
    }
    interface ShapeStyle {
        color: string | undefined | Color | LinearGradient;
    }
    class Shape extends CanvasElement implements ShapeInit {
        private _fill?;
        private _path?;
        private _scale;
        constructor(init?: ShapeInit);
        scale: number;
        fill: Color | LinearGradient | string | undefined;
        path: string;
        onStyleChange(): void;
        updateCanvas(ctx: any): void;
        static style: ShapeStyle;
    }
}
declare namespace Ui {
    interface IconInit extends ShapeInit {
        icon?: string;
    }
    class Icon extends Shape implements IconInit {
        constructor(init?: IconInit);
        icon: string;
        protected arrangeCore(width: number, height: number): void;
        static icons: object;
        static initialize(): void;
        static getPath(icon: any): any;
        static getNames(): string[];
        static register(iconName: any, iconPath: any): void;
        static override(iconName: any, iconPath: any): void;
        static parse(icon: any): Icon;
        static drawIcon(ctx: any, icon: any, size: any, fill: any): void;
        static drawIconAndBadge(ctx: any, icon: any, size: any, fill: any, badgeText: any, badgeSize: any, badgeFill: any, textFill: any): void;
    }
}
declare namespace Ui {
    interface DualIconInit extends CanvasElementInit {
        icon?: string;
        fill?: Color;
        stroke?: Color;
        strokeWidth?: number;
    }
    class DualIcon extends CanvasElement {
        private _icon?;
        private _fill?;
        private _stroke?;
        private _strokeWidth?;
        constructor(init?: DualIconInit);
        icon: string;
        fill: Color;
        stroke: Color;
        strokeWidth: number;
        updateCanvas(ctx: any): void;
        static style: any;
    }
}
declare namespace Ui {
    class Event extends Core.Object {
        type: string;
        bubbles: boolean;
        cancelable: boolean;
        target: Ui.Element;
        cancelBubble: boolean;
        stop: boolean;
        constructor();
        stopPropagation(): void;
        stopImmediatePropagation(): void;
        getIsPropagationStopped(): boolean;
        setType(type: string): void;
        setBubbles(bubbles: boolean): void;
        dispatchEvent(target: Ui.Element): void;
    }
}
declare namespace Ui {
    class PointerEvent extends Event {
        pointer: Pointer;
        clientX: number;
        clientY: number;
        pointerType: string;
        constructor(type: string, pointer: Pointer);
    }
    class PointerWatcher extends Core.Object {
        element: Element;
        pointer: Pointer;
        readonly downed: Core.Events<{
            target: PointerWatcher;
        }>;
        readonly moved: Core.Events<{
            target: PointerWatcher;
        }>;
        readonly upped: Core.Events<{
            target: PointerWatcher;
        }>;
        readonly cancelled: Core.Events<{
            target: PointerWatcher;
        }>;
        constructor(element: Element, pointer: Pointer);
        getAbsoluteDelta(): {
            x: number;
            y: number;
        };
        getDelta(): {
            x: number;
            y: number;
        };
        getPosition(): Point;
        getIsInside(): boolean;
        getDirection(): "left" | "right" | "top" | "bottom";
        getSpeed(): {
            x: number;
            y: number;
        };
        getIsCaptured(): boolean;
        capture(): void;
        release(): void;
        cancel(): void;
        down(): void;
        move(): void;
        up(): void;
        unwatch(): void;
    }
    class Pointer extends Core.Object {
        id: number;
        x: number;
        y: number;
        initialX: number;
        initialY: number;
        altKey: boolean;
        ctrlKey: boolean;
        shiftKey: boolean;
        type: string;
        start: number;
        cumulMove: number;
        chainLevel: number;
        watchers: PointerWatcher[];
        captureWatcher: PointerWatcher;
        history: any;
        buttons: number;
        button: number;
        readonly ptrmoved: Core.Events<{
            target: Pointer;
        }>;
        readonly ptrupped: Core.Events<{
            target: Pointer;
        }>;
        readonly ptrdowned: Core.Events<{
            target: Pointer;
        }>;
        readonly ptrcanceled: Core.Events<{
            target: Pointer;
        }>;
        constructor(type: string, id: number);
        capture(watcher: any): void;
        release(watcher: any): void;
        getType(): string;
        getIsDown(): boolean;
        getIsCaptured(): boolean;
        getX(): number;
        getY(): number;
        getInitialX(): number;
        getInitialY(): number;
        setInitialPosition(x: any, y: any): void;
        getButtons(): number;
        setButtons(buttons: any): void;
        getChainLevel(): number;
        getAltKey(): boolean;
        setAltKey(altKey: any): void;
        getCtrlKey(): boolean;
        setCtrlKey(ctrlKey: any): void;
        getShiftKey(): boolean;
        setShiftKey(shiftKey: any): void;
        setControls(altKey: any, ctrlKey: any, shiftKey: any): void;
        move(x: number, y: number): void;
        getIsHold(): boolean;
        getDelta(): number;
        getCumulMove(): number;
        getIsMove(): boolean;
        getPosition(element: Element): Point;
        getIsInside(element: Element): boolean;
        down(x: number, y: number, buttons: number, button: number): void;
        up(): void;
        cancel(): void;
        watch(element: any): PointerWatcher;
        unwatch(watcher: any): void;
        static HOLD_DELAY: number;
        static MOUSE_MOVE_DELTA: number;
        static MOVE_DELTA: number;
        static HISTORY_TIMELAPS: number;
    }
    class PointerManager extends Core.Object {
        touches: any;
        lastUpdate: any;
        lastTouchX: number;
        lastTouchY: number;
        lastDownTouchX: number;
        lastDownTouchY: number;
        mouse: Pointer;
        app: App;
        pointers: Core.HashTable<Pointer>;
        constructor(app: App);
        onSelectStart(event: any): void;
        onMouseDown(event: MouseEvent): void;
        onMouseMove(event: MouseEvent): void;
        onMouseUp(event: MouseEvent): void;
        onWindowLoad(): void;
        onPointerDown(event: any): void;
        onPointerMove(event: any): void;
        onPointerUp(event: any): void;
        onPointerCancel(event: any): void;
        updateTouches(event: TouchEvent): void;
    }
}
declare namespace Ui {
    class DragEffectIcon extends DualIcon {
        protected onStyleChange(): void;
        static style: object;
    }
    class DragEvent extends Event {
        clientX: number;
        clientY: number;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
        metaKey: boolean;
        dataTransfer: DragDataTransfer;
        effectAllowed: string;
        private deltaX;
        private deltaY;
        constructor();
        preventDefault(): void;
    }
    class DragNativeData extends Core.Object {
        dataTransfer: any;
        constructor(dataTransfer: any);
        getTypes(): any;
        hasTypes(...args: any[]): boolean;
        hasType(type: any): boolean;
        hasFiles(): boolean;
        getFiles(): any[];
        getData(type: any): any;
    }
    class DragWatcher extends Core.Object {
        effectAllowed: any;
        dataTransfer: DragDataTransfer;
        element: Element;
        x: number;
        y: number;
        readonly dropped: Core.Events<{
            target: DragWatcher;
            effect: string;
            x: number;
            y: number;
        }>;
        readonly leaved: Core.Events<{
            target: DragWatcher;
        }>;
        readonly moved: Core.Events<{
            target: DragWatcher;
            x: number;
            y: number;
        }>;
        constructor(element: Element, dataTransfer: DragDataTransfer);
        getPosition(): Point;
        getElement(): Element;
        getDataTransfer(): DragDataTransfer;
        getEffectAllowed(): any;
        setEffectAllowed(effect: any): void;
        move(x: number, y: number): void;
        leave(): void;
        drop(dropEffect: string): void;
        release(): void;
    }
    interface DragDataTransfer {
        getPosition(): Point;
        getData(): any;
        capture(element: Element, effect: any): DragWatcher;
        releaseDragWatcher(dragWatcher: DragWatcher): void;
    }
    class DragEmuDataTransfer extends Core.Object implements DragDataTransfer {
        draggable: Element;
        image: HTMLElement;
        imageEffect: DragEffectIcon;
        catcher: HTMLElement;
        startX: number;
        startY: number;
        dropX: number;
        dropY: number;
        x: number;
        y: number;
        startImagePoint: Point;
        overElement: Element;
        hasStarted: boolean;
        dragDelta: Point;
        effectAllowed: any;
        watcher: PointerWatcher;
        pointer: Pointer;
        dropEffect: any;
        dropEffectIcon: any;
        private _data;
        timer: Core.DelayedTask;
        dropFailsTimer: Anim.Clock;
        delayed: boolean;
        dragWatcher: DragWatcher;
        readonly started: Core.Events<{
            target: DragEmuDataTransfer;
        }>;
        readonly ended: Core.Events<{
            target: DragEmuDataTransfer;
        }>;
        constructor(draggable: Element, x: number, y: number, delayed: boolean, pointer: Pointer);
        setData(data: any): void;
        getData(): any;
        hasData(): boolean;
        getPosition(): Point;
        getDragDelta(): Point;
        protected generateImage(element: any): HTMLElement;
        protected onTimer(): void;
        capture(element: Element, effect: any): DragWatcher;
        releaseDragWatcher(dragWatcher: DragWatcher): void;
        protected onPointerMove: (e: {
            target: PointerWatcher;
        }) => void;
        protected onPointerUp: (e: {
            target: PointerWatcher;
        }) => void;
        protected onPointerCancel: (e: {
            target: PointerWatcher;
        }) => void;
        protected removeImage(): void;
        protected onDropFailsTimerUpdate(clock: any, progress: any): void;
        static getMergedEffectAllowed(effectAllowed1: any, effectAllowed2: any): any;
        static getMatchingDropEffect(srcEffectAllowed: any, dstEffectAllowed: any, pointerType: any, ctrlKey: any, altKey: any, shiftKey: any): any;
    }
    class DragNativeDataTransfer extends Core.Object implements DragDataTransfer {
        dataTransfer: any;
        dragWatcher: DragWatcher;
        nativeData: any;
        dropEffect: any;
        position: Point;
        constructor();
        getPosition(): Point;
        setPosition(position: Point): void;
        getData(): any;
        setDataTransfer(dataTransfer: any): void;
        capture(element: Element, effect: any): DragWatcher;
        releaseDragWatcher(dragWatcher: DragWatcher): void;
    }
    class DragNativeManager extends Core.Object {
        app: App;
        dataTransfer: DragNativeDataTransfer;
        nativeTarget: any;
        constructor(app: App);
        protected onDragOver(event: any): boolean;
        protected onDragEnter(e: any): void;
        protected onDragLeave(e: any): void;
        protected onDrop(event: any): void;
        nativeToCustom(effectAllowed: string): string[];
        customToNative(effectAllowed: any): string;
    }
}
declare namespace Ui {
    class WheelEvent extends Event {
        deltaX: number;
        deltaY: number;
        clientX: number;
        clientY: number;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
        metaKey: boolean;
        constructor();
        setClientX(clientX: any): void;
        setClientY(clientY: any): void;
        setDeltaX(deltaX: any): void;
        setDeltaY(deltaY: any): void;
        setCtrlKey(ctrlKey: any): void;
        setAltKey(altKey: any): void;
        setShiftKey(shiftKey: any): void;
        setMetaKey(metaKey: any): void;
    }
    class WheelManager extends Core.Object {
        app: App;
        constructor(app: App);
        onMouseWheel(event: any): void;
    }
}
declare namespace Ui {
    interface LBoxInit extends ContainerInit {
        padding?: number;
        paddingTop?: number;
        paddingBottom?: number;
        paddingLeft?: number;
        paddingRight?: number;
        content?: Element[] | Element;
    }
    class LBox extends Container implements LBoxInit {
        private _paddingTop;
        private _paddingBottom;
        private _paddingLeft;
        private _paddingRight;
        constructor(init?: LBoxInit);
        protected setContent(content: Element | Element[] | undefined): void;
        content: Element | Element[] | undefined;
        padding: number;
        paddingTop: number;
        paddingBottom: number;
        paddingLeft: number;
        paddingRight: number;
        append(child: Element): void;
        prepend(child: Element): void;
        insertBefore(child: Element, beforeChild: Element): void;
        remove(child: Element): void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
    interface LPBoxInit extends LBoxInit {
    }
    class LPBox extends LBox implements LPBoxInit {
        constructor(init?: LPBoxInit);
        appendAtLayer(child: Element, layer: number): void;
        prependAtLayer(child: Element, layer: number): void;
    }
}
declare namespace Ui {
    type Orientation = 'vertical' | 'horizontal';
    interface BoxInit extends ContainerInit {
        orientation?: Orientation;
        padding?: number;
        paddingTop?: number;
        paddingBottom?: number;
        paddingLeft?: number;
        paddingRight?: number;
        uniform?: boolean;
        spacing?: number;
        content?: Element | Element[];
    }
    class Box extends Container implements BoxInit {
        private _paddingTop;
        private _paddingBottom;
        private _paddingLeft;
        private _paddingRight;
        private _uniform;
        private _spacing;
        private star;
        private vertical;
        private uniformSize;
        constructor(init?: BoxInit);
        content: Element | Element[];
        orientation: Orientation;
        padding: number;
        paddingTop: number;
        paddingBottom: number;
        paddingLeft: number;
        paddingRight: number;
        uniform: boolean;
        spacing: number;
        append(child: Element, resizable?: boolean): void;
        prepend(child: Element, resizable?: boolean): void;
        insertAt(child: Element, position: number, resizable?: boolean): void;
        moveAt(child: Element, position: number): void;
        remove(child: Element): void;
        private measureUniform;
        private measureNonUniformVertical;
        private measureNonUniformHorizontal;
        protected measureCore(width: number, height: number): any;
        protected arrangeCore(width: number, height: number): void;
    }
    interface VBoxInit extends BoxInit {
    }
    class VBox extends Box implements VBoxInit {
        constructor(init?: VBoxInit);
    }
    interface HBoxInit extends BoxInit {
    }
    class HBox extends Box implements HBoxInit {
        constructor(init?: HBoxInit);
    }
}
declare namespace Ui {
    class OverWatcher extends Core.Object {
        private element;
        private pointer?;
        private enter?;
        private leave?;
        constructor(init: {
            element: Ui.Element;
            onentered?: (watcher: OverWatcher) => void;
            onleaved?: (watcher: OverWatcher) => void;
        });
        private onPtrMove;
        private onPtrUp;
        private onPtrLeave;
        readonly isOver: boolean;
    }
    interface OverableInit extends LBoxInit {
        onentered?: (event: {
            target: Overable;
        }) => void;
        onleaved?: (event: {
            target: Overable;
        }) => void;
        onmoved?: (event: {
            target: Overable;
        }) => void;
    }
    class Overable extends LBox implements OverableInit {
        watcher: OverWatcher;
        readonly entered: Core.Events<{
            target: Overable;
        }>;
        onentered: (event: {
            target: Overable;
        }) => void;
        readonly leaved: Core.Events<{
            target: Overable;
        }>;
        onleaved: (event: {
            target: Overable;
        }) => void;
        readonly moved: Core.Events<{
            target: Overable;
        }>;
        onmoved: (event: {
            target: Overable;
        }) => void;
        constructor(init?: OverableInit);
        readonly isOver: boolean;
    }
}
declare namespace Ui {
    class PressWatcher extends Core.Object {
        private element;
        private press;
        private down;
        private up;
        private activate;
        private delayedpress;
        private _isDown;
        private lastTime;
        private delayedTimer;
        x?: number;
        y?: number;
        altKey?: boolean;
        shiftKey?: boolean;
        ctrlKey?: boolean;
        lock: boolean;
        constructor(init: {
            element: Ui.Element;
            onpressed?: (watcher: PressWatcher) => void;
            ondowned?: (watcher: PressWatcher) => void;
            onupped?: (watcher: PressWatcher) => void;
            onactivated?: (watcher: PressWatcher) => void;
            ondelayedpress?: (watcher: PressWatcher) => void;
        });
        readonly isDown: boolean;
        protected onPointerDown(event: PointerEvent): void;
        protected onKeyDown(event: KeyboardEvent): void;
        protected onKeyUp(event: KeyboardEvent): void;
        protected onDown(): void;
        protected onUp(): void;
        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean): void;
        protected onActivate(x?: number, y?: number): void;
        protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean): void;
    }
    interface PressableInit extends OverableInit {
        lock?: boolean;
        onpressed?: (event: {
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
        }) => void;
        ondowned?: (event: {
            target: Pressable;
        }) => void;
        onupped?: (event: {
            target: Pressable;
        }) => void;
        onactivated?: (event: {
            target: Pressable;
            x?: number;
            y?: number;
        }) => void;
        ondelayedpress?: (event: {
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
        }) => void;
    }
    class Pressable extends Overable implements PressableInit {
        private pressWatcher;
        readonly downed: Core.Events<{
            target: Pressable;
        }>;
        ondowned: (event: {
            target: Pressable;
        }) => void;
        readonly upped: Core.Events<{
            target: Pressable;
        }>;
        onupped: (event: {
            target: Pressable;
        }) => void;
        readonly pressed: Core.Events<{
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
        }>;
        onpressed: (event: {
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
        }) => void;
        readonly activated: Core.Events<{
            target: Pressable;
            x?: number;
            y?: number;
        }>;
        onactivated: (event: {
            target: Pressable;
            x?: number;
            y?: number;
        }) => void;
        readonly delayedpress: Core.Events<{
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
        }>;
        ondelayedpress: (event: {
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
        }) => void;
        constructor(init?: PressableInit);
        readonly isDown: boolean;
        lock: boolean;
        protected onDown(): void;
        protected onUp(): void;
        press(): void;
        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean): void;
        protected onActivate(x?: number, y?: number): void;
        protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean): void;
        protected onDisable(): void;
        protected onEnable(): void;
    }
}
declare namespace Ui {
    class DraggableWatcher extends Core.Object {
        allowedMode: string | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all';
        data: any;
        private _dragDelta;
        private dataTransfer;
        private element;
        private start;
        private end;
        constructor(init: {
            element: Ui.Element;
            data: any;
            start?: (watcher: DraggableWatcher) => void;
            end?: (watcher: DraggableWatcher, effect: 'none' | 'copy' | 'link' | 'move' | string) => void;
        });
        readonly dragDelta: Point;
        private onDraggablePointerDown;
        private onDragStart;
        private onDragEnd;
    }
    interface DraggableInit extends PressableInit {
        ondragstarted?: (event: {
            target: Draggable;
            dataTransfer: DragEmuDataTransfer;
        }) => void;
        ondragended?: (event: {
            target: Draggable;
            effect: string;
        }) => void;
    }
    class Draggable extends Pressable implements DraggableInit {
        allowedMode: any;
        draggableData: any;
        private _dragDelta;
        private dataTransfer;
        readonly dragstarted: Core.Events<{
            target: Draggable;
            dataTransfer: DragEmuDataTransfer;
        }>;
        ondragstarted: (event: {
            target: Draggable;
            dataTransfer: DragEmuDataTransfer;
        }) => void;
        readonly dragended: Core.Events<{
            target: Draggable;
            effect: string;
        }>;
        ondragended: (event: {
            target: Draggable;
            effect: string;
        }) => void;
        constructor(init?: DraggableInit);
        setAllowedMode(allowedMode: any): void;
        readonly dragDelta: Point;
        private onDraggablePointerDown;
        protected onDragStart(dataTransfer: DragEmuDataTransfer): void;
        protected onDragEnd(dataTransfer: DragEmuDataTransfer): void;
    }
}
declare namespace Ui {
    interface SelectionAction {
        default?: boolean;
        text: string;
        icon: string;
        callback?: (selection: Selection) => void;
        multiple?: boolean;
        hidden?: boolean;
        testRight?: (watcher: SelectionableWatcher) => boolean;
    }
    interface SelectionActions {
        [key: string]: SelectionAction;
    }
    class SelectionableWatcher extends Core.Object {
        readonly element: Element;
        readonly selectionActions?: SelectionActions;
        private _isSelected;
        private handler;
        private select?;
        private unselect?;
        constructor(init: {
            element: Element;
            selectionActions?: SelectionActions;
            dragSelect?: boolean;
            pressSelect?: boolean;
            onselected?: (selection: Selection) => void;
            onunselected?: (selection: Selection) => void;
        });
        static getSelectionableWatcher(element: Element): SelectionableWatcher | undefined;
        static getIsSelectionableItem(element: Element): boolean;
        isSelected: boolean;
        onSelect(selection: Selection): void;
        onUnselect(selection: Selection): void;
        protected onDelayedPress(watcher: PressWatcher): void;
        private getParentSelectionHandler;
        private onSelectionableDragStart;
        private onSelectionableDragEnd;
        private onSelectionableActivate;
    }
    interface SelectionableInit extends LBoxInit {
    }
    class Selectionable extends LBox implements SelectionableInit {
        private selectionWatcher;
        readonly selected: Core.Events<{
            target: Selectionable;
        }>;
        onselected: (event: {
            target: Selectionable;
        }) => void;
        readonly unselected: Core.Events<{
            target: Selectionable;
        }>;
        onunselected: (event: {
            target: Selectionable;
        }) => void;
        constructor(init?: SelectionableInit);
        isSelected: boolean;
        protected onSelect(selection: Selection): void;
        protected onUnselect(selection: Selection): void;
        getSelectionActions(): SelectionActions;
        private getParentSelectionHandler;
        static getParentSelectionHandler(element: Element): Selection | undefined;
    }
}
declare namespace Ui {
    class Selection extends Core.Object {
        private _watchers;
        readonly changed: Core.Events<{
            target: Selection;
        }>;
        onchanged: (event: {
            target: Selection;
        }) => void;
        constructor();
        clear(): void;
        appendRange(start: SelectionableWatcher, end: SelectionableWatcher): void;
        append(elements: Array<SelectionableWatcher> | SelectionableWatcher): void;
        extend(end: SelectionableWatcher): void;
        findRangeElements(start: SelectionableWatcher, end: SelectionableWatcher): Array<SelectionableWatcher>;
        private internalAppend;
        remove(watcher: Array<SelectionableWatcher> | SelectionableWatcher): void;
        private internalRemove;
        watchers: Array<SelectionableWatcher>;
        elements: Element[];
        getElementActions(watcher: SelectionableWatcher): SelectionActions;
        getActions(): SelectionActions;
        getDefaultAction(): SelectionAction;
        executeDefaultAction(): boolean;
        getDeleteAction(): SelectionAction;
        executeDeleteAction(): boolean;
        onElementUnload: (e: {
            target: Element;
        }) => void;
    }
}
declare namespace Ui {
    interface ContextMenuWatcherInit {
        element: Ui.Element;
        press?: (watcher: ContextMenuWatcher) => void;
        down?: (watcher: ContextMenuWatcher) => void;
        up?: (watcher: ContextMenuWatcher) => void;
        lock?: boolean;
    }
    class ContextMenuWatcher extends Core.Object {
        readonly element: Ui.Element;
        private press;
        private down;
        private up;
        private _isDown;
        x?: number;
        y?: number;
        altKey?: boolean;
        shiftKey?: boolean;
        ctrlKey?: boolean;
        lock: boolean;
        constructor(init: ContextMenuWatcherInit);
        readonly isDown: boolean;
        protected onPointerDown(event: PointerEvent): void;
        protected onKeyUp(event: KeyboardEvent): void;
        protected onDown(): void;
        protected onUp(): void;
        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean): void;
    }
}
declare namespace Ui {
    type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    type TextTransform = 'none' | 'uppercase' | 'lowercase';
    interface LabelInit extends ElementInit {
        text?: string;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: FontWeight;
        color?: Color | string;
        orientation?: Orientation;
        textTransform?: TextTransform;
    }
    interface LabelStyle {
        color: Color;
        fontSize: number;
        fontFamily: string;
        fontWeight: FontWeight;
    }
    class Label extends Element implements LabelInit {
        private _text;
        private _orientation;
        private _fontSize?;
        private _fontFamily?;
        private _fontWeight?;
        private _color?;
        labelDrawing: HTMLElement;
        private textMeasureValid;
        private textWidth;
        private textHeight;
        private _textTransform?;
        constructor(init?: LabelInit);
        text: string;
        fontSize: number;
        fontFamily: string;
        fontWeight: FontWeight;
        textTransform: TextTransform;
        color: Color | string;
        private getColor;
        orientation: Orientation;
        onStyleChange(): void;
        renderDrawing(): HTMLElement;
        invalidateTextMeasure(): void;
        measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        arrangeCore(width: any, height: any): void;
        static measureBox: any;
        static measureContext: any;
        static measureTextCanvas(text: any, fontSize: any, fontFamily: any, fontWeight: any): any;
        static createMeasureCanvas(): void;
        static isFontAvailable(fontFamily: string, fontWeight: string): boolean;
        static measureTextHtml(text: string, fontSize: number, fontFamily: string, fontWeight: string): {
            width: any;
            height: any;
        };
        static createMeasureHtml(): void;
        static measureText(text: string, fontSize: number, fontFamily: string, fontWeight: string): any;
        static style: object;
    }
}
declare namespace Ui {
    interface MovableBaseInit extends ContainerInit {
        lock?: boolean;
        inertia?: boolean;
        moveHorizontal?: boolean;
        moveVertical?: boolean;
        onupped?: (event: {
            target: MovableBase;
            speedX: number;
            speedY: number;
            deltaX: number;
            deltaY: number;
            cumulMove: number;
            abort: boolean;
        }) => void;
        ondowned?: (event: {
            target: MovableBase;
        }) => void;
        onmoved?: (event: {
            target: MovableBase;
        }) => void;
    }
    class MovableBase extends Container implements MovableBaseInit {
        private _moveHorizontal;
        private _moveVertical;
        protected posX: number;
        protected posY: number;
        protected speedX: number;
        protected speedY: number;
        protected startPosX: number;
        protected startPosY: number;
        protected inertiaClock?: Anim.Clock;
        private _inertia;
        private _isDown;
        private _lock;
        protected isInMoveEvent: boolean;
        protected cumulMove: number;
        readonly upped: Core.Events<{
            target: MovableBase;
            speedX: number;
            speedY: number;
            deltaX: number;
            deltaY: number;
            cumulMove: number;
            abort: boolean;
        }>;
        onupped: (event: {
            target: MovableBase;
            speedX: number;
            speedY: number;
            deltaX: number;
            deltaY: number;
            cumulMove: number;
            abort: boolean;
        }) => void;
        readonly downed: Core.Events<{
            target: MovableBase;
        }>;
        ondowned: (event: {
            target: MovableBase;
        }) => void;
        readonly moved: Core.Events<{
            target: MovableBase;
        }>;
        onmoved: (event: {
            target: MovableBase;
        }) => void;
        constructor(init?: MovableBaseInit);
        lock: boolean;
        readonly isDown: boolean;
        inertia: boolean;
        moveHorizontal: boolean;
        moveVertical: boolean;
        private updateTouchAction;
        setPosition(x?: number, y?: number, dontSignal?: boolean): void;
        readonly positionX: number;
        readonly positionY: number;
        protected onMove(x: number, y: number): void;
        private onDown;
        private onUp;
        private onPointerDown;
        private startInertia;
        private stopInertia;
    }
}
declare namespace Ui {
    interface MovableInit extends MovableBaseInit {
        cursor?: string;
        content?: Element;
    }
    class Movable extends MovableBase implements MovableInit {
        private _content?;
        private _cursor;
        constructor(init?: MovableInit);
        cursor: string;
        protected onKeyDown(event: any): void;
        protected onMove(x: number, y: number): void;
        protected measureCore(width: number, height: number): Size;
        protected arrangeCore(width: number, height: number): void;
        content: Element | undefined;
        protected onDisable(): void;
        protected onEnable(): void;
    }
}
declare namespace Ui {
    class TransformableWatcher extends Core.Object {
        element: Ui.Element;
        transform?: (watcher: TransformableWatcher, testOnly: boolean) => void;
        inertiastart?: (watcher: TransformableWatcher) => void;
        inertiaend?: (watcher: TransformableWatcher) => void;
        up?: (watcher: TransformableWatcher) => void;
        down?: (watcher: TransformableWatcher) => void;
        private _inertia;
        protected inertiaClock: Anim.Clock;
        private _isDown;
        private transformLock;
        private watcher1;
        private watcher2;
        private _angle;
        private _scale;
        private _translateX;
        private _translateY;
        private startAngle;
        private startScale;
        private startTranslateX;
        private startTranslateY;
        private _allowScale;
        private _minScale;
        private _maxScale;
        private _allowRotate;
        private _allowTranslate;
        private _allowLeftMouse;
        private speedX;
        private speedY;
        constructor(init: {
            element: Element;
            transform?: (watcher: TransformableWatcher, testOnly: boolean) => void;
            inertiastart?: (watcher: TransformableWatcher) => void;
            inertiaend?: (watcher: TransformableWatcher) => void;
            down?: (watcher: TransformableWatcher) => void;
            up?: (watcher: TransformableWatcher) => void;
            allowLeftMouse?: boolean;
            allowScale?: boolean;
            minScale?: number;
            maxScale?: number;
            allowRotate?: boolean;
            allowTranslate?: boolean;
            angle?: number;
            scale?: number;
            translateX?: number;
            translateY?: number;
            inertia?: boolean;
        });
        allowLeftMouse: boolean;
        allowScale: boolean;
        minScale: number;
        maxScale: number;
        allowRotate: boolean;
        allowTranslate: boolean;
        readonly isDown: boolean;
        readonly isInertia: boolean;
        angle: number;
        scale: number;
        translateX: number;
        translateY: number;
        private buildMatrix;
        readonly matrix: Matrix;
        getBoundaryBox(matrix: any): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        setContentTransform(translateX: any, translateY: any, scale: any, angle: any): void;
        inertia: boolean;
        protected onDown(): void;
        protected onUp(): void;
        protected onPointerDown(event: PointerEvent): void;
        protected onPointerMove(watcher: any): void;
        protected onPointerCancel(watcher: any): void;
        protected onPointerUp(watcher: any): void;
        protected onWheel(event: WheelEvent): void;
        startInertia(): void;
        protected onTimeupdate(clock: any, progress: any, delta: any): void;
        stopInertia(): void;
    }
    interface TransformableInit {
        inertia?: boolean;
        allowLeftMouse?: boolean;
        allowScale?: boolean;
        minScale?: number;
        maxScale?: number;
        allowRotate?: boolean;
        allowTranslate?: boolean;
        angle?: number;
        scale?: number;
        translateX?: number;
        translateY?: number;
        content: Element;
        ondowned?: (event: {
            target: Transformable;
        }) => void;
        onupped?: (event: {
            target: Transformable;
        }) => void;
        ontransformed?: (event: {
            target: Transformable;
        }) => void;
        oninertiastarted?: (event: {
            target: Transformable;
        }) => void;
        oninertiaended?: (event: {
            target: Transformable;
        }) => void;
    }
    class Transformable extends LBox {
        private _inertia;
        protected inertiaClock: Anim.Clock;
        protected contentBox: LBox;
        private _isDown;
        private transformLock;
        private watcher1;
        private watcher2;
        private _angle;
        private _scale;
        private _translateX;
        private _translateY;
        private startAngle;
        private startScale;
        private startTranslateX;
        private startTranslateY;
        private _allowScale;
        private _minScale;
        private _maxScale;
        private _allowRotate;
        private _allowTranslate;
        private _allowLeftMouse;
        private speedX;
        private speedY;
        readonly downed: Core.Events<{
            target: Transformable;
        }>;
        ondowned: (event: {
            target: Transformable;
        }) => void;
        readonly upped: Core.Events<{
            target: Transformable;
        }>;
        onupped: (event: {
            target: Transformable;
        }) => void;
        readonly transformed: Core.Events<{
            target: Transformable;
        }>;
        ontransformed: (event: {
            target: Transformable;
        }) => void;
        readonly inertiastarted: Core.Events<{
            target: Transformable;
        }>;
        oninertiastarted: (event: {
            target: Transformable;
        }) => void;
        readonly inertiaended: Core.Events<{
            target: Transformable;
        }>;
        oninertiaended: (event: {
            target: Transformable;
        }) => void;
        constructor(init?: TransformableInit);
        allowLeftMouse: boolean;
        allowScale: boolean;
        minScale: number;
        maxScale: number;
        allowRotate: boolean;
        allowTranslate: boolean;
        readonly isDown: boolean;
        readonly isInertia: boolean;
        angle: number;
        scale: number;
        translateX: number;
        translateY: number;
        private buildMatrix;
        readonly matrix: Matrix;
        getBoundaryBox(matrix: any): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        setContentTransform(translateX: number, translateY: number, scale: number, angle: number): void;
        inertia: boolean;
        protected onContentTransform(testOnly?: boolean): void;
        protected onDown(): void;
        protected onUp(): void;
        protected onPointerDown(event: PointerEvent): void;
        protected onPointerMove(watcher: any): void;
        protected onPointerCancel(watcher: any): void;
        protected onPointerUp(watcher: any): void;
        protected onWheel(event: WheelEvent): void;
        startInertia(): void;
        protected onTimeupdate(clock: any, progress: any, delta: any): void;
        stopInertia(): void;
        content: Element;
        protected arrangeCore(width: any, height: any): void;
    }
}
declare namespace Ui {
    interface ScrollableInit extends ContainerInit {
        maxScale?: number;
        content?: Element;
        inertia?: boolean;
        scrollHorizontal?: boolean;
        scrollVertical?: boolean;
        scale?: number;
        onscrolled?: (event: {
            target: Scrollable;
            offsetX: number;
            offsetY: number;
        }) => void;
    }
    class Scrollable extends Container implements ScrollableInit {
        private contentBox;
        private _scrollHorizontal;
        private _scrollVertical;
        scrollbarHorizontalBox: Movable;
        scrollbarVerticalBox: Movable;
        showShadows: boolean;
        lock: boolean;
        isOver: boolean;
        protected showClock: Anim.Clock;
        offsetX: number;
        offsetY: number;
        relativeOffsetX: number;
        relativeOffsetY: number;
        viewWidth: number;
        viewHeight: number;
        contentWidth: number;
        contentHeight: number;
        scrollLock: boolean;
        scrollbarVerticalNeeded: boolean;
        scrollbarHorizontalNeeded: boolean;
        scrollbarVerticalHeight: number;
        scrollbarHorizontalWidth: number;
        readonly scrolled: Core.Events<{
            target: Scrollable;
            offsetX: number;
            offsetY: number;
        }>;
        onscrolled: (event: {
            target: Scrollable;
            offsetX: number;
            offsetY: number;
        }) => void;
        constructor(init?: ScrollableInit);
        maxScale: number;
        content: Element;
        protected setContent(content: Element): void;
        inertia: boolean;
        scrollHorizontal: boolean;
        scrollVertical: boolean;
        setScrollbarVertical(scrollbarVertical: Movable): void;
        setScrollbarHorizontal(scrollbarHorizontal: Movable): void;
        setOffset(offsetX?: number, offsetY?: number, absolute?: boolean, align?: boolean): boolean;
        getOffsetX(): number;
        getRelativeOffsetX(): number;
        getOffsetY(): number;
        getRelativeOffsetY(): number;
        scale: number;
        readonly isDown: boolean;
        readonly isInertia: boolean;
        protected onWheel(event: WheelEvent): void;
        protected onKeyDown(event: any): void;
        autoShowScrollbars: () => void;
        autoHideScrollbars: () => void;
        protected onShowBarsTick(clock: Anim.Clock, progress: number, delta: number): void;
        protected onScroll(): void;
        updateOffset(): void;
        protected onScrollbarHorizontalMove: () => void;
        protected onScrollbarVerticalMove: () => void;
        protected onScrollIntoView(el: Element): void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
    class ScrollableContent extends Transformable {
        private _contentWidth;
        private _contentHeight;
        readonly scrolled: Core.Events<{
            target: ScrollableContent;
            offsetX: number;
            offsetY: number;
        }>;
        onscrolled: (event: {
            target: ScrollableContent;
            offsetX: number;
            offsetY: number;
        }) => void;
        constructor();
        readonly offsetX: number;
        readonly offsetY: number;
        setOffset(x: number, y: number): void;
        readonly contentWidth: number;
        readonly contentHeight: number;
        protected arrangeCore(width: number, height: number): void;
        protected onContentTransform(testOnly?: boolean): void;
    }
}
declare namespace Ui {
    class Scrollbar extends Movable {
        private orientation;
        private rect;
        private over;
        private clock?;
        constructor(orientation: Orientation);
        radius: number;
        fill: Color;
        private startAnim;
        protected onTick(clock: Anim.Clock, progress: number, deltaTick: number): void;
    }
    interface ScrollingAreaInit extends ScrollableInit {
    }
    class ScrollingArea extends Scrollable implements ScrollingAreaInit {
        private horizontalScrollbar;
        private verticalScrollbar;
        constructor(init?: ScrollingAreaInit);
        protected onStyleChange(): void;
        static style: any;
    }
}
declare namespace Ui {
    class NativeScrollableContent extends Ui.Container {
        private _content;
        private scrollDiv;
        readonly scrolled: Core.Events<{
            target: NativeScrollableContent;
            offsetX: number;
            offsetY: number;
        }>;
        onscrolled: (event: {
            target: NativeScrollableContent;
            offsetX: number;
            offsetY: number;
        }) => void;
        constructor();
        renderDrawing(): HTMLDivElement;
        content: Ui.Element | undefined;
        readonly offsetX: number;
        readonly offsetY: number;
        stopInertia(): void;
        setOffset(x: number, y: number): void;
        readonly contentWidth: number;
        readonly contentHeight: number;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        protected onScroll(): void;
        getInverseLayoutTransform(): Ui.Matrix;
        getLayoutTransform(): Ui.Matrix;
        static nativeScrollBarWidth: number;
        static nativeScrollBarHeight: number;
        static initialize(): void;
    }
    class NativeScrollable extends Ui.Container {
        private contentBox;
        private _scrollHorizontal;
        private _scrollVertical;
        scrollbarHorizontalBox: Ui.Movable;
        scrollbarVerticalBox: Ui.Movable;
        showShadows: boolean;
        lock: boolean;
        isOver: boolean;
        protected showClock?: Anim.Clock;
        offsetX: number;
        offsetY: number;
        relativeOffsetX: number;
        relativeOffsetY: number;
        viewWidth: number;
        viewHeight: number;
        contentWidth: number;
        contentHeight: number;
        scrollLock: boolean;
        scrollbarVerticalNeeded: boolean;
        scrollbarHorizontalNeeded: boolean;
        scrollbarVerticalHeight: number;
        scrollbarHorizontalWidth: number;
        readonly scrolled: Core.Events<{
            target: NativeScrollable;
            offsetX: number;
            offsetY: number;
        }>;
        onscrolled: (event: {
            target: NativeScrollable;
            offsetX: number;
            offsetY: number;
        }) => void;
        constructor();
        content: Ui.Element | undefined;
        scrollHorizontal: boolean;
        scrollVertical: boolean;
        setScrollbarVertical(scrollbarVertical: Ui.Movable): void;
        setScrollbarHorizontal(scrollbarHorizontal: Ui.Movable): void;
        setOffset(offsetX?: number, offsetY?: number, absolute?: boolean, align?: boolean): boolean;
        getOffsetX(): number;
        getRelativeOffsetX(): number;
        getOffsetY(): number;
        getRelativeOffsetY(): number;
        autoShowScrollbars: () => void;
        autoHideScrollbars: () => void;
        protected onShowBarsTick(clock: Anim.Clock, progress: number, delta: number): void;
        protected onScroll(): void;
        updateOffset(): void;
        protected onScrollbarHorizontalMove: () => void;
        protected onScrollbarVerticalMove: () => void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
    class NativeScrollingArea extends NativeScrollable {
        private horizontalScrollbar;
        private verticalScrollbar;
        constructor();
        protected onStyleChange(): void;
        static style: any;
    }
}
declare namespace Ui {
    class CompactLabelContext extends Core.Object {
        text: string;
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
        maxLine: number;
        interLine: number;
        textAlign: string;
        width: number;
        drawLine: any;
        whiteSpace: 'pre-line' | 'nowrap';
        wordWrap: 'normal' | 'break-word';
        textTransform: 'none' | 'lowercase' | 'uppercase';
        constructor();
        setDrawLine(func: any): void;
        getWhiteSpace(): "nowrap" | "pre-line";
        setWhiteSpace(whiteSpace: any): void;
        getWordWrap(): "normal" | "break-word";
        setWordWrap(wordWrap: any): void;
        getMaxLine(): number;
        setMaxLine(maxLine: any): void;
        getTextAlign(): string;
        setTextAlign(textAlign: any): void;
        setInterLine(interLine: any): void;
        getInterLine(): number;
        getText(): string;
        setText(text: any): void;
        setFontSize(fontSize: any): void;
        getFontSize(): number;
        setFontFamily(fontFamily: any): void;
        getFontFamily(): string;
        setFontWeight(fontWeight: any): void;
        getFontWeight(): string;
        getTextTransform(): TextTransform;
        setTextTransform(textTransform: any): void;
        getTransformedText(): string;
        flushLine(y: any, line: any, width: any, render: any, lastLine?: boolean): number;
        updateFlow(width: any, render: any): {
            width: number;
            height: number;
        };
        updateFlowWords(width: any, render: any): {
            width: number;
            height: number;
        };
        drawText(width: any, render: any): any;
    }
    interface CompactLabelInit extends ElementInit {
        maxLine?: number;
        text?: string;
        textAlign?: string;
        interLine?: number;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: string;
        whiteSpace?: string;
        wordWrap?: string;
        textTransform?: string;
        color?: Color;
    }
    class CompactLabel extends Element implements CompactLabelInit {
        private _fontSize;
        private _fontFamily;
        private _fontWeight;
        private _color;
        private textDrawing;
        private _maxLine;
        private _interLine;
        private _textAlign;
        isMeasureValid: boolean;
        isArrangeValid: boolean;
        lastMeasureWidth: number;
        lastMeasureHeight: number;
        lastAvailableWidth: number;
        textContext: CompactLabelContext;
        private _whiteSpace;
        private _wordWrap;
        private _textTransform;
        constructor(init?: CompactLabelInit);
        maxLine: number;
        text: string;
        textAlign: string;
        interLine: number;
        fontSize: number;
        fontFamily: string;
        fontWeight: any;
        whiteSpace: string;
        wordWrap: string;
        textTransform: string;
        color: Color;
        protected renderDrawing(): any;
        protected onStyleChange(): void;
        invalidateTextMeasure(): void;
        protected measureCore(width: any, height: any): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: any, height: any): void;
        static style: object;
    }
}
declare namespace Ui {
    interface DropEffect {
        action: string;
        text?: string;
        dragicon?: string;
        primary?: boolean;
        secondary?: boolean;
    }
    type DropEffectFunc = (data: any, dataTransfer: DragDataTransfer) => DropEffect[];
    class DropableWatcher extends Core.Object {
        private element;
        private enter;
        private leave;
        private drop;
        private dropfile;
        private watchers;
        private allowedTypes;
        constructor(init: {
            element: Element;
            onentered?: (watcher: DropableWatcher, data: any) => void;
            onleaved?: (watcher: DropableWatcher) => void;
            ondropped?: (watcher: DropableWatcher, data: any, dropEffect: string, x: number, y: number, dataTransfer: DragDataTransfer) => boolean;
            ondroppedfile?: (watcher: DropableWatcher, file: any, dropEffect: string, x: number, y: number) => boolean;
            types?: Array<{
                type: string | Function;
                effects: string | string[] | DropEffect[] | DropEffectFunc;
            }>;
        });
        addType(type: string | Function, effects: string | string[] | DropEffect[] | DropEffectFunc): void;
        types: Array<{
            type: string | Function;
            effects: string | string[] | DropEffect[] | DropEffectFunc;
        }>;
        protected onDragOver(event: DragEvent): void;
        protected onWatcherEnter(watcher: DragWatcher): void;
        protected onWatcherDrop(watcher: DragWatcher, effect: any, x: number, y: number): void;
        protected onWatcherLeave(watcher: DragWatcher): void;
        private getAllowedTypesEffect;
        protected onDragEffect(dataTransfer: DragDataTransfer): string | DropEffect[];
        protected onDragEffectFunction(dataTransfer: DragDataTransfer, func: DropEffectFunc): DropEffect[];
        protected onDrop(dataTransfer: DragDataTransfer, dropEffect: any, x: number, y: number): void;
        protected onDragEnter(dataTransfer: DragDataTransfer): void;
        protected onDragLeave(): void;
    }
    interface DropBoxInit extends LBoxInit {
        ondrageffect?: (event: Ui.DragEvent) => void;
        ondragentered?: (event: {
            target: DropBox;
            data: any;
        }) => void;
        ondragleaved?: (event: {
            target: DropBox;
        }) => void;
        ondropped?: (event: {
            target: DropBox;
            data: any;
            effect: string;
            x: number;
            y: number;
            dataTransfer: DragDataTransfer;
        }) => void;
        ondroppedfile?: (event: {
            target: DropBox;
            file: Core.File;
            effect: string;
            x: number;
            y: number;
        }) => void;
    }
    class DropBox extends LBox implements DropBoxInit {
        watchers: DragWatcher[];
        allowedTypes: {
            type: string | Function;
            effect: DropEffect[] | DropEffectFunc;
        }[];
        readonly drageffect: Core.Events<DragEvent>;
        ondrageffect: (event: DragEvent) => void;
        readonly dragentered: Core.Events<{
            target: DropBox;
            data: any;
        }>;
        ondragentered: (event: {
            target: DropBox;
            data: any;
        }) => void;
        readonly dragleaved: Core.Events<{
            target: DropBox;
        }>;
        ondragleaved: (event: {
            target: DropBox;
        }) => void;
        readonly dropped: Core.Events<{
            target: DropBox;
            data: any;
            effect: string;
            x: number;
            y: number;
            dataTransfer: DragDataTransfer;
        }>;
        ondropped: (event: {
            target: DropBox;
            data: any;
            effect: string;
            x: number;
            y: number;
            dataTransfer: DragDataTransfer;
        }) => void;
        readonly droppedfile: Core.Events<{
            target: DropBox;
            file: Core.File;
            effect: string;
            x: number;
            y: number;
        }>;
        ondroppedfile: (event: {
            target: DropBox;
            file: Core.File;
            effect: string;
            x: number;
            y: number;
        }) => void;
        constructor(init?: DropBoxInit);
        addType(type: string | Function, effects: string | string[] | DropEffect[] | DropEffectFunc): void;
        protected onDragOver(event: DragEvent): void;
        protected onWatcherEnter(watcher: DragWatcher): void;
        protected onWatcherMove(watcher: DragWatcher): void;
        protected onWatcherDrop(watcher: DragWatcher, effect: any, x: number, y: number): void;
        protected onWatcherLeave(watcher: DragWatcher): void;
        getAllowedTypesEffect(dataTransfer: DragDataTransfer): DropEffect[];
        protected onDragEffect(dataTransfer: DragDataTransfer): string | DropEffect[];
        protected onDragEffectFunction(dataTransfer: DragDataTransfer, func: DropEffectFunc): DropEffect[];
        protected onDrop(dataTransfer: DragDataTransfer, dropEffect: any, x: number, y: number): void;
        protected onDragEnter(dataTransfer: DragDataTransfer): void;
        protected onDragLeave(): void;
    }
}
declare namespace Ui {
    class ButtonText extends CompactLabel {
    }
    class ButtonBackground extends CanvasElement {
        private _borderWidth;
        private _border;
        private _background;
        private _radius;
        constructor();
        borderWidth: number;
        border: Color | string;
        radius: number;
        background: Color | string;
        updateCanvas(ctx: any): void;
    }
    class ButtonIcon extends CanvasElement {
        private _badge;
        private _badgeColor;
        private _badgeTextColor;
        private _fill;
        private _icon;
        constructor();
        icon: string;
        badge: string;
        badgeColor: Color | string;
        badgeTextColor: Color | string;
        fill: Color | string;
        updateCanvas(ctx: any): void;
    }
    interface ButtonInit extends PressableInit {
        text?: string | undefined;
        icon?: string | undefined;
        background?: Element;
        marker?: Element;
        isActive?: boolean;
        badge?: string;
        orientation?: Orientation;
    }
    class Button extends Pressable implements ButtonInit {
        private _isActive;
        private mainBox;
        private buttonPartsBox;
        private _icon;
        private _iconBox;
        private _text;
        private _textBox;
        private _marker;
        private _badge;
        private bg;
        private _orientation;
        constructor(init?: ButtonInit);
        background: Element;
        readonly textBox: Element;
        text: string | undefined;
        setTextOrElement(text: string | Element | undefined): void;
        readonly iconBox: LBox;
        icon: string | undefined;
        setIconOrElement(icon: Element | string | undefined): void;
        marker: Element;
        isActive: boolean;
        badge: string;
        orientation: Orientation;
        protected getBackgroundColor(): Color;
        protected getBackgroundBorderColor(): Color;
        protected getForegroundColor(): Color;
        readonly isTextVisible: boolean;
        readonly isIconVisible: boolean;
        protected updateVisibles(): void;
        protected updateColors(): void;
        protected onDisable(): void;
        protected onEnable(): void;
        protected onStyleChange(): void;
        static style: object;
    }
    class DefaultButton extends Button {
        static style: object;
    }
}
declare namespace Ui {
    class ToggleButton extends Button {
        private _isToggled;
        readonly toggled: Core.Events<{
            target: ToggleButton;
        }>;
        ontoggled: (event: {
            target: ToggleButton;
        }) => void;
        readonly untoggled: Core.Events<{
            target: ToggleButton;
        }>;
        onuntoggled: (event: {
            target: ToggleButton;
        }) => void;
        constructor();
        isToggled: boolean;
        protected onToggleButtonPress(): void;
        protected onToggle(): void;
        protected onUntoggle(): void;
        toggle(): void;
        untoggle(): void;
    }
}
declare namespace Ui {
    interface ActionButtonInit extends ButtonInit {
        action?: any;
        selection?: Selection;
    }
    class ActionButton extends Button {
        private _action;
        private _selection;
        private _dropWatcher;
        constructor(init?: ActionButtonInit);
        action: any;
        selection: Selection;
        protected onActionButtonEffect(data: any, dataTransfer: any): DropEffect[];
        protected onActionButtonDrop(): boolean;
        static style: object;
    }
}
declare namespace Ui {
    class ContextBarCloseButton extends Button {
        constructor();
        static style: any;
    }
    interface ContextBarInit extends LBoxInit {
        selection?: Selection;
    }
    class ContextBar extends LBox implements ContextBarInit {
        bg: Rectangle;
        private _selection;
        actionsBox: Box;
        closeButton: ContextBarCloseButton;
        constructor(init?: ContextBarInit);
        selection: Selection;
        onClosePress(): void;
        onSelectionChange: () => void;
        onStyleChange(): void;
        static style: any;
    }
}
declare namespace Ui {
    interface PopupInit extends ContainerInit {
        preferredWidth?: number;
        preferredHeight?: number;
        autoClose?: boolean;
        onclosed?: (event: {
            target: Popup;
        }) => void;
        content?: Element;
    }
    type AttachBorder = 'right' | 'left' | 'top' | 'bottom' | 'center';
    class Popup extends Container implements PopupInit {
        popupSelection: Selection;
        background: PopupBackground;
        shadow: Pressable;
        shadowGraphic: Rectangle;
        contextBox: ContextBar;
        contentBox: LBox;
        scroll: ScrollingArea;
        posX: number;
        posY: number;
        attachedElement: Element;
        attachedBorder: AttachBorder;
        private _autoClose;
        private _preferredWidth;
        private _preferredHeight;
        openClock: Anim.Clock;
        isClosed: boolean;
        readonly closed: Core.Events<{
            target: Popup;
        }>;
        onclosed: (event: {
            target: Popup;
        }) => void;
        constructor(init?: PopupInit);
        preferredWidth: number;
        preferredHeight: number;
        getSelectionHandler(): Selection;
        autoClose: boolean;
        content: Element;
        protected onShadowPress(): void;
        protected onOpenTick(clock: Anim.Clock, progress: number, delta: number): void;
        protected onPopupSelectionChange(selection: Selection): void;
        protected onStyleChange(): void;
        protected onChildInvalidateMeasure(child: Element, type: any): void;
        protected onChildInvalidateArrange(child: Element): void;
        open(): void;
        openAt(posX: number, posY: number): void;
        openElement(element: Element, position?: AttachBorder): void;
        private openPosOrElement;
        close(): void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        setRight(x: any, y: any, width: any, height: any): void;
        setLeft(x: any, y: any, width: any, height: any): void;
        setTop(x: any, y: any, width: any, height: any): void;
        setBottom(x: any, y: any, width: any, height: any): void;
        setCenter(width: any, height: any): void;
        static style: any;
    }
    class PopupBackground extends CanvasElement {
        private _radius;
        private _fill;
        private _arrowBorder;
        private _arrowOffset;
        private readonly arrowSize;
        constructor();
        arrowBorder: 'left' | 'right' | 'top' | 'bottom' | 'none';
        arrowOffset: number;
        radius: number;
        fill: Color | string;
        private genPath;
        updateCanvas(ctx: any): void;
    }
    interface MenuPopupInit extends PopupInit {
    }
    class MenuPopup extends Popup implements MenuPopupInit {
        constructor(init?: MenuPopupInit);
    }
    class MenuPopupSeparator extends Separator {
        constructor();
    }
}
declare namespace Ui {
    class MenuToolBarPopup extends MenuPopup {
    }
    class MenuToolBarButton extends Button {
        constructor();
        static style: any;
    }
    interface MenuToolBarInit extends ContainerInit {
        paddingTop?: number;
        paddingBottom?: number;
        paddingLeft?: number;
        paddingRight?: number;
        itemsAlign?: 'left' | 'right';
        menuPosition?: 'left' | 'right';
        uniform?: boolean;
        spacing?: number;
    }
    class MenuToolBar extends Container implements MenuToolBarInit {
        private _paddingTop;
        private _paddingBottom;
        private _paddingLeft;
        private _paddingRight;
        private star;
        private measureLock;
        items: Element[];
        private menuButton;
        private _itemsAlign;
        private _menuPosition;
        private _uniform;
        private uniformSize;
        private _spacing;
        private itemsWidth;
        private keepItems;
        private menuNeeded;
        private bg;
        constructor(init?: MenuToolBarInit);
        uniform: boolean;
        menuPosition: 'left' | 'right';
        itemsAlign: 'left' | 'right';
        readonly logicalChildren: Element[];
        padding: number;
        paddingTop: number;
        paddingBottom: number;
        paddingLeft: number;
        paddingRight: number;
        spacing: number;
        append(child: Element, resizable?: boolean): void;
        prepend(child: Element, resizable?: boolean): void;
        remove(child: Element): void;
        moveAt(child: Element, position: number): void;
        insertAt(child: Element, position: number, resizable: boolean): void;
        setContent(content: any): void;
        private onMenuButtonPress;
        clear(): void;
        measureCore(width: number, height: number): any;
        arrangeCore(width: number, height: number): void;
        onChildInvalidateMeasure(child: Element, event: any): void;
        onStyleChange(): void;
        static style: any;
    }
}
declare namespace Ui {
    interface AppInit extends ContainerInit {
        content?: Element;
    }
    class App extends Container {
        private updateTask;
        private _loaded;
        focusElement: any;
        arguments: any;
        private _ready;
        orientation: number;
        webApp: boolean;
        lastArrangeHeight: number;
        private drawList?;
        private layoutList?;
        windowWidth: number;
        windowHeight: number;
        private contentBox;
        private _content?;
        private dialogs?;
        private dialogsFocus;
        private topLayers?;
        requireFonts: any;
        testFontTask: any;
        bindedUpdate: any;
        selection: Selection;
        readonly resized: Core.Events<{
            target: App;
            width: number;
            height: number;
        }>;
        onresized: (event: {
            target: App;
            width: number;
            height: number;
        }) => void;
        readonly ready: Core.Events<{
            target: App;
        }>;
        onready: (event: {
            target: App;
        }) => void;
        readonly parentmessage: Core.Events<{
            target: App;
            message: any;
        }>;
        onparentmessage: (event: {
            target: App;
            message: any;
        }) => void;
        readonly orientationchanged: Core.Events<{
            target: App;
            orientation: number;
        }>;
        onorientationchanged: (event: {
            target: App;
            orientation: number;
        }) => void;
        constructor(init?: AppInit);
        setWebApp(webApp: boolean): void;
        getSelectionHandler(): Selection;
        forceInvalidateMeasure(element: Ui.Element): void;
        requireFont(fontFamily: string, fontWeight: string): void;
        testRequireFonts(): void;
        checkWindowSize(): void;
        getOrientation(): number;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected onSelectionChange(selection: any): void;
        protected onWindowLoad(): void;
        protected onWindowResize(event: any): void;
        protected onOrientationChange(event: any): void;
        update(): void;
        content: Element | undefined;
        getFocusElement(): any;
        appendDialog(dialog: any): void;
        removeDialog(dialog: any): void;
        appendTopLayer(layer: any): void;
        removeTopLayer(layer: any): void;
        getArguments(): any;
        readonly isReady: boolean;
        protected onReady(): void;
        protected onWindowKeyUp(event: any): void;
        protected onMessage(event: any): void;
        sendMessageToParent(msg: any): void;
        findFocusableDiv(current: any): any;
        enqueueDraw(element: any): void;
        enqueueLayout(element: any): void;
        handleScrolling(drawing: any): void;
        getElementsByClass(className: Function): Element[];
        getElementByDrawing(drawing: any): any;
        getInverseLayoutTransform(): Matrix;
        getLayoutTransform(): Matrix;
        invalidateMeasure(): void;
        invalidateArrange(): void;
        protected arrangeCore(w: number, h: number): void;
        static current: App;
        static getWindowIFrame(currentWindow: any): any;
        static getRootWindow(): Window;
    }
}
declare namespace Ui {
    interface FormInit extends LBoxInit {
    }
    class Form extends LBox implements FormInit {
        readonly submited: Core.Events<{
            target: Form;
        }>;
        onsubmited: (event: {
            target: Form;
        }) => void;
        constructor(init?: FormInit);
        protected onSubmit(event: any): void;
        submit(): void;
        renderDrawing(): any;
    }
}
declare namespace Ui {
    interface DialogCloseButtonInit extends ButtonInit {
    }
    class DialogCloseButton extends Button implements DialogCloseButtonInit {
        constructor(init?: DialogCloseButtonInit);
        static style: object;
    }
    class DialogGraphic extends CanvasElement {
        private _background;
        constructor();
        background: Color | string;
        updateCanvas(ctx: any): void;
    }
    class DialogTitle extends Label {
        static style: object;
    }
    class DialogButtonBox extends LBox {
        bg: Rectangle;
        actionBox: HBox;
        cancelButton?: Pressable;
        actionButtonsBox: HBox;
        titleLabel: DialogTitle;
        readonly cancelled: Core.Events<{
            target: DialogButtonBox;
        }>;
        constructor();
        getTitle(): string;
        setTitle(title: string): void;
        setCancelButton(button: Pressable): void;
        setActionButtons(buttons: Array<Element>): void;
        getActionButtons(): Element[];
        onCancelPress: () => void;
        onStyleChange(): void;
        static style: object;
    }
    interface DialogInit extends ContainerInit {
        padding?: number;
        preferredWidth?: number;
        preferredHeight?: number;
        title?: string;
        cancelButton?: Pressable;
        actionButtons?: Pressable[];
        autoClose?: boolean;
        content?: Element;
        onclosed?: (event: {
            target: Dialog;
        }) => void;
    }
    class Dialog extends Container implements DialogInit {
        dialogSelection: Selection;
        shadowGraphic: Rectangle;
        graphic: DialogGraphic;
        lbox: Form;
        vbox: VBox;
        contentBox: LBox;
        contentVBox: VBox;
        private _actionButtons?;
        private _cancelButton?;
        private buttonsBox;
        buttonsVisible: boolean;
        private _preferredWidth;
        private _preferredHeight;
        actionBox: DialogButtonBox;
        contextBox: ContextBar;
        private _autoClose?;
        openClock?: Anim.Clock;
        isClosed: boolean;
        scroll: ScrollingArea;
        readonly closed: Core.Events<{
            target: Dialog;
        }>;
        onclosed: (event: {
            target: Dialog;
        }) => void;
        constructor(init?: DialogInit);
        getSelectionHandler(): Selection;
        preferredWidth: number;
        preferredHeight: number;
        padding: number;
        open(): void;
        close(): void;
        onOpenTick(clock: any, progress: any, delta: any): void;
        getDefaultButton(): DefaultButton | undefined;
        defaultAction(): void;
        title: string;
        updateButtonsBoxVisible(): void;
        cancelButton: Pressable;
        actionButtons: Pressable[];
        content: Element | undefined;
        autoClose: boolean;
        protected onCancelPress(): void;
        protected onFormSubmit(): void;
        protected onDialogSelectionChange(selection: Ui.Selection): void;
        protected onKeyUp(event: any): void;
        protected onShadowPress(): void;
        protected onStyleChange(): void;
        protected onChildInvalidateMeasure(child: Element, type: any): void;
        protected onChildInvalidateArrange(child: Element): void;
        protected measureCore(width: number, height: number): Size;
        protected arrangeCore(width: number, height: number): void;
        static style: object;
    }
}
declare namespace Ui {
    interface HtmlInit extends ElementInit {
        html?: string;
        text?: string;
        textAlign?: string;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: string;
        interLine?: number;
        wordWrap?: string;
        whiteSpace?: string;
        color?: Color | string;
        onlink?: (event: {
            target: Html;
            ref: string;
        }) => void;
    }
    class Html extends Element implements HtmlInit {
        protected htmlDrawing: HTMLElement;
        private bindedOnImageLoad;
        private _fontSize;
        private _fontFamily;
        private _fontWeight;
        private _color;
        private _textAlign;
        private _interLine;
        private _wordWrap;
        private _whiteSpace;
        readonly link: Core.Events<{
            target: Html;
            ref: string;
        }>;
        onlink: (event: {
            target: Html;
            ref: string;
        }) => void;
        constructor(init?: HtmlInit);
        getElements(tagName: any): any[];
        searchElements(tagName: any, element: any, res: any): void;
        getParentElement(tagName: any, element: any): any;
        html: string;
        text: string;
        private getTextContent;
        textAlign: string;
        fontSize: number;
        fontFamily: string;
        fontWeight: any;
        interLine: number;
        wordWrap: string;
        whiteSpace: string;
        protected getColor(): Color;
        color: Color | string;
        protected onSubtreeModified(event: any): void;
        protected onKeyPress(event: KeyboardEvent): void;
        protected onImageLoad(event: any): void;
        protected onClick(event: any): void;
        protected onVisible(): void;
        protected onStyleChange(): void;
        protected renderDrawing(): any;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        static style: object;
    }
}
declare namespace Ui {
    interface TextInit extends HtmlInit {
        textTransform?: string;
    }
    class Text extends Html implements TextInit {
        constructor(init?: TextInit);
        textTransform: string;
    }
}
declare namespace Ui {
    interface ShadowInit extends CanvasElementInit {
        color?: Color | string;
        inner?: boolean;
        shadowWidth?: number;
        radius?: number;
        radiusTopLeft?: number;
        radiusTopRight?: number;
        radiusBottomLeft?: number;
        radiusBottomRight?: number;
    }
    class Shadow extends CanvasElement implements ShadowInit {
        private _radiusTopLeft;
        private _radiusTopRight;
        private _radiusBottomLeft;
        private _radiusBottomRight;
        private _shadowWidth;
        private _inner;
        private _color;
        constructor(init?: ShadowInit);
        color: Color | string;
        inner: boolean;
        shadowWidth: number;
        radius: number;
        radiusTopLeft: number;
        radiusTopRight: number;
        radiusBottomLeft: number;
        radiusBottomRight: number;
        protected updateCanvas(ctx: any): void;
    }
}
declare namespace Ui {
    class Toaster extends Container {
        static current: Toaster;
        private arrangeClock?;
        constructor();
        appendToast(toast: Toast): void;
        removeToast(toast: Toast): void;
        protected onArrangeTick(clock: any, progress: any, delta: any): void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        static appendToast(toast: Toast): void;
        static removeToast(toast: Toast): void;
    }
    class Toast extends LBox {
        private _isClosed;
        private openClock?;
        private toastContentBox;
        newToast: boolean;
        lastLayoutX: number;
        lastLayoutY: number;
        lastLayoutWidth: number;
        lastLayoutHeight: number;
        readonly closed: Core.Events<{
            target: Toast;
        }>;
        constructor();
        readonly isClosed: boolean;
        open(): void;
        close(): void;
        protected onOpenTick(clock: any, progress: any, delta: any): void;
        content: Element;
        protected arrangeCore(width: number, height: number): void;
        static send(content: Element | string): void;
    }
}
declare namespace Ui {
    interface ImageInit extends ElementInit {
        src?: string;
        onready?: (event: {
            target: Image;
        }) => void;
        onerror?: (event: {
            target: Image;
        }) => void;
    }
    class Image extends Element implements ImageInit {
        private _src?;
        private loaddone;
        private _naturalWidth?;
        private _naturalHeight?;
        private imageDrawing;
        private setSrcLock;
        readonly ready: Core.Events<{
            target: Image;
        }>;
        onready: (event: {
            target: Image;
        }) => void;
        readonly error: Core.Events<{
            target: Image;
        }>;
        onerror: (event: {
            target: Image;
        }) => void;
        constructor(init?: ImageInit);
        src: string | undefined;
        readonly naturalWidth: number | undefined;
        readonly naturalHeight: number | undefined;
        readonly isReady: boolean;
        private onImageError;
        private onImageLoad;
        private onAppReady;
        private onImageDelayReady;
        protected renderDrawing(): HTMLImageElement;
        protected measureCore(width: any, height: any): any;
        protected arrangeCore(width: number, height: number): void;
    }
}
declare namespace Ui {
    interface LoadingInit extends CanvasElementInit {
    }
    class Loading extends CanvasElement implements LoadingInit {
        private clock;
        private ease;
        constructor(init?: LoadingInit);
        protected onVisible(): void;
        protected onHidden(): void;
        protected updateCanvas(ctx: Ui.CanvasRenderingContext2D): void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        static style: object;
    }
}
declare namespace Ui {
    interface EntryInit extends ElementInit {
        passwordMode?: boolean;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: string;
        color?: Color | string;
        value?: string;
        captureValidated?: boolean;
        onchanged?: (event: {
            target: Entry;
            value: string;
        }) => void;
        onvalidated?: (event: {
            target: Entry;
            value: string;
        }) => void;
    }
    class Entry extends Element implements EntryInit {
        private _fontSize?;
        private _fontFamily?;
        private _fontWeight?;
        private _color?;
        private _value;
        private _passwordMode;
        captureValidated: boolean;
        readonly changed: Core.Events<{
            target: Entry;
            value: string;
        }>;
        onchanged: (event: {
            target: Entry;
            value: string;
        }) => void;
        readonly validated: Core.Events<{
            target: Entry;
            value: string;
        }>;
        onvalidated: (event: {
            target: Entry;
            value: string;
        }) => void;
        constructor(init?: EntryInit);
        passwordMode: boolean;
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
        private getColor;
        color: Color | string;
        value: string;
        private onPaste;
        private onAfterPaste;
        private onChange;
        private onKeyDown;
        private onKeyUp;
        renderDrawing(): HTMLInputElement;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        onDisable(): void;
        onEnable(): void;
        onStyleChange(): void;
        static style: object;
    }
}
declare namespace Ui {
    interface FixedInit extends ContainerInit {
    }
    class Fixed extends Container implements FixedInit {
        readonly resize: Core.Events<{
            target: Fixed;
            width: number;
            height: number;
        }>;
        onresize: (event: {
            target: Fixed;
            width: number;
            height: number;
        }) => void;
        constructor(init?: FixedInit);
        setPosition(item: Element, x: number, y: number): void;
        setRelativePosition(item: Element, x: number, y: number, absolute?: boolean): void;
        append(child: Element, x: number, y: number): void;
        remove(child: Element): void;
        protected updateItemTransform(child: Element): void;
        private getItemPosition;
        protected measureCore(width: number, height: number): Size;
        protected arrangeCore(width: number, height: number): void;
        protected onChildInvalidateMeasure(child: Element, event: any): void;
        protected onChildInvalidateArrange(child: Element): void;
    }
}
declare namespace Ui {
    interface ToolBarInit extends ContainerInit {
        content?: Element | Element[];
    }
    class ToolBar extends Container implements ToolBarInit {
        private scroll;
        private hbox;
        constructor(init?: ToolBarInit);
        append(child: Element, resizable?: boolean): void;
        remove(child: Element): void;
        content: Element | Element[];
        protected measureCore(width: number, height: number): Size;
        protected arrangeCore(width: number, height: number): void;
        protected onStyleChange(): void;
        static style: object;
    }
}
declare namespace Ui {
    class TextBgGraphic extends CanvasElement {
        private textHasFocus;
        hasFocus: boolean;
        private readonly background;
        private readonly backgroundBorder;
        updateCanvas(ctx: any): void;
        onDisable(): void;
        onEnable(): void;
        onStyleChange(): void;
        static style: TextBgGraphicStyle;
    }
    interface TextBgGraphicStyle {
        radius: number;
        borderWidth: number;
        background: Color;
        focusBackground: Color;
        backgroundBorder: Color;
        focusBackgroundBorder: Color;
    }
}
declare namespace Ui {
    interface TextFieldInit extends LBoxInit {
        textHolder?: string;
        passwordMode?: boolean;
        value?: string;
        captureValidated?: boolean;
        onchanged?: (event: {
            target: TextField;
            value: string;
        }) => void;
        onvalidated?: (event: {
            target: TextField;
        }) => void;
    }
    class TextField extends LBox {
        private entry;
        private graphic;
        private textholder;
        readonly changed: Core.Events<{
            target: TextField;
            value: string;
        }>;
        onchanged: (event: {
            target: TextField;
            value: string;
        }) => void;
        readonly validated: Core.Events<{
            target: TextField;
        }>;
        onvalidated: (event: {
            target: TextField;
        }) => void;
        constructor(init?: TextFieldInit);
        textHolder: string;
        passwordMode: boolean;
        value: string;
        captureValidated: boolean;
        private onEntryFocus;
        private onEntryBlur;
        private onEntryChange;
    }
}
declare namespace Ui {
    class CheckBoxGraphic extends CanvasElement {
        isDown: boolean;
        isChecked: boolean;
        color: Color;
        checkColor: Color;
        activeColor: Color;
        borderWidth: number;
        radius: number;
        constructor();
        getIsDown(): boolean;
        setIsDown(isDown: any): void;
        getIsChecked(): boolean;
        setIsChecked(isChecked: any): void;
        setRadius(radius: any): void;
        getColor(): Color;
        setColor(color: any): void;
        setBorderWidth(borderWidth: any): void;
        setCheckColor(color: any): void;
        getCheckColor(): Color;
        updateCanvas(ctx: any): void;
        measureCore(width: any, height: any): {
            width: number;
            height: number;
        };
        onDisable(): void;
        onEnable(): void;
    }
}
declare namespace Ui {
    interface CheckBoxInit extends PressableInit {
        value?: boolean;
        text?: string;
        content?: Element;
        onchanged?: (event: {
            target: CheckBox;
            value: boolean;
        }) => void;
        ontoggled?: (event: {
            target: CheckBox;
        }) => void;
        onuntoggled?: (event: {
            target: CheckBox;
        }) => void;
    }
    class CheckBox extends Pressable implements CheckBoxInit {
        private graphic;
        private contentBox;
        private hbox;
        private _content;
        private _text;
        private _isToggled;
        readonly changed: Core.Events<{
            target: CheckBox;
            value: boolean;
        }>;
        onchanged: (event: {
            target: CheckBox;
            value: boolean;
        }) => void;
        readonly toggled: Core.Events<{
            target: CheckBox;
        }>;
        ontoggled: (event: {
            target: CheckBox;
        }) => void;
        readonly untoggled: Core.Events<{
            target: CheckBox;
        }>;
        onuntoggled: (event: {
            target: CheckBox;
        }) => void;
        constructor(init?: CheckBoxInit);
        readonly isToggled: boolean;
        value: boolean;
        text: string;
        content: Element;
        toggle(): void;
        untoggle(): void;
        private onCheckPress;
        protected onToggle(): void;
        protected onUntoggle(): void;
        protected onCheckFocus(): void;
        protected onCheckBlur(): void;
        protected onCheckBoxDown(): void;
        protected onCheckBoxUp(): void;
        protected onStyleChange(): void;
        static style: object;
    }
}
declare namespace Ui {
    interface FrameInit extends CanvasElementInit {
        frameWidth?: number;
        fill?: Color | LinearGradient | string;
        radius?: number;
        radiusTopLeft?: number;
        radiusTopRight?: number;
        radiusBottomLeft?: number;
        radiusBottomRight?: number;
    }
    class Frame extends CanvasElement implements FrameInit {
        private _fill;
        private _radiusTopLeft;
        private _radiusTopRight;
        private _radiusBottomLeft;
        private _radiusBottomRight;
        private _frameWidth;
        constructor(init?: FrameInit);
        frameWidth: number;
        fill: Color | LinearGradient | string;
        radius: number;
        radiusTopLeft: number;
        radiusTopRight: number;
        radiusBottomLeft: number;
        radiusBottomRight: number;
        updateCanvas(ctx: any): void;
    }
}
declare namespace Ui {
    type ScaleBoxAlign = 'left' | 'right' | 'center';
    interface ScaleBoxInit extends ContainerInit {
        fixedWidth?: number;
        fixedHeight?: number;
        itemAlign?: ScaleBoxAlign;
        content?: Ui.Element;
    }
    class ScaleBox extends Container {
        private _fixedWidth;
        private _fixedHeight;
        private _itemAlign;
        constructor(init?: ScaleBoxInit);
        setFixedSize(width?: number, height?: number): void;
        fixedWidth: number;
        fixedHeight: number;
        content: Element;
        itemAlign: ScaleBoxAlign;
        protected measureCore(width: number, height: number): {
            width: any;
            height: any;
        };
        protected arrangeCore(width: number, height: number): void;
    }
}
declare namespace Ui {
    interface TextAreaInit extends ElementInit {
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: string;
        color?: Color | string;
        value?: string;
    }
    class TextArea extends Element {
        private _fontSize?;
        private _fontFamily?;
        private _fontWeight?;
        private _color?;
        private _value;
        readonly changed: Core.Events<{
            target: TextArea;
            value: string;
        }>;
        onchanged: (event: {
            target: TextArea;
            value: string;
        }) => void;
        constructor(init?: TextAreaInit);
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
        color: Color | string;
        private getColor;
        value: string;
        setOffset(offsetX: number, offsetY: number): void;
        readonly offsetX: number;
        readonly offsetY: number;
        protected onPaste(event: any): void;
        protected onAfterPaste(): void;
        protected onChange(event: any): void;
        protected onKeyDown(event: any): void;
        protected onKeyUp(event: any): void;
        protected renderDrawing(): HTMLTextAreaElement;
        protected measureCore(width: any, height: any): {
            width: any;
            height: number;
        };
        protected arrangeCore(width: any, height: any): void;
        protected onDisable(): void;
        protected onEnable(): void;
        protected onStyleChange(): void;
        static style: TextAreaStyle;
    }
    interface TextAreaStyle {
        color: Color;
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
    }
}
declare namespace Ui {
    interface TextAreaFieldInit extends LBoxInit {
        textHolder?: string;
        value?: string;
        onchanged?: (event: {
            target: TextAreaField;
            value: string;
        }) => void;
    }
    class TextAreaField extends LBox {
        textarea: TextArea;
        graphic: TextBgGraphic;
        textholder: Label;
        readonly changed: Core.Events<{
            target: TextAreaField;
            value: string;
        }>;
        onchanged: (event: {
            target: TextAreaField;
            value: string;
        }) => void;
        constructor(init?: TextAreaFieldInit);
        textHolder: string;
        value: string;
        protected onTextAreaFocus(): void;
        protected onTextAreaBlur(): void;
        protected onTextAreaChange(entry: any, value: string): void;
    }
}
declare namespace Ui {
    interface GridInit extends ContainerInit {
        cols?: string;
        rows?: string;
    }
    class Grid extends Container implements GridInit {
        private _cols;
        private _rows;
        constructor(init?: GridInit);
        cols: string;
        rows: string;
        setContent(content: any): void;
        attach(child: Element, col: number, row: number, colSpan?: number, rowSpan?: number): void;
        detach(child: Element): void;
        private getColMin;
        private getRowMin;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: any, height: any): void;
        static getCol(child: any): any;
        static setCol(child: any, col: any): void;
        static getRow(child: any): any;
        static setRow(child: any, row: any): void;
        static getColSpan(child: any): any;
        static setColSpan(child: any, colSpan: any): void;
        static getRowSpan(child: any): any;
        static setRowSpan(child: any, rowSpan: any): void;
    }
}
declare namespace Ui {
    interface FlowInit extends ContainerInit {
        spacing?: number;
        itemAlign?: 'left' | 'right';
        uniform?: boolean;
        content?: Element[] | undefined;
    }
    class Flow extends Container implements FlowInit {
        private _uniform;
        private uniformWidth;
        private uniformHeight;
        private _itemAlign;
        private _spacing;
        constructor(init?: FlowInit);
        content: Element[] | undefined;
        spacing: number;
        itemAlign: 'left' | 'right';
        uniform: boolean;
        append(child: Element): void;
        prepend(child: Element): void;
        insertAt(child: Element, position: number): void;
        moveAt(child: Element, position: number): void;
        remove(child: Element): void;
        private measureChildrenNonUniform;
        private measureChildrenUniform;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
}
declare namespace Ui {
    interface ProgressBarInit extends ContainerInit {
        value?: number;
    }
    class ProgressBar extends Container implements ProgressBarInit {
        private _value;
        private bar;
        private background;
        constructor(init?: ProgressBarInit);
        value: number;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        protected onStyleChange(): void;
        static style: object;
    }
}
declare namespace Ui {
    interface PanedInit extends ContainerInit {
        orientation?: Orientation;
        pos?: number;
        content1?: Element;
        content2?: Element;
    }
    class Paned extends Container implements PanedInit {
        private vertical;
        private cursor;
        private content1Box;
        private _content1;
        private minContent1Size;
        private content2Box;
        private _content2;
        private minContent2Size;
        private _pos;
        readonly changed: Core.Events<{
            target: Paned;
            position: number;
        }>;
        onchanged: (event: {
            target: Paned;
            position: number;
        }) => void;
        constructor(init?: PanedInit);
        orientation: Orientation;
        pos: number;
        content1: Element;
        content2: Element;
        invert(): void;
        protected onCursorMove: () => void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: any;
        } | {
            width: any;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
    interface VPanedInit extends PanedInit {
    }
    class VPaned extends Paned {
        constructor(init?: VPanedInit);
    }
    interface HPanedInit extends PanedInit {
    }
    class HPaned extends Paned {
        constructor(init?: HPanedInit);
    }
    class HPanedCursor extends LBox {
        constructor();
    }
    class VPanedCursor extends LBox {
        constructor();
    }
}
declare namespace Ui {
    interface SliderInit extends ContainerInit {
        value?: number;
        orientation?: Orientation;
        onchanged?: (event: {
            target: Slider;
            value: number;
        }) => void;
    }
    class Slider extends Container implements SliderInit {
        protected _value: number;
        protected background: Rectangle;
        protected bar: Rectangle;
        protected button: Movable;
        protected buttonContent: Rectangle;
        protected _orientation: Orientation;
        protected updateLock: boolean;
        readonly changed: Core.Events<{
            target: Slider;
            value: number;
        }>;
        onchanged: (event: {
            target: Slider;
            value: number;
        }) => void;
        constructor(init?: SliderInit);
        value: number;
        setValue(value: number, dontSignal?: boolean): void;
        orientation: Orientation;
        protected onButtonMove: () => void;
        protected updateValue(): void;
        protected getColor(): Color;
        protected getForeground(): Color;
        protected getBackground(): Color;
        protected getButtonColor(): Color;
        protected updateColors(): void;
        protected measureCore(width: any, height: any): Size;
        protected arrangeCore(width: any, height: any): void;
        protected onStyleChange(): void;
        protected onDisable(): void;
        protected onEnable(): void;
        static style: object;
    }
}
declare namespace Ui {
    type MediaState = 'initial' | 'playing' | 'paused' | 'buffering' | 'error';
    interface AudioInit extends ElementInit {
        src?: string;
        oggSrc?: string;
        mp3Src?: string;
        aacSrc?: string;
        volume?: number;
        currentTime?: number;
    }
    class Audio extends Element {
        private _src;
        protected audioDrawing: HTMLAudioElement;
        private canplaythrough;
        private _state;
        readonly ready: Core.Events<{
            target: Audio;
        }>;
        onready: (event: {
            target: Audio;
        }) => void;
        readonly ended: Core.Events<{
            target: Audio;
        }>;
        onended: (event: {
            target: Audio;
        }) => void;
        readonly timeupdate: Core.Events<{
            target: Audio;
            time: number;
        }>;
        ontimeupdate: (event: {
            target: Audio;
            time: number;
        }) => void;
        readonly bufferingupdate: Core.Events<{
            target: Audio;
            buffer: number;
        }>;
        onbufferingupdate: (event: {
            target: Audio;
            buffer: number;
        }) => void;
        readonly statechange: Core.Events<{
            target: Audio;
            state: MediaState;
        }>;
        onstatechange: (event: {
            target: Audio;
            state: MediaState;
        }) => void;
        readonly error: Core.Events<{
            target: Audio;
            code: number;
        }>;
        onerror: (event: {
            target: Audio;
            code: number;
        }) => void;
        static htmlAudio: boolean;
        static supportOgg: boolean;
        static supportMp3: boolean;
        static supportWav: boolean;
        static supportAac: boolean;
        constructor(init?: AudioInit);
        src: string;
        play(): void;
        pause(): void;
        stop(): void;
        volume: number;
        readonly duration: number | undefined;
        currentTime: number;
        readonly state: MediaState;
        readonly isReady: boolean;
        protected onReady(): void;
        protected onTimeUpdate(): void;
        protected onEnded(): void;
        protected onProgress(): void;
        readonly currentBufferSize: number;
        checkBuffering(): void;
        protected onError(): void;
        protected onWaiting(): void;
        protected onUnload(): void;
        protected renderDrawing(): any;
        static initialize(): void;
    }
}
declare namespace Ui {
    interface LinkButtonInit extends ButtonInit {
        src?: string;
        openWindow?: boolean;
        target?: string;
    }
    class LinkButton extends Button implements LinkButtonInit {
        readonly src?: string;
        openWindow: boolean;
        target: string;
        readonly link: Core.Events<{
            target: LinkButton;
        }>;
        onlink: (event: {
            target: LinkButton;
        }) => void;
        constructor(init?: LinkButtonInit);
        protected onLinkButtonPress(): void;
        static style: object;
    }
}
declare namespace Ui {
    type SFlowFloat = 'none' | 'left' | 'right';
    type SFlowFlush = 'flush' | 'flushleft' | 'flushright' | 'newline';
    type SFlowAlign = 'left' | 'right' | 'center' | 'stretch';
    interface SFlowInit extends ContainerInit {
        content?: Element[] | undefined;
        spacing?: number;
        itemAlign?: SFlowAlign;
        uniform?: boolean;
        uniformRatio?: number;
        stretchMaxRatio?: number;
    }
    class SFlow extends Container implements SFlowInit {
        private _uniform;
        private _uniformRatio;
        private _uniformWidth;
        private _uniformHeight;
        private _itemAlign;
        private _stretchMaxRatio;
        private _spacing;
        constructor(init?: SFlowInit);
        content: Element[] | undefined;
        spacing: number;
        itemAlign: SFlowAlign;
        uniform: boolean;
        uniformRatio: number;
        stretchMaxRatio: number;
        append(child: Element, floatVal?: SFlowFloat, flushVal?: SFlowFlush): void;
        prepend(child: Element, floatVal?: SFlowFloat, flushVal?: SFlowFlush): void;
        insertAt(child: Element, position: number, floatVal?: SFlowFloat, flushVal?: SFlowFlush): void;
        moveAt(child: Element, position: number): void;
        remove(child: Element): void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        static getFloat(child: Element): SFlowFloat;
        static setFloat(child: Element, floatVal: SFlowFloat): void;
        static getFlush(child: Element): SFlowFlush;
        static setFlush(child: Element, flushVal: SFlowFlush): void;
    }
}
declare namespace Ui {
    interface VideoInit extends ElementInit {
        oggSrc?: string;
        mp4Src?: string;
        webmSrc?: string;
        src?: string;
        poster?: string;
        autoplay?: boolean;
        volume?: number;
        currentTime?: number;
        controls?: boolean;
        onstatechanged?: (event: {
            target: Video;
            state: MediaState;
        }) => void;
        onready?: (event: {
            target: Video;
        }) => void;
        onended?: (event: {
            target: Video;
        }) => void;
        onerror?: (event: {
            target: Video;
            code: number;
        }) => void;
        ontimeupdated?: (event: {
            target: Video;
            time: number;
        }) => void;
        onbufferingupdated?: (event: {
            target: Video;
            buffer: number;
        }) => void;
    }
    class Video extends Element {
        private loaddone;
        private videoDrawing;
        canplaythrough: boolean;
        private _state;
        readonly statechanged: Core.Events<{
            target: Video;
            state: MediaState;
        }>;
        onstatechanged: (event: {
            target: Video;
            state: MediaState;
        }) => void;
        readonly ready: Core.Events<{
            target: Video;
        }>;
        onready: (event: {
            target: Video;
        }) => void;
        readonly ended: Core.Events<{
            target: Video;
        }>;
        onended: (event: {
            target: Video;
        }) => void;
        readonly error: Core.Events<{
            target: Video;
            code: number;
        }>;
        onerror: (event: {
            target: Video;
            code: number;
        }) => void;
        readonly timeupdated: Core.Events<{
            target: Video;
            time: number;
        }>;
        ontimeupdated: (event: {
            target: Video;
            time: number;
        }) => void;
        readonly bufferingupdated: Core.Events<{
            target: Video;
            buffer: number;
        }>;
        onbufferingupdated: (event: {
            target: Video;
            buffer: number;
        }) => void;
        static htmlVideo: boolean;
        static flashVideo: boolean;
        static supportOgg: boolean;
        static supportMp4: boolean;
        static supportWebm: boolean;
        constructor(init?: VideoInit);
        src: string;
        poster: string;
        autoplay: boolean;
        play(): void;
        pause(): void;
        stop(): void;
        controls: boolean;
        volume: number;
        readonly duration: number;
        currentTime: number;
        readonly state: MediaState;
        readonly isReady: boolean;
        readonly naturalWidth: number;
        readonly naturalHeight: number;
        protected onReady(): void;
        protected onTimeUpdate(): void;
        protected onEnded(): void;
        protected onProgress(): void;
        readonly currentBufferSize: number;
        checkBuffering(): void;
        protected onError(): void;
        protected onWaiting(): void;
        protected onUnload(): void;
        protected renderDrawing(): HTMLVideoElement;
        protected arrangeCore(width: number, height: number): void;
        static initialize(): void;
    }
}
declare namespace Ui {
    interface MonthCalendarInit extends VBoxInit {
        date?: Date;
        selectedDate?: Date;
        dayFilter?: number[];
        dateFilter?: string[];
        ondayselected?: (event: {
            target: MonthCalendar;
            value: Date;
        }) => void;
    }
    class MonthCalendar extends VBox {
        private _selectedDate;
        private _date;
        private title;
        private leftarrow;
        private rightarrow;
        private grid;
        private _dayFilter;
        private _dateFilter;
        readonly dayselected: Core.Events<{
            target: MonthCalendar;
            value: Date;
        }>;
        ondayselected: (event: {
            target: MonthCalendar;
            value: Date;
        }) => void;
        constructor(init?: MonthCalendarInit);
        dayFilter: number[];
        dateFilter: string[];
        date: Date;
        selectedDate: Date;
        protected onLeftButtonPress(): void;
        protected onRightButtonPress(): void;
        protected onDaySelect(button: any): void;
        protected updateDate(): void;
        protected onStyleChange(): void;
        static style: object;
    }
}
declare namespace Ui {
    class TextFieldButton extends Button {
        style: object;
    }
    interface TextButtonFieldInit extends FormInit {
        textHolder?: string;
        widthText?: number;
        buttonIcon?: string;
        buttonText?: string;
        value?: string;
        onchanged?: (event: {
            target: TextButtonField;
            value: string;
        }) => void;
        onbuttonpressed?: (event: {
            target: TextButtonField;
        }) => void;
        onvalidated?: (event: {
            target: TextButtonField;
            value: string;
        }) => void;
    }
    class TextButtonField extends Form {
        protected graphic: TextBgGraphic;
        protected entry: Entry;
        protected _textholder: Label;
        protected button: TextFieldButton;
        readonly changed: Core.Events<{
            target: TextButtonField;
            value: string;
        }>;
        onchanged: (event: {
            target: TextButtonField;
            value: string;
        }) => void;
        readonly buttonpressed: Core.Events<{
            target: TextButtonField;
        }>;
        onbuttonpressed: (event: {
            target: TextButtonField;
        }) => void;
        readonly validated: Core.Events<{
            target: TextButtonField;
            value: string;
        }>;
        onvalidated: (event: {
            target: TextButtonField;
            value: string;
        }) => void;
        constructor(init?: TextButtonFieldInit);
        textHolder: string;
        widthText: number;
        buttonIcon: string;
        buttonText: string;
        textValue: string;
        value: string;
        protected onButtonPress(): void;
        protected onEntryChange(entry: Entry, value: string): void;
        protected onFormSubmit(): void;
        protected onEntryFocus(): void;
        protected onEntryBlur(): void;
    }
}
declare namespace Ui {
    interface DatePickerInit extends TextButtonFieldInit {
        dayFilter?: number[];
        dateFilter?: string[];
        selectedDate?: Date;
    }
    class DatePicker extends TextButtonField implements DatePickerInit {
        protected popup?: Popup;
        protected calendar?: MonthCalendar;
        protected _selectedDate: Date;
        protected _isValid: boolean;
        protected _dayFilter?: number[];
        protected _dateFilter?: string[];
        constructor(init?: DatePickerInit);
        dayFilter: number[];
        dateFilter: string[];
        readonly isValid: boolean;
        selectedDate: Date;
        protected onDatePickerButtonPress(): void;
        protected onDatePickerChange(): void;
        private zeroPad;
        protected onDaySelect(monthcalendar: any, date: Date): void;
    }
}
declare namespace Ui {
    interface DownloadButtonInit extends LinkButtonInit {
    }
    class DownloadButton extends LinkButton {
        readonly download: Core.Events<{
            target: DownloadButton;
        }>;
        ondownload: (event: {
            target: DownloadButton;
        }) => void;
        constructor(init?: DownloadButtonInit);
        protected onLinkPress(): void;
        style: object;
    }
}
declare namespace Ui {
    interface SVGElementInit extends ElementInit {
    }
    class SVGElement extends Element implements SVGElementInit {
        renderSVG(svg: any): void;
        protected renderDrawing(): SVGSVGElement;
    }
}
declare namespace Ui {
    class SVGIcon extends Ui.Element {
        static baseUrl: string;
        static forceExternal: boolean;
        fill: Ui.Color | string;
        path: string;
        icon: string;
        private loadIcon;
        private normalize;
    }
}
declare namespace Ui {
    interface IFrameInit extends ElementInit {
        src?: string;
    }
    class IFrame extends Element {
        protected iframeDrawing: HTMLIFrameElement;
        protected _isReady: boolean;
        readonly ready: Core.Events<{
            target: IFrame;
        }>;
        onready: (event: {
            target: IFrame;
        }) => void;
        constructor(init?: IFrameInit);
        src: string;
        readonly isReady: boolean;
        protected onIFrameLoad(): void;
        protected renderDrawing(): any;
        protected arrangeCore(width: number, height: number): void;
    }
}
declare namespace Ui {
    interface ContentEditableInit extends HtmlInit {
        onanchorchanged?: (event: {
            target: ContentEditable;
        }) => void;
        onchanged?: (event: {
            target: ContentEditable;
        }) => void;
        onvalidated?: (event: {
            target: ContentEditable;
        }) => void;
    }
    class ContentEditable extends Html {
        anchorNode?: Node;
        anchorOffset: number;
        private _hasSelection;
        readonly anchorchanged: Core.Events<{
            target: ContentEditable;
        }>;
        onanchorchanged: (event: {
            target: ContentEditable;
        }) => void;
        readonly changed: Core.Events<{
            target: ContentEditable;
        }>;
        onchanged: (event: {
            target: ContentEditable;
        }) => void;
        readonly validated: Core.Events<{
            target: ContentEditable;
        }>;
        onvalidated: (event: {
            target: ContentEditable;
        }) => void;
        readonly selectionentered: Core.Events<{
            target: ContentEditable;
        }>;
        onselectionentered: (event: {
            target: ContentEditable;
        }) => void;
        readonly selectionleaved: Core.Events<{
            target: ContentEditable;
        }>;
        onselectionleaved: (event: {
            target: ContentEditable;
        }) => void;
        private _lastHtml;
        constructor(init?: ContentEditableInit);
        protected onLoad(): void;
        protected onUnload(): void;
        protected onKeyUp(event: any): void;
        protected testAnchorChange: () => void;
        protected onContentSubtreeModified(event: any): void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
    }
}
declare namespace Ui {
    class ScrollLoader extends Core.Object {
        readonly changed: Core.Events<{
            target: ScrollLoader;
        }>;
        constructor();
        getMin(): number;
        getMax(): number;
        getElementAt(position: number): Ui.Element;
    }
    interface VBoxScrollableInit extends ContainerInit {
        loader?: ScrollLoader;
        maxScale?: number;
        content?: Element;
        scrollHorizontal?: boolean;
        scrollVertical?: boolean;
        scrollbarVertical?: Movable;
        scrollbarHorizontal?: Movable;
    }
    class VBoxScrollable extends Container implements VBoxScrollableInit {
        contentBox: VBoxScrollableContent;
        _scrollHorizontal: boolean;
        _scrollVertical: boolean;
        scrollbarHorizontalNeeded: boolean;
        scrollbarVerticalNeeded: boolean;
        scrollbarVerticalHeight: number;
        scrollbarHorizontalWidth: number;
        _scrollbarVertical: Movable;
        _scrollbarHorizontal: Movable;
        showShadows: boolean;
        lock: boolean;
        isOver: boolean;
        showClock: Anim.Clock;
        offsetX: number;
        offsetY: number;
        viewWidth: number;
        viewHeight: number;
        contentWidth: number;
        contentHeight: number;
        overWatcher: PointerWatcher;
        scrollLock: boolean;
        relativeOffsetX: number;
        relativeOffsetY: number;
        readonly scrolled: Core.Events<{
            target: VBoxScrollable;
            offsetX: number;
            offsetY: number;
        }>;
        onscrolled: (event: {
            target: VBoxScrollable;
            offsetX: number;
            offsetY: number;
        }) => void;
        constructor(init?: VBoxScrollableInit);
        reload(): void;
        getActiveItems(): Element[];
        loader: ScrollLoader;
        maxScale: number;
        content: Element;
        scrollHorizontal: boolean;
        scrollVertical: boolean;
        scrollbarVertical: Movable;
        scrollbarHorizontal: Movable;
        setOffset(offsetX?: number, offsetY?: number, absolute?: boolean): boolean;
        getOffsetX(): number;
        getRelativeOffsetX(): number;
        getOffsetY(): number;
        getRelativeOffsetY(): number;
        onWheel(event: any): void;
        autoShowScrollbars: () => void;
        autoHideScrollbars: () => void;
        onShowBarsTick(clock: Anim.Clock, progress: number, delta: number): void;
        onScroll(): void;
        updateOffset(): void;
        onScrollbarHorizontalMove: () => void;
        onScrollbarVerticalMove: () => void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
    class VBoxScrollableContent extends Transformable {
        contentWidth: number;
        contentHeight: number;
        estimatedHeight: number;
        estimatedHeightNeeded: boolean;
        loader: ScrollLoader;
        beforeRemoveItems: Element[];
        activeItems: Element[];
        activeItemsPos: number;
        activeItemsY: number;
        activeItemsHeight: number;
        reloadNeeded: boolean;
        readonly scrolled: Core.Events<{
            target: VBoxScrollableContent;
            offsetX: number;
            offsetY: number;
        }>;
        onscrolled: (event: {
            target: VBoxScrollableContent;
            offsetX: number;
            offsetY: number;
        }) => void;
        constructor();
        setLoader(loader: any): void;
        getActiveItems(): Element[];
        readonly offsetX: number;
        readonly offsetY: number;
        setOffset(x: number, y: number): void;
        getContentWidth(): number;
        getContentHeight(): number;
        getEstimatedContentHeight(): number;
        getMinY(): number;
        getMaxY(): number;
        loadItems(w?: number, h?: number): void;
        updateItems(): void;
        reload(): void;
        onLoaderChange: () => void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        onContentTransform(testOnly: boolean): void;
    }
    interface VBoxScrollingAreaInit extends VBoxScrollableInit {
    }
    class VBoxScrollingArea extends VBoxScrollable implements VBoxScrollingAreaInit {
        horizontalScrollbar: Scrollbar;
        verticalScrollbar: Scrollbar;
        constructor(init?: VBoxScrollingAreaInit);
        protected onStyleChange(): void;
        static style: object;
    }
}
declare namespace Ui {
    interface SelectionAreaInit extends Ui.LBoxInit {
    }
    class SelectionArea extends Ui.LBox implements SelectionAreaInit {
        watcher: Ui.PointerWatcher | undefined;
        rectangle: Ui.Rectangle;
        startPos: Ui.Point;
        private shiftStart;
        constructor(init?: SelectionAreaInit);
        getParentSelectionHandler(): Ui.Selection | undefined;
        private findAreaElements;
        private findSelectionableWatchers;
        private findMatchSelectionable;
        private findRightSelectionable;
        private findLeftSelectionable;
        private findBottomSelectionable;
        private findTopSelectionable;
        private onPointerDown;
        private onPtrUp;
        private onPtrMove;
        private onKeyDown;
    }
}
declare namespace Ui {
    interface ComboInit extends ButtonInit {
        placeHolder?: string;
        field?: string;
        data?: any[];
        position?: number;
        current?: any;
        search?: boolean;
        onchanged?: (event: {
            target: Combo;
            value: any;
            position: number;
        }) => void;
    }
    class Combo extends Button implements ComboInit {
        private _field;
        private _data;
        private _position;
        private _current;
        private _placeHolder;
        sep: undefined;
        arrowbottom: Icon;
        search: boolean;
        readonly changed: Core.Events<{
            target: Combo;
            value: any;
            position: number;
        }>;
        onchanged: (event: {
            target: Combo;
            value: any;
            position: number;
        }) => void;
        constructor(init?: ComboInit);
        placeHolder: string;
        field: string;
        data: any[];
        position: number;
        current: any;
        readonly value: any;
        protected onItemPress(popup: any, item: any, position: any): void;
        protected onPress(): void;
        protected updateColors(): void;
        protected onDisable(): void;
        protected onEnable(): void;
        static style: object;
    }
    interface ComboPopupInit extends MenuPopupInit {
        search?: boolean;
        field?: string;
        data?: any[];
        position?: number;
    }
    class ComboPopup extends MenuPopup {
        private list;
        private _data;
        private _field;
        private searchField;
        readonly item: Core.Events<{
            target: ComboPopup;
            item: ComboItem;
            position: number;
        }>;
        constructor(init?: ComboPopupInit);
        private onSearchChange;
        search: boolean;
        field: string;
        data: any[];
        position: number;
        protected onItemPress(item: ComboItem): void;
    }
    class ComboItem extends Button {
        static style: object;
    }
}
declare namespace Ui {
    interface HeaderDef {
        width?: number;
        type: string;
        title: string | Element;
        key?: string;
        colWidth?: number;
        ui?: typeof ListViewCell;
        resizable?: boolean;
    }
    interface ListViewHeaderInit extends PressableInit {
        title?: string | Element;
    }
    class ListViewHeader extends Pressable {
        protected _title: string | Element;
        protected uiTitle: Label;
        protected background: Rectangle;
        constructor(init?: ListViewHeaderInit);
        title: string | Element;
        protected getColor(): Color;
        protected getColorDown(): Color;
        protected onListViewHeaderDown(): void;
        protected onListViewHeaderUp(): void;
        protected onStyleChange(): void;
        static style: object;
    }
    class ListViewHeadersBar extends Container {
        private headers;
        sortColKey: string;
        sortInvert: boolean;
        sortArrow: Icon;
        cols: ListViewColBar[];
        rowsHeight: number;
        headersHeight: number;
        readonly headerpressed: Core.Events<{
            target: ListViewHeadersBar;
            key: string;
        }>;
        onheaderpressed: (event: {
            target: ListViewHeadersBar;
            key: string;
        }) => void;
        constructor(config: any);
        getSortColKey(): string;
        getSortInvert(): boolean;
        sortBy(key: string, invert: boolean): void;
        protected onHeaderPress(header: any): void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
    interface ListViewRowInit {
        height?: number;
        listView: ListView;
        headers: HeaderDef[];
        data: any;
        selectionActions?: SelectionActions;
    }
    class ListViewRow extends Container {
        private headers;
        private _data;
        private cells;
        private background;
        private sep;
        private selectionActions;
        readonly selectionWatcher: SelectionableWatcher;
        listView: ListView;
        readonly selected: Core.Events<{
            target: ListViewRow;
        }>;
        onselected: (event: {
            target: ListViewRow;
        }) => void;
        readonly unselected: Core.Events<{
            target: ListViewRow;
        }>;
        onunselected: (event: {
            target: ListViewRow;
        }) => void;
        constructor(init: ListViewRowInit);
        data: any;
        isSelected: boolean;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        protected onStyleChange(): void;
        static style: object;
    }
    interface ListViewRowOddInit extends ListViewRowInit {
    }
    class ListViewRowOdd extends ListViewRow {
        constructor(init: ListViewRowOddInit);
        static style: object;
    }
    interface ListViewRowEvenInit extends ListViewRowInit {
    }
    class ListViewRowEven extends ListViewRow {
        constructor(init: ListViewRowEvenInit);
        static style: object;
    }
    class ListViewScrollLoader extends ScrollLoader {
        listView: ListView;
        data: object[];
        constructor(listView: ListView, data: object[]);
        signalChange(): void;
        getMin(): number;
        getMax(): number;
        getElementAt(position: any): ListViewRow;
    }
    interface ListViewInit extends VBoxInit {
        headers?: HeaderDef[];
        scrolled?: boolean;
        scrollVertical?: boolean;
        scrollHorizontal?: boolean;
        selectionActions?: SelectionActions;
        onselectionchanged?: (event: {
            target: ListView;
        }) => void;
        onselected?: (event: {
            target: ListView;
        }) => void;
        onunselected?: (event: {
            target: ListView;
        }) => void;
        onactivated?: (event: {
            target: ListView;
            position: number;
            value: any;
        }) => void;
        onsortchanged?: (event: {
            target: ListView;
            key: string;
            invert: boolean;
        }) => void;
    }
    class ListView extends VBox implements ListViewInit {
        private _data;
        headers: HeaderDef[];
        headersBar: ListViewHeadersBar;
        headersScroll: ScrollingArea;
        firstRow: undefined;
        firstCol: undefined;
        cols: undefined;
        rowsHeight: number;
        headersHeight: number;
        headersVisible: boolean;
        sortColKey: string;
        sortInvert: boolean;
        sortArrow: undefined;
        scroll: VBoxScrollingArea;
        selectionActions: SelectionActions;
        private _scrolled;
        private _scrollVertical;
        private _scrollHorizontal;
        vbox: VBox;
        vboxScroll: ScrollingArea;
        private _selectionChangedLock;
        readonly selectionchanged: Core.Events<{
            target: ListView;
        }>;
        onselectionchanged: (event: {
            target: ListView;
        }) => void;
        readonly selected: Core.Events<{
            target: ListView;
        }>;
        onselected: (event: {
            target: ListView;
        }) => void;
        readonly unselected: Core.Events<{
            target: ListView;
        }>;
        onunselected: (event: {
            target: ListView;
        }) => void;
        readonly activated: Core.Events<{
            target: ListView;
            position: number;
            value: any;
        }>;
        onactivated: (event: {
            target: ListView;
            position: number;
            value: any;
        }) => void;
        readonly sortchanged: Core.Events<{
            target: ListView;
            key: string;
            invert: boolean;
        }>;
        onsortchanged: (event: {
            target: ListView;
            key: string;
            invert: boolean;
        }) => void;
        constructor(init?: ListViewInit);
        scrolled: boolean;
        scrollVertical: boolean;
        scrollHorizontal: boolean;
        showHeaders(): void;
        hideHeaders(): void;
        getSelectionActions(): SelectionActions;
        setSelectionActions(value: SelectionActions): void;
        getElementAt(position: number): ListViewRow;
        appendData(data: any): void;
        updateData(data: any): void;
        removeData(data: any): void;
        removeDataAt(position: number): void;
        clearData(): void;
        data: Array<any>;
        sortData(): void;
        sortBy(key: string, invert: boolean): void;
        findDataRow(data: any): number;
        onHeaderPress(header: any, key: any): void;
        onSelectionEdit(selection: Selection): void;
        protected onChildInvalidateArrange(child: Element): void;
        onRowSelectionChanged(): void;
        readonly rows: Array<ListViewRow>;
        readonly selectedRows: Array<ListViewRow>;
        selectAll(): void;
        unselectAll(): void;
    }
    class ListViewCell extends LBox {
        value: any;
        ui: Element;
        key: string;
        row: ListViewRow;
        constructor();
        getKey(): string;
        setKey(key: any): void;
        setRow(row: ListViewRow): void;
        getValue(): any;
        setValue(value: any): void;
        protected generateUi(): Element;
        protected onValueChange(value: any): void;
        protected onStyleChange(): void;
        static style: object;
    }
    class ListViewCellString extends ListViewCell {
        ui: Label;
        constructor();
        protected generateUi(): Element;
        protected onValueChange(value: any): void;
    }
    class ListViewColBar extends Container {
        headerHeight: number;
        header: ListViewHeader;
        headerDef: HeaderDef;
        grip: Movable;
        separator: Rectangle;
        constructor(header: ListViewHeader, headerDef: HeaderDef);
        setHeader(header: any): void;
        setHeaderHeight(height: any): void;
        protected onMove(): void;
        protected onUp(): void;
        protected measureCore(width: any, height: any): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: any, height: any): void;
        protected onDisable(): void;
        protected onEnable(): void;
    }
}
declare namespace Ui {
    interface UploadableInit extends PressableInit {
    }
    class Uploadable extends Pressable {
        protected _content: Element;
        protected input: UploadableFileWrapper;
        readonly file: Core.Events<{
            target: Uploadable;
            file: Core.File;
        }>;
        onfile: (event: {
            target: Uploadable;
            file: Core.File;
        }) => void;
        constructor(init?: UploadableInit);
        setDirectoryMode(active: any): void;
        protected onFile(fileWrapper: any, file: Core.File): void;
        protected onPress(): void;
        content: Element;
    }
    class UploadableFileWrapper extends Element {
        formDrawing: HTMLFormElement;
        inputDrawing: HTMLInputElement;
        iframeDrawing: HTMLIFrameElement;
        directoryMode: false;
        readonly file: Core.Events<{
            target: UploadableFileWrapper;
            file: Core.File;
        }>;
        constructor();
        select(): void;
        setDirectoryMode(active: any): void;
        protected createInput(): void;
        protected onChange: (event: any) => void;
        protected onLoad(): void;
        protected onUnload(): void;
        protected arrangeCore(w: number, h: number): void;
    }
    class UploadableWrapper extends Element {
        formDrawing: HTMLFormElement;
        inputDrawing: HTMLInputElement;
        directoryMode: boolean;
        readonly file: Core.Events<{
            target: UploadableWrapper;
            file: Core.File;
        }>;
        constructor();
        setDirectoryMode(active: any): void;
        protected createInput(): HTMLFormElement;
        onChange(event: any): void;
        protected renderDrawing(): void;
        protected arrangeCore(width: number, height: number): void;
    }
}
declare namespace Ui {
    interface UploadButtonInit extends ButtonInit {
        directoryMode?: boolean;
        onfilechanged?: (event: {
            target: UploadButton;
            file: Core.File;
        }) => void;
    }
    class UploadButton extends Button implements UploadButtonInit {
        input: UploadableFileWrapper;
        readonly filechanged: Core.Events<{
            target: UploadButton;
            file: Core.File;
        }>;
        onfilechanged: (event: {
            target: UploadButton;
            file: Core.File;
        }) => void;
        constructor(init?: UploadButtonInit);
        directoryMode: boolean;
        protected onUploadButtonPress(): void;
        protected onFile(wrapper: UploadableFileWrapper, file: Core.File): void;
    }
}
declare namespace Ui {
    class Transition extends Core.Object {
        constructor();
        run(current: Element, next: Element, progress: number): void;
        protected static transitions: object;
        static register(transitionName: string, classType: any): void;
        static parse(transition: any): any;
        static create(transition: Transition | string): Transition;
    }
}
declare namespace Ui {
    class Fade extends Transition {
        run(current: Element, next: Element, progress: number): void;
    }
}
declare namespace Ui {
    type SlideDirection = 'top' | 'bottom' | 'left' | 'right';
    interface SlideInit {
        direction?: SlideDirection;
    }
    class Slide extends Transition implements SlideInit {
        protected _direction: SlideDirection;
        constructor(init?: SlideInit);
        direction: SlideDirection;
        run(current: Element, next: Element, progress: number): void;
    }
}
declare namespace Ui {
    interface FlipInit {
        orientation?: 'horizontal' | 'vertical';
    }
    class Flip extends Transition implements FlipInit {
        orientation: 'horizontal' | 'vertical';
        constructor(init?: FlipInit);
        run(current: Element, next: Element, progress: number): void;
    }
}
declare namespace Ui {
    interface TransitionBoxInit extends LBoxInit {
        duration?: number;
        ease?: Anim.EasingFunction | string;
        transition?: Transition | string;
        position?: number;
        current?: Element;
    }
    class TransitionBox extends LBox {
        protected _transition: Transition;
        protected _duration: number;
        protected _ease: Anim.EasingFunction;
        protected _position: number;
        protected transitionClock: Anim.Clock;
        protected _current: Element;
        protected next: Element;
        protected replaceMode: boolean;
        protected progress: number;
        children: TransitionBoxContent[];
        readonly changed: Core.Events<{
            target: TransitionBox;
            position: number;
        }>;
        onchanged: (event: {
            target: TransitionBox;
            position: number;
        }) => void;
        constructor(init?: TransitionBoxInit);
        position: number;
        duration: number;
        ease: Anim.EasingFunction | string;
        transition: Transition | string;
        current: Element;
        setCurrentAt(position: number): void;
        replaceContent(content: any): void;
        protected onLoad(): void;
        protected onTransitionBoxLoad(): void;
        protected onUnload(): void;
        protected onTransitionBoxUnload(): void;
        protected onTransitionTick(clock: any, progress: any): void;
        protected onTransitionComplete: () => void;
        protected arrangeCore(width: number, height: number): void;
        append(child: Element): void;
        prepend(child: Element): void;
        remove(child: any): void;
        getChildPosition(child: Element): number;
    }
    class TransitionBoxContent extends LBox {
    }
}
declare namespace Ui {
    type FoldDirection = 'top' | 'bottom' | 'left' | 'right';
    type FoldMode = 'extend' | 'slide';
    interface FoldInit extends ContainerInit {
        isFolded?: boolean;
        over?: boolean;
        mode?: FoldMode;
        header?: Element;
        content?: Element;
        background?: Element;
        position?: FoldDirection;
        animDuration?: number;
        onfolded?: (event: {
            target: Fold;
        }) => void;
        onunfolded?: (event: {
            target: Fold;
        }) => void;
        onpositionchanged?: (event: {
            target: Fold;
            position: FoldDirection;
        }) => void;
        onprogress?: (event: {
            target: Fold;
            offset: number;
        }) => void;
    }
    class Fold extends Container {
        private headerBox;
        private _header;
        private contentBox;
        private _content;
        private _background;
        private _offset;
        private _position;
        private _isFolded;
        private _over;
        private _mode;
        private clock?;
        private contentSize;
        private _animDuration;
        readonly folded: Core.Events<{
            target: Fold;
        }>;
        onfolded: (event: {
            target: Fold;
        }) => void;
        readonly unfolded: Core.Events<{
            target: Fold;
        }>;
        onunfolded: (event: {
            target: Fold;
        }) => void;
        readonly positionchanged: Core.Events<{
            target: Fold;
            position: "left" | "right" | "top" | "bottom";
        }>;
        onpositionchanged: (event: {
            target: Fold;
            position: FoldDirection;
        }) => void;
        readonly progress: Core.Events<{
            target: Fold;
            offset: number;
        }>;
        onprogress: (event: {
            target: Fold;
            offset: number;
        }) => void;
        constructor(init?: FoldInit);
        isFolded: boolean;
        fold(): void;
        unfold(): void;
        over: boolean;
        mode: FoldMode;
        header: Element;
        content: Element;
        background: Element;
        position: FoldDirection;
        invert(): void;
        animDuration: number;
        protected offset: number;
        protected startAnimation(): void;
        protected stopAnimation(): void;
        protected onClockTick(clock: Anim.Clock, progress: number): void;
        protected measureCore(width: any, height: any): Size;
        protected arrangeCore(width: any, height: any): void;
    }
}
declare namespace Ui {
    interface SwitchInit extends ContainerInit {
        value?: boolean;
        ease?: Anim.EasingFunction;
        onchanged?: (event: {
            target: Switch;
            value: boolean;
        }) => void;
    }
    class Switch extends Container {
        private _value;
        private pos;
        private background;
        private button;
        private bar;
        private buttonContent;
        private alignClock?;
        private speed;
        private animNext;
        private animStart;
        ease: Anim.EasingFunction;
        readonly changed: Core.Events<{
            target: Switch;
            value: boolean;
        }>;
        onchanged: (event: {
            target: Switch;
            value: boolean;
        }) => void;
        constructor(init?: SwitchInit);
        value: boolean;
        private onButtonMove;
        private updatePos;
        private getColor;
        private getForeground;
        private getBackground;
        private getButtonColor;
        private updateColors;
        private onDown;
        private onUp;
        private startAnimation;
        private stopAnimation;
        private onAlignTick;
        protected measureCore(width: number, height: number): Size;
        protected arrangeCore(width: number, height: number): void;
        protected onStyleChange(): void;
        protected onDisable(): void;
        protected onEnable(): void;
        static style: object;
    }
}
declare namespace Ui {
    type AccordeonOrientation = 'horizontal' | 'vertical';
    interface AccordeonableInit extends ContainerInit {
    }
    class Accordeonable extends Container {
        private current;
        private _currentPage?;
        private clock?;
        private headersSize;
        private contentSize;
        private _orientation;
        readonly changed: Core.Events<{
            target: Accordeonable;
            page: AccordeonPage;
            position: number;
        }>;
        onchanged: (event: {
            target: Accordeonable;
            page: AccordeonPage;
            position: number;
        }) => void;
        constructor(init?: AccordeonableInit);
        orientation: AccordeonOrientation;
        readonly pages: AccordeonPage[];
        currentPage: AccordeonPage | undefined;
        currentPosition: number;
        appendPage(page: AccordeonPage): void;
        removePage(page: AccordeonPage): void;
        private onClockTick;
        private onPageSelect;
        private onPageClose;
        private measureHorizontal;
        private measureVertical;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
    class AccordeonPage extends Container {
        headerBox: Pressable;
        header?: Element;
        content?: Element;
        offset: number;
        orientation: 'vertical' | 'horizontal';
        isSelected: boolean;
        selected: Core.Events<{
            target: AccordeonPage;
        }>;
        unselected: Core.Events<{
            target: AccordeonPage;
        }>;
        closed: Core.Events<{
            target: AccordeonPage;
        }>;
        orientationchanged: Core.Events<{
            target: AccordeonPage;
            orientation: Orientation;
        }>;
        constructor(init?: any);
        close(): void;
        select(): void;
        getIsSelected(): boolean;
        getHeader(): Element;
        setHeader(header: any): void;
        getContent(): Element;
        setContent(content: any): void;
        getOrientation(): Orientation;
        setOrientation(orientation: any): void;
        unselect(): void;
        showContent(): void;
        hideContent(): void;
        getOffset(): number;
        setOffset(offset: any): void;
        private onHeaderPress;
        protected measureCore(width: number, height: number): Size;
        protected arrangeCore(width: number, height: number): void;
    }
}
declare namespace Ui {
    class Accordeon extends Accordeonable {
    }
}
declare namespace Ui {
    type DropAtEffectFunc = (data: any, position: number) => DropEffect[];
    interface DropAtBoxInit extends LBoxInit {
        ondrageffect?: (event: Ui.DragEvent) => void;
        ondragentered?: (event: {
            target: DropAtBox;
            data: any;
        }) => void;
        ondragleaved?: (event: {
            target: DropAtBox;
        }) => void;
        ondroppedat?: (event: {
            target: DropAtBox;
            data: any;
            effect: string;
            position: number;
            x: number;
            y: number;
        }) => void;
        ondroppedfileat?: (event: {
            target: DropAtBox;
            file: Core.File;
            effect: string;
            position: number;
            x: number;
            y: number;
        }) => void;
    }
    class DropAtBox extends LBox implements DropAtBoxInit {
        watchers: DragWatcher[];
        allowedTypes: {
            type: string | Function;
            effect: DropEffect[] | DropAtEffectFunc;
        }[];
        private container;
        private fixed;
        private markerOrientation;
        readonly drageffect: Core.Events<DragEvent>;
        ondrageffect: (event: DragEvent) => void;
        readonly dragentered: Core.Events<{
            target: DropAtBox;
            data: any;
        }>;
        ondragentered: (event: {
            target: DropAtBox;
            data: any;
        }) => void;
        readonly dragleaved: Core.Events<{
            target: DropAtBox;
        }>;
        ondragleaved: (event: {
            target: DropAtBox;
        }) => void;
        readonly droppedat: Core.Events<{
            target: DropAtBox;
            data: any;
            effect: string;
            position: number;
            x: number;
            y: number;
        }>;
        ondroppedat: (event: {
            target: DropAtBox;
            data: any;
            effect: string;
            position: number;
            x: number;
            y: number;
        }) => void;
        readonly droppedfileat: Core.Events<{
            target: DropAtBox;
            file: Core.File;
            effect: string;
            position: number;
            x: number;
            y: number;
        }>;
        ondroppedfileat: (event: {
            target: DropAtBox;
            file: Core.File;
            effect: string;
            position: number;
            x: number;
            y: number;
        }) => void;
        constructor(init?: DropAtBoxInit);
        addType(type: string | Function, effects: string | string[] | DropEffect[] | DropAtEffectFunc): void;
        setContainer(container: any): void;
        getContainer(): Container;
        setMarkerOrientation(orientation: any): void;
        setMarkerPos(marker: Element, pos: number): void;
        findPosition(point: Point): number;
        findPositionHorizontal(point: Point): number;
        findPositionVertical(point: Point): number;
        insertAt(element: Element, pos: number): void;
        moveAt(element: Element, pos: number): void;
        readonly logicalChildren: Element[];
        content: Element;
        clear(): void;
        append(item: Element): void;
        remove(item: Element): void;
        protected onStyleChange(): void;
        protected getAllowedTypesEffect(dataTransfer: DragDataTransfer): DropEffect[];
        protected onDragEffect(dataTransfer: DragDataTransfer): string | DropEffect[];
        protected onDragOver(event: DragEvent): void;
        protected onDragEffectFunction(dataTransfer: DragDataTransfer, func: DropAtEffectFunc): DropEffect[];
        protected onWatcherEnter(watcher: DragWatcher): void;
        protected onWatcherMove(watcher: DragWatcher): void;
        protected onWatcherLeave(watcher: any): void;
        protected onWatcherDrop(watcher: DragWatcher, effect: any, x: number, y: number): void;
        protected onDragEnter(dataTransfer: DragDataTransfer): void;
        protected onDragLeave(): void;
        protected onDrop(dataTransfer: DragDataTransfer, dropEffect: any, x: number, y: number): void;
        static style: object;
    }
    interface FlowDropBoxInit extends DropAtBoxInit {
        uniform?: boolean;
        spacing?: number;
    }
    class FlowDropBox extends DropAtBox {
        private _flow;
        constructor(init?: FlowDropBoxInit);
        uniform: boolean;
        spacing: number;
    }
    interface SFlowDropBoxInit extends DropAtBoxInit {
        stretchMaxRatio?: number;
        uniform?: boolean;
        uniformRatio?: number;
        itemAlign?: SFlowAlign;
        spacing?: number;
    }
    class SFlowDropBox extends DropAtBox {
        private _sflow;
        constructor(init?: SFlowDropBoxInit);
        stretchMaxRatio: number;
        uniform: boolean;
        uniformRatio: number;
        itemAlign: SFlowAlign;
        spacing: number;
    }
    interface VDropBoxInit extends DropAtBoxInit {
    }
    class VDropBox extends DropAtBox {
        private _vbox;
        constructor(init?: VDropBoxInit);
        uniform: boolean;
        spacing: number;
    }
    interface HDropBoxInit extends DropAtBoxInit {
    }
    class HDropBox extends DropAtBox {
        private _hbox;
        constructor(init?: HDropBoxInit);
        uniform: boolean;
        spacing: number;
    }
}
declare namespace Ui {
    interface SegmentBarInit extends LBoxInit {
        orientation?: 'horizontal' | 'vertical';
        field?: string;
        data?: Array<any>;
        currentPosition?: number;
        onchanged?: (event: {
            target: SegmentBar;
            value: any;
        }) => void;
    }
    class SegmentBar extends LBox {
        private border;
        private box;
        private current;
        private _field;
        private _data;
        private _orientation;
        readonly changed: Core.Events<{
            target: SegmentBar;
            value: any;
        }>;
        onchanged: (event: {
            target: SegmentBar;
            value: any;
        }) => void;
        constructor(init?: SegmentBarInit);
        orientation: 'horizontal' | 'vertical';
        field: string;
        data: Array<any>;
        currentPosition: number;
        next(): void;
        previous(): void;
        private onSegmentSelect;
        private onKeyDown;
        protected onStyleChange(): void;
        static style: any;
    }
    interface SegmentButtonInit extends PressableInit {
        textTransform?: string;
        foreground?: Color | string;
        data?: any;
        text?: string;
        textHeight?: number;
        mode?: 'left' | 'right' | 'top' | 'bottom';
        radius?: number;
        spacing?: number;
        background?: Color | string;
    }
    class SegmentButton extends Pressable implements SegmentButtonInit {
        private textBox;
        private label;
        private bg;
        private _mode;
        private _data;
        private _radius;
        constructor(init?: SegmentButtonInit);
        textTransform: string;
        foreground: Color | string;
        data: any;
        text: string;
        textHeight: number;
        mode: 'left' | 'right' | 'top' | 'bottom';
        radius: number;
        spacing: number;
        background: Color | string;
        backgroundMode: 'top' | 'bottom' | 'left' | 'right' | 'stretch';
        backgroundWidth: number;
        backgroundHeight: number;
        protected onDisable(): void;
        protected onEnable(): void;
    }
}
declare namespace Ui {
    interface LocatorInit extends ContainerInit {
        path?: string;
        onchanged?: (event: {
            target: Locator;
            path: string;
            position: number;
        }) => void;
    }
    class Locator extends Container implements LocatorInit {
        private _path;
        private foregrounds;
        private backgrounds;
        private border;
        private focusedPart;
        readonly changed: Core.Events<{
            target: Locator;
            path: string;
            position: number;
        }>;
        onchanged: (event: {
            target: Locator;
            path: string;
            position: number;
        }) => void;
        constructor(init?: LocatorInit);
        path: string;
        private getBackground;
        private getLightColor;
        private getBackgroundBorder;
        private getDownColor;
        private onPathPress;
        private onPathDown;
        private onPathUp;
        private onPathFocus;
        private onPathBlur;
        private updateColors;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        protected onStyleChange(): void;
        protected onDisable(): void;
        protected onEnable(): void;
        static style: any;
    }
    interface LocatorRightArrowInit extends CanvasElementInit {
    }
    class LocatorRightArrow extends CanvasElement {
        private _radius;
        private _length;
        private _fill;
        constructor(config: any);
        radius: number;
        arrowLength: number;
        fill: Color | string;
        protected updateCanvas(ctx: any): void;
    }
    interface LocatorLeftArrowInit extends ShapeInit {
        radius?: number;
        arrowLength?: number;
    }
    class LocatorLeftArrow extends Shape implements LocatorLeftArrowInit {
        private _radius;
        private _length;
        constructor(init?: LocatorLeftArrowInit);
        radius: number;
        arrowLength: number;
        protected arrangeCore(width: number, height: number): void;
    }
    interface LocatorLeftRightArrowInit extends ShapeInit {
        radius?: number;
        arrowLength?: number;
    }
    class LocatorLeftRightArrow extends Shape implements LocatorLeftRightArrowInit {
        private _length;
        constructor(init?: LocatorLeftRightArrowInit);
        radius: number;
        arrowLength: number;
        protected arrangeCore(width: number, height: number): void;
    }
}
declare namespace Ui {
    interface CarouselableInit extends MovableBaseInit {
        ease?: Anim.EasingFunction;
        autoPlay?: number;
        bufferingSize?: number;
        content?: Element[];
    }
    class Carouselable extends MovableBase {
        private _ease;
        private items;
        private pos;
        private lastPosition;
        private activeItems;
        private alignClock;
        private animNext;
        private animStart;
        private speed;
        private _bufferingSize;
        private autoPlayDelay;
        private autoPlayTask?;
        readonly changed: Core.Events<{
            target: Carouselable;
            position: number;
        }>;
        onchanged: (event: {
            target: Carouselable;
            position: number;
        }) => void;
        constructor(init?: CarouselableInit);
        autoPlay: number;
        stopAutoPlay(): void;
        startAutoPlay(): void;
        private onAutoPlayTimeout;
        bufferingSize: number;
        readonly logicalChildren: Element[];
        readonly currentPosition: number;
        current: Element;
        setCurrentAt(position: number, noAnimation?: boolean): void;
        setCurrent(current: Element, noAnimation?: boolean): void;
        next(): void;
        previous(): void;
        ease: Anim.EasingFunction;
        content: Element[];
        append(child: Element): void;
        remove(child: Element): void;
        insertAt(child: Element, position: number): void;
        moveAt(child: Element, position: number): void;
        private onKeyDown;
        private onWheel;
        private onCarouselableDown;
        private onCarouselableUp;
        private onChange;
        private onAlignTick;
        private startAnimation;
        private stopAnimation;
        private loadItems;
        private updateItems;
        protected onLoad(): void;
        protected onMove(x: any, y: any): void;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
}
declare namespace Ui {
    interface CarouselInit extends ContainerInit {
        autoPlay?: number;
        bufferingSize?: number;
        content?: Element[];
        alwaysShowArrows?: boolean;
        onchanged?: (event: {
            target: Carousel;
            position: number;
        }) => void;
    }
    class Carousel extends Container {
        private carouselable;
        private buttonNext;
        private buttonNextIcon;
        private buttonPrevious;
        private buttonPreviousIcon;
        private showClock?;
        private hideTimeout?;
        private showNext;
        private showPrevious;
        private _alwaysShowArrows;
        readonly changed: Core.Events<{
            target: Carousel;
            position: number;
        }>;
        onchanged: (event: {
            target: Carousel;
            position: number;
        }) => void;
        constructor(init?: CarouselInit);
        autoPlay: number;
        alwaysShowArrows: boolean;
        next(): void;
        previous(): void;
        readonly logicalChildren: Element[];
        readonly currentPosition: number;
        current: Element;
        setCurrentAt(position: number, noAnimation?: boolean): void;
        setCurrent(current: Element, noAnimation?: boolean): void;
        bufferingSize: number;
        append(child: Element): void;
        remove(child: Element): void;
        insertAt(child: Element, pos: number): void;
        moveAt(child: Element, pos: number): void;
        content: Element[];
        private onCarouselableChange;
        private onCarouselableFocus;
        private onCarouselableBlur;
        private onPreviousPress;
        private onNextPress;
        private onMouseEnter;
        private onMouseOverMove;
        private onMouseLeave;
        private showArrows;
        private hideArrows;
        private onShowTick;
        private onKeyDown;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        protected onStyleChange(): void;
        static style: any;
    }
}
declare namespace Ui {
    class RichTextButton extends ToggleButton {
        style: {
            borderWidth: number;
            background: string;
            activeBackground: string;
        };
    }
    class RichTextEditor extends LBox {
        private _contentEditable;
        constructor();
        html: string;
        text: string;
        textAlign: string;
        fontSize: number;
        fontFamily: string;
        fontWeight: any;
        interLine: number;
        wordWrap: string;
        whiteSpace: string;
        color: Color | string;
    }
}
