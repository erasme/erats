"use strict";
/// <reference path="../../era/era.d.ts" />
new Ui.App({
    content: new Ui.Rectangle().assign({
        fill: new Ui.LinearGradient([
            { offset: 0, color: new Ui.Color(0.2, 0.5, 0.2) },
            { offset: 0.5, color: new Ui.Color(0.9, 0.1, 0.1) },
            { offset: 1, color: new Ui.Color(0.1, 0.8, 0.9) }
        ], 'vertical'),
        width: 100,
        height: 100,
        verticalAlign: 'center',
        horizontalAlign: 'center',
        radius: 8
    })
});
