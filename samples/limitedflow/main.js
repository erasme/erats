"use strict";
/// <reference path="../../era/era.d.ts" />
new Ui.App({
    content: new Ui.VBox().assign({
        content: [
            new Ui.TextField().assign({
                onvalidated: function (e) {
                    var lflow = Ui.App.current.getElementsByClass(Ui.LimitedFlow)[0];
                    if (e.target.value == undefined || e.target.value == '')
                        lflow.maxLines = undefined;
                    else
                        lflow.maxLines = parseInt(e.target.value);
                }
            }),
            new Ui.CheckBox().assign({
                content: new Ui.Label().assign({ text: 'uniform' }),
                onchanged: function (e) {
                    var lflow = Ui.App.current.getElementsByClass(Ui.LimitedFlow)[0];
                    lflow.uniform = e.value;
                }
            }),
            new Ui.LimitedFlow().assign({
                spacing: 10,
                content: [
                    new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'pink' }),
                    new Ui.Rectangle().assign({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }),
                    new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'brown' }),
                    new Ui.Rectangle().assign({ width: 200, height: 15, fill: 'orange' }),
                    new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'lightblue' }),
                    new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'pink' }),
                    new Ui.Rectangle().assign({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }),
                    new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'brown' }),
                    new Ui.Rectangle().assign({ width: 200, height: 15, fill: 'orange' }),
                    new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'lightblue' }),
                    new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'pink' }),
                    new Ui.Rectangle().assign({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }),
                    new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'brown' }),
                    new Ui.Rectangle().assign({ width: 200, height: 15, fill: 'orange' }),
                    new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'lightblue' })
                ]
            }),
            new Ui.Rectangle().assign({ height: 150, fill: 'green' })
        ]
    })
});
