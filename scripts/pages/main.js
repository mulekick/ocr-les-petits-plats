/* eslint-disable no-invalid-this */

// import modules
import {searchEngine} from "../data/search.js";
import {inputFactory} from "../factories/input.js";
import {resultsFactory} from "../factories/results.js";

try {

    const
        [ textSearch, selectedTags, ingredientsSearch, appliancesSearch, ustensilsSearch, recipeFinder, recipesList ] = [
            // create DOM element for text search
            inputFactory(`search`, `recipes-search`, `Rechercher une recette`),
            // create DOM element for selected tags
            inputFactory(`selected`, `selected-tags-list`),
            // create DOM elements for tag searches
            inputFactory(`tag`, `ingredients-tag`, `Ingédients`),
            inputFactory(`tag`, `appliances-tag`, `Appareils`),
            inputFactory(`tag`, `ustensils-tag`, `Ustensiles`),
            // create new search engine
            new searchEngine(`recipes finder`, function(e) {
                // start recipes search
                this.find(e);
            }),
            resultsFactory(`recipes`, function({event, recipes}) {
                // if current element is relevant to notification
                if (event === `recipesListUpdate`)
                    // refresh recipes list
                    this.refresh(recipes);
            })
        ];

    // recipes list subscribes to search engine ...
    recipeFinder.subscribe(recipesList);

    // store recipes list DOM element, set id
    recipesList.element = recipesList.get(`recipes-list`);

    // search engine subscribes to inputs ...
    [ textSearch, selectedTags, ingredientsSearch, appliancesSearch, ustensilsSearch ]
        .forEach(x => x.subscribe(recipeFinder));

    // append text search
    document.querySelector(`.tags`).before(...textSearch.get(), selectedTags.get());

    // append tag search
    [ ingredientsSearch, appliancesSearch, ustensilsSearch ]
        .forEach(x => document.querySelector(`.tags`).append(x.get(recipeFinder)));

    // append recipes list
    document.querySelector(`.tags`).after(recipesList.element);

} catch (err) {
    // write to stderr
    console.error(`error: ${ err.message }`);
}