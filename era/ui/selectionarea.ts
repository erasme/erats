namespace Ui {
    export interface SelectionAreaInit extends Ui.LBoxInit {
    }

    export class SelectionArea extends Ui.LBox implements SelectionAreaInit {
        watcher: Ui.PointerWatcher | undefined;
        rectangle: Ui.Rectangle;
        startPos: Ui.Point;
        private shiftStart: Ui.SelectionableWatcher;

        constructor(init?: SelectionAreaInit) {
            super(init);

            // handle pointers
            this.connect(this, 'ptrdown', this.onPointerDown);
        
            // handle keyboard
            this.connect(this.drawing, 'keydown', this.onKeyDown);
        }

        getParentSelectionHandler(): Ui.Selection | undefined {
            // search for the selection handler
            let parent: Ui.Element = this.parent;
            while (parent !== undefined) {
                if ('getSelectionHandler' in parent)
                    return (parent as any).getSelectionHandler();
                parent = parent.parent;
            }
            return undefined;
        }

        private findAreaElements(p1: Ui.Point, p2: Ui.Point): Array<Ui.SelectionableWatcher> {
            let res = new Array<Ui.SelectionableWatcher>();

            let p = new Ui.Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
            let s = { width: Math.abs(p1.x - p2.x), height: Math.abs(p1.y - p2.y) };

            let intersect = (el: Ui.Element) => {
                let m = el.transformToElement(this);
                let pe1 = (new Ui.Point(0, 0)).multiply(m);
                let pe2 = (new Ui.Point(el.layoutWidth, el.layoutHeight)).multiply(m);
                let pe = new Ui.Point(Math.min(pe1.x, pe2.x), Math.min(pe1.y, pe2.y));
                let se = { width: Math.abs(pe1.x - pe2.x), height: Math.abs(pe1.y - pe2.y) };
            
                let hoverlap = (p.x < pe.x + se.width) && (pe.x < p.x + s.width);
                let voverlap = (p.y < pe.y + se.height) && (pe.y < p.y + s.height);
                return hoverlap && voverlap;
            };

            let addSelectionable = (el: Ui.Element) => {
                let watcher = Ui.SelectionableWatcher.getSelectionableWatcher(el);
                if (watcher) {
                    if (intersect(watcher.element))
                        res.push(watcher);
                }
                else if (el instanceof Ui.Container)
                    el.children.forEach(el2 => addSelectionable(el2));
            };
            addSelectionable(this);

            // sort from the distance to p2 (release area selection)
            res = res.sort((a, b) => {
                let m = a.element.transformToElement(this);
                let c1 = (new Ui.Point(a.element.layoutWidth / 2, a.element.layoutHeight / 2)).multiply(m);
                let d1 = Math.sqrt(Math.pow((c1.x - p2.x), 2) + Math.pow((c1.y - p2.y), 2));
                
                m = b.element.transformToElement(this);
                let c2 = (new Ui.Point(b.element.layoutWidth / 2, b.element.layoutHeight / 2)).multiply(m);
                let d2 = Math.sqrt(Math.pow((c2.x - p2.x), 2) + Math.pow((c2.y - p2.y), 2));

                return d2 - d1;
            });

            return res;
        }
    
        private findSelectionableWatchers(): Array<Ui.SelectionableWatcher> {
            let res = new Array<Ui.SelectionableWatcher>();

            let addSelectionable = (el: Ui.Element) => {
                let watcher = Ui.SelectionableWatcher.getSelectionableWatcher(el);
                if (watcher)
                    res.push(watcher);
                else if (el instanceof Ui.Container)
                    el.children.forEach(el2 => addSelectionable(el2));
            };
            addSelectionable(this);
            return res;
        }
    
        private findMatchSelectionable(
            element: Ui.Element,
            filter: (p: Ui.Point, s: { width: number, height: number }, c: Ui.Point,
                pe: Ui.Point, se: { width: number, height: number }, ce: Ui.Point) => boolean
        ): Ui.SelectionableWatcher | undefined {
            let all = this.findSelectionableWatchers();
            if (all.length == 0)
                return undefined;
                    
            let m = element.transformToElement(this);
            let p1 = (new Ui.Point(0, 0)).multiply(m);
            let p2 = (new Ui.Point(element.layoutWidth, element.layoutHeight)).multiply(m);
            let p = new Ui.Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
            let s = { width: Math.abs(p1.x - p2.x), height: Math.abs(p1.y - p2.y) };
            let c = new Ui.Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);

            let distance = 0;
            let found: Ui.SelectionableWatcher | undefined;

            all.forEach((w) => {
                let el = w.element;
                let m = el.transformToElement(this);
                let pe1 = (new Ui.Point(0, 0)).multiply(m);
                let pe2 = (new Ui.Point(el.layoutWidth, el.layoutHeight)).multiply(m);
                let pe = new Ui.Point(Math.min(pe1.x, pe2.x), Math.min(pe1.y, pe2.y));
                let se = { width: Math.abs(pe1.x - pe2.x), height: Math.abs(pe1.y - pe2.y) };
                let ce = new Ui.Point((pe1.x + pe2.x) / 2, (pe1.y + pe2.y) / 2);

                if (!filter(p, s, c, pe, se, ce))
                    return;
                let d = Math.sqrt(Math.pow((c.x - ce.x), 2) + Math.pow((c.y - ce.y), 2));
                if (!found || d < distance) {
                    distance = d;
                    found = w;
                }
            });
            return found;
        }

        private findRightSelectionable(element: Ui.Element): Ui.SelectionableWatcher | undefined {
            return this.findMatchSelectionable(element,
                (p, s, c, pe, se, ce) => {
                    if (pe.x < p.x + s.width)
                        return false;
                    let voverlap = (p.y < pe.y + se.height) && (pe.y < p.y + s.height);
                    if (!voverlap)
                        return false;
                    return true;
                });
        }

        private findLeftSelectionable(element: Ui.Element): Ui.SelectionableWatcher | undefined {
            return this.findMatchSelectionable(element,
                (p, s, c, pe, se, ce) => {
                    if (pe.x + se.width > p.x)
                        return false;
                    let voverlap = (p.y < pe.y + se.height) && (pe.y < p.y + s.height);
                    if (!voverlap)
                        return false;
                    return true;
                });
        }

        private findBottomSelectionable(element: Ui.Element): Ui.SelectionableWatcher | undefined {
            return this.findMatchSelectionable(element,
                (p, s, c, pe, se, ce) => {
                    if (p.y + s.height > pe.y)
                        return false;
                    let hoverlap = (p.x < pe.x + se.width) && (pe.x < p.x + s.width);
                    if (!hoverlap)
                        return false;
                    return true;
                });
        }

        private findTopSelectionable(element: Ui.Element): Ui.SelectionableWatcher | undefined {
            return this.findMatchSelectionable(element,
                (p, s, c, pe, se, ce) => {
                    if (pe.y + se.height > p.y)
                        return false;
                    let hoverlap = (p.x < pe.x + se.width) && (pe.x < p.x + s.width);
                    if (!hoverlap)
                        return false;
                    return true;
                });
        }

        private onPointerDown(event: Ui.PointerEvent) {
            if (this.watcher != undefined)
                return;
            if (event.pointerType == 'mouse' && event.pointer.button == 0) {
                this.watcher = event.pointer.watch(this);
                this.connect(this.watcher, 'move', this.onPtrMove);
                this.connect(this.watcher, 'up', this.onPtrUp);
                this.connect(this.watcher, 'cancel', () => this.watcher = undefined);
            }
        }

        private onPtrUp(watcher: Ui.PointerWatcher) {
            // selection end
            if (watcher.getIsCaptured()) {
                let endPos = watcher.pointer.getPosition(this);
                let res = this.findAreaElements(this.startPos, endPos);
                let selection = this.getParentSelectionHandler();

                // Shift = selection append
                if (watcher.pointer.shiftKey)
                    selection.append(res);
                // Ctrl = selection append the inverted selection status
                else if (watcher.pointer.ctrlKey) {
                    let watchers = selection.watchers;
                    let res2 = new Array<SelectionableWatcher>();
                    watchers.forEach(w => {
                        if (res.indexOf(w) == -1)
                            res2.push(w);
                    });
                    res.forEach(w => {
                        if (watchers.indexOf(w) == -1)
                            res2.push(w);    
                    });
                    selection.watchers = res2;
                }
                // set the current selection    
                else
                    selection.watchers = res;

                if (this.rectangle.parent == this)
                    this.remove(this.rectangle);
            }
            // click only
            else if (watcher.getIsInside() && !watcher.pointer.getIsMove()) {
                let selection = this.getParentSelectionHandler();
                if (selection)
                    selection.clear();
                let sel: Selection;
            }
            if (this.watcher)
                this.watcher.cancel();
        }

        private onPtrMove(watcher: Ui.PointerWatcher) {
            if (!watcher.getIsCaptured()) {
                if (watcher.pointer.getIsMove()) {
                    watcher.capture();
                    this.startPos = watcher.pointer.getPosition(this);
                    this.rectangle = new Ui.Rectangle({
                        width: 0, height: 0,
                        fill: 'rgba(0,0,0,0.1)'
                    });
                
                    this.append(this.rectangle);
                }
            }
            else {
                let movePos = watcher.pointer.getPosition(this);
                this.rectangle.arrange(
                    Math.min(movePos.x, this.startPos.x),
                    Math.min(movePos.y, this.startPos.y),
                    Math.abs(movePos.x - this.startPos.x),
                    Math.abs(movePos.y - this.startPos.y));
            }

        }

        private onKeyDown(event: KeyboardEvent) {
            console.log(`onKeyDown ${event.which}`);

            if ((event.which >= 37 && event.which <= 40) || event.which == 65 || event.which == 16 || event.which == 46) {
                let selection = this.getParentSelectionHandler();
                if (!selection)
                    return;

                let ours = new Array<Ui.SelectionableWatcher>();
                ours = selection.watchers.filter((w) => w.element.getIsChildOf(this));

                if (ours.length == 0)
                    return;
                
                let focusElement: Ui.Element;
                let focusWatcher = ours.find(w => w.element.hasFocus);
                if (!focusWatcher)
                    focusWatcher = ours[0];
                focusElement = focusWatcher.element;
        
                let found: Ui.SelectionableWatcher | undefined;
                // left (37)
                if (event.which == 37) {
                    found = this.findLeftSelectionable(focusElement);
                }
                // right (39)
                else if (event.which == 39) {
                    found = this.findRightSelectionable(focusElement);
                }
                // up (38)
                else if (event.which == 38) {
                    found = this.findTopSelectionable(focusElement);
                }
                // down (40)
                else if (event.which == 40) {
                    found = this.findBottomSelectionable(focusElement);
                }
                if (found) {
                    event.stopPropagation();
                    event.preventDefault();

                    let shiftStart = this.shiftStart || focusWatcher;

                    if (event.shiftKey)
                        selection.watchers = selection.findRangeElements(shiftStart, found);
                    else
                        selection.watchers = [found];
                    if (found.element.focusable)
                        found.element.focus();
                }
                // Ctrl + A
                if (event.which == 65 && event.ctrlKey)
                    selection.watchers = this.findSelectionableWatchers();
                // Shift
                if (event.which == 16)
                    this.shiftStart = focusWatcher;
                // Del
                if (event.which == 46)
                    selection.executeDeleteAction();    
            }
        }
    }
}