// import modules
import {observeeMixin, observerMixin} from "../utils/classMixins.js";
import {EVENT_TEXT_SEARCH, EVENT_TAGS_SEARCH, EVENT_RECIPES_UPDATE, EVENT_TAGS_LIST_UPDATE, EVENT_TAGS_SELECTED} from "../utils/config.js";
import recipes from "./recipes.js";

const
    // recipes search object
    search = class {
        // constructor
        constructor(name) {
            // store engine name
            this.name = name;
            // store current recipes
            this.recipes = [];
            // store current tags lists
            this.ingredients = [];
            this.appliances = [];
            this.ustensils = [];
            // store current search term
            this.searchTerm = ``;
            // store current selected tags
            this.tags = [];
        }

        parse() {
            // reset engine properties
            for (const p of [ `recipes`, `ingredients`, `appliances`, `ustensils` ])
                this[p].splice(0, this[p].length);

            // parse recipes for search terms in name, ingredients, description
            for (const recipe of recipes) {
                const
                    // extract properties
                    {name, ingredients, description, appliance, ustensils} = recipe;

                // test properties against selected tags using strict equality (Array.every returns true when passed an empty array)
                if (!this.tags.every(x => ingredients.map(y => y[`ingredient`]).includes(x) || appliance === x || ustensils.includes(x)))
                    // at least one tag is nowhere to be found in the recipe, skip
                    continue;

                // ========= MATCH SEARCH TERM AGAINST LENGTH, RECIPE NAME, DESCRIPTION AND INGREDIENTS : NATIVE LOOPS / INDEXOF ========

                // if search term length exceeds 3, test properties against it using regexp, otherwise recipe is good to go
                if (this.searchTerm.length < 3 || name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0 || description.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0 || (a => {
                    for (const x of a)
                        // this points to parent lexical scope
                        if (x[`ingredient`].toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0)
                            return true;
                    return false;
                })(ingredients)) {
                    // store recipe
                    this.recipes.push(recipe);
                    for (const i of ingredients)
                        // store ingredients
                        this.ingredients.push(i[`ingredient`]);
                    // store appliances
                    this.appliances.push(appliance);
                    for (const u of ustensils)
                        // store ustensils
                        this.ustensils.push(u);
                }

                // ========= MATCH SEARCH TERM AGAINST LENGTH, RECIPE NAME, DESCRIPTION AND INGREDIENTS : NATIVE LOOPS / INDEXOF ========

                // remove duplicate tags from lists (we assess that recipes contain no duplicates ...)
                [ `ingredients`, `appliances`, `ustensils` ]
                    .forEach(p => (this[p] = this[p].filter((x, i, a) => a.indexOf(x) === i).sort()));
            }
        }

        // search criteria update notification
        find({event, element}) {
            // eslint compliant
            let match = null;
            // execute on observee's notifications
            switch (event) {
            case EVENT_TEXT_SEARCH :
                console.log(`${ this.name }: search text changed to ${ element.value } in ${ element.id }`);
                // store search term
                this.searchTerm = element.value;
                // parse recipes
                this.parse();
                // notify recipes list
                this.notify({
                    event: EVENT_RECIPES_UPDATE,
                    recipes: this.recipes
                });
                // notify tags lists
                this.notify({
                    event: EVENT_TAGS_LIST_UPDATE,
                    id: `ingredients-tag-list`,
                    tags: this.ingredients
                });
                this.notify({
                    event: EVENT_TAGS_LIST_UPDATE,
                    id: `appliances-tag-list`,
                    tags: this.appliances
                });
                this.notify({
                    event: EVENT_TAGS_LIST_UPDATE,
                    id: `ustensils-tag-list`,
                    tags: this.ustensils
                });
                break;
            case EVENT_TAGS_SEARCH :
                console.log(`${ this.name }: search tag changed to ${ element.value } in ${ element.id }`);
                // test tag list id
                match = element.id.match(/(?<list>\w+)-tag/u);
                // throw error if not found
                if (match === null)
                    throw new Error(`${ this.name }: invalid tag filter id`);
                // notify observer div with new list
                this.notify({
                    event: EVENT_TAGS_LIST_UPDATE,
                    id: `${ element.id }-list`,
                    // filter tags matching input
                    tags: this[match.pop()].filter(x => new RegExp(element.value, `gui`).test(x))
                });
                break;
            case EVENT_TAGS_SELECTED :
                // update current selected tags
                this.tags = Array.from(element.children).map(x => x.textContent);
                console.log(`${ this.name }: selected tags list changed to ${ this.tags.join(`, `) } in ${ element.id }`);
                // parse recipes
                this.parse();
                // notify recipes list
                this.notify({
                    event: EVENT_RECIPES_UPDATE,
                    recipes: this.recipes
                });
                // notify tags lists
                this.notify({
                    event: EVENT_TAGS_LIST_UPDATE,
                    id: `ingredients-tag-list`,
                    tags: this.ingredients
                });
                this.notify({
                    event: EVENT_TAGS_LIST_UPDATE,
                    id: `appliances-tag-list`,
                    tags: this.appliances
                });
                this.notify({
                    event: EVENT_TAGS_LIST_UPDATE,
                    id: `ustensils-tag-list`,
                    tags: this.ustensils
                });
                break;
            default :
                throw new Error(`${ this.name }: unhandled notification type`);
            }
        }
    },
    // recipes search object - add the observee/observer functionality
    searchEngine = class extends observerMixin(observeeMixin(search)) {};

export {searchEngine};