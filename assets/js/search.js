const searchClient = algoliasearch('TAGTUHCAAG', 'fcfee81a653159c2b3fe92ab4f423556');

const search = instantsearch({
	indexName: 'page',
	searchClient,
});

search.addWidget(
	instantsearch.widgets.searchBox({
		container: '#searchbox-al',
		showReset: false,
	})
);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
	templates: {
		item:`
		<div class="search-result-al al-{{_highlightResult.html.matchLevel}}">
			<a href="{{permalink}}" class="search-result-al-text">
				<h3 class="search-result-al-text">{{#helpers.highlight}}{ "attribute": "title", "highlightedTagName": "mark" }{{/helpers.highlight}}</h3>
			</a>
		</div>
		`
	}
  })
);

document.addEventListener("click", function (e) {
	search.helper.setQuery('').search();
});

search.start();

var searchboxArr = document.getElementsByClassName("ais-SearchBox-input");
var searchbox = searchboxArr[0];

searchbox.addEventListener("input", function (e) {
	var results = document.getElementById("hits");
	results.classList.remove("inactive");
});

