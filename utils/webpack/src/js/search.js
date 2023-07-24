// This is from Geekdocs (https://github.com/thegeeklab/hugo-geekdoc)
const groupBy = require("lodash/groupBy");
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

  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }

  if (!input.value) {
    noResults.classList.add("d-none")
    return results.classList.add("d-none");
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
    searchHits = groupBy(searchHits, (hit) => hit.parent);
  }

  const items = [];

  if (searchConfig.showParent === true) {
    for (const section in searchHits) {
        if(section === "Upbound Documentation"){
            continue
        }

        try{
          // Deep copy the section of the nav
          // We modify this and put it inside the results
          // This way the CSS in the nav always matches the results
            var resultParent = document.getElementById(section).cloneNode(true)
        }
        catch {
            console.log("section: " + section)
            console.log(document)
        }

        // hide "No results" if it isn't already hidden
        noResults.classList.add("d-none")

        try {
          // prevent highlighting of section title in search results
          resultParent.classList.add('disabled');

          // hide accordion
          resultParent.querySelector(".button-container").classList.add('d-none');
        } catch(e) {
          console.error(e);
        }

        // deep copy the children of the nav section. This will be modified
        var resultChildrenContainer = document.getElementById(section + "-children").cloneNode(true)

        // ensure the accordian is expanded
        resultChildrenContainer.firstElementChild.classList.add("show")


        var childLinks = resultChildrenContainer.getElementsByClassName(".nav-child")
        var resultPaths = []

        for(var i = 0 ; i < searchHits[section].length - 1; i++){
            resultPaths.push(searchHits[section][i]["href"])
        }

        for(var i = 0 ; i < childLinks.length - 1 ; i++){
            if(!resultPaths.includes(childLinks[i].pathname)){
                childLinks[i].classList.add("d-none")
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
  var closeSearch = document.getElementById("close-search");
  var searchPanel = document.getElementById("search-panel");
  const searchInput = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  const noResults = document.getElementById("no-results-container")

  const headerHeight = "100%"

  // Note: navIconSwitcher also resets these menus on mobile menu close
  closeSearch.addEventListener(`click`, (event) => {
    results.classList.add("d-none")
    noResults.classList.add("d-none")
    searchInput.value = '';
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
