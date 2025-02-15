import { IonicNativePlugin } from '@ionic-native/core';
import { Observable } from 'rxjs';
export declare type IMakePayments = 'This device can make payments and has a supported card' | 'This device cannot make payments.' | 'This device can make payments but has no supported cards';
export declare type IShippingType = 'shipping' | 'delivery' | 'store' | 'service';
export declare type IBillingRequirement = 'none' | 'all' | 'postcode' | 'name' | 'email' | 'phone';
export declare type ITransactionStatus = 'success' | 'failure' | 'invalid-billing-address' | 'invalid-shipping-address' | 'invalid-shipping-contact' | 'require-pin' | 'incorrect-pin' | 'locked-pin';
export declare type ICompleteTransaction = 'Payment status applied.';
export declare type IUpdateItemsAndShippingStatus = 'Updated List Info' | 'Did you make a payment request?';
export declare type IMerchantCapabilities = '3ds' | 'credit' | 'debit' | 'emv';
export declare type ISupportedNetworks = 'visa' | 'amex' | 'discover' | 'masterCard';
export interface IPaymentResponse {
    billingNameFirst?: string;
    billingNameMiddle?: string;
    billingNameLast?: string;
    billingEmailAddress?: string;
    billingSupplementarySubLocality?: string;
    billingAddressStreet?: string;
    billingAddressCity?: string;
    billingAddressState?: string;
    billingPostalCode?: string;
    billingCountry?: string;
    billingISOCountryCode?: string;
    shippingNameFirst?: string;
    shippingNameMiddle?: string;
    shippingNameLast?: string;
    shippingEmailAddress?: string;
    shippingPhoneNumber?: string;
    shippingSupplementarySubLocality?: string;
    shippingAddressStreet?: string;
    shippingAddressCity?: string;
    shippingAddressState?: string;
    shippingPostalCode?: string;
    shippingCountry?: string;
    shippingISOCountryCode?: string;
    paymentData: string;
    transactionIdentifier: string;
    paymentMethodDisplayName?: string;
    paymentMethodNetwork?: string;
    paymentMethodTypeCard?: string;
}
export interface IOrderItem {
    label: string;
    amount: number;
}
export interface IShippingMethod {
    identifier: string;
    label: string;
    detail: string;
    amount: number;
}
export interface IOrderItemsAndShippingMethods {
    items: IOrderItem[];
    shippingMethods?: IShippingMethod[];
}
export interface IOrder extends IOrderItemsAndShippingMethods {
    merchantIdentifier: string;
    currencyCode: string;
    countryCode: string;
    billingAddressRequirement?: IBillingRequirement | IBillingRequirement[];
    shippingAddressRequirement?: IBillingRequirement | IBillingRequirement[];
    shippingType?: IShippingType;
    merchantCapabilities?: IMerchantCapabilities | IMerchantCapabilities[];
    supportedNetworks?: ISupportedNetworks | ISupportedNetworks[];
}
export interface ISelectedShippingContact {
    shippingAddressCity: string;
    shippingAddressState: string;
    shippingPostalCode: string;
    shippingISOCountryCode: string;
}
/**
 * @name Apple Pay
 * @description
 * A dependency free Cordova plugin to provide Apple Pay functionality.
 *
 * @usage
 * ```typescript
 * import { ApplePay } from '@ionic-native/apple-pay/ngx';
 *
 *
 * constructor(private applePay: ApplePay) { }
 *
 * ...
 * async applePay() {
 *   // This block is optional -- only if you need to update order items/shipping
 *   // methods in response to shipping method selections
 *   this.applePay.startListeningForShippingContactSelection()
 *     .subscribe(async selection => {
 *       try {
 *         await this.applePay.updateItemsAndShippingMethods({
 *           items: getFromSelection(selection),
 *           shippingMethods: getFromSelection(selection),
 *         });
 *       }
 *       catch {
 *         // handle update items error
 *       }
 *     });
 *
 *   try {
 *     const applePayTransaction = await this.applePay.makePaymentRequest({
 *       items,
 *       shippingMethods,
 *       merchantIdentifier,
 *       currencyCode,
 *       countryCode,
 *       billingAddressRequirement: ['name', 'email', 'phone'],
 *       shippingAddressRequirement: 'none',
 *       shippingType: 'shipping'
 *     });
 *
 *     const transactionStatus = await completeTransactionWithMerchant(applePayTransaction);
 *     await this.applePay.completeLastTransaction(transactionStatus);
 *   } catch {
 *     // handle payment request error
 *     // Can also handle stop complete transaction but these should normally not occur
 *   }
 *
 *   // only if you started listening before
 *   await this.applePay.stopListeningForShippingContactSelection();
 * }
 * ```
 */
