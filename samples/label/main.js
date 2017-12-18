"use strict";
/// <reference path="../../era/era.d.ts" />
//
// Play with Ui.Label, the simplest text element
//
new Ui.App({
    content: new Ui.Label({
        text: 'hello world',
        verticalAlign: 'center',
        horizontalAlign: 'center'
    })
});
