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
            onpressed: function () { return _this.carousel.previous(); }
        });
        toolbar.append(previousButton);
        toolbar.append(new Ui.Element(), true);
        var nextButton = new Ui.Button({
            icon: 'arrowright',
            onpressed: function () { return _this.carousel.next(); }
        });
        toolbar.append(nextButton);
        var lbox = new Ui.LBox({ verticalAlign: 'center', horizontalAlign: 'center', width: 400, height: 400 });
        vbox.append(lbox, true);
        lbox.append(new Ui.Frame({ fill: 'orange', frameWidth: 4, radius: 8 }));
        _this.carousel = new Ui.Carousel({
            margin: 4, alwaysShowArrows: true,
            onchanged: function (e) { return Ui.Toast.send("position " + e.position); }
        });
        lbox.append(_this.carousel);
        _this.carousel.append(new Ui.Rectangle({ fill: 'lightgreen' }));
        _this.carousel.append(new Ui.Rectangle({ fill: 'lightblue' }));
        _this.carousel.append(new Ui.ScrollingArea({
            content: new Ui.Rectangle({ fill: 'orange', height: 600 })
        }));
        _this.carousel.append(new Ui.ScrollingArea({
            content: new Ui.Image({ src: '6wind.jpg', width: 600, height: 600 })
        }));
        var complexcontent = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center' });
        complexcontent.append(new Ui.Button({ text: 'Button 1' }));
        complexcontent.append(new Ui.Button({ text: 'Button 2' }));
        _this.carousel.append(complexcontent);
        _this.carousel.append(new Ui.Text({ selectable: true, text: 'Thalassius vero ea tempestate praefectus praetorio praesens ipse ' +
                'quoque adrogantis ingenii, considerans incitationem eius ad multorum ' +
                'augeri discrimina, non maturitate vel consiliis mitigabat, ut aliquotiens ' +
                'celsae potestates iras principum molliverunt, sed adversando iurgandoque ' +
                'cum parum congrueret, eum ad rabiem potius evibrabat, Augustum actus eius ' +
                'exaggerando creberrime docens, idque, incertum qua mente, ne lateret adfectans. ' +
                'quibus mox Caesar acrius efferatus, velut contumaciae quoddam vexillum altius ' +
                'erigens, sine respectu salutis alienae vel suae ad vertenda opposita instar ' +
                'rapidi fluminis irrevocabili impetu ferebatur.'
        }));
        _this.carousel.append(new Ui.Rectangle({ fill: 'green' }));
        return _this;
    }
    return App;
}(Ui.App));
new App();
