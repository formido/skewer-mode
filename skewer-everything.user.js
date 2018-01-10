// ==UserScript==
// @name         Skewer Everything [Tampermonkey fix]
// @description  Add a toggle button to run Skewer on the current page
// @lastupdated  2017-01-10
// @version      1.3.1
// @license      Public Domain
// @include      /^https?:///
// @grant        none
// @run-at       document-end
// ==/UserScript==

window.skewerNativeXHR = XMLHttpRequest;
window.skewerInject = inject;

var host = 'http://localhost:8080';

var toggle = document.createElement('div');
toggle.onclick = inject;
toggle.style.width = '0px';
toggle.style.height = '0px';
toggle.style.borderStyle = 'solid';
toggle.style.borderWidth = '0 12px 12px 0';
toggle.style.borderColor = 'transparent #F00 transparent transparent';
toggle.style.position = 'absolute';
toggle.style.right = 0;
toggle.style.top = 0;
toggle.style.zIndex = 214748364;

var injected = false;

function inject() {
    if (!injected) {
        var script = document.createElement('script');
        script.src = host + '/skewer';
        document.body.appendChild(script);
        toggle.style.borderRightColor = '#0F0';
    } else {
        /* break skewer to disable it */
        skewer.fn = null;
        toggle.style.borderRightColor = '#F00';
    }
    injected = !injected;
    localStorage._autoskewered = JSON.stringify(injected);
}

function maybeInject() {
    /* Don't use on iframes. */
    if (window.top === window.self) {
        document.body.appendChild(toggle);
        if (JSON.parse(localStorage._autoskewered || 'false')) {
            inject();
        }
    }
}

(function() {
    'use strict';

    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
        maybeInject();
    } else {
        document.addEventListener("DOMContentLoaded", function(event) {
            maybeInject();
        });
    }
})();
