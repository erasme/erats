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
        set onerror(value: (event: {
            target: HttpRequest;
            code: number;
        }) => void);
        readonly done: Events<{
            target: HttpRequest;
        }>;
        set ondone(value: (event: {
            target: HttpRequest;
        }) => void);
        constructor(init?: HttpRequestInit);
        setRequestHeader(header: any, value: any): void;
        addArgument(argName: any, argValue: any): void;
        abort(): void;
        send(): void;
        sendAsync(): Promise<HttpRequest>;
        waitAsync(): Promise<HttpRequest>;
        getResponseHeader(header: string): string;
        get responseText(): string;
        get responseBase64(): string;
        get responseJSON(): any;
        get responseXML(): Document;
        get status(): number;
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
        set ontimeupdated(value: (event: {
            target: Timer;
            arguments: Array<any>;
        }) => void);
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
        set onerror(value: (event: {
            target: Socket;
        }) => void);
        readonly message: Events<{
            target: Socket;
            message: any;
        }>;
        set onmessage(value: (event: {
            target: Socket;
            message: any;
        }) => void);
        readonly closed: Events<{
            target: Socket;
        }>;
        set onclosed(value: (event: {
            target: Socket;
        }) => void);
        readonly opened: Events<{
            target: Socket;
        }>;
        set onopened(value: (event: {
            target: Socket;
        }) => void);
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
        protected _isSent: boolean;
        field: string;
        protected loadedOctets: number;
        protected totalOctets: number;
        readonly progress: Events<{
            target: FilePostUploader;
            loaded: number;
            total: number;
        }>;
        set onprogress(value: (event: {
            target: FilePostUploader;
            loaded: number;
            total: number;
        }) => void);
        readonly completed: Events<{
            target: FilePostUploader;
        }>;
        set oncompleted(value: (event: {
            target: FilePostUploader;
        }) => void);
        readonly error: Events<{
            target: FilePostUploader;
            status: number;
        }>;
        set onerror(value: (event: {
            target: FilePostUploader;
            status: number;
        }) => void);
        constructor(init?: FilePostUploaderInit);
        set method(method: string);
        get file(): File;
        set file(file: File);
        set service(service: string);
        setField(name: any, value: any): void;
        set arguments(args: object);
        set destination(destination: string);
        send(): void;
        get status(): number;
        sendAsync(): Promise<FilePostUploader>;
        waitAsync(): Promise<FilePostUploader>;
        abort(): void;
        get responseText(): string;
        get responseJSON(): any;
        get isCompleted(): boolean;
        get total(): number;
        get loaded(): number;
        protected onStateChange(event: any): void;
        protected onUpdateProgress(event: any): void;
        protected onFileReaderError(event: any): void;
        protected onFileReaderLoad(event: any): void;
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
        set animation(animation: boolean);
        set repeat(repeat: 'forever' | number);
        set speed(speed: number);
        set autoReverse(autoReverse: boolean);
        set beginTime(beginTime: number);
        set ease(ease: EasingFunction | string);
        set target(target: Target);
        set duration(duration: number | 'forever' | 'automatic');
        set parent(parent: Clock);
        get parent(): Clock;
        get globalTime(): number;
        get isActive(): boolean;
        get time(): number;
        get iteration(): number;
        get progress(): number;
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
        set content(content: Clock[]);
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
        getCssGradient(): string;
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
        readonly drawing: HTMLElement;
        private collapse;
        private measureValid;
        private measureConstraintPixelRatio;
        private measureConstraintWidth;
        private measureConstraintHeight;
        private measureConstraintIsPrint;
        private _measureWidth;
        private _measureHeight;
        private arrangeValid;
        private arrangeX;
        private arrangeY;
        private arrangeWidth;
        private arrangeHeight;
        private arrangeIsPrint;
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
        set onfocused(value: (event: {
            target: Element;
        }) => void);
        readonly blurred: Core.Events<{
            target: Element;
        }>;
        set onblurred(value: (event: {
            target: Element;
        }) => void);
        readonly loaded: Core.Events<{
            target: Element;
        }>;
        set onloaded(value: (event: {
            target: Element;
        }) => void);
        readonly unloaded: Core.Events<{
            target: Element;
        }>;
        set onunloaded(value: (event: {
            target: Element;
        }) => void);
        readonly enabled: Core.Events<{
            target: Element;
        }>;
        set onenabled(value: (event: {
            target: Element;
        }) => void);
        readonly disabled: Core.Events<{
            target: Element;
        }>;
        set ondisabled(value: (event: {
            target: Element;
        }) => void);
        readonly visible: Core.Events<{
            target: Element;
        }>;
        set onvisible(value: (event: {
            target: Element;
        }) => void);
        readonly hidden: Core.Events<{
            target: Element;
        }>;
        set onhidden(value: (event: {
            target: Element;
        }) => void);
        readonly ptrdowned: Core.Events<EmuPointerEvent>;
        set onptrdowned(value: (event: EmuPointerEvent) => void);
        readonly ptrmoved: Core.Events<EmuPointerEvent>;
        set onptrmoved(value: (event: EmuPointerEvent) => void);
        readonly ptrupped: Core.Events<EmuPointerEvent>;
        set onptrupped(value: (event: EmuPointerEvent) => void);
        readonly ptrcanceled: Core.Events<EmuPointerEvent>;
        set onptrcanceled(value: (event: EmuPointerEvent) => void);
        readonly wheelchanged: Core.Events<WheelEvent>;
        set onwheelchanged(value: (event: WheelEvent) => void);
        readonly dragover: Core.Events<DragEvent>;
        set ondragover(value: (event: DragEvent) => void);
        constructor(init?: ElementInit);
        get selectable(): boolean;
        set selectable(selectable: boolean);
        get resizable(): boolean;
        set resizable(value: boolean);
        get layoutX(): number;
        get layoutY(): number;
        get layoutWidth(): number;
        get layoutHeight(): number;
        set id(id: string);
        get id(): string;
        get focusable(): boolean;
        set focusable(focusable: boolean);
        private onMouseDownFocus;
        private onMouseUpFocus;
        getIsMouseFocus(): boolean;
        set role(role: string);
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
        get width(): number | undefined;
        set width(width: number | undefined);
        get height(): number | undefined;
        set height(height: number | undefined);
        get maxWidth(): number | undefined;
        set maxWidth(width: number | undefined);
        get maxHeight(): number | undefined;
        set maxHeight(height: number | undefined);
        get verticalAlign(): VerticalAlign;
        set verticalAlign(align: VerticalAlign);
        get horizontalAlign(): HorizontalAlign;
        set horizontalAlign(align: HorizontalAlign);
        get clipToBounds(): boolean;
        set clipToBounds(clip: boolean);
        setClipRectangle(x: number, y: number, width: number, height: number): void;
        updateClipRectangle(): void;
        set margin(margin: number);
        get marginTop(): number;
        set marginTop(marginTop: number);
        get marginBottom(): number;
        set marginBottom(marginBottom: number);
        get marginLeft(): number;
        set marginLeft(marginLeft: number);
        get marginRight(): number;
        set marginRight(marginRight: number);
        get opacity(): number;
        set opacity(opacity: number);
        focus(): void;
        blur(): void;
        set transform(transform: Matrix | undefined);
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
        set eventsHidden(eventsHidden: boolean);
        get eventsHidden(): boolean;
        elementFromPoint(point: Point): Element | undefined;
        get measureWidth(): number;
        get measureHeight(): number;
        get isCollapsed(): boolean;
        hide(collapse?: boolean): void;
        show(): void;
        get isVisible(): boolean;
        set isVisible(value: boolean);
        set parentVisible(visible: boolean);
        protected onInternalHidden(): void;
        protected onHidden(): void;
        protected onInternalVisible(): void;
        checkVisible(): void;
        protected onVisible(): void;
        disable(): void;
        enable(): void;
        setEnable(enable: boolean): void;
        get isDisabled(): boolean;
        set isDisabled(disabled: boolean);
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
        get parent(): Element | undefined;
        set parent(parent: Element | undefined);
        getParentByClass<T extends Ui.Element>(classFunc: new (...args: any[]) => T): T | undefined;
        setParentStyle(parentStyle: object | undefined): void;
        set style(style: object | undefined);
        setStyleProperty(property: string, value: any): void;
        getStyleProperty(property: string): any;
        protected onInternalStyleChange(): void;
        protected onStyleChange(): void;
        get hasFocus(): boolean;
        scrollIntoView(): void;
        protected onScrollIntoView(el: Element): void;
        get(name: string): Element | undefined;
        get isLoaded(): boolean;
        set isLoaded(isLoaded: boolean);
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
        get containerDrawing(): any;
        set containerDrawing(containerDrawing: any);
        appendChild(child: Element): void;
        prependChild(child: Element): void;
        removeChild(child: Element): void;
        insertChildAt(child: Element, position: number): void;
        insertChildBefore(child: Element, beforeChild: Element): void;
        moveChildAt(child: Element, position: number): void;
        get children(): Element[];
        get firstChild(): Element | undefined;
        get lastChild(): Element | undefined;
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
        protected _canvasEngine: 'canvas' | 'svg';
        private _context;
        private svgDrawing;
        private canvasDrawing;
        private dpiRatio;
        private generateNeeded;
        constructor(init?: ContainerInit);
        get canvasEngine(): 'canvas' | 'svg';
        set canvasEngine(value: 'canvas' | 'svg');
        update(): void;
        get context(): CanvasRenderingContext2D;
        protected updateCanvas(context: Ui.CanvasRenderingContext2D): void;
        protected renderCanvasDrawing(): void;
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
        measureText(text: any): {
            width: number;
            height: number;
        };
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
    class Rectangle extends Element implements RectangleInit {
        private _fill;
        private _radiusTopLeft;
        private _radiusTopRight;
        private _radiusBottomLeft;
        private _radiusBottomRight;
        constructor(init?: RectangleInit);
        set fill(fill: Color | LinearGradient | string);
        set radius(radius: number);
        get radiusTopLeft(): number;
        set radiusTopLeft(radiusTopLeft: number);
        get radiusTopRight(): number;
        set radiusTopRight(radiusTopRight: number);
        get radiusBottomLeft(): number;
        set radiusBottomLeft(radiusBottomLeft: number);
        get radiusBottomRight(): number;
        set radiusBottomRight(radiusBottomRight: number);
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
        set scale(scale: number);
        get fill(): Color | LinearGradient | string | undefined;
        set fill(fill: string | undefined | Color | LinearGradient);
        set path(path: string);
        onStyleChange(): void;
        updateCanvas(ctx: any): void;
        static style: ShapeStyle;
    }
}
declare namespace Ui {
    interface IconInit extends ElementInit {
        icon?: string;
        fill?: string | Color;
        path?: string;
    }
    class Icon extends Element {
        static baseUrl: string;
        static forceExternal: boolean;
        private static loadingReqs;
        private static iconsCache;
        private _icon;
        private _fill?;
        readonly loadingfailed: Core.Events<{
            target: Icon;
        }>;
        set onloadingfailed(value: ({ target: Icon }: {
            target: any;
        }) => void);
        constructor(init?: IconInit);
        get fill(): Color | string;
        set fill(value: Color | string);
        set path(value: string);
        set icon(value: string);
        protected onStyleChange(): void;
        protected onLoadingFailed(): void;
        private loadIcon;
        private normalize;
        static style: any;
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
        set icon(icon: string);
        get fill(): Color;
        set fill(fill: Color);
        get stroke(): Color;
        set stroke(stroke: Color);
        get strokeWidth(): number;
        set strokeWidth(strokeWidth: number);
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
    class EmuPointerEvent extends Event {
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
        getFiles(): FileList;
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
        imageElement: Element;
        image: HTMLElement;
        imageEffect: DragEffectIcon;
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
        timer?: Core.DelayedTask;
        dropFailsTimer: Anim.Clock;
        delayed: boolean;
        scrollControlTimer?: Anim.Clock;
        dragWatcher: DragWatcher;
        readonly started: Core.Events<{
            target: DragEmuDataTransfer;
        }>;
        readonly ended: Core.Events<{
            target: DragEmuDataTransfer;
        }>;
        constructor(draggable: Element, imageElement: Element, x: number, y: number, delayed: boolean, pointerEvent?: PointerEvent, touchEvent?: TouchEvent, mouseEvent?: MouseEvent);
        setData(data: any): void;
        getData(): any;
        hasData(): boolean;
        getPosition(): Point;
        getDragDelta(): Point;
        protected generateImage(element: any): HTMLElement;
        protected onTimer(): void;
        capture(element: Element, effect: any): DragWatcher;
        releaseDragWatcher(dragWatcher: DragWatcher): void;
        protected onScrollClockTick(clock: Anim.Clock, delta: number): void;
        protected onKeyUpDown: (e: KeyboardEvent) => void;
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
        set content(content: Element | Element[] | undefined);
        set padding(padding: number);
        get paddingTop(): number;
        set paddingTop(paddingTop: number);
        get paddingBottom(): number;
        set paddingBottom(paddingBottom: number);
        get paddingLeft(): number;
        set paddingLeft(paddingLeft: number);
        get paddingRight(): number;
        set paddingRight(paddingRight: number);
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
    class Box extends Container implements BoxInit, IContainer {
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
        set content(content: Element | Element[]);
        get orientation(): Orientation;
        set orientation(orientation: Orientation);
        set padding(padding: number);
        get paddingTop(): number;
        set paddingTop(paddingTop: number);
        get paddingBottom(): number;
        set paddingBottom(paddingBottom: number);
        get paddingLeft(): number;
        set paddingLeft(paddingLeft: number);
        get paddingRight(): number;
        set paddingRight(paddingRight: number);
        get uniform(): boolean;
        set uniform(uniform: boolean);
        get spacing(): number;
        set spacing(spacing: number);
        append(child: Element, resizable?: boolean): void;
        prepend(child: Element, resizable?: boolean): void;
        insertAt(child: Element, position: number, resizable?: boolean): void;
        insertBefore(child: Element, beforeChild: Element): void;
        moveAt(child: Element, position: number): void;
        remove(child: Element): void;
        private measureUniform;
        private measureNonUniformVertical;
        private measureNonUniformHorizontal;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected measureForOrientation(width: number, height: number, orientation: 'horizontal' | 'vertical'): {
            width: number;
            height: number;
        };
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
        private enter?;
        private leave?;
        private _isOver;
        constructor(init: {
            element: Ui.Element;
            onentered?: (watcher: OverWatcher) => void;
            onleaved?: (watcher: OverWatcher) => void;
        });
        get isOver(): boolean;
    }
    interface OverableInit extends LBoxInit {
        onentered?: (event: {
            target: Overable;
        }) => void;
        onleaved?: (event: {
            target: Overable;
        }) => void;
    }
    class Overable extends LBox implements OverableInit {
        watcher: OverWatcher;
        readonly entered: Core.Events<{
            target: Overable;
        }>;
        set onentered(value: (event: {
            target: Overable;
        }) => void);
        readonly leaved: Core.Events<{
            target: Overable;
        }>;
        set onleaved(value: (event: {
            target: Overable;
        }) => void);
        constructor(init?: OverableInit);
        get isOver(): boolean;
    }
}
declare namespace Ui {
    class FocusInWatcher extends Core.Object {
        private element;
        private focusin?;
        private focusout?;
        private _isDelayFocusIn;
        private _isFocusIn;
        private delayTask?;
        constructor(init: {
            element: Ui.Element;
            onfocusin?: (watcher: FocusInWatcher) => void;
            onfocusout?: (watcher: FocusInWatcher) => void;
        });
        private delayFocus;
        private onDelayFocus;
        get isFocusIn(): boolean;
    }
}
declare namespace Ui {
    class RippleEffect extends Core.Object {
        readonly element: Ui.Element;
        private ripple;
        private isAnimated;
        private upResolve?;
        constructor(element: Ui.Element);
        protected anim(x?: number, y?: number): Promise<void>;
        down(x?: number, y?: number): void;
        up(): void;
        press(x?: number, y?: number): void;
        set fill(fill: Ui.Color | string);
        set pressable(pressable: Pressable);
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
        private _pointerId?;
        private _isDown;
        private lastTime;
        private delayedTimer;
        x?: number;
        y?: number;
        altKey?: boolean;
        shiftKey?: boolean;
        ctrlKey?: boolean;
        middleButton?: boolean;
        lock: boolean;
        allowMiddleButton: boolean;
        constructor(init: {
            element: Ui.Element;
            onpressed?: (watcher: PressWatcher) => void;
            ondowned?: (watcher: PressWatcher) => void;
            onupped?: (watcher: PressWatcher) => void;
            onactivated?: (watcher: PressWatcher) => void;
            ondelayedpress?: (watcher: PressWatcher) => void;
        });
        get isDown(): boolean;
        protected onPointerDown(event: PointerEvent): void;
        protected onKeyDown(event: KeyboardEvent): void;
        protected onKeyUp(event: KeyboardEvent): void;
        protected onDown(): void;
        protected onUp(): void;
        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean): void;
        protected onActivate(x?: number, y?: number): void;
        protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean): void;
    }
    interface PressableInit extends OverableInit {
        lock?: boolean;
        allowMiddleButton?: boolean;
        onpressed?: (event: {
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
            middleButton?: boolean;
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
            x?: number;
            y?: number;
        }>;
        set ondowned(value: (event: {
            target: Pressable;
            x?: number;
            y?: number;
        }) => void);
        readonly upped: Core.Events<{
            target: Pressable;
            x?: number;
            y?: number;
        }>;
        set onupped(value: (event: {
            target: Pressable;
            x?: number;
            y?: number;
        }) => void);
        readonly pressed: Core.Events<{
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
            middleButton?: boolean;
        }>;
        set onpressed(value: (event: {
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
            middleButton?: boolean;
        }) => void);
        readonly activated: Core.Events<{
            target: Pressable;
            x?: number;
            y?: number;
        }>;
        set onactivated(value: (event: {
            target: Pressable;
            x?: number;
            y?: number;
        }) => void);
        readonly delayedpress: Core.Events<{
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
            middleButton?: boolean;
        }>;
        set ondelayedpress(value: (event: {
            target: Pressable;
            x?: number;
            y?: number;
            altKey?: boolean;
            shiftKey?: boolean;
            ctrlKey?: boolean;
            middleButton?: boolean;
        }) => void);
        constructor(init?: PressableInit);
        get isDown(): boolean;
        set lock(lock: boolean);
        get lock(): boolean;
        set allowMiddleButton(value: boolean);
        get allowMiddleButton(): boolean;
        protected onDown(x?: number, y?: number): void;
        protected onUp(x?: number, y?: number): void;
        press(): void;
        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean): void;
        protected onActivate(x?: number, y?: number): void;
        protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean): void;
        protected onDisable(): void;
        protected onEnable(): void;
    }
}
declare namespace Ui {
    class DraggableWatcher extends Core.Object {
        allowedMode: string | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | Array<string>;
        data: any;
        private image?;
        private _dragDelta;
        dataTransfer?: DragEmuDataTransfer;
        private element;
        private start;
        private end;
        constructor(init: {
            element: Element;
            data: any;
            image?: Element;
            start?: (watcher: DraggableWatcher) => void;
            end?: (watcher: DraggableWatcher, effect: 'none' | 'copy' | 'link' | 'move' | string) => void;
        });
        get dragDelta(): Point;
        dispose(): void;
        private onDraggablePointerDown;
        private onDraggableMouseDown;
        private onDraggableTouchStart;
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
        draggableWatcher: DraggableWatcher;
        private _dragDelta;
        readonly dragstarted: Core.Events<{
            target: Draggable;
            dataTransfer: DragEmuDataTransfer;
        }>;
        set ondragstarted(value: (event: {
            target: Draggable;
            dataTransfer: DragEmuDataTransfer;
        }) => void);
        readonly dragended: Core.Events<{
            target: Draggable;
            effect: string;
        }>;
        set ondragended(value: (event: {
            target: Draggable;
            effect: string;
        }) => void);
        constructor(init?: DraggableInit);
        get draggableData(): any;
        set draggableData(data: any);
        setAllowedMode(allowedMode: any): void;
        get dragDelta(): Point;
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
        testMultipleRight?: (watchers: SelectionableWatcher[]) => boolean;
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
        private draggableWatcher?;
        private _draggableElement?;
        constructor(init: {
            element: Element;
            selectionActions?: SelectionActions;
            dragSelect?: boolean;
            pressSelect?: boolean;
            onselected?: (selection: Selection) => void;
            onunselected?: (selection: Selection) => void;
            draggable?: boolean;
            draggableElement?: Element;
            pressElement?: Element;
        });
        static getSelectionableWatcher(element: Element): SelectionableWatcher | undefined;
        static getIsSelectionableItem(element: Element): boolean;
        get draggableElement(): Element | undefined;
        set draggableElement(element: Element | undefined);
        get draggable(): boolean;
        set draggable(value: boolean);
        get isSelected(): boolean;
        set isSelected(value: boolean);
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
        set onselected(value: (event: {
            target: Selectionable;
        }) => void);
        readonly unselected: Core.Events<{
            target: Selectionable;
        }>;
        set onunselected(value: (event: {
            target: Selectionable;
        }) => void);
        constructor(init?: SelectionableInit);
        get isSelected(): boolean;
        set isSelected(isSelected: boolean);
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
        set onchanged(value: (event: {
            target: Selection;
        }) => void);
        constructor();
        clear(): void;
        appendRange(start: SelectionableWatcher, end: SelectionableWatcher): void;
        append(elements: Array<SelectionableWatcher> | SelectionableWatcher): void;
        extend(end: SelectionableWatcher): void;
        findRangeElements(start: SelectionableWatcher, end: SelectionableWatcher): Array<SelectionableWatcher>;
        private internalAppend;
        remove(watcher: Array<SelectionableWatcher> | SelectionableWatcher): void;
        private internalRemove;
        get watchers(): Array<SelectionableWatcher>;
        set watchers(watchers: Array<SelectionableWatcher>);
        get elements(): Element[];
        set elements(elements: Element[]);
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
        lock?: boolean;
    }
    class ContextMenuWatcher extends Core.Object {
        readonly element: Ui.Element;
        private press;
        x?: number;
        y?: number;
        altKey?: boolean;
        shiftKey?: boolean;
        ctrlKey?: boolean;
        lock: boolean;
        constructor(init: ContextMenuWatcherInit);
        private onContextMenu;
        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean): void;
        dispose(): void;
    }
}
declare namespace Ui {
    type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    type TextTransform = 'none' | 'uppercase' | 'lowercase';
    type TextAlign = 'left' | 'right' | 'center' | 'justify';
    interface LabelInit extends ElementInit {
        text?: string;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: FontWeight;
        color?: Color | string;
        orientation?: Orientation;
        textTransform?: TextTransform;
        textAlign?: TextAlign;
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
        private _textAlign?;
        constructor(init?: LabelInit);
        get text(): string;
        set text(text: string);
        set fontSize(fontSize: number);
        get fontSize(): number;
        set fontFamily(fontFamily: string);
        get fontFamily(): string;
        set fontWeight(fontWeight: FontWeight);
        get fontWeight(): FontWeight;
        set textTransform(textTransform: TextTransform);
        get textTransform(): TextTransform;
        get textAlign(): TextAlign;
        set textAlign(textAlign: TextAlign);
        set color(color: Color | string);
        private getColor;
        get orientation(): Orientation;
        set orientation(orientation: Orientation);
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
        private static measureTextCanvas;
        private static createMeasureCanvas;
        static isFontAvailable(fontFamily: string, fontWeight: string): boolean;
        private static measureTextHtml;
        private static createMeasureHtml;
        static measureText(text: string, fontSize: number, fontFamily: string, fontWeight: string): {
            width: number;
            height: number;
        };
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
        private _pointerId?;
        private _touchCapture;
        protected isInMoveEvent: boolean;
        protected cumulMove: number;
        protected history: {
            time: number;
            x: number;
            y: number;
        }[];
        readonly upped: Core.Events<{
            target: MovableBase;
            speedX: number;
            speedY: number;
            deltaX: number;
            deltaY: number;
            cumulMove: number;
            abort: boolean;
        }>;
        set onupped(value: (event: {
            target: MovableBase;
            speedX: number;
            speedY: number;
            deltaX: number;
            deltaY: number;
            cumulMove: number;
            abort: boolean;
        }) => void);
        readonly downed: Core.Events<{
            target: MovableBase;
        }>;
        set ondowned(value: (event: {
            target: MovableBase;
        }) => void);
        readonly moved: Core.Events<{
            target: MovableBase;
        }>;
        set onmoved(value: (event: {
            target: MovableBase;
        }) => void);
        constructor(init?: MovableBaseInit);
        set lock(lock: boolean);
        get lock(): boolean;
        get isDown(): boolean;
        get inertia(): boolean;
        set inertia(inertiaActive: boolean);
        get moveHorizontal(): boolean;
        set moveHorizontal(moveHorizontal: boolean);
        get moveVertical(): boolean;
        set moveVertical(moveVertical: boolean);
        private updateTouchAction;
        private getSpeed;
        setPosition(x?: number, y?: number, dontSignal?: boolean): void;
        get positionX(): number;
        get positionY(): number;
        protected onMove(x: number, y: number): void;
        private onDown;
        private onUp;
        private onTouchStart;
        private onPointerDown;
        private onMouseDown;
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
        set cursor(cursor: string);
        protected onKeyDown(event: any): void;
        protected onMove(x: number, y: number): void;
        protected measureCore(width: number, height: number): Size;
        protected arrangeCore(width: number, height: number): void;
        get content(): Element | undefined;
        set content(content: Element | undefined);
        protected onDisable(): void;
        protected onEnable(): void;
    }
}
declare namespace Ui {
    class ElementPointerManager extends Core.Object {
        readonly element: Element;
        private onptrdowned;
        constructor(init: {
            element: Element;
            onptrdowned: (event: EmuPointerEvent) => void;
        });
        onPointerDown(pointerEvent: PointerEvent): void;
        onTouchStart(touchEvent: TouchEvent): void;
        onMouseDown(mouseEvent: MouseEvent): void;
    }
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
        set allowLeftMouse(value: boolean);
        set allowScale(allow: boolean);
        set minScale(minScale: number);
        set maxScale(maxScale: number);
        set allowRotate(allow: boolean);
        set allowTranslate(allow: boolean);
        get isDown(): boolean;
        get isInertia(): boolean;
        get angle(): number;
        set angle(angle: number);
        get scale(): number;
        set scale(scale: number);
        scaleAt(scale: number, x: number, y: number): void;
        get translateX(): number;
        set translateX(translateX: number);
        get translateY(): number;
        set translateY(translateY: number);
        private buildMatrix;
        get matrix(): Matrix;
        getBoundaryBox(matrix: any): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        setContentTransform(translateX?: number, translateY?: number, scale?: number, angle?: number): void;
        get inertia(): boolean;
        set inertia(inertiaActive: boolean);
        protected onDown(): void;
        protected onUp(): void;
        protected onPointerDown(event: EmuPointerEvent): void;
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
        set ondowned(value: (event: {
            target: Transformable;
        }) => void);
        readonly upped: Core.Events<{
            target: Transformable;
        }>;
        set onupped(value: (event: {
            target: Transformable;
        }) => void);
        readonly transformed: Core.Events<{
            target: Transformable;
        }>;
        set ontransformed(value: (event: {
            target: Transformable;
        }) => void);
        readonly inertiastarted: Core.Events<{
            target: Transformable;
        }>;
        set oninertiastarted(value: (event: {
            target: Transformable;
        }) => void);
        readonly inertiaended: Core.Events<{
            target: Transformable;
        }>;
        set oninertiaended(value: (event: {
            target: Transformable;
        }) => void);
        constructor(init?: TransformableInit);
        set allowLeftMouse(value: boolean);
        set allowScale(allow: boolean);
        set minScale(minScale: number);
        set maxScale(maxScale: number);
        set allowRotate(allow: boolean);
        set allowTranslate(allow: boolean);
        get isDown(): boolean;
        get isInertia(): boolean;
        get angle(): number;
        set angle(angle: number);
        get scale(): number;
        set scale(scale: number);
        get translateX(): number;
        set translateX(translateX: number);
        get translateY(): number;
        set translateY(translateY: number);
        private buildMatrix;
        get matrix(): Matrix;
        getBoundaryBox(matrix: any): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        setContentTransform(translateX?: number, translateY?: number, scale?: number, angle?: number): void;
        get inertia(): boolean;
        set inertia(inertiaActive: boolean);
        protected onContentTransform(testOnly?: boolean): void;
        protected onDown(): void;
        protected onUp(): void;
        protected onPointerDown(event: EmuPointerEvent): void;
        protected onPointerMove(watcher: any): void;
        protected onPointerCancel(watcher: any): void;
        protected onPointerUp(watcher: any): void;
        protected onWheel(event: WheelEvent): void;
        startInertia(): void;
        protected onTimeupdate(clock: any, progress: any, delta: any): void;
        stopInertia(): void;
        get content(): Element;
        set content(content: Element);
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
        set onscrolled(value: (event: {
            target: Scrollable;
            offsetX: number;
            offsetY: number;
        }) => void);
        constructor(init?: ScrollableInit);
        set maxScale(maxScale: number);
        set content(content: Element);
        get content(): Element;
        protected setContent(content: Element): void;
        get inertia(): boolean;
        set inertia(inertiaActive: boolean);
        get scrollHorizontal(): boolean;
        set scrollHorizontal(scroll: boolean);
        get scrollVertical(): boolean;
        set scrollVertical(scroll: boolean);
        setScrollbarVertical(scrollbarVertical: Movable): void;
        setScrollbarHorizontal(scrollbarHorizontal: Movable): void;
        setOffset(offsetX?: number, offsetY?: number, absolute?: boolean, align?: boolean): boolean;
        getOffsetX(): number;
        getRelativeOffsetX(): number;
        getOffsetY(): number;
        getRelativeOffsetY(): number;
        get scale(): number;
        set scale(scale: number);
        get isDown(): boolean;
        get isInertia(): boolean;
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
        set onscrolled(value: (event: {
            target: ScrollableContent;
            offsetX: number;
            offsetY: number;
        }) => void);
        constructor();
        get offsetX(): number;
        get offsetY(): number;
        setOffset(x: number, y: number): void;
        get contentWidth(): number;
        get contentHeight(): number;
        protected arrangeCore(width: number, height: number): void;
        protected onContentTransform(testOnly?: boolean): void;
    }
}
declare namespace Ui {
    class NativeScrollableContent extends Container {
        private _content;
        private scrollDiv;
        readonly scrolled: Core.Events<{
            target: NativeScrollableContent;
            offsetX: number;
            offsetY: number;
        }>;
        set onscrolled(value: (event: {
            target: NativeScrollableContent;
            offsetX: number;
            offsetY: number;
        }) => void);
        constructor();
        renderDrawing(): HTMLDivElement;
        get content(): Ui.Element | undefined;
        set content(value: Ui.Element | undefined);
        get offsetX(): number;
        get offsetY(): number;
        stopInertia(): void;
        setOffset(x: number, y: number): void;
        get contentWidth(): number;
        get contentHeight(): number;
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
    interface NativeScrollableInit extends ContainerInit {
        content?: Element | undefined;
        scrollHorizontal?: boolean;
        scrollVertical?: boolean;
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
        set onscrolled(value: (event: {
            target: NativeScrollable;
            offsetX: number;
            offsetY: number;
        }) => void);
        constructor(init?: NativeScrollableInit);
        set content(content: Ui.Element | undefined);
        get content(): Ui.Element | undefined;
        get scrollHorizontal(): boolean;
        set scrollHorizontal(scroll: boolean);
        get scrollVertical(): boolean;
        set scrollVertical(scroll: boolean);
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
        protected onScrollIntoView(el: Element): void;
    }
    interface NativeScrollingAreaInit extends NativeScrollableInit {
    }
    class NativeScrollingArea extends NativeScrollable {
        private horizontalScrollbar;
        private verticalScrollbar;
        constructor(init?: NativeScrollableInit);
        protected onStyleChange(): void;
        static style: any;
    }
}
declare namespace Ui {
    class Scrollbar extends Movable {
        private orientation;
        private rect;
        private over;
        private clock?;
        private scale;
        constructor(orientation: Orientation);
        set radius(radius: number);
        set fill(color: Color);
        private startAnim;
        protected onTick(clock: Anim.Clock, progress: number, deltaTick: number): void;
        private updateScale;
    }
    interface ScrollingAreaInit extends NativeScrollingAreaInit {
        maxScale?: number;
        content?: Element;
        inertia?: boolean;
        scrollHorizontal?: boolean;
        scrollVertical?: boolean;
        scale?: number;
        onscrolled?: (event: {
            target: NativeScrollable;
            offsetX: number;
            offsetY: number;
        }) => void;
    }
    class ScrollingArea extends NativeScrollingArea {
        constructor(init?: ScrollingAreaInit);
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
        updateFlow(width: number, render: boolean): {
            width: number;
            height: number;
        };
        updateFlowWords(width: number, render: boolean): {
            width: number;
            height: number;
        };
        drawText(width: number, render: boolean): {
            width: number;
            height: number;
        };
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
        color?: Color | string | undefined;
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
        get maxLine(): number;
        set maxLine(maxLine: number);
        get text(): string;
        set text(text: string);
        get textAlign(): string;
        set textAlign(textAlign: string);
        get interLine(): number;
        set interLine(interLine: number);
        get fontSize(): number;
        set fontSize(fontSize: number);
        get fontFamily(): string;
        set fontFamily(fontFamily: string);
        get fontWeight(): any;
        set fontWeight(fontWeight: any);
        get whiteSpace(): string;
        set whiteSpace(whiteSpace: string);
        get wordWrap(): string;
        set wordWrap(wordWrap: string);
        get textTransform(): string;
        set textTransform(textTransform: string);
        set color(color: Color | string | undefined);
        get color(): Color | string | undefined;
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
        set types(types: Array<{
            type: string | Function;
            effects: string | string[] | DropEffect[] | DropEffectFunc;
        }>);
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
            file: File;
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
        set ondrageffect(value: (event: DragEvent) => void);
        readonly dragentered: Core.Events<{
            target: DropBox;
            data: any;
        }>;
        set ondragentered(value: (event: {
            target: DropBox;
            data: any;
        }) => void);
        readonly dragleaved: Core.Events<{
            target: DropBox;
        }>;
        set ondragleaved(value: (event: {
            target: DropBox;
        }) => void);
        readonly dropped: Core.Events<{
            target: DropBox;
            data: any;
            effect: string;
            x: number;
            y: number;
            dataTransfer: DragDataTransfer;
        }>;
        set ondropped(value: (event: {
            target: DropBox;
            data: any;
            effect: string;
            x: number;
            y: number;
            dataTransfer: DragDataTransfer;
        }) => void);
        readonly droppedfile: Core.Events<{
            target: DropBox;
            file: File;
            effect: string;
            x: number;
            y: number;
        }>;
        set ondroppedfile(value: (event: {
            target: DropBox;
            file: File;
            effect: string;
            x: number;
            y: number;
        }) => void);
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
    class SimpleButtonBackground extends Element {
        constructor();
        set borderWidth(borderWidth: number);
        set border(border: Color | string);
        set radius(radius: number);
        set background(background: Color | string);
    }
    class ButtonBackground extends Element {
        private ripple;
        constructor();
        down(x?: number, y?: number): void;
        up(): void;
        press(x?: number, y?: number): void;
        set borderWidth(borderWidth: number);
        set border(border: Color | string);
        set radius(radius: number);
        set background(background: Color | string);
    }
    class ButtonBadge extends LBox {
        private _bg;
        private _label;
        private _badge;
        private _badgeColor;
        private _badgeTextColor;
        constructor();
        set fontSize(value: number);
        set badge(badge: string);
        set badgeColor(badgeColor: Color | string);
        set badgeTextColor(badgeTextColor: Color | string);
    }
    class ButtonIcon extends Icon {
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
        protected buttonPartsBox: Box;
        private _icon;
        private _iconBox;
        private _text;
        private _textBox;
        private _marker?;
        private _badge?;
        private _badgeContent?;
        private bg;
        private _orientation;
        constructor(init?: ButtonInit);
        get background(): Element;
        set background(bg: Element);
        get textBox(): Element;
        get text(): string | undefined;
        set text(text: string | undefined);
        setTextOrElement(text: string | Element | undefined): void;
        get iconBox(): LBox;
        get icon(): string | undefined;
        set icon(icon: string | undefined);
        setIconOrElement(icon: Element | string | undefined): void;
        get marker(): Element;
        set marker(marker: Element);
        get isActive(): boolean;
        set isActive(isActive: boolean);
        get badge(): string;
        set badge(text: string);
        get orientation(): Orientation;
        set orientation(orientation: Orientation);
        protected getBackgroundColor(): Color;
        protected getBackgroundBorderColor(): Color;
        protected getForegroundColor(): Color;
        get isTextVisible(): boolean;
        get isIconVisible(): boolean;
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
    class FlatButton extends Button {
        static style: object;
    }
}
declare namespace Ui {
    class ToggleButton extends Button {
        private _isToggled;
        readonly toggled: Core.Events<{
            target: ToggleButton;
        }>;
        set ontoggled(value: (event: {
            target: ToggleButton;
        }) => void);
        readonly untoggled: Core.Events<{
            target: ToggleButton;
        }>;
        set onuntoggled(value: (event: {
            target: ToggleButton;
        }) => void);
        constructor();
        get isToggled(): boolean;
        set isToggled(value: boolean);
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
        set action(action: any);
        set selection(selection: Selection);
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
        get selection(): Selection;
        set selection(selection: Selection);
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
        set onclosed(value: (event: {
            target: Popup;
        }) => void);
        constructor(init?: PopupInit);
        set preferredWidth(width: number);
        set preferredHeight(height: number);
        getSelectionHandler(): Selection;
        set autoClose(autoClose: boolean);
        get content(): Element;
        set content(content: Element);
        protected onShadowPress(): void;
        protected onOpenTick(clock: Anim.Clock, progress: number, delta: number): void;
        protected onPopupSelectionChange(selection: Selection): void;
        protected onStyleChange(): void;
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
        get arrowBorder(): 'left' | 'right' | 'top' | 'bottom' | 'none';
        set arrowBorder(arrowBorder: 'left' | 'right' | 'top' | 'bottom' | 'none');
        get arrowOffset(): number;
        set arrowOffset(offset: number);
        set radius(radius: number);
        set fill(fill: Color | string);
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
        get uniform(): boolean;
        set uniform(uniform: boolean);
        get menuPosition(): 'left' | 'right';
        set menuPosition(menuPosition: 'left' | 'right');
        get itemsAlign(): 'left' | 'right';
        set itemsAlign(align: 'left' | 'right');
        get logicalChildren(): Element[];
        set padding(padding: number);
        get paddingTop(): number;
        set paddingTop(paddingTop: number);
        get paddingBottom(): number;
        set paddingBottom(paddingBottom: number);
        get paddingLeft(): number;
        set paddingLeft(paddingLeft: number);
        get paddingRight(): number;
        set paddingRight(paddingRight: number);
        get spacing(): number;
        set spacing(spacing: number);
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
        selection: Selection;
        readonly resized: Core.Events<{
            target: App;
            width: number;
            height: number;
        }>;
        set onresized(value: (event: {
            target: App;
            width: number;
            height: number;
        }) => void);
        readonly ready: Core.Events<{
            target: App;
        }>;
        set onready(value: (event: {
            target: App;
        }) => void);
        readonly parentmessage: Core.Events<{
            target: App;
            message: any;
        }>;
        set onparentmessage(value: (event: {
            target: App;
            message: any;
        }) => void);
        readonly orientationchanged: Core.Events<{
            target: App;
            orientation: number;
        }>;
        set onorientationchanged(value: (event: {
            target: App;
            orientation: number;
        }) => void);
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
        update: () => void;
        get content(): Element | undefined;
        set content(content: Element | undefined);
        getFocusElement(): any;
        appendDialog(dialog: any): void;
        removeDialog(dialog: any): void;
        appendTopLayer(layer: any): void;
        removeTopLayer(layer: any): void;
        getArguments(): any;
        get isReady(): boolean;
        protected onReady(): void;
        protected onWindowKeyUp(event: any): void;
        protected onLoad(): void;
        protected onMessage(event: any): void;
        sendMessageToParent(msg: any): void;
        findFocusableDiv(current: any): any;
        enqueueDraw(element: Element): void;
        enqueueLayout(element: Element): void;
        handleScrolling(drawing: any): void;
        getElementsByClass(className: Function): Element[];
        getElementByDrawing(drawing: any): any;
        getInverseLayoutTransform(): Matrix;
        getLayoutTransform(): Matrix;
        invalidateMeasure(): void;
        invalidateArrange(): void;
        protected arrangeCore(w: number, h: number): void;
        static current: App;
        static isPrint: boolean;
        static getWindowIFrame(currentWindow: any): any;
        static getRootWindow(): Window;
    }
}
declare namespace Ui {
    interface FormInit extends LBoxInit {
    }
    class Form extends LBox implements FormInit {
        readonly drawing: HTMLFormElement;
        readonly submited: Core.Events<{
            target: Form;
        }>;
        set onsubmited(value: (event: {
            target: Form;
        }) => void);
        constructor(init?: FormInit);
        protected onSubmit(event: any): void;
        submit(): void;
        renderDrawing(): HTMLFormElement;
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
        set background(color: Color | string);
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
        actionButtons?: Element[];
        autoClose?: boolean;
        content?: Element;
        onclosed?: (event: {
            target: Dialog;
        }) => void;
    }
    class Dialog extends Container implements DialogInit {
        dialogSelection: Selection;
        protected shadowGraphic: Rectangle;
        protected graphic: DialogGraphic;
        private lbox;
        private vbox;
        private contentBox;
        private contentVBox;
        private _actionButtons?;
        private _cancelButton?;
        private buttonsBox;
        buttonsVisible: boolean;
        private _preferredWidth;
        private _preferredHeight;
        private actionBox;
        private contextBox;
        private _autoClose?;
        private openClock?;
        isClosed: boolean;
        private scroll;
        readonly closed: Core.Events<{
            target: Dialog;
        }>;
        set onclosed(value: (event: {
            target: Dialog;
        }) => void);
        constructor(init?: DialogInit);
        getSelectionHandler(): Selection;
        set preferredWidth(width: number);
        set preferredHeight(height: number);
        get padding(): number;
        set padding(padding: number);
        open(): void;
        close(): void;
        onOpenTick(clock: any, progress: any, delta: any): void;
        getDefaultButton(): DefaultButton | undefined;
        defaultAction(): void;
        get title(): string;
        set title(title: string);
        updateButtonsBoxVisible(): void;
        set cancelButton(button: Pressable | undefined);
        set actionButtons(buttons: Element[]);
        set content(content: Element | undefined);
        get content(): Element | undefined;
        set autoClose(autoClose: boolean);
        protected onCancelPress(): void;
        protected onFormSubmit(): void;
        protected onDialogSelectionChange(selection: Ui.Selection): void;
        protected onKeyUp(event: any): void;
        protected onShadowPress(): void;
        protected onStyleChange(): void;
        protected measureCore(width: number, height: number): Size;
        protected arrangeCore(width: number, height: number): void;
        static style: object;
    }
}
declare namespace Ui {
    interface HtmlInit extends ElementInit {
        html?: string;
        text?: string;
        textAlign?: TextAlign;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: FontWeight;
        interLine?: number;
        wordWrap?: string;
        wordBreak?: string;
        whiteSpace?: string;
        color?: Color | string;
        onlink?: (event: {
            target: Html;
            ref: string;
        }) => void;
    }
    class Html extends Element implements HtmlInit {
        captureLink: boolean;
        protected htmlDrawing: HTMLElement;
        private bindedOnImageLoad;
        private _fontSize?;
        private _fontFamily?;
        private _fontWeight?;
        private _color;
        private _textAlign?;
        private _interLine?;
        private _wordWrap?;
        private _wordBreak?;
        private _whiteSpace?;
        readonly link: Core.Events<{
            target: Html;
            ref: string;
        }>;
        set onlink(value: (event: {
            target: Html;
            ref: string;
        }) => void);
        constructor(init?: HtmlInit);
        getElements(tagName: any): any[];
        searchElements(tagName: any, element: any, res: any): void;
        getParentElement(tagName: any, element: any): any;
        get html(): string;
        private bindChildEvents;
        set html(html: string);
        set htmlElement(htmlElement: HTMLElement);
        get text(): string;
        set text(text: string);
        private getTextContent;
        get textAlign(): TextAlign;
        set textAlign(textAlign: TextAlign);
        get fontSize(): number;
        set fontSize(fontSize: number);
        get fontFamily(): string;
        set fontFamily(fontFamily: string);
        get fontWeight(): FontWeight;
        set fontWeight(fontWeight: FontWeight);
        get interLine(): number;
        set interLine(interLine: number);
        get wordWrap(): string;
        set wordWrap(wordWrap: string);
        get wordBreak(): string;
        set wordBreak(wordBreak: string);
        get whiteSpace(): string;
        set whiteSpace(whiteSpace: string);
        protected getColor(): Color;
        set color(color: Color | string | undefined);
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
    interface TextInit extends CompactLabelInit {
    }
    class Text extends CompactLabel implements TextInit {
        constructor(init?: TextInit);
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
        set color(color: Color | string);
        get inner(): boolean;
        set inner(inner: boolean);
        set shadowWidth(shadowWidth: number);
        get shadowWidth(): number;
        set radius(radius: number);
        get radiusTopLeft(): number;
        set radiusTopLeft(radiusTopLeft: number);
        get radiusTopRight(): number;
        set radiusTopRight(radiusTopRight: number);
        get radiusBottomLeft(): number;
        set radiusBottomLeft(radiusBottomLeft: number);
        get radiusBottomRight(): number;
        set radiusBottomRight(radiusBottomRight: number);
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
        get isClosed(): boolean;
        open(): void;
        close(): void;
        protected onOpenTick(clock: any, progress: any, delta: any): void;
        set content(content: Element);
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
        set onready(value: (event: {
            target: Image;
        }) => void);
        readonly error: Core.Events<{
            target: Image;
        }>;
        set onerror(value: (event: {
            target: Image;
        }) => void);
        constructor(init?: ImageInit);
        get src(): string | undefined;
        set src(src: string | undefined);
        get naturalWidth(): number | undefined;
        get naturalHeight(): number | undefined;
        get isReady(): boolean;
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
        value?: number | 'infinite';
    }
    class Loading extends CanvasElement implements LoadingInit {
        private _value;
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
        set value(value: number | 'infinite');
        get value(): number | 'infinite';
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
        readonly drawing: HTMLInputElement;
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
        set onchanged(value: (event: {
            target: Entry;
            value: string;
        }) => void);
        readonly validated: Core.Events<{
            target: Entry;
            value: string;
        }>;
        set onvalidated(value: (event: {
            target: Entry;
            value: string;
        }) => void);
        constructor(init?: EntryInit);
        get passwordMode(): boolean;
        set passwordMode(passwordMode: boolean);
        get fontSize(): number;
        set fontSize(fontSize: number);
        get fontFamily(): string;
        set fontFamily(fontFamily: string);
        get fontWeight(): string;
        set fontWeight(fontWeight: string);
        private getColor;
        set color(color: Color | string);
        get value(): string;
        set value(value: string);
        get inputMode(): string;
        set inputMode(value: string);
        get autocomplete(): string;
        set autocomplete(value: string);
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
        set onresize(value: (event: {
            target: Fixed;
            width: number;
            height: number;
        }) => void);
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
        set content(content: Element | Element[]);
        protected measureCore(width: number, height: number): Size;
        protected arrangeCore(width: number, height: number): void;
        protected onStyleChange(): void;
        static style: object;
    }
}
declare namespace Ui {
    class TextBgGraphic extends CanvasElement {
        private textHasFocus;
        set hasFocus(hasFocus: boolean);
        private get background();
        private get backgroundBorder();
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
        readonly entry: Entry;
        private graphic;
        private textholder;
        readonly changed: Core.Events<{
            target: TextField;
            value: string;
        }>;
        set onchanged(value: (event: {
            target: TextField;
            value: string;
        }) => void);
        readonly validated: Core.Events<{
            target: TextField;
        }>;
        set onvalidated(value: (event: {
            target: TextField;
        }) => void);
        constructor(init?: TextFieldInit);
        set textHolder(text: string);
        set passwordMode(passwordMode: boolean);
        get value(): string;
        set value(value: string);
        get captureValidated(): boolean;
        set captureValidated(value: boolean);
        get inputMode(): string;
        set inputMode(value: string);
        get autocomplete(): string;
        set autocomplete(value: string);
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
        private bg;
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
        set onchanged(value: (event: {
            target: CheckBox;
            value: boolean;
        }) => void);
        readonly toggled: Core.Events<{
            target: CheckBox;
        }>;
        set ontoggled(value: (event: {
            target: CheckBox;
        }) => void);
        readonly untoggled: Core.Events<{
            target: CheckBox;
        }>;
        set onuntoggled(value: (event: {
            target: CheckBox;
        }) => void);
        constructor(init?: CheckBoxInit);
        get isToggled(): boolean;
        get value(): boolean;
        set value(value: boolean);
        get text(): string;
        set text(text: string);
        get content(): Element;
        set content(content: Element);
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
        get frameWidth(): number;
        set frameWidth(frameWidth: number);
        set fill(fill: Color | LinearGradient | string);
        set radius(radius: number);
        get radiusTopLeft(): number;
        set radiusTopLeft(radiusTopLeft: number);
        get radiusTopRight(): number;
        set radiusTopRight(radiusTopRight: number);
        get radiusBottomLeft(): number;
        set radiusBottomLeft(radiusBottomLeft: number);
        get radiusBottomRight(): number;
        set radiusBottomRight(radiusBottomRight: number);
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
        set fixedWidth(width: number);
        set fixedHeight(height: number);
        set content(content: Element);
        get itemAlign(): ScaleBoxAlign;
        set itemAlign(align: ScaleBoxAlign);
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
        readonly drawing: HTMLTextAreaElement;
        private _fontSize?;
        private _fontFamily?;
        private _fontWeight?;
        private _color?;
        private _value;
        readonly changed: Core.Events<{
            target: TextArea;
            value: string;
        }>;
        set onchanged(value: (event: {
            target: TextArea;
            value: string;
        }) => void);
        constructor(init?: TextAreaInit);
        set fontSize(fontSize: number);
        get fontSize(): number;
        set fontFamily(fontFamily: string);
        get fontFamily(): string;
        set fontWeight(fontWeight: string);
        get fontWeight(): string;
        set color(color: Color | string);
        private getColor;
        get value(): string;
        set value(value: string);
        setOffset(offsetX: number, offsetY: number): void;
        get offsetX(): number;
        get offsetY(): number;
        protected onPaste(event: any): void;
        protected onAfterPaste(): void;
        protected onChange(event: any): void;
        protected onKeyDown(event: any): void;
        protected onKeyUp(event: any): void;
        protected renderDrawing(): HTMLTextAreaElement;
        protected measureCore(width: any, height: any): {
            width: number;
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
        readonly textarea: TextArea;
        graphic: TextBgGraphic;
        textholder: Label;
        readonly changed: Core.Events<{
            target: TextAreaField;
            value: string;
        }>;
        set onchanged(value: (event: {
            target: TextAreaField;
            value: string;
        }) => void);
        constructor(init?: TextAreaFieldInit);
        set textHolder(text: string);
        get value(): string;
        set value(value: string);
        protected onTextAreaFocus(): void;
        protected onTextAreaBlur(): void;
        protected onTextAreaChange(entry: TextArea, value: string): void;
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
        set cols(colsDef: string);
        set rows(rowsDef: string);
        attach(child: Element, col: number, row: number, colSpan?: number, rowSpan?: number): void;
        detach(child: Element): void;
        set content(value: Array<{
            child: Element;
            col: number;
            row: number;
            colSpan?: number;
            rowSpan?: number;
        }>);
        private getColMin;
        private getRowMin;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        static getCol(child: Element): number;
        static setCol(child: Element, col: number): void;
        static getRow(child: Element): number;
        static setRow(child: Element, row: number): void;
        static getColSpan(child: Element): number;
        static setColSpan(child: Element, colSpan: number): void;
        static getRowSpan(child: Element): number;
        static setRowSpan(child: Element, rowSpan: number): void;
    }
}
declare namespace Ui {
    interface FlowInit extends ContainerInit {
        spacing?: number;
        itemAlign?: 'left' | 'right';
        uniform?: boolean;
        content?: Element[] | undefined;
    }
    class Flow extends Container implements FlowInit, IContainer {
        protected lines: {
            pos: number;
            y: number;
            width: number;
            height: number;
        }[];
        private _uniform;
        protected uniformWidth: number;
        protected uniformHeight: number;
        private _itemAlign;
        private _spacing;
        constructor(init?: FlowInit);
        set content(content: Element[] | undefined);
        get spacing(): number;
        set spacing(spacing: number);
        get itemAlign(): 'left' | 'right';
        set itemAlign(itemAlign: 'left' | 'right');
        get uniform(): boolean;
        set uniform(uniform: boolean);
        append(child: Element): void;
        prepend(child: Element): void;
        insertAt(child: Element, position: number): void;
        insertBefore(child: Element, beforeChild: Element): void;
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
    class LimitedFlow extends Flow {
        private _maxLines;
        private _canExpand;
        readonly canexpandchanged: Core.Events<{
            target: LimitedFlow;
            value: boolean;
        }>;
        set oncanexpandchanged(value: (event: {
            target: LimitedFlow;
            value: boolean;
        }) => void);
        private _linesCount;
        readonly linechanged: Core.Events<{
            target: LimitedFlow;
            value: number;
        }>;
        set onlinechanged(value: (event: {
            target: LimitedFlow;
            value: number;
        }) => void);
        constructor();
        get maxLines(): number | undefined;
        set maxLines(value: number | undefined);
        get linesCount(): number;
        get canExpand(): boolean;
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
}
declare namespace Ui {
    interface ProgressBarInit extends ContainerInit {
        value?: number | 'infinite';
    }
    class ProgressBar extends Container implements ProgressBarInit {
        private _value;
        readonly bar: Rectangle;
        private background;
        private clock;
        constructor(init?: ProgressBarInit);
        set value(value: number | 'infinite');
        get value(): number | 'infinite';
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        protected onVisible(): void;
        protected onHidden(): void;
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
        set onchanged(value: (event: {
            target: Paned;
            position: number;
        }) => void);
        constructor(init?: PanedInit);
        get orientation(): Orientation;
        set orientation(orientation: Orientation);
        get pos(): number;
        set pos(pos: number);
        get content1(): Element;
        set content1(content1: Element);
        get content2(): Element;
        set content2(content2: Element);
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
        set onchanged(value: (event: {
            target: Slider;
            value: number;
        }) => void);
        constructor(init?: SliderInit);
        get value(): number;
        set value(value: number);
        setValue(value: number, dontSignal?: boolean): void;
        get orientation(): Orientation;
        set orientation(orientation: Orientation);
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
        controls?: boolean;
        controlsList?: Array<string>;
        currentTime?: number;
        onready?: (event: {
            target: Audio;
            code: number;
        }) => void;
        onerror?: (event: {
            target: Audio;
            code: number;
        }) => void;
    }
    class Audio extends Element {
        private _src;
        protected audioDrawing: HTMLAudioElement;
        private canplaythrough;
        private _state;
        private audioMeasureValid;
        private audioSize;
        static measureBox: HTMLAudioElement;
        readonly ready: Core.Events<{
            target: Audio;
        }>;
        set onready(value: (event: {
            target: Audio;
        }) => void);
        readonly ended: Core.Events<{
            target: Audio;
        }>;
        set onended(value: (event: {
            target: Audio;
        }) => void);
        readonly timeupdate: Core.Events<{
            target: Audio;
            time: number;
        }>;
        set ontimeupdate(value: (event: {
            target: Audio;
            time: number;
        }) => void);
        readonly bufferingupdate: Core.Events<{
            target: Audio;
            buffer: number;
        }>;
        set onbufferingupdate(value: (event: {
            target: Audio;
            buffer: number;
        }) => void);
        readonly statechange: Core.Events<{
            target: Audio;
            state: MediaState;
        }>;
        set onstatechange(value: (event: {
            target: Audio;
            state: MediaState;
        }) => void);
        readonly error: Core.Events<{
            target: Audio;
            code: number;
        }>;
        set onerror(value: (event: {
            target: Audio;
            code: number;
        }) => void);
        static htmlAudio: boolean;
        static supportOgg: boolean;
        static supportMp3: boolean;
        static supportWav: boolean;
        static supportAac: boolean;
        constructor(init?: AudioInit);
        set src(src: string | undefined);
        play(): void;
        pause(): void;
        stop(): void;
        set controls(value: boolean);
        get controls(): boolean;
        set controlsList(value: Array<string>);
        get controlsList(): Array<string>;
        set volume(volume: number);
        get volume(): number;
        get duration(): number | undefined;
        set currentTime(time: number);
        get currentTime(): number;
        get state(): MediaState;
        get isReady(): boolean;
        protected onReady(): void;
        protected onTimeUpdate(): void;
        protected onEnded(): void;
        protected onProgress(): void;
        get currentBufferSize(): number;
        checkBuffering(): void;
        protected onError(): void;
        protected onWaiting(): void;
        protected onUnload(): void;
        protected renderDrawing(): any;
        measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        static measure(isPlayerVisible: boolean): {
            width: number;
            height: number;
        };
        private static measureTextHtml;
        private static createMeasureHtml;
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
        set onlink(value: (event: {
            target: LinkButton;
        }) => void);
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
    class SFlow extends Container implements SFlowInit, IContainer {
        private _uniform;
        private _uniformRatio;
        private _uniformWidth;
        private _uniformHeight;
        private _itemAlign;
        private _stretchMaxRatio;
        private _spacing;
        constructor(init?: SFlowInit);
        set content(content: Element[] | undefined);
        get spacing(): number;
        set spacing(spacing: number);
        get itemAlign(): SFlowAlign;
        set itemAlign(itemAlign: SFlowAlign);
        get uniform(): boolean;
        set uniform(uniform: boolean);
        get uniformRatio(): number;
        set uniformRatio(uniformRatio: number);
        get stretchMaxRatio(): number;
        set stretchMaxRatio(stretchMaxRatio: number);
        append(child: Element, floatVal?: SFlowFloat, flushVal?: SFlowFlush): void;
        prepend(child: Element, floatVal?: SFlowFloat, flushVal?: SFlowFlush): void;
        insertAt(child: Element, position: number, floatVal?: SFlowFloat, flushVal?: SFlowFlush): void;
        insertBefore(child: Element, beforeChild: Element, floatVal?: SFlowFloat, flushVal?: SFlowFlush): void;
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
        controlsList?: Array<string>;
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
        set onstatechanged(value: (event: {
            target: Video;
            state: MediaState;
        }) => void);
        readonly ready: Core.Events<{
            target: Video;
        }>;
        set onready(value: (event: {
            target: Video;
        }) => void);
        readonly ended: Core.Events<{
            target: Video;
        }>;
        set onended(value: (event: {
            target: Video;
        }) => void);
        readonly error: Core.Events<{
            target: Video;
            code: number;
        }>;
        set onerror(value: (event: {
            target: Video;
            code: number;
        }) => void);
        readonly timeupdated: Core.Events<{
            target: Video;
            time: number;
        }>;
        set ontimeupdated(value: (event: {
            target: Video;
            time: number;
        }) => void);
        readonly bufferingupdated: Core.Events<{
            target: Video;
            buffer: number;
        }>;
        set onbufferingupdated(value: (event: {
            target: Video;
            buffer: number;
        }) => void);
        static htmlVideo: boolean;
        static flashVideo: boolean;
        static supportOgg: boolean;
        static supportMp4: boolean;
        static supportWebm: boolean;
        constructor(init?: VideoInit);
        set src(src: string | undefined);
        set poster(src: string);
        set autoplay(autoplay: boolean);
        play(): void;
        pause(): void;
        stop(): void;
        set controls(value: boolean);
        get controls(): boolean;
        set controlsList(value: Array<string>);
        get controlsList(): Array<string>;
        set volume(volume: number);
        get volume(): number;
        get duration(): number;
        set currentTime(time: number);
        get currentTime(): number;
        get state(): MediaState;
        get isReady(): boolean;
        get naturalWidth(): number;
        get naturalHeight(): number;
        protected onReady(): void;
        protected onTimeUpdate(): void;
        protected onEnded(): void;
        protected onProgress(): void;
        get currentBufferSize(): number;
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
        private _selectMode;
        private _date;
        private monthButton;
        private yearButton;
        private grid;
        private _dayFilter;
        private _mode;
        private _dateFilter;
        readonly dayselected: Core.Events<{
            target: MonthCalendar;
            value: Date;
        }>;
        set ondayselected(value: (event: {
            target: MonthCalendar;
            value: Date;
        }) => void);
        constructor(init?: MonthCalendarInit);
        set dayFilter(dayFilter: number[]);
        set dateFilter(dateFilter: string[]);
        set date(date: Date);
        get selectedDate(): Date;
        set selectedDate(selectedDate: Date);
        get selectMode(): 'DAY' | 'WEEK';
        set selectMode(value: 'DAY' | 'WEEK');
        get mode(): 'DAY' | 'MONTH' | 'YEAR';
        set mode(value: 'DAY' | 'MONTH' | 'YEAR');
        protected onLeftButtonPress(): void;
        protected onRightButtonPress(): void;
        protected onDaySelect(button: any): void;
        protected updateDate(reuseGrid?: boolean): void;
        private updateDayGrid;
        private updateMonthGrid;
        private updateYearGrid;
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
        set onchanged(value: (event: {
            target: TextButtonField;
            value: string;
        }) => void);
        readonly buttonpressed: Core.Events<{
            target: TextButtonField;
        }>;
        set onbuttonpressed(value: (event: {
            target: TextButtonField;
        }) => void);
        readonly validated: Core.Events<{
            target: TextButtonField;
            value: string;
        }>;
        set onvalidated(value: (event: {
            target: TextButtonField;
            value: string;
        }) => void);
        constructor(init?: TextButtonFieldInit);
        set textHolder(text: string);
        set widthText(nbchar: number);
        set buttonIcon(icon: string);
        set buttonText(text: string);
        get textValue(): string;
        set textValue(value: string);
        get value(): string;
        set value(value: string);
        get autocomplete(): string;
        set autocomplete(value: string);
        get passwordMode(): boolean;
        set passwordMode(value: boolean);
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
        set dayFilter(dayFilter: number[]);
        set dateFilter(dateFilter: string[]);
        get isValid(): boolean;
        get selectedDate(): Date;
        set selectedDate(date: Date);
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
        set ondownload(value: (event: {
            target: DownloadButton;
        }) => void);
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
    interface ShapeIconInit extends ShapeInit {
        icon?: string;
    }
    class ShapeIcon extends Shape implements ShapeIconInit {
        constructor(init?: IconInit);
        set icon(icon: string);
        protected arrangeCore(width: number, height: number): void;
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
        set onready(value: (event: {
            target: IFrame;
        }) => void);
        constructor(init?: IFrameInit);
        get src(): string;
        set src(src: string);
        get isReady(): boolean;
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
        set onanchorchanged(value: (event: {
            target: ContentEditable;
        }) => void);
        readonly changed: Core.Events<{
            target: ContentEditable;
        }>;
        set onchanged(value: (event: {
            target: ContentEditable;
        }) => void);
        readonly validated: Core.Events<{
            target: ContentEditable;
        }>;
        set onvalidated(value: (event: {
            target: ContentEditable;
        }) => void);
        readonly selectionentered: Core.Events<{
            target: ContentEditable;
        }>;
        set onselectionentered(value: (event: {
            target: ContentEditable;
        }) => void);
        readonly selectionleaved: Core.Events<{
            target: ContentEditable;
        }>;
        set onselectionleaved(value: (event: {
            target: ContentEditable;
        }) => void);
        private _lastHtml;
        constructor(init?: ContentEditableInit);
        protected onDisable(): void;
        protected onEnable(): void;
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
        set onscrolled(value: (event: {
            target: VBoxScrollable;
            offsetX: number;
            offsetY: number;
        }) => void);
        constructor(init?: VBoxScrollableInit);
        reload(): void;
        getActiveItems(): Element[];
        set loader(loader: ScrollLoader);
        set maxScale(maxScale: number);
        set content(content: Element);
        get content(): Element;
        get scrollHorizontal(): boolean;
        set scrollHorizontal(scroll: boolean);
        get scrollVertical(): boolean;
        set scrollVertical(scroll: boolean);
        get scrollbarVertical(): Movable;
        set scrollbarVertical(scrollbarVertical: Movable);
        get scrollbarHorizontal(): Movable;
        set scrollbarHorizontal(scrollbarHorizontal: Movable);
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
        set onscrolled(value: (event: {
            target: VBoxScrollableContent;
            offsetX: number;
            offsetY: number;
        }) => void);
        constructor();
        setLoader(loader: any): void;
        getActiveItems(): Element[];
        get offsetX(): number;
        get offsetY(): number;
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
        private _pointerId?;
        private rectangle?;
        private startPos;
        private shiftStart;
        private lastSelection;
        lock: boolean;
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
        private onMouseDown;
        private onKeyDown;
    }
}
declare namespace Ui {
    interface ComboInit<T> extends ButtonInit {
        placeHolder?: string;
        field?: keyof T;
        iconField?: keyof T;
        data?: T[];
        position?: number;
        current?: T;
        search?: boolean;
        allowNone?: boolean;
        onchanged?: (event: {
            target: Combo<T>;
            value: T;
            position: number;
        }) => void;
    }
    class Combo<T = any> extends Button implements ComboInit<T> {
        private _field;
        private _iconField?;
        private _data;
        private _position;
        private _current;
        private _placeHolder;
        sep: undefined;
        arrowbottom: Icon;
        search: boolean;
        allowNone: boolean;
        readonly changed: Core.Events<{
            target: Combo<T>;
            value: T;
            position: number;
        }>;
        set onchanged(value: (event: {
            target: Combo<T>;
            value: T;
            position: number;
        }) => void);
        constructor(init?: ComboInit<T>);
        set placeHolder(placeHolder: string);
        set field(field: keyof T);
        set iconField(field: keyof T);
        set data(data: T[]);
        get data(): T[];
        get position(): number;
        set position(position: number);
        get current(): T;
        get value(): T;
        set current(current: T);
        protected onItemPress(popup: any, item: any, position: any): void;
        protected onPress(): void;
        protected updateColors(): void;
        protected onDisable(): void;
        protected onEnable(): void;
        static style: object;
    }
    interface ComboPopupInit<T> extends MenuPopupInit {
        search?: boolean;
        allowNone?: boolean;
        field?: keyof T;
        iconField?: keyof T;
        data?: T[];
        position?: number;
    }
    class ComboPopup<T> extends MenuPopup {
        private list;
        private _allowNone;
        private _data;
        private _field;
        private _iconField?;
        private searchField;
        private emptyField;
        readonly item: Core.Events<{
            target: ComboPopup<T>;
            item: ComboItem;
            position: number;
        }>;
        constructor(init?: ComboPopupInit<T>);
        private onSearchChange;
        set search(value: boolean);
        get allowNone(): boolean;
        set allowNone(value: boolean);
        get field(): keyof T;
        set field(field: keyof T);
        get iconField(): keyof T;
        set iconField(field: keyof T);
        set data(data: T[]);
        set position(position: number);
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
    class ListViewHeader extends Pressable {
        readonly headerDef: HeaderDef;
        protected ui: Element;
        protected background: Rectangle;
        protected sortBox: HBox;
        protected sortOrderLabel: Label;
        protected sortArrow: Icon;
        protected _sortOrder: number | undefined;
        protected _sortInvert: boolean;
        constructor(headerDef: HeaderDef);
        set sort(value: {
            order: number | undefined;
            invert: boolean;
        });
        get sort(): {
            order: number | undefined;
            invert: boolean;
        };
        protected getColor(): Color;
        protected getColorDown(): Color;
        protected onListViewHeaderDown(): void;
        protected onListViewHeaderUp(): void;
        protected onStyleChange(): void;
        static style: object;
    }
    class ListViewHeadersBar<T> extends Container {
        allowMultiSort: boolean;
        private headers;
        private _sortOrder;
        uis: ListViewHeader[];
        rowsHeight: number;
        headersHeight: number;
        readonly sortchanged: Core.Events<{
            target: ListViewHeadersBar<T>;
            sortOrder: {
                key: keyof T;
                invert: boolean;
            }[];
        }>;
        set onsortchanged(value: (event: {
            target: ListViewHeadersBar<T>;
            sortOrder: Array<{
                key: keyof T;
                invert: boolean;
            }>;
        }) => void);
        constructor(init: any);
        get sortColKey(): keyof T;
        get sortInvert(): boolean;
        sortBy(key: keyof T, invert: boolean): void;
        get sortOrder(): Array<{
            key: keyof T;
            invert: boolean;
        }>;
        set sortOrder(value: Array<{
            key: keyof T;
            invert: boolean;
        }>);
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
    }
    interface ListViewRowInit<T> {
        height?: number;
        listView: ListView<T>;
        data: any;
    }
    class ListViewRow<T> extends Container {
        private headers;
        private _data;
        readonly cells: ListViewCell[];
        private selectionActions;
        readonly selectionWatcher: SelectionableWatcher;
        readonly listView: ListView<T>;
        readonly selected: Core.Events<{
            target: ListViewRow<T>;
        }>;
        set onselected(value: (event: {
            target: ListViewRow<T>;
        }) => void);
        readonly unselected: Core.Events<{
            target: ListViewRow<T>;
        }>;
        set onunselected(value: (event: {
            target: ListViewRow<T>;
        }) => void);
        constructor(init: ListViewRowInit<T>);
        getValueFrom(key: string, data: T): any;
        get data(): T;
        set data(data: T);
        get isSelected(): boolean;
        set isSelected(value: boolean);
        protected measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: number, height: number): void;
        protected onStyleChange(): void;
        static style: object;
    }
    interface ListViewRowOddInit<T> extends ListViewRowInit<T> {
    }
    class ListViewRowOdd<T> extends ListViewRow<T> {
        constructor(init: ListViewRowOddInit<T>);
        static style: object;
    }
    interface ListViewRowEvenInit<T> extends ListViewRowInit<T> {
    }
    class ListViewRowEven<T> extends ListViewRow<T> {
        constructor(init: ListViewRowEvenInit<T>);
        static style: object;
    }
    class ListViewScrollLoader<T> extends ScrollLoader {
        listView: ListView<T>;
        data: T[];
        constructor(listView: ListView<T>, data: T[]);
        signalChange(): void;
        getMin(): number;
        getMax(): number;
        getElementAt(position: any): ListViewRow<T>;
    }
    interface ListViewInit<T> extends VBoxInit {
        headers?: HeaderDef[];
        scrolled?: boolean;
        allowMultiSort?: boolean;
        scrollVertical?: boolean;
        scrollHorizontal?: boolean;
        selectionActions?: ((v: T) => SelectionActions) | SelectionActions;
        onselectionchanged?: (event: {
            target: ListView<T>;
        }) => void;
        onselected?: (event: {
            target: ListView<T>;
        }) => void;
        onunselected?: (event: {
            target: ListView<T>;
        }) => void;
        onactivated?: (event: {
            target: ListView<T>;
            position: number;
            value: any;
        }) => void;
        onsortchanged?: (event: {
            target: ListView<T>;
            sortOrder: Array<{
                key: keyof T;
                invert: boolean;
            }>;
        }) => void;
    }
    class ListView<T = any> extends VBox implements ListViewInit<T> {
        private _data;
        headers: HeaderDef[];
        readonly headersBar: ListViewHeadersBar<T>;
        headersScroll: ScrollingArea;
        firstRow: undefined;
        firstCol: undefined;
        cols: undefined;
        rowsHeight: number;
        headersHeight: number;
        headersVisible: boolean;
        scroll: VBoxScrollingArea;
        selectionActions: ((v: T) => SelectionActions) | SelectionActions;
        sortFunc?: (data: Array<T>, sortOrder: Array<{
            key: keyof T;
            invert: boolean;
        }>) => void;
        private _scrolled;
        private _scrollVertical;
        private _scrollHorizontal;
        vbox: VBox;
        vboxScroll: ScrollingArea;
        private _selectionChangedLock;
        readonly selectionchanged: Core.Events<{
            target: ListView<T>;
        }>;
        set onselectionchanged(value: (event: {
            target: ListView<T>;
        }) => void);
        readonly selected: Core.Events<{
            target: ListView<T>;
        }>;
        set onselected(value: (event: {
            target: ListView<T>;
        }) => void);
        readonly unselected: Core.Events<{
            target: ListView<T>;
        }>;
        set onunselected(value: (event: {
            target: ListView<T>;
        }) => void);
        readonly activated: Core.Events<{
            target: ListView<T>;
            position: number;
            value: any;
        }>;
        set onactivated(value: (event: {
            target: ListView<T>;
            position: number;
            value: any;
        }) => void);
        readonly sortchanged: Core.Events<{
            target: ListView<T>;
            sortOrder: {
                key: keyof T;
                invert: boolean;
            }[];
        }>;
        set onsortchanged(value: (event: {
            target: ListView<T>;
            sortOrder: Array<{
                key: keyof T;
                invert: boolean;
            }>;
        }) => void);
        readonly datachanged: Core.Events<{
            target: ListView<T>;
        }>;
        set ondatachanged(value: (event: {
            target: ListView<T>;
        }) => void);
        constructor(init?: ListViewInit<T>);
        set scrolled(scrolled: boolean);
        set scrollVertical(value: boolean);
        set scrollHorizontal(value: boolean);
        get allowMultiSort(): boolean;
        set allowMultiSort(value: boolean);
        showHeaders(): void;
        hideHeaders(): void;
        getSelectionActions(): SelectionActions | ((v: T) => SelectionActions);
        setSelectionActions(value: SelectionActions): void;
        getElementAt(position: number): ListViewRow<T>;
        appendData(data: T): void;
        updateData(): void;
        removeData(data: any): void;
        removeDataAt(position: number): void;
        clearData(): void;
        get data(): Array<T>;
        set data(data: Array<T>);
        sortData(): void;
        sortBy(key: keyof T, invert: boolean): void;
        get sortOrder(): Array<{
            key: keyof T;
            invert: boolean;
        }>;
        set sortOrder(value: Array<{
            key: keyof T;
            invert: boolean;
        }>);
        get sortColKey(): keyof T;
        get sortInvert(): boolean;
        findDataRow(data: T): number;
        onSelectionEdit(selection: Selection): void;
        protected onChildInvalidateArrange(child: Element): void;
        onRowSelectionChanged(): void;
        get rows(): Array<ListViewRow<T>>;
        get selectedRows(): Array<ListViewRow<T>>;
        selectAll(): void;
        unselectAll(): void;
    }
    class ListViewCell extends LBox {
        value: any;
        ui: Element;
        key: string;
        row: ListViewRow<any>;
        constructor();
        getKey(): string;
        setKey(key: any): void;
        setRow(row: ListViewRow<any>): void;
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
    class ListViewCellNumber extends ListViewCell {
        ui: Label;
        constructor();
        protected generateUi(): Element;
        protected onValueChange(value: number): void;
    }
    class ListViewColBar extends Container {
        protected header: ListViewHeader;
        protected headerDef: HeaderDef;
        protected grip: Movable;
        protected separator: Rectangle;
        private gripR1;
        private gripR2;
        constructor(header: ListViewHeader, headerDef: HeaderDef);
        setHeader(header: ListViewHeader): void;
        protected onMove(): void;
        protected onUp(): void;
        protected measureCore(width: any, height: any): {
            width: number;
            height: number;
        };
        protected arrangeCore(width: any, height: any): void;
        protected onDisable(): void;
        protected onEnable(): void;
        onStyleChange(): void;
        static style: {
            color: 'black';
        };
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
            file: File;
        }>;
        set onfile(value: (event: {
            target: Uploadable;
            file: File;
        }) => void);
        constructor(init?: UploadableInit);
        setDirectoryMode(active: boolean): void;
        set directoryMode(active: boolean);
        set multiple(active: boolean);
        protected onFile(fileWrapper: any, file: File): void;
        protected onPress(): void;
        set content(content: Element);
    }
    class UploadableFileWrapper extends Element {
        formDrawing: HTMLFormElement;
        inputDrawing: HTMLInputElement;
        iframeDrawing: HTMLIFrameElement;
        private _directoryMode;
        private _multiple;
        private _accept?;
        readonly file: Core.Events<{
            target: UploadableFileWrapper;
            file: File;
        }>;
        constructor();
        select(): void;
        set multiple(active: boolean);
        setDirectoryMode(active: any): void;
        set directoryMode(active: boolean);
        set accept(value: string | undefined);
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
            file: File;
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
            file: File;
        }) => void;
    }
    class UploadButton extends Button implements UploadButtonInit {
        input: UploadableFileWrapper;
        readonly filechanged: Core.Events<{
            target: UploadButton;
            file: File;
        }>;
        set onfilechanged(value: (event: {
            target: UploadButton;
            file: File;
        }) => void);
        constructor(init?: UploadButtonInit);
        set directoryMode(active: boolean);
        set multiple(active: boolean);
        set accept(value: string | undefined);
        protected onUploadButtonPress(): void;
        protected onFile(wrapper: UploadableFileWrapper, file: File): void;
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
        set direction(direction: SlideDirection);
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
        protected transitionClock?: Anim.Clock;
        protected _current: Element;
        protected next: Element;
        protected replaceMode: boolean;
        protected progress: number;
        children: TransitionBoxContent[];
        readonly changed: Core.Events<{
            target: TransitionBox;
            position: number;
        }>;
        set onchanged(value: (event: {
            target: TransitionBox;
            position: number;
        }) => void);
        constructor(init?: TransitionBoxInit);
        get position(): number;
        set position(position: number);
        set duration(duration: number);
        set ease(ease: Anim.EasingFunction | string);
        set transition(transition: Transition | string);
        get current(): Element;
        set current(child: Element);
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
        set onfolded(value: (event: {
            target: Fold;
        }) => void);
        readonly unfolded: Core.Events<{
            target: Fold;
        }>;
        set onunfolded(value: (event: {
            target: Fold;
        }) => void);
        readonly positionchanged: Core.Events<{
            target: Fold;
            position: "left" | "right" | "top" | "bottom";
        }>;
        set onpositionchanged(value: (event: {
            target: Fold;
            position: FoldDirection;
        }) => void);
        readonly progress: Core.Events<{
            target: Fold;
            offset: number;
        }>;
        set onprogress(value: (event: {
            target: Fold;
            offset: number;
        }) => void);
        constructor(init?: FoldInit);
        get isFolded(): boolean;
        set isFolded(isFolded: boolean);
        fold(): void;
        unfold(): void;
        get over(): boolean;
        set over(over: boolean);
        get mode(): FoldMode;
        set mode(mode: FoldMode);
        get header(): Element;
        set header(header: Element);
        get content(): Element;
        set content(content: Element);
        get background(): Element;
        set background(background: Element);
        get position(): FoldDirection;
        set position(position: FoldDirection);
        invert(): void;
        get animDuration(): number;
        set animDuration(duration: number);
        protected get offset(): number;
        protected set offset(offset: number);
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
        set onchanged(value: (event: {
            target: Switch;
            value: boolean;
        }) => void);
        constructor(init?: SwitchInit);
        get value(): boolean;
        set value(value: boolean);
        private onButtonMove;
        private updatePos;
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
        set onchanged(value: (event: {
            target: Accordeonable;
            page: AccordeonPage;
            position: number;
        }) => void);
        constructor(init?: AccordeonableInit);
        get orientation(): AccordeonOrientation;
        set orientation(orientation: AccordeonOrientation);
        get pages(): AccordeonPage[];
        get currentPage(): AccordeonPage | undefined;
        set currentPage(page: AccordeonPage | undefined);
        get currentPosition(): number;
        set currentPosition(pos: number);
        appendPage(page: AccordeonPage, autoSelect?: boolean): void;
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
        set onselected(value: (event: {
            target: AccordeonPage;
        }) => void);
        unselected: Core.Events<{
            target: AccordeonPage;
        }>;
        set onunselected(value: (event: {
            target: AccordeonPage;
        }) => void);
        closed: Core.Events<{
            target: AccordeonPage;
        }>;
        set onclosed(value: (event: {
            target: AccordeonPage;
        }) => void);
        orientationchanged: Core.Events<{
            target: AccordeonPage;
            orientation: Orientation;
        }>;
        set onorientationchanged(value: (event: {
            target: AccordeonPage;
            orientation: 'vertical' | 'horizontal';
        }) => void);
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
    interface DropAtBoxInit<T extends Ui.Container & IContainer> extends LBoxInit {
        ondrageffect?: (event: Ui.DragEvent) => void;
        ondragentered?: (event: {
            target: DropAtBox<T>;
            data: any;
        }) => void;
        ondragleaved?: (event: {
            target: DropAtBox<T>;
        }) => void;
        ondroppedat?: (event: {
            target: DropAtBox<T>;
            data: any;
            effect: string;
            position: number;
            x: number;
            y: number;
        }) => void;
        ondroppedfileat?: (event: {
            target: DropAtBox<T>;
            file: File;
            effect: string;
            position: number;
            x: number;
            y: number;
        }) => void;
    }
    interface IContainer {
        insertAt(child: Element, position: number): void;
        insertBefore(child: Element, before: Element): void;
        moveAt(element: Element, pos: number): void;
        content: Element | Element[] | undefined;
        append(item: Element): void;
        remove(item: Element): void;
    }
    class DropAtBox<T extends Ui.Container & IContainer> extends LBox implements DropAtBoxInit<T> {
        watchers: DragWatcher[];
        allowedTypes: {
            type: string | Function;
            effect: DropEffect[] | DropAtEffectFunc;
        }[];
        readonly container: T;
        private fixed;
        private markerOrientation;
        readonly drageffect: Core.Events<DragEvent>;
        set ondrageffect(value: (event: DragEvent) => void);
        readonly dragentered: Core.Events<{
            target: DropAtBox<T>;
            data: any;
        }>;
        set ondragentered(value: (event: {
            target: DropAtBox<T>;
            data: any;
        }) => void);
        readonly dragleaved: Core.Events<{
            target: DropAtBox<T>;
        }>;
        set ondragleaved(value: (event: {
            target: DropAtBox<T>;
        }) => void);
        readonly droppedat: Core.Events<{
            target: DropAtBox<T>;
            data: any;
            effect: string;
            position: number;
            x: number;
            y: number;
        }>;
        set ondroppedat(value: (event: {
            target: DropAtBox<T>;
            data: any;
            effect: string;
            position: number;
            x: number;
            y: number;
        }) => void);
        readonly droppedfileat: Core.Events<{
            target: DropAtBox<T>;
            file: File;
            effect: string;
            position: number;
            x: number;
            y: number;
        }>;
        set ondroppedfileat(value: (event: {
            target: DropAtBox<T>;
            file: File;
            effect: string;
            position: number;
            x: number;
            y: number;
        }) => void);
        constructor(container: T, init?: DropAtBoxInit<T>);
        addType(type: string | Function, effects: string | string[] | DropEffect[] | DropAtEffectFunc): void;
        setMarkerOrientation(orientation: any): void;
        setMarkerPos(marker: Element, pos: number): void;
        findPosition(point: Point): number;
        findPositionHorizontal(point: Point): number;
        findPositionVertical(point: Point): number;
        insertAt(element: Element, pos: number): void;
        insertBefore(element: Element, child: Element): void;
        moveAt(element: Element, pos: number): void;
        get logicalChildren(): Element[];
        set content(content: Element);
        clear(): void;
        append(item: Element): void;
        remove(item: Element): void;
        getChildPosition(child: Element): number;
        hasChild(child: Element): boolean;
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
    interface FlowDropBoxInit extends DropAtBoxInit<Flow> {
        uniform?: boolean;
        spacing?: number;
    }
    class FlowDropBox extends DropAtBox<Flow> {
        constructor(init?: FlowDropBoxInit);
        set uniform(uniform: boolean);
        set spacing(spacing: number);
    }
    interface SFlowDropBoxInit extends DropAtBoxInit<SFlow> {
        stretchMaxRatio?: number;
        uniform?: boolean;
        uniformRatio?: number;
        itemAlign?: SFlowAlign;
        spacing?: number;
    }
    class SFlowDropBox extends DropAtBox<SFlow> {
        constructor(init?: SFlowDropBoxInit);
        set stretchMaxRatio(ratio: number);
        set uniform(uniform: boolean);
        set uniformRatio(uniformRatio: number);
        set itemAlign(align: SFlowAlign);
        set spacing(spacing: number);
    }
    interface VDropBoxInit extends DropAtBoxInit<VBox> {
        spacing?: number;
    }
    class VDropBox extends DropAtBox<VBox> {
        constructor(init?: VDropBoxInit);
        set uniform(uniform: boolean);
        set spacing(spacing: number);
    }
    interface HDropBoxInit extends DropAtBoxInit<HBox> {
    }
    class HDropBox extends DropAtBox<HBox> {
        constructor(init?: HDropBoxInit);
        set uniform(uniform: boolean);
        set spacing(spacing: number);
    }
}
declare namespace Ui {
    interface SegmentBarInit extends LBoxInit {
        orientation?: 'horizontal' | 'vertical';
        field?: string;
        iconField?: string;
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
        private _current;
        private _field;
        private _iconField;
        private _data;
        private _orientation;
        readonly changed: Core.Events<{
            target: SegmentBar;
            value: any;
        }>;
        set onchanged(value: (event: {
            target: SegmentBar;
            value: any;
        }) => void);
        constructor(init?: SegmentBarInit);
        set orientation(orientation: 'horizontal' | 'vertical');
        set field(field: string);
        set iconField(iconField: string);
        set data(data: Array<any>);
        set currentPosition(position: number);
        get currentPosition(): number;
        get logicalChildren(): Array<SegmentButton>;
        get current(): SegmentButton | undefined;
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
        iconText?: string;
        boxHeight?: number;
        mode?: 'left' | 'right' | 'top' | 'bottom';
        radius?: number;
        spacing?: number;
        background?: Color | string;
    }
    class SegmentButton extends Pressable implements SegmentButtonInit {
        private box;
        private label;
        private icon;
        private bg;
        private _mode;
        private _data;
        private _radius;
        constructor(init?: SegmentButtonInit);
        set textTransform(textTransform: string);
        set foreground(color: Color | string);
        get data(): any;
        set data(data: any);
        set text(text: string);
        set iconText(icon: string);
        set boxHeight(height: number);
        set mode(mode: 'left' | 'right' | 'top' | 'bottom');
        set radius(radius: number);
        set spacing(spacing: number);
        set background(color: Color | string);
        set backgroundMode(mode: 'top' | 'bottom' | 'left' | 'right' | 'stretch');
        set backgroundWidth(width: number);
        set backgroundHeight(height: number);
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
        set onchanged(value: (event: {
            target: Locator;
            path: string;
            position: number;
        }) => void);
        constructor(init?: LocatorInit);
        set path(path: string);
        get path(): string;
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
        set radius(radius: number);
        set arrowLength(length: number);
        set fill(color: Color | string);
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
        set radius(radius: number);
        set arrowLength(length: number);
        protected arrangeCore(width: number, height: number): void;
    }
    interface LocatorLeftRightArrowInit extends ShapeInit {
        radius?: number;
        arrowLength?: number;
    }
    class LocatorLeftRightArrow extends Shape implements LocatorLeftRightArrowInit {
        private _length;
        constructor(init?: LocatorLeftRightArrowInit);
        set radius(radius: number);
        set arrowLength(length: number);
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
        set onchanged(value: (event: {
            target: Carouselable;
            position: number;
        }) => void);
        constructor(init?: CarouselableInit);
        set autoPlay(delay: number);
        stopAutoPlay(): void;
        startAutoPlay(): void;
        private onAutoPlayTimeout;
        get bufferingSize(): number;
        set bufferingSize(size: number);
        get logicalChildren(): Element[];
        get currentPosition(): number;
        get current(): Element;
        set current(value: Element);
        setCurrentAt(position: number, noAnimation?: boolean): void;
        setCurrent(current: Element, noAnimation?: boolean): void;
        next(): void;
        previous(): void;
        get ease(): Anim.EasingFunction;
        set ease(ease: Anim.EasingFunction);
        set content(value: Element[]);
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
        set onchanged(value: (event: {
            target: Carousel;
            position: number;
        }) => void);
        constructor(init?: CarouselInit);
        set autoPlay(delay: number);
        get alwaysShowArrows(): boolean;
        set alwaysShowArrows(value: boolean);
        next(): void;
        previous(): void;
        get logicalChildren(): Element[];
        get currentPosition(): number;
        get current(): Element;
        set current(value: Element);
        setCurrentAt(position: number, noAnimation?: boolean): void;
        setCurrent(current: Element, noAnimation?: boolean): void;
        get bufferingSize(): number;
        set bufferingSize(size: number);
        append(child: Element): void;
        remove(child: Element): void;
        insertAt(child: Element, pos: number): void;
        moveAt(child: Element, pos: number): void;
        set content(content: Element[]);
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
        private _autoHideControls;
        private controlsBox;
        private focusInWatcher;
        private _textHolder;
        private bg;
        readonly changed: Core.Events<{
            target: RichTextEditor;
        }>;
        set onchanged(value: (event: {
            target: RichTextEditor;
        }) => void);
        constructor();
        private showHideTextHolder;
        get html(): string;
        set html(html: string);
        get text(): string;
        set text(text: string);
        get textAlign(): TextAlign;
        set textAlign(textAlign: TextAlign);
        get fontSize(): number;
        set fontSize(fontSize: number);
        get fontFamily(): string;
        set fontFamily(fontFamily: string);
        get fontWeight(): FontWeight;
        set fontWeight(fontWeight: FontWeight);
        get interLine(): number;
        set interLine(interLine: number);
        get wordWrap(): string;
        set wordWrap(wordWrap: string);
        get whiteSpace(): string;
        set whiteSpace(whiteSpace: string);
        get color(): Color | string;
        set color(color: Color | string);
        get textHolder(): string;
        set textHolder(value: string);
        get isBackgroundVisible(): boolean;
        set isBackgroundVisible(value: boolean);
        get autoHideControls(): boolean;
        set autoHideControls(value: boolean);
    }
}
declare namespace Ui {
    class RadioBoxGraphic extends CanvasElement {
        private _isDown;
        private _isChecked;
        private _color;
        private _activeColor;
        private _borderWidth;
        constructor();
        get isDown(): boolean;
        set isDown(isDown: boolean);
        get isChecked(): boolean;
        set isChecked(isChecked: boolean);
        get color(): Color;
        set color(color: Color);
        set borderWidth(borderWidth: number);
        get borderWidth(): number;
        set activeColor(color: Color);
        get activeColor(): Color;
        updateCanvas(ctx: CanvasRenderingContext2D): void;
        measureCore(width: number, height: number): {
            width: number;
            height: number;
        };
        onDisable(): void;
        onEnable(): void;
    }
}
declare namespace Ui {
    interface RadioBoxInit extends PressableInit {
        value?: boolean;
        text?: string;
        content?: Element;
        group?: RadioGroup;
        onchanged?: (event: {
            target: RadioBox;
            value: boolean;
        }) => void;
        ontoggled?: (event: {
            target: RadioBox;
        }) => void;
        onuntoggled?: (event: {
            target: RadioBox;
        }) => void;
    }
    class RadioBox extends Pressable implements RadioBoxInit {
        private bg;
        private graphic;
        private contentBox;
        private hbox;
        private _content;
        private _text;
        private _group;
        private _isToggled;
        readonly changed: Core.Events<{
            target: RadioBox;
            value: boolean;
        }>;
        set onchanged(value: (event: {
            target: RadioBox;
            value: boolean;
        }) => void);
        readonly toggled: Core.Events<{
            target: RadioBox;
        }>;
        set ontoggled(value: (event: {
            target: RadioBox;
        }) => void);
        readonly untoggled: Core.Events<{
            target: RadioBox;
        }>;
        set onuntoggled(value: (event: {
            target: RadioBox;
        }) => void);
        constructor(init?: RadioBoxInit);
        get isToggled(): boolean;
        get value(): boolean;
        set value(value: boolean);
        get text(): string;
        set text(text: string);
        get content(): Element;
        set content(content: Element);
        get group(): RadioGroup;
        set group(group: RadioGroup);
        toggle(): void;
        untoggle(): void;
        private onRadioPress;
        protected onToggle(): void;
        protected onUntoggle(): void;
        protected onRadioFocus(): void;
        protected onRadioBlur(): void;
        protected onRadioDown(): void;
        protected onRadioUp(): void;
        protected onStyleChange(): void;
        static style: object;
    }
    class RadioGroup extends Core.Object {
        readonly content: Core.HashTable<RadioBox>;
        private _current?;
        readonly changed: Core.Events<{
            target: RadioGroup;
        }>;
        set onchanged(value: (event: {
            target: RadioGroup;
        }) => void);
        get current(): RadioBox | undefined;
        set current(radio: RadioBox | undefined);
        get children(): Array<RadioBox>;
        add(radio: RadioBox): void;
        remove(radio: RadioBox): void;
        onRadioSelected(event: {
            target: RadioBox;
        }): void;
    }
}
