"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        var previousButton = new Ui.Button({
            icon: 'arrowleft',
            onpressed: function () { return carouselable.previous(); }
        });
        toolbar.append(previousButton);
        toolbar.append(new Ui.Element(), true);
        var nextButton = new Ui.Button({
            icon: 'arrowright',
            onpressed: function () { return carouselable.next(); }
        });
        toolbar.append(nextButton);
        var lbox = new Ui.LBox({
            verticalAlign: 'center', horizontalAlign: 'center',
            width: 400, height: 400
        });
        vbox.append(lbox, true);
        lbox.append(new Ui.Frame({ fill: 'orange', frameWidth: 4 }));
        var carouselable = new Ui.Carouselable({ margin: 4 });
        lbox.append(carouselable);
        carouselable.append(new Ui.Rectangle({ fill: 'lightgreen' }));
        carouselable.append(new Ui.Rectangle({ fill: 'lightblue' }));
        carouselable.append(new Ui.Rectangle({ fill: 'purple' }));
        return _this;
    }
    return App;
}(Ui.App));
new App();
