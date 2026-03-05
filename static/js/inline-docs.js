(function () {
  function isInlineDocs() {
    return (
      new URLSearchParams(window.location.search).get("inlineDocs") === "true"
    );
  }

  function hideElements() {
    const navs = document.querySelectorAll("nav");
    navs.forEach(function (nav) {
      // Instead of .remove(), we'll hide the elements
      // Because some other pieces of code use query selectors to find these elements
      // and do not have null checks.
      nav.style.display = "none";
    });
    var selectors = [
      ".navbar",
      ".theme-doc-breadcrumbs",
      ".pagination-nav",
      ".navbar-sidebar",
    ];
    selectors.forEach(function (sel) {
      var el = document.querySelector(sel);
      // Instead of .remove(), we'll hide the elements
      // Because some other pieces of code use query selectors to find these elements
      // and do not have null checks.
      if (el) el.style.display = "none";
    });
  }

  function applyContentLinks(container) {
    var root = container || document;
    var links = root.querySelectorAll("a[href]");
    var currentPath = window.location.pathname;
    links.forEach(function (a) {
      // Skip links which navigate to a heading on the same page.
      // Ex: /docs/getting-started#prerequisites
      if (a.href.includes(currentPath) && a.href.includes("#")) {
        return;
      }
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
  }

  function run() {
    if (!isInlineDocs()) return;

    var root = document.getElementById("__docusaurus") || document.body;
    if (!root) return;

    function apply() {
      hideElements();
      applyContentLinks();
    }

    var main = document.querySelector("main");
    if (main && typeof MutationObserver !== "undefined") {
      var linkObserver = new MutationObserver(function () {
        applyContentLinks(document);
      });
      linkObserver.observe(main, { childList: true, subtree: true });
    }

    var waitObserver = new MutationObserver(function () {
      if (document.querySelector(".navbar")) {
        apply();
      }
    });
    waitObserver.observe(root, { childList: true, subtree: true });

    if (document.querySelector(".navbar")) {
      apply();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
