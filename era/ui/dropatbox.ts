﻿namespace Ui {

    export type DropAtEffectFunc = (data: any, position: number) => DropEffect[];

    export interface DropAtBoxInit<T extends Ui.Container & IContainer> extends LBoxInit {
        ondrageffect?: (event: Ui.DragEvent) => void;
        ondragentered?: (event: { target: DropAtBox<T>, data: any }) => void;
        ondragleaved?: (event: { target: DropAtBox<T> }) => void;
        ondroppedat?: (event: { target: DropAtBox<T>, data: any, effect: string, position: number, x: number, y: number }) => void;
        ondroppedfileat?: (event: { target: DropAtBox<T>, file: File, effect: string, position: number, x: number, y: number }) => void;
    }

    export interface IContainer {
        insertAt(child: Element, position: number): void;
        insertBefore(child: Element, before: Element): void;
        moveAt(element: Element, pos: number): void;
        content: Element | Element[] | undefined;
        append(item: Element): void;
        remove(item: Element): void;
    }

    export class DropAtBox<T extends Ui.Container & IContainer > extends LBox implements DropAtBoxInit<T> {
        watchers: DragWatcher[] = [];
        allowedTypes: { type: string | Function, effect: DropEffect[] | DropAtEffectFunc }[];
        readonly container: T;
        private fixed: Fixed;
        private markerOrientation: 'horizontal';

        readonly drageffect = new Core.Events<DragEvent>();
        set ondrageffect(value: (event: DragEvent) => void) { this.drageffect.connect(value); }
        readonly dragentered = new Core.Events<{ target: DropAtBox<T>, data: any }>();
        set ondragentered(value: (event: { target: DropAtBox<T>, data: any }) => void) { this.dragentered.connect(value); }
        readonly dragleaved = new Core.Events<{ target: DropAtBox<T> }>();
        set ondragleaved(value: (event: { target: DropAtBox<T> }) => void) { this.dragleaved.connect(value); }
        readonly droppedat = new Core.Events<{ target: DropAtBox<T>, data: any, effect: string, position: number, x: number, y: number }>();
        set ondroppedat(value: (event: { target: DropAtBox<T>, data: any, effect: string, position: number, x: number, y: number }) => void) { this.droppedat.connect(value); }
        readonly droppedfileat = new Core.Events<{ target: DropAtBox<T>, file: File, effect: string, position: number, x: number, y: number }>();
        set ondroppedfileat(value: (event: { target: DropAtBox<T>, file: File, effect: string, position: number, x: number, y: number }) => void) { this.droppedfileat.connect(value); }

        constructor(container: T, init?: DropAtBoxInit<T>) {
            super(init);
            this.fixed = new Fixed();
            super.append(this.fixed);
            this.container = container;
            super.append(this.container);
            this.dragover.connect((e) => this.onDragOver(e));
            if (init) {
                if (init.ondroppedat)
                    this.droppedat.connect(init.ondroppedat);
                if (init.ondroppedfileat)
                    this.droppedfileat.connect(init.ondroppedfileat);
            }
        }

        addType(type: string | Function, effects: string | string[] | DropEffect[] | DropAtEffectFunc) {
            if (typeof (type) === 'string')
                type = type.toLowerCase();
            if (this.allowedTypes == undefined)
                this.allowedTypes = [];
            if (typeof (effects) === 'string')
                effects = [effects];
            if (typeof (effects) !== 'function') {
                for (let i = 0; i < effects.length; i++) {
                    let effect = effects[i];
                    if (typeof (effect) === 'string')
                        effect = { action: effect };
                    if (!('text' in effect)) {
                        if (effect.action === 'copy')
                            effect.text = 'Copier';
                        else if (effect.action === 'move')
                            effect.text = 'Déplacer';
                        else if (effect.action === 'link')
                            effect.text = 'Lier';
                        else
                            effect.text = effect.action;
                    }
                    if (!('dragicon' in effect))
                        effect.dragicon = 'drag' + effect.action;
                    effects[i] = effect;
                }
                this.allowedTypes.push({ type: type, effect: effects as DropEffect[] });
            }
            else
                this.allowedTypes.push({ type: type, effect: effects as DropAtEffectFunc });
        }

        setMarkerOrientation(orientation) {
            this.markerOrientation = orientation;
        }

        setMarkerPos(marker: Element, pos: number) {
            marker.show();
            let spacing = 0;
            if ('spacing' in this.container)
                spacing = (this.container as any).spacing;
            if (pos < this.container.children.length) {
                let child = this.container.children[pos];

                if (this.markerOrientation === 'horizontal') {
                    let x = child.layoutX - child.marginLeft -
                        (marker.layoutWidth + marker.marginLeft + marker.marginRight + spacing) / 2;
                    let y = child.layoutY;
                    let height = child.layoutHeight;
                    marker.height = height;
                    this.fixed.setPosition(marker, x, y);
                }
                else {
                    let x = child.layoutX;
                    let y = child.layoutY - child.marginTop - (marker.layoutHeight + marker.marginTop + marker.marginBottom) / 2 - spacing / 2;
                    marker.width = child.layoutWidth;
                    this.fixed.setPosition(marker, x, y);
                }
            }
            else if (this.container.children.length > 0) {
                let child = this.container.children[this.container.children.length - 1];

                if (this.markerOrientation === 'horizontal') {
                    let x = child.layoutX + child.layoutWidth - (marker.layoutWidth - spacing) / 2;
                    let y = child.layoutY;
                    let height = child.layoutHeight;
                    marker.height = height;
                    this.fixed.setPosition(marker, x, y);
                }
                else {
                    let x = child.layoutX;
                    let y = child.layoutY + child.layoutHeight - marker.layoutHeight / 2;
                    marker.width = child.layoutWidth;
                    this.fixed.setPosition(marker, x, y);
                }
            }
        }

        findPosition(point: Point) {
            if (this.markerOrientation === 'horizontal')
                return this.findPositionHorizontal(point);
            else
                return this.findPositionVertical(point);
        }

        findPositionHorizontal(point: Point) {
            let line : Element[] = [];
            let childs = this.container.children;
            for (let i = 0; i < childs.length; i++) {
                if ((point.y >= childs[i].layoutY) && (point.y < childs[i].layoutY + childs[i].layoutHeight))
                    line.push(childs[i]);
            }
            let element : Element | undefined = undefined;
            let dist = Number.MAX_VALUE;
            for (let i = 0; i < line.length; i++) {
                let cx = line[i].layoutX + ((line[i].layoutWidth) / 2);
                let d = Math.abs(point.x - cx);
                if (d < dist) {
                    dist = d;
                    element = line[i];
                }
            }
            if ((element === undefined) && (line.length > 0))
                element = line[line.length - 1];

            let insertPos = childs.length;
            if (element !== undefined) {
                // find element pos
                let elPos = -1;
                for (let i = 0; (elPos == -1) && (i < childs.length); i++) {
                    if (childs[i] == element)
                        elPos = i;
                }
                if (point.x < element.layoutX + element.layoutWidth / 2)
                    insertPos = elPos;
                else
                    insertPos = elPos + 1;
            }
            return insertPos;
        }

        findPositionVertical(point: Point) {
            let childs = this.container.children;

            let element : Element | undefined = undefined;
            let dist = Number.MAX_VALUE;
            for (let i = 0; i < childs.length; i++) {
                let cy = childs[i].layoutY + ((childs[i].layoutHeight) / 2);
                let d = Math.abs(point.y - cy);
                if (d < dist) {
                    dist = d;
                    element = childs[i];
                }
            }
            if ((element === undefined) && (childs.length > 0))
                element = childs[childs.length - 1];

            let insertPos = childs.length;
            if (element !== undefined) {
                // find element pos
                let elPos = -1;
                for (let i = 0; (elPos === -1) && (i < childs.length); i++) {
                    if (childs[i] === element)
                        elPos = i;
                }
                if (point.y < element.layoutY + element.layoutHeight / 2)
                    insertPos = elPos;
                else
                    insertPos = elPos + 1;
            }
            return insertPos;
        }

        insertAt(element: Element, pos: number) {
           this.container.insertAt(element, pos);
        }

        insertBefore(element: Element, child: Element) {
            this.container.insertBefore(element, child);
        }

        moveAt(element: Element, pos: number) {
           this.container.moveAt(element, pos);
        }

        get logicalChildren(): Element[] {
            return this.container.children;
        }

        set content(content: Element) {
            this.container.content = content;
        }

        clear() {
            this.container.clear();
        }

        append(item: Element) {
            this.container.append(item);
        }

        remove(item: Element) {
            this.container.remove(item);
        }

        getChildPosition(child: Element): number {
            return this.container.getChildPosition(child);
        }
        hasChild(child: Element): boolean {
            return this.container.hasChild(child);
        }

        protected onStyleChange() {
            let color = this.getStyleProperty('markerColor');
            for (let i = 0; i < this.watchers.length; i++) {
                let marker = (this.watchers[i])["Ui.DropAtBox.marker"] as Rectangle;
                marker.fill = color;
            }
        }

        protected getAllowedTypesEffect(dataTransfer: DragDataTransfer): DropEffect[] {
            if (this.allowedTypes !== undefined) {
                let data = dataTransfer.getData();
                let effect : DropEffect[] | DropAtEffectFunc | undefined = undefined;
                for (let i = 0; (effect === undefined) && (i < this.allowedTypes.length); i++) {
                    let type = this.allowedTypes[i];
                    if (typeof (type.type) === 'string') {
                        if (type.type === 'all')
                            effect = type.effect;
                        else if (data instanceof DragNativeData) {
                            if ((type.type === 'files') && data.hasFiles())
                                effect = type.effect;
                            else if (((type.type === 'text') || (type.type === 'text/plain')) && data.hasTypes('text/plain', 'text'))
                                effect = type.effect;
                            else if (data.hasType(type.type))
                                effect = type.effect;
                        }
                    }
                    else if (data instanceof type.type)
                        effect = type.effect;
                }
                if (typeof (effect) === 'function') {
                    let effects = this.onDragEffectFunction(dataTransfer, effect);

                    for (let i = 0; i < effects.length; i++) {
                        let effect = effects[i];
                        if (typeof (effect) === 'string')
                            effect = { action: effect };
                        if (!('text' in effect)) {
                            if (effect.action === 'copy')
                                effect.text = 'Copier';
                            else if (effect.action === 'move')
                                effect.text = 'Déplacer';
                            else if (effect.action === 'link')
                                effect.text = 'Lier';
                            else if (effect.action === 'run')
                                effect.text = 'Exécuter';
                            else if (effect.action === 'play')
                                effect.text = 'Jouer';
                            else
                                effect.text = effect.action;
                        }
                        if (!('dragicon' in effect))
                            effect.dragicon = 'drag' + effect.action;
                        effects[i] = effect;
                    }
                    effect = effects;
                }
                if (effect === undefined)
                    effect = [];
                return effect;
            }
            else
                return [];
        }

        //
        // Override to allow a drop for the given dataTransfer.
        // This method return the possible allowed effect [move|copy|link|...] in an array
        //
        protected onDragEffect(dataTransfer: DragDataTransfer) {
            let dragEvent = new Ui.DragEvent();
            dragEvent.setType('drageffect');
            dragEvent.setBubbles(false);
            dragEvent.dataTransfer = dataTransfer;
            dragEvent.dispatchEvent(this);
            let effectAllowed = dragEvent.effectAllowed;
            if (effectAllowed !== undefined)
                return dragEvent.effectAllowed;
            else
                return this.getAllowedTypesEffect(dataTransfer);
        }

        protected onDragOver(event: DragEvent) {
            if (!event.dataTransfer)
                return;
            // test if we already captured this dataTransfer
            let foundWatcher : DragWatcher | undefined = undefined;
            for (let i = 0; (foundWatcher === undefined) && (i < this.watchers.length); i++)
                if (this.watchers[i].getDataTransfer() === event.dataTransfer)
                    foundWatcher = this.watchers[i];

            // get allowed effect for the given dataTransfer
            let effect = this.onDragEffect(event.dataTransfer);

            if (foundWatcher !== undefined && effect) {
                let equal = effect.length === foundWatcher.getEffectAllowed();
                for (let i = 0; equal && (i < effect.length); i++) {
                    equal = effect[i] === foundWatcher.getEffectAllowed()[i];
                }
                if (!equal) {
                    foundWatcher.release();
                    foundWatcher = undefined;
                }
            }

            if ((effect !== undefined) && (effect.length > 0) && (foundWatcher === undefined)) {
                // capture the dataTransfer
                let watcher = event.dataTransfer.capture(this, effect);
                this.watchers.push(watcher);
                watcher.moved.connect(() => this.onWatcherMove(watcher));
                watcher.dropped.connect((e) => this.onWatcherDrop(e.target, e.effect, e.x, e.y));
                watcher.leaved.connect(() => this.onWatcherLeave(watcher));
                event.stopImmediatePropagation();

                this.onWatcherEnter(watcher);
            }
            // we are already interrested
            else if (foundWatcher !== undefined)
                event.stopImmediatePropagation();
        }

        protected onDragEffectFunction(dataTransfer: DragDataTransfer, func: DropAtEffectFunc): DropEffect[] {
            let position = this.findPosition(this.pointFromWindow(dataTransfer.getPosition()));
            return func(dataTransfer.getData(), position);
        }

        protected onWatcherEnter(watcher: DragWatcher) {
            //let marker = new Ui.Frame({ margin: 2, frameWidth: 2, width: 6, height: 6 });
            let marker = new Ui.Rectangle({ margin: 0, width: 6, height: 6 });
            marker.fill = this.getStyleProperty('markerColor');
            marker.hide();
            this.fixed.append(marker, 0, 0);

            watcher["Ui.DropAtBox.marker"] = marker;
        }

        protected onWatcherMove(watcher: DragWatcher) {
            this.onDragEnter(watcher.getDataTransfer());

            let marker = watcher["Ui.DropAtBox.marker"] as Rectangle;
            let position = this.findPosition(this.pointFromWindow(watcher.getPosition()));
            this.setMarkerPos(marker, position);
        }

        protected onWatcherLeave(watcher) {
            let found = false;
            let i = 0;
            for (; !found && (i < this.watchers.length); i++) {
                found = (this.watchers[i] === watcher);
            }
            i--;
            if (found)
                this.watchers.splice(i, 1);
            if (this.watchers.length === 0)
                this.onDragLeave();

            let marker = watcher["Ui.DropAtBox.marker"] as Rectangle;
            this.fixed.remove(marker);
        }

        protected onWatcherDrop(watcher: DragWatcher, effect, x: number, y: number): void {
            let point = this.pointFromWindow(new Point(x, y));
            this.onDrop(watcher.getDataTransfer(), effect, point.getX(), point.getY());
        }

        //
        // Override to do something when the first allowed drag enter the element.
        // The default action is to raise the 'dragenter' event
        //
        protected onDragEnter(dataTransfer: DragDataTransfer): void {
            this.dragentered.fire({ target: this, data: dataTransfer.getData() });
        }

        //
        // Override to do something when the last allowed drag leave the element.
        // The default action is to raise the 'dragleave' event
        //
        protected onDragLeave(): void {
            this.dragleaved.fire({ target: this });
        }

        protected onDrop(dataTransfer: DragDataTransfer, dropEffect, x: number, y: number) {
            let done = false;
            let point = new Point(x, y);
            let position = this.findPosition(point);

            this.droppedat.fire({
                target: this,
                data: dataTransfer.getData(),
                effect: dropEffect,
                position: position,
                x: x, y: y
            });

            let data = dataTransfer.getData();
            if (data instanceof DragNativeData && data.hasFiles()) {
                let files = data.getFiles();
                for (let i = 0; i < files.length; i++)
                    this.droppedfileat.fire({
                        target: this, file: files[i], effect: dropEffect,
                        position: position, x: x, y: y
                    });
            }
        }

        static style: object = {
            markerColor: '#ff0076'
        }
    }

    export interface FlowDropBoxInit extends DropAtBoxInit<Flow> {
        uniform?: boolean;
        spacing?: number;
    }

    export class FlowDropBox extends DropAtBox<Flow> {

        constructor(init?: FlowDropBoxInit) {
            super(new Flow().assign({ spacing: 10 }), init);
            this.setMarkerOrientation('horizontal');
            if (init) {
                if (init.uniform !== undefined)
                    this.uniform = init.uniform;
                if (init.spacing !== undefined)
                    this.spacing = init.spacing;
            }
        }

        set uniform(uniform: boolean) {
            this.container.uniform = uniform;
        }

        set spacing(spacing: number) {
            this.container.spacing = spacing;
        }
    }

    export interface SFlowDropBoxInit extends DropAtBoxInit<SFlow> {
        stretchMaxRatio?: number;
        uniform?: boolean;
        uniformRatio?: number;
        itemAlign?: SFlowAlign;
        spacing?: number;
    }

    export class SFlowDropBox extends DropAtBox<SFlow> {

        constructor(init?: SFlowDropBoxInit) {
            super(new SFlow(),init);
            this.setMarkerOrientation('horizontal');
            if (init) {
                if (init.stretchMaxRatio !== undefined)
                    this.stretchMaxRatio = init.stretchMaxRatio;
                if (init.uniform !== undefined)
                    this.uniform = init.uniform;
                if (init.uniformRatio !== undefined)
                    this.uniformRatio = init.uniformRatio;
                if (init.itemAlign !== undefined)
                    this.itemAlign = init.itemAlign;
                if (init.spacing !== undefined)
                    this.spacing = init.spacing;
            }
        }

        set stretchMaxRatio(ratio: number) {
            this.container.stretchMaxRatio = ratio;
        }

        set uniform(uniform: boolean) {
            this.container.uniform = uniform;
        }

        set uniformRatio(uniformRatio: number) {
            this.container.uniformRatio = uniformRatio;
        }

        set itemAlign(align: SFlowAlign) {
            this.container.itemAlign = align;
        }

        set spacing(spacing: number) {
            this.container.spacing = spacing;
        }
    }

    export interface VDropBoxInit extends DropAtBoxInit<VBox> {
        spacing?: number
    }

    export class VDropBox extends DropAtBox<VBox> {

        constructor(init?: VDropBoxInit) {
            super(
                new VBox().assign({ spacing: init && init.spacing ? init.spacing : 0 }),
                init
            );
            this.setMarkerOrientation('vertical');
        }

        set uniform(uniform: boolean) {
            this.container.uniform = uniform;
        }

        set spacing(spacing: number) {
            this.container.spacing = spacing;
        }
    }

    export interface HDropBoxInit extends DropAtBoxInit<HBox> { }

    export class HDropBox extends DropAtBox<HBox> {

        constructor(init?: HDropBoxInit) {
            super(new HBox(),init);
            this.setMarkerOrientation('horizontal');
        }

        set uniform(uniform: boolean) {
            this.container.uniform = uniform;
        }

        set spacing(spacing: number) {
            this.container.spacing = spacing;
        }
    }
}