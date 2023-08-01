// This is from Geekdocs (https://github.com/thegeeklab/hugo-geekdoc)
const groupBy = require("lodash/groupBy");
const filter = require("lodash/filter");
const truncate = require("lodash/truncate");
const { FlexSearch } = require("flexsearch/dist/flexsearch.compact");
const { Validator } = require("@cfworker/json-schema");

document.addEventListener("DOMContentLoaded", function (event) {
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  const basePath = urlPath(input ? input.dataset.siteBaseUrl : "");
  const lang = input ? input.dataset.siteLang : "";

  const configSchema = {
    type: "object",
    properties: {
      dataFile: {
        type: "string",
      },
      indexConfig: {
        type: ["object", "null"],
      },
      showParent: {
        type: "boolean",
      },
      showDescription: {
        type: "boolean",
      },
    },
    additionalProperties: false,
  };
  const validator = new Validator(configSchema);

  if (!input) return;

  getJson(
    combineURLs(basePath, "/search/" + lang + ".config.min.json"),
    function (searchConfig) {
      const validationResult = validator.validate(searchConfig);

      if (!validationResult.valid)
        throw AggregateError(
          validationResult.errors.map(
            (err) => new Error("Validation error: " + err.error)
          ),
          "Schema validation failed"
        );

      if (input) {
        input.addEventListener("focus", () => {
          init(input, searchConfig);
        });
        input.addEventListener("keyup", () => {
          search(input, results, searchConfig);
        });
      }
    }
  );

  document.addEventListener("keyup", (event) => {
    if (event.key === '/') {
      input.focus();
    }
  });

});


function init(input, searchConfig) {
  input.removeEventListener("focus", init);

  const indexCfgDefaults = {
    tokenize: "forward",
  };
  const indexCfg = searchConfig.indexConfig
    ? searchConfig.indexConfig
    : indexCfgDefaults;
  const dataUrl = searchConfig.dataFile;

  indexCfg.document = {
    key: "id",
    index: ["title", "content", "description"],
    store: ["title", "href", "parent", "description"],
  };

  const index = new FlexSearch.Document(indexCfg);
  window.geekdocSearchIndex = index;

  getJson(dataUrl, function (data) {
    data.forEach((obj) => {
      window.geekdocSearchIndex.add(obj);
    });
  });
}

function search(input, results, searchConfig) {
  const searchCfg = {
    enrich: true,
    limit: 5,
  };

  var noResults = document.getElementById("no-results-container")
  var closeSearchButton = document.getElementById("close-search");

  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }

  if (!input.value) {
    closeSearchButton.classList.add("d-none");
    noResults.classList.add("d-none")
    return results.classList.add("d-none");
  } else {
    closeSearchButton.classList.remove("d-none");
  }

  let searchHits = flattenHits(
    window.geekdocSearchIndex.search(input.value, searchCfg)
  );

  if (searchHits.length < 1 || searchHits.length === 1 && searchHits[0].parent === "Upbound Documentation") {
    results.classList.add("d-none")

    var noResults = document.getElementById("no-results-container")
    return noResults.classList.remove("d-none")
  } else {
    results.classList.remove("d-none")
  }

  if (searchConfig.showParent === true) {
    // Group by href to account for nested sections
    searchHits = groupBy(searchHits, (hit) => hit.href.split("/")[1]);
  }


  const items = [];

  if (searchConfig.showParent === true) {
    for (const section in searchHits) {
      try{
        // Deep copy the section of the nav
        // We modify this and put it inside the results
        // This way the CSS in the nav always matches the results
          var resultParent = document.getElementById(section).cloneNode(true)
      } catch {
          console.log("section: " + section)
          console.log(document)
      }

      // hide "No results" if it isn't already hidden
      noResults.classList.add("d-none")

      try {
        // prevent hover highlighting of section title in search results
        resultParent.classList.add("disabled");
      } catch(e) {
        console.error(e);
      }

      // deep copy the children of the nav section. This will be modified
      var resultChildrenContainer = document.getElementById(section + "-children").cloneNode(true)

      // ensure the accordian is expanded -- by this point, all children are shown (even non-matches to search hit, which we will hide later)
      resultChildrenContainer.firstElementChild.classList.add("show")

      // expand accordian for nested sections
      var subpages = resultChildrenContainer.getElementsByClassName("subpages")
      for(let h = 0; h < subpages.length; h++){
        subpages[h].classList.add("show")
      }

      // get links to all children, to compare with expected links from search hits
      var childLinks = resultChildrenContainer.getElementsByClassName("child-link-container")
      var resultPaths = []

      for (let i = 0; i < searchHits[section].length; i++) {
        resultPaths.push(searchHits[section][i]["href"])
      }

      // Hide children that do not match search hit
      for (let j = 0; j < childLinks.length; j++) {
        const pathName = childLinks[j].getElementsByClassName("child-link")[0].pathname;
        if (!resultPaths.includes(pathName)) {
          childLinks[j].classList.add("d-none")
        }
      }

      let subheaders = resultChildrenContainer.getElementsByClassName("subheader");
      for (let k = 0; k < subheaders.length; k++) {
        // prevent hover highlighting of subsection title
        subheaders[k].classList.add("disabled");

        // Hide subheaders if all of their children are hidden
        let subpageContainer = subheaders[k].nextElementSibling;
        if (subpageContainer.getElementsByClassName("child-link-container").length === subpageContainer.getElementsByClassName("child-link-container d-none").length) {
          subheaders[k].classList.add("d-none")
        }
      }

      items.push(resultParent)
      items.push(resultChildrenContainer)
    }
  }

  items.forEach((item) => {
    results.appendChild(item);
  });
}

function fetchErrors(response) {
  if (!response.ok) {
    throw Error(
      "Failed to fetch '" + response.url + "': " + response.statusText
    );
  }
  return response;
}

function getJson(src, callback) {
  fetch(src)
    .then(fetchErrors)
    .then((response) => response.json())
    .then((json) => callback(json))
    .catch(function (error) {
      if (error instanceof AggregateError) {
        console.error(error.message);
        error.errors.forEach((element) => {
          console.error(element);
        });
      } else {
        console.error(error);
      }
    });
}

function flattenHits(results) {
  const items = [];
  const map = new Map();

  for (const field of results) {
    for (const page of field.result) {
      if (!map.has(page.doc.href)) {
        map.set(page.doc.href, true);
        items.push(page.doc);
      }
    }
  }

  return items;
}

function urlPath(rawURL) {
  var parser = document.createElement("a");
  parser.href = rawURL;

  return parser.pathname;
}

/**
 * Part of [axios](https://github.com/axios/axios/blob/master/lib/helpers/combineURLs.js).
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
}

// Create a search box and results when the search icon is selected
function buildTransition() {
  var closeSearchButton = document.getElementById("close-search");
  var searchPanel = document.getElementById("search-panel");
  const searchInput = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  const noResults = document.getElementById("no-results-container")

  const headerHeight = "100%"

  // Note: navIconSwitcher also resets these menus on mobile menu close
  closeSearchButton.addEventListener("click", (event) => {
    closeSearchButton.classList.add("d-none")
    results.classList.add("d-none")
    noResults.classList.add("d-none")
    searchInput.value = "";
  })

  // Close the search panel if they click outside of it
  document.addEventListener("click", function(event) {
    targetElement = event.target
    do {
      if (searchPanel == targetElement){
        return
      }
      targetElement = targetElement.parentNode
    } while (targetElement)
      results.classList.add("d-none")
      noResults.classList.add("d-none")
  });
}

window.onload = buildTransition();
