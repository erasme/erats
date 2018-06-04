"use strict";
/// <reference path="../../era/era.d.ts" />
new Ui.App().assign({
    content: new Ui.ToolBar().assign({
        verticalAlign: 'top',
        content: [
            new Ui.Button().assign({
                text: 'button1',
                onpressed: function () { return console.log('press button1'); }
            }),
            new Ui.Button().assign({
                text: 'button2',
                onpressed: function () { return console.log('press button2'); }
            })
        ]
    })
});
