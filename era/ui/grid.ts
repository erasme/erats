namespace Ui {

    interface GridCol {
        auto: boolean;
        star: boolean;
        absolute: boolean;
        actualWidth: number;
        offset: number;
        width: number;
    }

    interface GridRow {
        auto: boolean;
        star: boolean;
        absolute: boolean;
        actualHeight: number;
        offset: number;
        height: number;
    }

    export interface GridInit extends ContainerInit {
        cols?: string;
        rows?: string;
    }
    
    export class Grid extends Container implements GridInit {

        private _cols: GridCol[];
        private _rows: GridRow[];

        constructor(init?: GridInit) {
            super(init);
            this._cols = [{ auto: true, star: false, absolute: false, actualWidth: 0, offset: 0, width: 0 }];
            this._rows = [{ auto: true, star: false, absolute: false, actualHeight: 0, offset: 0, height: 0 }];
            if (init) {
                if (init.cols !== undefined)
                    this.cols = init.cols;	
                if (init.rows !== undefined)
                    this.rows = init.rows;	
            }
        }

        set cols(colsDef: string) {
            this._cols = [];
            let cols = colsDef.split(',');
            for (let i = 0; i < cols.length; i++) {
                let col = cols[i];
                if (col == 'auto')
                    this._cols.push({ auto: true, star: false, absolute: false, actualWidth: 0, offset: 0, width: 0 });
                else if (col == '*')
                    this._cols.push({ auto: false, star: true, absolute: false, actualWidth: 0, offset: 0, width: 1 });
                else if (col.match(/^[0-9]+\.?[0-9]*\*$/))
                    this._cols.push({ auto: false, star: true, absolute: false, actualWidth: 0, offset: 0, width: parseInt(col.slice(0, col.length - 1)) });
                else if (col.match(/^[0-9]+$/))
                    this._cols.push({ auto: false, star: false, absolute: true, actualWidth: 0, offset: 0, width: parseInt(col) });
                else if (DEBUG)
                    throw ('Ui.Grid column definition "' + col + '" not supported');
            }
            //this.invalidateMeasure();
        }

        set rows(rowsDef: string) {
            this._rows = [];
            let rows = rowsDef.split(',');
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                if (row == 'auto')
                    this._rows.push({ auto: true, star: false, absolute: false, actualHeight: 0, offset: 0, height: 0 });
                else if (row == '*')
                    this._rows.push({ auto: false, star: true, absolute: false, actualHeight: 0, offset: 0, height: 1 });
                else if (row.match(/^[0-9]+\.?[0-9]*\*$/))
                    this._rows.push({ auto: false, star: true, absolute: false, actualHeight: 0, offset: 0, height: parseInt(row.slice(0, row.length - 1)) });
                else if (row.match(/^[0-9]+$/))
                    this._rows.push({ auto: false, star: false, absolute: true, actualHeight: 0, offset: 0, height: parseInt(row) });
                else if (DEBUG)
                    throw ('Ui.Grid row definition "' + row + '" not supported');
            }
        }

        setContent(content) {
            while (this.firstChild !== undefined)
                this.removeChild(this.firstChild);
            if ((content !== undefined) && (typeof (content) === 'object')) {
                if (content.constructor == Array) {
                    for (let i = 0; i < content.length; i++)
                        this.appendChild(content[i]);
                }
                else
                    this.appendChild(content);
            }
        }

        //
        // Attach a given child on the grid
        //
        attach(child: Element, col: number, row: number, colSpan: number = 1, rowSpan: number = 1) {
            Grid.setCol(child, col);
            Grid.setRow(child, row);
            Grid.setColSpan(child, colSpan);
            Grid.setRowSpan(child, rowSpan);
            this.appendChild(child);
        }

        //
        // Remove a given child from the grid
        //
        detach(child: Element) {
            this.removeChild(child);
        }

        private getColMin(colPos) {
            let i; let i2; let currentColumn;
            let col = this._cols[colPos];
            let min = 0;
            for (i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                let childCol = Ui.Grid.getCol(child);
                let childColSpan = Ui.Grid.getColSpan(child);
                
                if ((childColSpan == 1) && (childCol == colPos)) {
                    if (child.measureWidth > min)
                        min = child.measureWidth;
                }
                else if ((childCol <= colPos) && (childCol + childColSpan > colPos)) {
                    let isLastAuto = true;
                    let hasStar = false;
                    let prev = 0.0;
                    
                    for (i2 = childCol; i2 < colPos; i2++) {
                        currentColumn = this._cols[i2];
                        prev += currentColumn.actualWidth;
                        if (currentColumn.star) {
                            hasStar = true;
                            break;
                        }
                    }
                
                    if (!hasStar) {
                        for (i2 = colPos + 1; i2 < childCol + childColSpan; i2++) {
                            currentColumn = this._cols[i2];
                            if (currentColumn.star) {
                                hasStar = true;
                                break;
                            }
                            if (currentColumn.auto) {
                                isLastAuto = false;
                                break;
                            }
                        }
                    }
                    if (!hasStar && isLastAuto) {
                        if ((child.measureWidth - prev) > min)
                            min = child.measureWidth - prev;
                    }
                }
            }
            return min;
        }

        private getRowMin(rowPos) {
            let i; let i2; let currentRow;
            let row = this._rows[rowPos];
            let min = 0;

            for (i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                let childRow = Ui.Grid.getRow(child);
                let childRowSpan = Ui.Grid.getRowSpan(child);
            
                if ((childRowSpan == 1) && (childRow == rowPos)) {
                    if (child.measureHeight > min)
                        min = child.measureHeight;
                }
                else if ((childRow <= rowPos) && (childRow + childRowSpan > rowPos)) {
                    let isLastAuto = true;
                    let hasStar = false;
                    let prev = 0.0;
                
                    for (i2 = childRow; i2 < rowPos; i2++) {
                        currentRow = this._rows[i2];
                        prev += currentRow.actualHeight;
                        if (currentRow.star) {
                            hasStar = true;
                            break;
                        }
                    }

                    if (!hasStar) {
                        for (i2 = rowPos + 1; i2 < childRow + childRowSpan; i2++) {
                            currentRow = this._rows[i2];
                            if (currentRow.star) {
                                hasStar = true;
                                break;
                            }
                            if (currentRow.auto) {
                                isLastAuto = false;
                                break;
                            }
                        }
                    }
                    if (!hasStar && isLastAuto) {
                        if ((child.measureHeight - prev) > min)
                            min = child.measureHeight - prev;
                    }
                }
            }
            return min;
        }

        protected measureCore(width: number, height: number) {
            let i; let child; let col; let colSpan; let colPos;
            let childX; let childWidth; let x; let row; let rowPos;

            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                let constraintWidth = (width * Ui.Grid.getColSpan(child)) / this._cols.length;
                let constraintHeight = (height * Ui.Grid.getRowSpan(child)) / this._rows.length;
                child.measure(constraintWidth, constraintHeight);
            }

            let colStarCount = 0.0;
            let colStarSize = 0.0;
            let rowStarCount = 0.0;
            let rowStarSize = 0.0;
            
            let offsetX = 0;
            for (colPos = 0; colPos < this._cols.length; colPos++) {
                col = this._cols[colPos];
                col.offset = offsetX;
                if (col.absolute)
                    col.actualWidth += col.width;
                else if (col.star) {
                    col.actualWidth = 0;
                    colStarCount += col.width;
                }
                else if (col.auto) {
                    col.actualWidth = this.getColMin(colPos);
                }
                offsetX += col.actualWidth;
            }

            // propose a star width
            let starWidth = 0.0;
            if (colStarCount > 0.0)
                starWidth = (width - offsetX) / colStarCount;

            // update to column auto with the proposed star width
            offsetX = 0;
            for (i = 0; i < this._cols.length; i++) {
                col = this._cols[i];
                col.offset = offsetX;
                if (col.star)
                    col.actualWidth = starWidth * col.width;
                offsetX += col.actualWidth;
            }

            // redo the element measure with the correct width constraint
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                col = Ui.Grid.getCol(child);
                colSpan = Ui.Grid.getColSpan(child);
                
                childX = this._cols[col].offset;
                childWidth = 0.0;
                
                for (x = col; x < col + colSpan; x++)
                    childWidth += this._cols[x].actualWidth;

                child.measure(childWidth, height);
            }
            
            // redo the width measure with the new element measure
            offsetX = 0;
            for (colPos = 0; colPos < this._cols.length; colPos++) {
                col = this._cols[colPos];
                col.offset = offsetX;
                if (col.absolute) {
                    col.actualWidth = col.width;
                }
                else if (col.star) {
                    col.actualWidth = Math.max(this.getColMin(colPos), starWidth * col.width);
                    colStarSize += col.actualWidth;
                }
                else if (col.auto) {
                    col.actualWidth = this.getColMin(colPos);
                }
                offsetX += col.actualWidth;
            }
                        
            // redo the element measure with the correct width constraint
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                col = Ui.Grid.getCol(child);
                colSpan = Ui.Grid.getColSpan(child);
                
                childX = this._cols[col].offset;
                childWidth = 0.0;
                
                for (x = col; x < col + colSpan; x++)
                    childWidth += this._cols[x].actualWidth;

                child.measure(childWidth, height);
            }
        
            // do the height measure
            let offsetY = 0;
            for (rowPos = 0; rowPos < this._rows.length; rowPos++) {
                row = this._rows[rowPos];
                row.offset = offsetY;
                if (row.absolute)
                    row.actualHeight = row.height;
                else if (row.star) {
                    row.actualHeight = 0;
                    rowStarCount += row.height;
                }
                else if (row.auto)
                    row.actualHeight = this.getRowMin(rowPos);
                offsetY += row.actualHeight;
            }
        
            // propose a star height
            let starHeight = 0.0;
            if (rowStarCount > 0.0)
                starHeight = (height - offsetY) / rowStarCount;
            
            // update to column with the proposed star width
            offsetY = 0;
            for (i = 0; i < this._rows.length; i++) {
                row = this._rows[i];
                row.offset = offsetY;
                if (row.star)
                    row.actualHeight = starHeight * row.height;
                offsetY += row.actualHeight;
            }
            
            // redo the element measure height the correct height constraint
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                col = Ui.Grid.getCol(child);
                colSpan = Ui.Grid.getColSpan(child);
                
                childX = this._cols[col].offset;
                childWidth = 0.0;
                
                for (x = col; x < col + colSpan; x++)
                    childWidth += this._cols[x].actualWidth;
                
                row = Ui.Grid.getRow(child);
                let rowSpan = Ui.Grid.getRowSpan(child);
            
                let childY = this._rows[row].offset;
                let childHeight = 0.0;
                
                for (let y = row; y < row + rowSpan; y++)
                    childHeight += this._rows[y].actualHeight;

                child.measure(childWidth, childHeight);
            }
                
            // redo the height measure with the new element measure
            offsetY = 0;
            for (rowPos = 0; rowPos < this._rows.length; rowPos++) {
                row = this._rows[rowPos];
                row.offset = offsetY;
                if (row.absolute) {
                    row.actualHeight = row.height;
                }
                else if (row.star) {
                    let rowMin = this.getRowMin(rowPos);
                    row.actualHeight = Math.max(rowMin, starHeight * row.height);
                    rowStarSize += row.actualHeight;
                }
                else if (row.auto) {
                    row.actualHeight = this.getRowMin(rowPos);
                }
                offsetY += row.actualHeight;
            }
            return { width: offsetX, height: offsetY };
        }

        protected arrangeCore(width, height) {
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                let col = Ui.Grid.getCol(child);
                let colSpan = Ui.Grid.getColSpan(child);
                let row = Ui.Grid.getRow(child);
                let rowSpan = Ui.Grid.getRowSpan(child);
                
                let childX = this._cols[col].offset;
                let childY = this._rows[row].offset;
                let childWidth = 0.0;
                let childHeight = 0.0;
                
                for (let x = col; x < col + colSpan; x++)
                    childWidth += this._cols[x].actualWidth;
                for (let y = row; y < row + rowSpan; y++)
                    childHeight += this._rows[y].actualHeight;
            
                child.arrange(childX, childY, childWidth, childHeight);
            }
        }

        static getCol(child) {
            return (child['Ui.Grid.col'] !== undefined) ? child['Ui.Grid.col'] : 0;
        }

        static setCol(child, col) {
            if (Ui.Grid.getCol(child) != col) {
                child['Ui.Grid.col'] = col;
                child.invalidateMeasure();
            }
        }

        static getRow(child) {
            return (child['Ui.Grid.row'] !== undefined) ? child['Ui.Grid.row'] : 0;
        }

        static setRow(child, row) {
            if (Ui.Grid.getRow(child) !== row) {
                child['Ui.Grid.row'] = row;
                child.invalidateMeasure();
            }
        }

        static getColSpan(child) {
            return (child['Ui.Grid.colSpan'] !== undefined) ? child['Ui.Grid.colSpan'] : 1;
        }

        static setColSpan(child, colSpan) {
            if (Ui.Grid.getColSpan(child) !== colSpan) {
                child['Ui.Grid.colSpan'] = colSpan;
                child.invalidateMeasure();
            }
        }

        static getRowSpan(child) {
            return (child['Ui.Grid.rowSpan'] !== undefined) ? child['Ui.Grid.rowSpan'] : 1;
        }

        static setRowSpan(child, rowSpan) {
            if (Ui.Grid.getRowSpan(child) !== rowSpan) {
                child['Ui.Grid.rowSpan'] = rowSpan;
                child.invalidateMeasure();
            }
        }
    }
}	
