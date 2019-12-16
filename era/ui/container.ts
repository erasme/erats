namespace Ui
{
    export interface ContainerInit extends ElementInit {
    }

    export class Container extends Element implements ContainerInit
    {
        private _children: Element[];
        private _containerDrawing: any = undefined;

        constructor(init?: ContainerInit) {
            super(init);
            this._children = [];
            if (this._containerDrawing === undefined)
                this._containerDrawing = this.drawing;
        }

        get containerDrawing() {
            return this._containerDrawing;
        }

        set containerDrawing(containerDrawing) {
            this._containerDrawing = containerDrawing;
        }

        //
        // Add a child in the container at the end
        //
        appendChild(child: Element) {
            child.parent = this;
            this._children.push(child);
            this._containerDrawing.appendChild(child.drawing);
            child.isLoaded = this.isLoaded;
            child.parentVisible = this.isVisible;
            child.parentDisabled = this.isDisabled;
            this.onChildInvalidateMeasure(child, 'add');
        }

        //
        // Add a child in the container at the begining
        //
        prependChild(child: Element) {
            child.parent = this;
            this._children.unshift(child);
            if (this._containerDrawing.firstChild !== undefined)
                this._containerDrawing.insertBefore(child.drawing, this._containerDrawing.firstChild);
            else
                this._containerDrawing.appendChild(child.drawing);
            child.isLoaded = this.isLoaded;
            child.parentVisible = this.isVisible;
            child.parentDisabled = this.isDisabled;
            this.onChildInvalidateMeasure(child, 'add');
        }

        //
        // Remove a child element from the current container
        //
        removeChild(child: Element) {
            if (child == undefined)
                return;
            child.parent = undefined;
            if (child.drawing != undefined && child.drawing.parentNode == this._containerDrawing)
                this._containerDrawing.removeChild(child.drawing);
            let i = 0;
            while ((i < this._children.length) && (this._children[i] !== child)) { i++; }
            if (i < this._children.length)
                this._children.splice(i, 1);
            child.isLoaded = false;
            child.parentVisible = false;
            this.onChildInvalidateMeasure(child, 'remove');
        }

        //
        // Insert a child element in the current container at the given position
        //
        insertChildAt(child: Element, position: number) {
            position = Math.max(0, Math.min(position, this._children.length));

            child.parent = this;
            this._children.splice(position, 0, child);
            if ((this._containerDrawing.firstChild !== undefined) && (position < this._children.length - 1))
                this._containerDrawing.insertBefore(child.drawing, this._containerDrawing.childNodes[position]);
            else
                this._containerDrawing.appendChild(child.drawing);
            child.isLoaded = this.isLoaded;
            child.parentVisible = this.isVisible;
            child.parentDisabled = this.isDisabled;
            this.onChildInvalidateMeasure(child, 'add');
        }

        insertChildBefore(child: Element, beforeChild: Element) {
            this.insertChildAt(child, this.getChildPosition(beforeChild));
        }

        //
        // Move a child from its current position to
        // the given position. Negative value allow
        // to specify position from the end.
        //
        moveChildAt(child: Element, position: number) {
            if (position < 0)
                position = this._children.length + position;
            if (position < 0)
                position = 0;
            if (position >= this._children.length)
                position = this._children.length;
            let i = 0;
            while ((i < this._children.length) && (this._children[i] !== child)) { i++; }
            if (i < this._children.length) {
                this._children.splice(i, 1);
                this._children.splice(position, 0, child);
                this._containerDrawing.removeChild(child.drawing);
                if ((this._containerDrawing.firstChild !== undefined) && (position < this._containerDrawing.childNodes.length))
                    this._containerDrawing.insertBefore(child.drawing, this._containerDrawing.childNodes[position]);
                else
                    this._containerDrawing.appendChild(child.drawing);
            }
            this.onChildInvalidateMeasure(child, 'move');
        }

        //
        // @return An array of children.
        // ATTENTION: use it only in READ ONLY
        //
        get children(): Element[] {
            return this._children;
        }

        //
        // @return the first child or undefined
        // if the container has no children
        //
        get firstChild(): Element | undefined {
            if (this._children.length > 0)
                return this._children[0];
            else
                return undefined;
        }

        //
        // @return the last child or undefined
        // if the container has no children
        //
        get lastChild(): Element | undefined {
            if (this._children.length > 0)
                return this._children[this._children.length - 1];
            else
                return undefined;
        }

        //
        // @return the child position in the container or
        // -1 if the container does not have this child
        //
        getChildPosition(child: Element): number {
            for (let i = 0; i < this._children.length; i++) {
                if (this._children[i] === child) {
                    return i;
                }
            }
            return -1;
        }

        //
        // @return true if the element passed is one of the container's children
        //
        hasChild(child: Element): boolean {
            return this.getChildPosition(child) !== -1;
        }

        //
        // Remove all the container's children
        //
        clear() {
            while (this.firstChild !== undefined) {
                this.removeChild(this.firstChild);
            }
        }

        get(name: string): Element | undefined {
            if (this.name == name)
                return this;
            else {
                for (let i = 0; i < this._children.length; i++) {
                    let child = this._children[i];
                    let res = child.get(name);
                    if (res != undefined)
                        return res;
                }
            }
            return undefined;
        }

        protected onLoad() {
            super.onLoad();
            for (let i = 0; i < this._children.length; i++)
                    this._children[i].isLoaded = this.isLoaded;
        }

        protected onUnload() {
            super.onUnload();
            for (let i = 0; i < this._children.length; i++)
                    this._children[i].isLoaded = this.isLoaded;
        }

        protected onInternalStyleChange() {
            if (!this.isLoaded)
                return;
            this.onStyleChange();
            if (this._children !== undefined) {
                for (let i = 0; i < this._children.length; i++)
                    this._children[i].setParentStyle(this.mergeStyle);
            }
        }

        protected onInternalDisable() {
            super.onInternalDisable();
            if (this._children) {
                for (let i = 0; i < this._children.length; i++)
                    this._children[i].setParentDisabled(true);
            }
        }

        protected onInternalEnable() {
            super.onInternalEnable();
            if (this._children) {
                for (let i = 0; i < this._children.length; i++)
                    this._children[i].setParentDisabled(false);
            }
        }

        protected onInternalVisible() {
            super.onInternalVisible();
            if (this._children) {
                for (let i = 0; i < this._children.length; i++)
                    this._children[i].parentVisible = true;
            }
        }

        protected onInternalHidden() {
            super.onInternalHidden();
            if (this._children) {
                for (let i = 0; i < this._children.length; i++)
                    this._children[i].parentVisible = false;
            }
        }
    }
}
