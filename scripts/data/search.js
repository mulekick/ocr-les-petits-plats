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
        }

        // search criteria update notification
        find({event, element}) {
            // execute on observee's notifications
            switch (event) {
            case `textSearchValueChange` :
                console.log(`${ this.name }: search text changed to ${ element.value } in ${ element.id }`);
                // notify recipes list
                this.notify({
                    event: `recipesListUpdate`,
                    recipes: shuffle(this.recipes)
                });
                // notify tags lists
                this.notify({
                    event: `tagListUpdate`,
                    id: `ingredients-tag-list`,
                    tags: shuffle(this.ingredients)
                });
                this.notify({
                    event: `tagListUpdate`,
                    id: `appliances-tag-list`,
                    tags: shuffle(this.appliances)
                });
                this.notify({
                    event: `tagListUpdate`,
                    id: `ustensils-tag-list`,
                    tags: shuffle(this.ustensils)
                });
                break;
            case `tagValueChange` :
                console.log(`${ this.name }: search tag changed to ${ element.value } in ${ element.id }`);
                break;
            default :
                throw new Error(`${ this.name }: unhandled notification type`);
            }
        }
    },
    // recipes search object - add the observee/observer functionality
    searchEngine = class extends observerMixin(observeeMixin(search)) {};

export {searchEngine};