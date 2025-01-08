// The collection of things to load on all pages
import ColorMode from './colorMode.js';
import 'instant.page';

import 'bootstrap/js/dist/base-component';
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/scrollspy';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/popover';
import Tab from 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/offcanvas';

import './tabDeepAnchor.js';
import './customClipboard.js';
import './hoverHighlight.js';
import './navIconSwitcher.js';
import './search.js';

// https://lokeshdhakar.com/projects/lightbox2/
import * as lightbox from 'lightbox2/src/js/lightbox';

// Show the full image in a lightbox popout.
lightbox.option({
    'fitImagesInViewport': false
})

document.addEventListener("DOMContentLoaded", () => {
    let pageUrl = (location.origin + location.pathname);

    //init
    const tabs = document.querySelectorAll('.nav-link[data-hash]')
    tabs.forEach(tab => {
        new Tab(tab)
    });

    if (location.hash) {
        let pageHash = location.hash.split('#')[1];

        const targetTab = document.querySelector(`[data-hash="${pageHash}"]`);
        if (targetTab) {
            Tab.getInstance(targetTab).show();
        }
    }

    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener("click", function () {
            const hash = this.dataset.hash;
            const newUrl = pageUrl + "#" + hash;

            history.pushState(null, null, newUrl);
        });
    });
});
