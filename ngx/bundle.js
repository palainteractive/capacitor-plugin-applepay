'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');
require('rxjs');

var ApplePay = /** @class */ (function (_super) {
    tslib.__extends(ApplePay, _super);
    function ApplePay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ApplePay.prototype.canMakePayments = function () { return core.cordova(this, "canMakePayments", { "otherPromise": true }, arguments); };
    ApplePay.prototype.startListeningForShippingContactSelection = function () { return core.cordova(this, "startListeningForShippingContactSelection", { "observable": true, "clearFunction": "stopListeningForShippingContactSelection" }, arguments); };
    ApplePay.prototype.stopListeningForShippingContactSelection = function () { return core.cordova(this, "stopListeningForShippingContactSelection", { "otherPromise": true }, arguments); };
    ApplePay.prototype.updateItemsAndShippingMethods = function (list) { return core.cordova(this, "updateItemsAndShippingMethods", { "otherPromise": true }, arguments); };
    ApplePay.prototype.makePaymentRequest = function (order) { return core.cordova(this, "makePaymentRequest", { "otherPromise": true }, arguments); };
    ApplePay.prototype.completeLastTransaction = function (complete) { return core.cordova(this, "completeLastTransaction", { "otherPromise": true }, arguments); };
    ApplePay.pluginName = "ApplePay";
    ApplePay.plugin = "cordova-plugin-applepay";
    ApplePay.pluginRef = "ApplePay";
    ApplePay.repo = "https://github.com/samkelleher/cordova-plugin-applepay";
    ApplePay.platforms = ["iOS"];
    ApplePay.decorators = [
        { type: core$1.Injectable }
    ];
    return ApplePay;
}(core.IonicNativePlugin));

exports.ApplePay = ApplePay;
