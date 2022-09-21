// import modules
import {observeeMixin, observerMixin} from "../utils/classMixins.js";
import recipes from "./recipes.js";

const
    // for test
    shuffle = a => {
        let
            [ len, tmp, rnd ] = [ a.length, null, null ];
        // while elements remain to shuffle...
        while (len >= 0) {
            // pick one of the remaining elements at random...
            rnd = Math.floor(Math.random() * --len);
            // and swap it with the current element.
            tmp = a[len];
            a[len] = a[rnd];
            a[rnd] = tmp;
        }
        return a;
    },
    // recipes search object
    search = class {
        // constructor
        constructor(name) {
            // store the logger name
            this.name = name;
            // store current recipes
            this.recipes = recipes.slice(0, 6);
            // store current tags lists
            this.ingredients = [
                `Lait de coco`,
                `Jus de citron`,
                `Crème de coco`,
                `Sucre`,
                `Glaçons`,
                `Poulet`,
                `Coulis de tomate`,
                `Oignon`,
                `Poivron rouge`,
                `Huile d'olive`
            ];
            this.appliances = [
                `Cuiseur de riz`,
                `Four`,
                `Saladier`,
                `Casserole`
            ];
            this.ustensils = [
                `couteau`,
                `économe`,
                `cuillère en bois`,
                `poelle à frire`,
                `louche`,
                `râpe à fromage`
            ];
            // store current selected tags
            this.tags = null;
        }

        // search criteria update notification
        find({event, element}) {
            // eslint compliant
            let match = null;
            // execute on observee's notifications
            switch (event) {
            case `textSearchInputChange` :
                // reset results and tags if input length is less than 3
                console.log(`${ this.name }: search text changed to ${ element.value } in ${ element.id }`);
                // notify recipes list
                this.notify({
                    event: `recipesListUpdate`,
                    recipes: element.value.length < 3 ? null : shuffle(this.recipes)
                });
                // notify tags lists
                this.notify({
                    event: `tagListUpdate`,
                    id: `ingredients-tag-list`,
                    tags: element.value.length < 3 ? null : shuffle(this.ingredients)
                });
                this.notify({
                    event: `tagListUpdate`,
                    id: `appliances-tag-list`,
                    tags: element.value.length < 3 ? null : shuffle(this.appliances)
                });
                this.notify({
                    event: `tagListUpdate`,
                    id: `ustensils-tag-list`,
                    tags: element.value.length < 3 ? null : shuffle(this.ustensils)
                });
                break;
            case `tagInputChange` :
                // filter tags matching input
                console.log(`${ this.name }: search tag changed to ${ element.value } in ${ element.id }`);
                // test tag list id
                match = element.id.match(/(?<list>\w+)-tag/u);
                // throw error if not found
                if (match === null)
                    throw new Error(`${ this.name }: invalid tag filter id`);
                // notify observer div with new list
                this.notify({
                    event: `tagListUpdate`,
                    id: `${ element.id }-list`,
                    tags: this[match.pop()].filter(x => new RegExp(element.value, `gui`).test(x))
                });
                break;
            case `selectedTagsInputChange` :
                // update current selected tags
                this.tags = Array.from(element.children).map(x => x.textContent);
                console.log(`${ this.name }: selected tags list changed to ${ this.tags.join(`, `) } in ${ element.id }`);
                break;
            default :
                throw new Error(`${ this.name }: unhandled notification type`);
            }
        }
    },
    // recipes search object - add the observee/observer functionality
    searchEngine = class extends observerMixin(observeeMixin(search)) {};

export {searchEngine};