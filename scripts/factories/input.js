/* eslint-disable no-invalid-this */
/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

// import modules
import {domElementCreator} from "../utils/domElementCreator.js";
import {observeeMixin} from "../utils/classMixins.js";
import {resultsFactory} from "./results.js";

const
    // -------------------------------------------------------
    // base class for the factory; it will be extended to provide objects with methods to override
    observeeInput = class extends observeeMixin(domElementCreator) {
        // constructor
        constructor(id, placeholder) {
            // call superclass constructor
            super();
            // assign properties
            this.id = id;
            this.placeholder = placeholder;
        }

        // retrieve DOM element to insert (important : this is a method - not a getter)
        // this method will be overriden in subclasses to respect the factory pattern
        get() {}
    },
    // constructor is not specified since it would be empty
    searchInput = class extends observeeInput {
        // use a factory function to override the superclass method
        get() {
            const
                // specify new DOM elements to create
                [ input, span, i ] = [ {
                    tag: `input`,
                    attributes: [ {attr: `type`, value: `text`}, {attr: `id`, value: this.id}, {attr: `placeholder`, value: this.placeholder} ],
                    // notify observers
                    listeners: [ {
                        // event: `change`,
                        event: `input`,
                        callback: function(e) {
                            // listener will be bound to searchInput instance during DOM element creation
                            this.notify({
                                event: `textSearchValueChange`,
                                element: e.target
                            });
                        }
                    } ]
                }, {
                    tag: `span`,
                    attributes: [ {attr: `class`, value: `icon`} ]
                }, {
                    tag: `i`,
                    attributes: [ {attr: `class`, value: `fa-solid fa-magnifying-glass`} ]
                // use an arrow function expression so 'this' points to the parent scope
                } ].map(x => this.create(x));

            // append i to span
            span.append(i);

            // return input and span
            return [ input, span ];
        }

    },
    // constructor is not specified since it would be empty
    tagInput = class extends observeeInput {
        // use a factory function to override the superclass method
        get(engine) {
            const
                // specify new DOM elements to create
                [ div1, div2, input, span, i ] = [ {
                    tag: `div`
                }, {
                    tag: `div`
                }, {
                    tag: `input`,
                    attributes: [ {attr: `type`, value: `text`}, {attr: `id`, value: this.id}, {attr: `placeholder`, value: this.placeholder} ],
                    // notify observers
                    listeners: [ {
                        // event: `change`,
                        event: `input`,
                        callback: function(e) {
                            // listener will be bound to searchInput instance during DOM element creation
                            this.notify({
                                event: `tagValueChange`,
                                element: e.target
                            });
                        }
                    } ]
                }, {
                    tag: `span`,
                    attributes: [ {attr: `class`, value: `icon`} ]
                }, {
                    tag: `i`,
                    attributes: [ {attr: `class`, value: `fa-solid fa-chevron-down`} ]
                // use an arrow function expression so 'this' points to the parent scope
                } ].map(x => this.create(x)),
                // create tags list
                tagList = new resultsFactory(`tag`, function({event, id, tags}) {
                    // if current element is relevant to notification
                    if (event === `tagListUpdate` &&  id === this.element.id)
                        // refresh tags list
                        this.refresh(tags);
                });

            // tags list subscribes to search engine
            engine.subscribe(tagList);

            // store tags list DOM element, set id
            tagList.element = tagList.get(`${ this.id }-list`);

            // append i to span
            span.append(i);

            // append input and span to div2
            div2.append(input, span);

            // append div2 to div1
            div1.append(div2);

            // and append tags list DOM element to div1
            div1.append(tagList.element);

            // return div1
            return div1;
        }

    },
    // actual input factory
    inputFactory = function(type, id, placeholder, icon) {
        // select the instance to create
        switch (type) {
        case `search` :
            return new searchInput(id, placeholder, icon);
        case `tag` :
            return new tagInput(id, placeholder, icon);
        default :
            throw new TypeError(`invalid values provided, photographer factory can't return an object`);
        }
    };

export {inputFactory};