export declare class ApplePayOriginal extends IonicNativePlugin {
    /**
     * Detects if the current device supports Apple Pay and has any capable cards registered.
     * @return {Promise<IMakePayments>} Returns a promise
     *
     * @usage
     * try {
     *   const message = await this.applePay.canMakePayments();
     *   // Apple Pay is enabled and a supported card is setup. Expect:
     *   // 'This device can make payments and has a supported card'
     * } catch (message) {
     *   // There is an issue, examine the message to see the details, will be:
     *   // 'This device cannot make payments.''
     *   // 'This device can make payments but has no supported cards'
     * }
     */
    canMakePayments(): Promise<IMakePayments>;
    /**
     * Starts listening for shipping contact selection changes
     * Any time the user selects shipping contact, this callback will fire.
     * You *must* call `updateItemsAndShippingMethods` in response or else the
     * user will not be able to process payment.
     * @return {Observable<ISelectedShippingContact>} emits with shipping contact information on
     *   shipping contact selection changes
     */
    startListeningForShippingContactSelection(): Observable<ISelectedShippingContact>;
    /**
     * Stops listening for shipping contact selection changes
     * @return {Promise} whether stop listening was successful. This should
     *   really only fail if this is called without starting listening
     */
    stopListeningForShippingContactSelection(): Promise<boolean>;
    /**
     * Update the list of pay sheet items and shipping methods in response to
     * a shipping contact selection event. This *must* be called in response to
     * any shipping contact selection event or else the user will not be able
     * to complete a transaction on the pay sheet. Do not call without
     * subscribing to shipping contact selection events first
     *
     * @param {IOrderItemsAndShippingMethods} list `items` and `shippingMethods` properties.
     * @returns {Promise<IUpdateItemsAndShippingStatus>}
     *
     * @usage
     * this.applePay.startListeningForShippingContactSelection().pluck('shippingAddressState').subscribe(shippingAddressState => {
     *   let shippingMethods;
     *   if ('AK' === shippingAddressState) {
     *     shippingMethods = [{
     *         identifier: 'Alaska',
     *         label: 'Alaska',
     *         detail: 'For shipping to Alaska',
     *         amount: 9.99
     *     },];
     *   } else {
     *     shippingMethods = [{
     *         identifier: 'Continental',
     *         label: 'Continental',
     *         detail: 'For shipping Continentally',
     *         amount: 5.99
     *     }];
     *   }
     *   this.paySheetItems.shippingCost = {
     *      label: 'Shipping Cost',
     *      amount: shippingMethod[0].amount
     *   }
     *   this.applePay.updateItemsAndShippingMethods(this.paySheetItems, shippingMethods);
     * });
     */
    updateItemsAndShippingMethods(list: IOrderItemsAndShippingMethods): Promise<IUpdateItemsAndShippingStatus>;
    /**
     * Request a payment with Apple Pay
     *
     * @param {IOrder} order
     * @return {Promise<IPaymentResponse>} Returns a promise that resolves when something happens
     *
     * @usage
     * try {
     *   const paymentResponse = this.applePay.makePaymentRequest({
     *     items: [
     *       {
     *         label: '3 x Basket Items',
     *         amount: 49.99
     *       },
     *       {
     *         label: 'Next Day Delivery',
     *         amount: 3.99
     *       },
     *       {
     *         label: 'My Fashion Company',
     *         amount: 53.98
     *       }
     *     ],
     *     shippingMethods: [
     *       {
     *         identifier: 'NextDay',
     *         label: 'NextDay',
     *         detail: 'Arrives tomorrow by 5pm.',
     *         amount: 3.99
     *       },
     *       {
     *         identifier: 'Standard',
     *         label: 'Standard',
     *         detail: 'Arrive by Friday.',
     *         amount: 4.99
     *       },
     *       {
     *         identifier: 'SaturdayDelivery',
     *         label: 'Saturday',
     *         detail: 'Arrive by 5pm this Saturday.',
     *         amount: 6.99
     *       }
     *     ],
     *     merchantIdentifier: 'merchant.apple.test',
     *     currencyCode: 'GBP',
     *     countryCode: 'GB',
     *     billingAddressRequirement: 'none',
     *     shippingAddressRequirement: 'none',
     *     shippingType: 'shipping',
     *   });
     *
     *   // The user has authorized the payment.
     *
     *   // Handle the token, asynchronously, i.e. pass to your merchant bank to
     *   // action the payment, then once finished, depending on the outcome:
     *
     *   // Here is an example implementation:
     *
     *   const captureStatus = await MyPaymentProvider.authorizeApplePayToken(paymentResponse.paymentData);
     *   await this.applePay.completeLastTransaction('success');
     * }
     * catch (err) {
     *   if (isPaymentAuthError(err)) {
     *     this.completeLastTransaction('failure');
     *   }
     *   else {
     *     // Failed to open pay sheet or user canceled payment
     *   }
     * }
     */
    makePaymentRequest(order: IOrder): Promise<IPaymentResponse>;
    /**
     * Once the makePaymentRequest has been resolved successfully, the device will be waiting for a completion event.
     * This means, that the application must proceed with the token authorization and return a success, failure,
     * or other validation error. Once this has been passed back, the Apple Pay sheet will be dismissed via an animation.
     *
     * @param {ITransactionStatus} complete
     * @return {Promise<ICompleteTransaction>} Returns a promise that resolves after confirmation of payment authorization completion
     *
     */
    completeLastTransaction(complete: ITransactionStatus): Promise<ICompleteTransaction>;
}

export declare const ApplePay: ApplePayOriginal;