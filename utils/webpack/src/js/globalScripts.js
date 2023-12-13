// The collection of things to load on all pages
import ColorMode from './colorMode.js';
import 'instant.page';


import 'bootstrap/js/src/base-component';
import 'bootstrap/js/src/button';
import 'bootstrap/js/src/scrollspy';
import 'bootstrap/js/src/collapse';
import 'bootstrap/js/src/dropdown';
import 'bootstrap/js/src/popover';
import 'bootstrap/js/src/tab';
import 'bootstrap/js/src/offcanvas';

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
