namespace Ui {
    export interface SelectionAreaInit extends Ui.LBoxInit {
    }

    export class SelectionArea extends Ui.LBox implements SelectionAreaInit {
        watcher: Ui.PointerWatcher | undefined;
        rectangle: Ui.Rectangle;
        startPos: Ui.Point;
        private shiftStart: Ui.Selectionable;

        constructor(init?: Partial<SelectionAreaInit>) {
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

        private findAreaElements(p1: Ui.Point, p2: Ui.Point): Array<Ui.Selectionable> {
            let res = new Array<Ui.Selectionable>();

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
                if (el instanceof Ui.Selectionable) {
                    if (intersect(el))
                        res.push(el);
                }
                else if (el instanceof Ui.Container)
                    el.children.forEach(el2 => addSelectionable(el2));
            };
            addSelectionable(this);

            // sort from the distance to p2 (release area selection)
            res = res.sort((a, b) => {
                let m = a.transformToElement(this);
                let c1 = (new Ui.Point(a.layoutWidth / 2, a.layoutHeight / 2)).multiply(m);
                let d1 = Math.sqrt(Math.pow((c1.x - p2.x), 2) + Math.pow((c1.y - p2.y), 2));
                
                m = b.transformToElement(this);
                let c2 = (new Ui.Point(b.layoutWidth / 2, b.layoutHeight / 2)).multiply(m);
                let d2 = Math.sqrt(Math.pow((c2.x - p2.x), 2) + Math.pow((c2.y - p2.y), 2));

                return d2 - d1;
            });

            return res;
        }
    
        private findSelectionableElements(): Array<Ui.Selectionable> {
            let res = new Array<Ui.Selectionable>();

            let addSelectionable = (el: Ui.Element) => {
                if (el instanceof Ui.Selectionable) {
                    res.push(el);
                }
                else if (el instanceof Ui.Container)
                    el.children.forEach(el2 => addSelectionable(el2));
            };
            addSelectionable(this);
            return res;
        }
    
        private findMatchSelectionable(
            element: Ui.Selectionable,
            filter: (p: Ui.Point, s: { width: number, height: number }, c: Ui.Point,
                pe: Ui.Point, se: { width: number, height: number }, ce: Ui.Point) => boolean
        ): Ui.Selectionable | undefined {
            let all = this.findSelectionableElements();
            if (all.length == 0)
                return undefined;
                    
            let m = element.transformToElement(this);
            let p1 = (new Ui.Point(0, 0)).multiply(m);
            let p2 = (new Ui.Point(element.layoutWidth, element.layoutHeight)).multiply(m);
            let p = new Ui.Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
            let s = { width: Math.abs(p1.x - p2.x), height: Math.abs(p1.y - p2.y) };
            let c = new Ui.Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);

            let distance = 0;
            let found: Ui.Selectionable | undefined;

            all.forEach((el) => {
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
                    found = el;
                }
            });
            return found;
        }

        private findRightSelectionable(element: Ui.Selectionable): Ui.Selectionable | undefined {
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

        private findLeftSelectionable(element: Ui.Selectionable): Ui.Selectionable | undefined {
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

        private findBottomSelectionable(element: Ui.Selectionable): Ui.Selectionable | undefined {
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

        private findTopSelectionable(element: Ui.Selectionable): Ui.Selectionable | undefined {
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
                    let els = selection.elements;
                    let res2 = new Array<Selectionable>();
                    els.forEach(el => {
                        if (res.indexOf(el) == -1)
                            res2.push(el);
                    });
                    res.forEach(el => {
                        if (els.indexOf(el) == -1)
                            res2.push(el);    
                    });
                    selection.elements = res2;
                }
                // set the current selection    
                else
                    selection.elements = res;

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

            if ((event.which >= 37 && event.which <= 40) || event.which == 65 || event.which == 16) {
                let selection = this.getParentSelectionHandler();
                if (!selection)
                    return;

                let ours = new Array<Ui.Selectionable>();
                ours = selection.elements.filter((el) => el.getIsChildOf(this));    

                if (ours.length == 0)
                    return;
                
                let focusElement = ours.find(el => el.hasFocus);
                if (!focusElement)
                    focusElement = ours[0];    
        
                let found: Ui.Selectionable | undefined;
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

                    let shiftStart = this.shiftStart || focusElement;

                    if (event.shiftKey)
                        selection.elements = selection.findRangeElements(shiftStart, found);
                    else
                        selection.elements = [found];
                    if (found.focusable)
                        found.focus();    
                }
                // Ctrl + A
                if (event.which == 65 && event.ctrlKey)
                    selection.elements = this.findSelectionableElements();
                // Shift
                if (event.which == 16)
                    this.shiftStart = focusElement;
            }
        }
    }
}