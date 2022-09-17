/* eslint-disable no-invalid-this */

// import modules
import {inputFactory} from "../factories/input.js";
import {searchEngine} from "../data/search.js";

try {

    const
        // create DOM element for text search
        textSearch = inputFactory(`search`, `recipes-search`, `Rechercher une recette`, `magnifying-glass`);

    /*
        // create DOM elements for tag searches
        ingredientsSearch = inputFactory(`tag`, `ingredients-tag`, `Ingédients`, `chevron-down`),
        appliancesSearch = inputFactory(`tag`, `appliances-tag`, `Appareils`, `chevron-down`),
        ustensilsSearch = inputFactory(`tag`, `ustensils-tag`, `Ustensiles`, `chevron-down`),
        // create new search engine
        recipeFinder = new searchEngine(`recipes finder`, function(e) {
            // write notified event to console
            this.writeToconsole(e);
            // notify engines observer (TBC)
            this.notify(e);
        });

    // search engine subscribes to inputs ...
    textSearch.subscribe(recipeFinder);
    ingredientsSearch.subscribe(recipeFinder);
    appliancesSearch.subscribe(recipeFinder);
    ustensilsSearch.subscribe(recipeFinder);
    */

    // append text search
    document.querySelector(`.tags`).before(...textSearch.get());

    /*
    // append tag search
    [ ustensilsSearch, appliancesSearch, ingredientsSearch ]
        .forEach(x => document.querySelector(`.tags`).append(...x.get()));
    */

} catch (err) {
    // write to stderr
    console.error(`error: ${ err.message }`);
}