"use strict";
/// <reference path="../../era/era.d.ts" />
let scl = new Ui.NativeScrollingArea();
new Ui.App().assign({
    content: new Ui.VBox().assign({
        content: [
            new Ui.ToolBar().assign({
                content: [
                    new Ui.Button().assign({
                        text: 'top left',
                        onpressed: () => scl.setOffset(0, 0)
                    }),
                    new Ui.Button().assign({
                        text: 'bottom right',
                        onpressed: () => scl.setOffset(1, 1)
                    })
                ]
            }),
            scl.assign({
                resizable: true,
                content: new Ui.Grid().assign({
                    cols: 'auto,auto,auto',
                    rows: 'auto,auto,auto,auto',
                    content: [
                        {
                            child: new Ui.Rectangle().assign({ width: 200, height: 400, fill: 'lightgreen' }),
                            col: 0, row: 0
                        },
                        {
                            child: new Ui.Rectangle().assign({ width: 200, height: 400, fill: 'lightblue' }),
                            col: 0, row: 1
                        },
                        {
                            child: new Ui.Rectangle().assign({ width: 200, height: 400, fill: 'purple' }),
                            col: 1, row: 0
                        },
                        {
                            child: new Ui.Button().assign({
                                width: 200, height: 200, text: 'fun',
                                onpressed: () => console.log('grid button press')
                            }),
                            col: 1, row: 1
                        },
                        {
                            child: new Ui.Rectangle().assign({ width: 400, height: 400, fill: 'pink' }),
                            col: 2, row: 0
                        },
                        {
                            child: new Ui.TextAreaField(),
                            col: 2, row: 1
                        },
                        {
                            child: new Ui.Rectangle().assign({ width: 200, height: 400, fill: 'orange' }),
                            col: 0, row: 2, colSpan: 3, rowSpan: 1
                        },
                        {
                            child: new Ui.Text().assign({
                                text: 'Hello Daniel'
                            }),
                            col: 0, row: 3, colSpan: 3
                        }
                    ]
                })
            })
        ]
    })
});
