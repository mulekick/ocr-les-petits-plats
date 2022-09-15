// import modules
import {observeeMixin, observerMixin} from "../utils/classMixins.js";
// import recipes from "./recipes.js";

const
    // recipes search object
    search = class {
        // constructor
        constructor(name) {
            // store the logger name
            this.name = name;
        }

        // search criteria update notification
        writeToconsole({event, element}) {
            // execute on observee's notifications
            switch (event) {
            case `textSearchValueChange` :
                console.log(`${ this.name }: search text changed to ${ element.value } in ${ element.id }`);
                break;
            case `tagValueChange` :
                console.log(`${ this.name }: searcg tag changed to ${ element.value } in ${ element.id }`);
                break;
            default :
                throw new Error(`${ this.name }: unhandled notification type`);
            }
        }
    },
    // recipes search object - add the observee/observer functionality
    searchEngine = class extends observerMixin(observeeMixin(search)) {};

export {searchEngine};