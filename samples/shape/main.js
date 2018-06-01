"use strict";
/// <reference path="../../era/era.d.ts" />
new Ui.App().assign({
    content: new Ui.Shape().assign({
        width: 48,
        height: 48,
        fill: 'orange',
        path: 'm 9.2,24 7,-7 7,7 14,-14 7,7 -21,21 z',
        verticalAlign: 'center',
        horizontalAlign: 'center'
    })
});
