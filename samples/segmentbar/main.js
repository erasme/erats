"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
        var vbox = new Ui.VBox({ horizontalAlign: 'center', verticalAlign: 'center', spacing: 5 });
        _this.content = vbox;
        var label = new Ui.Label({ horizontalAlign: 'center' });
        vbox.append(label);
        var segmentbar = new Ui.SegmentBar({
            field: 'text', data: [
                { text: 'Home' }, { text: 'Download' }, { text: 'API' }, { text: 'Samples' }
            ],
            onchanged: function (e) { return label.text = "Choice: " + e.value.text; }
        });
        vbox.append(segmentbar);
        segmentbar.currentPosition = 0;
        return _this;
    }
    return App;
}(Ui.App));
new App();
