/**
 * Copyright (C) 2012 Chris Wharton (chris@weare2ndfloor.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * THIS SOFTWARE AND DOCUMENTATION IS PROVIDED "AS IS," AND COPYRIGHT
 * HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY OR
 * FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE SOFTWARE
 * OR DOCUMENTATION WILL NOT INFRINGE ANY THIRD PARTY PATENTS,
 * COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.COPYRIGHT HOLDERS WILL NOT
 * BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL
 * DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENTATION.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://gnu.org/licenses/>.

 Documentation available at http://cookiecuttr.com

 */
(function ($) {
    $.cookieCuttr = function (options) {
        var defaults = {
            cookieCutter                    : false, // you'd like to enable the div/section/span etc. hide feature? change this to true
            cookieCutterDeclineOnly         : false, // you'd like the CookieCutter to only hide when someone has clicked declined set this to true
            cookieAnalytics                 : true, // just using a simple analytics package? change this to true
            cookieDeclineButton             : false, // this will disable non essential cookies
            cookieAcceptButton              : true, // this will disable non essential cookies
            cookieResetButton               : false,
            cookieOverlayEnabled            : false, // don't want a discreet toolbar? Fine, set this to true
            cookiePolicyLink                : '/privacy-policy/', // if applicable, enter the link to your privacy policy here...
            cookieMessage                   : 'We use cookies on this website, you can <a href="{{cookiePolicyLink}}" title="read about our cookies">read about them here</a>. To use the website as intended please...',
            cookieAnalyticsMessage          : 'We use cookies, just to track visits to our website, we store no personal details.',
            cookieErrorMessage              : "We\'re sorry, this feature places cookies in your browser and has been disabled. <br>To continue using this functionality, please",
            cookieWhatAreTheyLink           : "http://www.allaboutcookies.org/",
            cookieDisable                   : '',
            cookieExpires                   : 365,
            cookieAcceptButtonText          : "ACCEPT COOKIES",
            cookieDeclineButtonText         : "DECLINE COOKIES",
            cookieResetButtonText           : "RESET COOKIES FOR THIS WEBSITE",
            cookieWhatAreLinkText           : "What are cookies?",
            cookieNotificationLocationBottom: false, // top or bottom - they are your only options, so true for bottom, false for top
            cookiePolicyPage                : false,
            cookiePolicyPageMessage         : 'Please read the information below and then choose from the following options',
            cookieDiscreetLink              : false,
            cookieDiscreetReset             : false,
            cookieDiscreetLinkText          : "Cookies?",
            cookieDiscreetPosition          : "topleft", //options: topleft, topright, bottomleft, bottomright
            cookieNoMessage                 : false, // change to true hide message from all pages apart from your policy page
            cookieDomain                    : ""
        };

        options               = $.extend({}, defaults, options);
        options.cookieMessage = options.cookieMessage.replace('{{cookiePolicyLink}}', options.cookiePolicyLink);

        // cookie identifier
        var $cookieAccepted = $.cookie('cc_cookie_accept')  == 'cc_cookie_accept';
        var $cookieDeclined = $.cookie('cc_cookie_decline') == 'cc_cookie_decline';

        $.cookieAccepted = function () { return $cookieAccepted; };
        $.cookieDeclined = function () { return $cookieDeclined; };

        //  buttons html-string, etc
        var cookieAccept  = '',
            cookieDecline = '',
            cookieOverlay = ''
        ;

        if (options.cookieAcceptButton)  // write cookie accept button
            cookieAccept  = ' <a href="#accept" class="cc-cookie-accept">' + options.cookieAcceptButtonText + '</a> ';


        if (options.cookieDeclineButton) // write cookie decline button
            cookieDecline = ' <a href="#decline" class="cc-cookie-decline">' + options.cookieDeclineButtonText + '</a> ';

        // write extra class for overlay
        if (options.cookieOverlayEnabled)
            cookieOverlay = ' cc-overlay';

        // to prepend or append, that is the question?
        var appOrPre = (options.cookieNotificationLocationBottom         ||
                        options.cookieDiscreetPosition == "bottomright"  ||
                        options.cookieDiscreetPosition == "bottomleft") ? 'append' : 'prepend';

        var setDiscretePos = function(pos) {
            //add appropriate CSS depending on position chosen
            switch (pos) {
                case 'topleft'    : $('div.cc-cookies').css({top: 0,    left: 0});  break;
                case 'topright'   : $('div.cc-cookies').css({top: 0,    right: 0}); break;
                case 'bottomleft' : $('div.cc-cookies').css({bottom: 0, left: 0});  break;
                case 'bottomright': $('div.cc-cookies').css({bottom: 0, right: 0}); break;
            }
        };

        if ($cookieAccepted || $cookieDeclined) {
            // write cookie reset button
            if (options.cookieResetButton && options.cookieDiscreetReset) {
                $('body')[appOrPre]('<div class="cc-cookies cc-discreet"><a href="#" class="cc-cookie-reset">' + cookieResetButtonText + '</a></div>');
                setDiscrete(options.cookieDiscreetPosition);
            } else if (options.cookieResetButton) {
                $('body')[appOrPre]('<div class="cc-cookies"><a href="#" class="cc-cookie-reset">' + options.cookieResetButtonText + '</a></div>');
            }
        } else if (options.cookieNoMessage && !options.cookiePolicyPage) {
            // show no link on any pages APART from the policy page
        } else if (options.cookieDiscreetLink && !options.cookiePolicyPage) { // show discreet link
            $('body')[appOrPre]('<div class="cc-cookies cc-discreet"><a href="' + options.cookiePolicyLink + '" title="' + options.cookieDiscreetLinkText + '">' + options.cookieDiscreetLinkText + '</a></div>');
            setDiscrete(options.cookieDiscreetPosition);
        } else if (options.cookieAnalytics) { // show analytics overlay
            $('body')[appOrPre]('<div class="cc-cookies' + cookieOverlay + '">' + options.cookieAnalyticsMessage + cookieAccept + cookieDecline + '<a rel="external" href="' + options.cookieWhatAreTheyLink + '">' + options.cookieWhatAreLinkText + '</a></div>');
        }

        if (options.cookiePolicyPage) { // show policy page overlay
            $('body')[appOrPre]('<div class="cc-cookies' + cookieOverlay + '">' + options.cookiePolicyPageMessage + " " + ' <a href="#accept" class="cc-cookie-accept">' + options.cookieAcceptButtonText + '</a> ' + ' <a href="#decline" class="cc-cookie-decline">' + options.cookieDeclineButtonText + '</a> ' + '</div>');
        } else if (!options.cookieAnalytics && !options.cookieDiscreetLink) { // show privacy policy option
            $('body')[appOrPre]('<div class="cc-cookies' + cookieOverlay + '">' + options.cookieMessage + cookieAccept + cookieDecline + '</div>');
        }

        if ((options.cookieCutter && !options.cookieCutterDeclineOnly && ($cookieDeclined || !$cookieAccepted)) ||
            (options.cookieCutter && options.cookieCutterDeclineOnly && $cookieDeclined)
        ) $(cookieDisable).html('<div class="cc-cookies-error">' + options.cookieErrorMessage + ' <a href="#accept" class="cc-cookie-accept">' + options.cookieAcceptButtonText + '</a> ' + '</div>');

        // if bottom is true, switch div to bottom if not in discreet mode
        if ((options.cookieNotificationLocationBottom && !options.cookieDiscreetLink) ||
            (options.cookieNotificationLocationBottom && options.cookieDiscreetLink && options.cookiePolicyPage)
        ) $('div.cc-cookies').css({top: 'auto', bottom: 0});

        // click handlers, setting the cookies ...

        // handler: for [top/bottom] bar
        $('.cc-cookie-accept, .cc-cookie-decline').click(function (e) {
            e.preventDefault();

            if ($(this).is('[href$=#decline]')) {
                $.cookie('cc_cookie_accept', null, { path: '/' });
                $.cookie('cc_cookie_decline', 'cc_cookie_decline', { expires: options.cookieExpires, path: '/'});

                if (options.cookieDomain) {
                    // kill google analytics cookies
                    $.cookie("__utma", null, { domain: '.' + options.cookieDomain, path: '/' });
                    $.cookie("__utmb", null, { domain: '.' + options.cookieDomain, path: '/' });
                    $.cookie("__utmc", null, { domain: '.' + options.cookieDomain, path: '/' });
                    $.cookie("__utmz", null, { domain: '.' + options.cookieDomain, path: '/' });
                }
            } else {
                $.cookie('cc_cookie_decline', null, { path: '/' });
                $.cookie('cc_cookie_accept', 'cc_cookie_accept', { expires: options.cookieExpires, path: '/' });
            }

            $(".cc-cookies").fadeOut(function () {
                location.reload();
            });
        });

        // handler: reset cookies
        $('a.cc-cookie-reset').click(function (f) {
            f.preventDefault();

            $.cookie('cc_cookie_accept', null,  { path: '/' });
            $.cookie('cc_cookie_decline', null, { path: '/' });

            $(".cc-cookies").fadeOut(function () {
                location.reload();
            });
        });

        // handler: cookie error accept
        $('.cc-cookies-error a.cc-cookie-accept').click(function (g) {
            g.preventDefault();

            $.cookie('cc_cookie_accept', 'cc_cookie_accept', { expires: options.cookieExpires, path: '/'});
            $.cookie('cc_cookie_decline', null, { path: '/'});

            location.reload();
        });
    };
})(jQuery);