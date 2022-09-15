/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

// import modules
import {domElementCreator} from "../utils/domElementCreator.js";
import {observeeMixin} from "../utils/classMixins.js";

const
    // -------------------------------------------------------
    // base class for the factory; it will be extended to provide objects with methods to override
    observeeInput = class extends observeeMixin(domElementCreator) {
        // constructor
        constructor(id, placeholder, icon) {
            // call superclass constructor
            super();
            // assign properties
            this.id = id;
            this.placeholder = placeholder;
            this.icon = `fa-solid fa-${ icon }`;
        }

        // retrieve DOM element to insert (important : this is a method - not a getter)
        // this method will be overriden in subclasses to respect the factory pattern
        get() {}
    },
    // constructor is not specified since it would be empty
    searchInput = class extends observeeInput {
        // use a factory function to override the superclass
        // method and create then search input in the DOM
        get() {
            const
                // specify new DOM elements to create
                [ input, span, i ] = [ {
                    tag: `input`,
                    attributes: [ {attr: `type`, value: `text`}, {attr: `id`, value: this.id}, {attr: `placeholder`, value: this.placeholder} ],
                    // notify observers
                    listeners: [ {
                        event: `change`,
                        // event: `input`, !!! TBC
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
                    attributes: [ {attr: `class`, value: this.icon} ]
                // use an arrow function expression so 'this' points to the photographer
                // instance inside it and it is possible to access the superclass's method
                } ].map(x => this.create(x));

            // append i to span
            [ i ].forEach(x => span.appendChild(x));

            // return input and span
            return [ input, span ];
        }

    },
    // constructor is not specified since it would be empty
    tagInput = class extends observeeInput {
        // use a factory function to override the superclass
        // method and create then search input in the DOM
        get() {
            const
                // specify new DOM elements to create
                [ input, span, i ] = [ {
                    tag: `input`,
                    attributes: [ {attr: `type`, value: `text`}, {attr: `id`, value: this.id}, {attr: `placeholder`, value: this.placeholder} ],
                    // notify observers
                    listeners: [ {
                        event: `change`,
                        // event: `input`, !!! TBC
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
                    attributes: [ {attr: `class`, value: this.icon} ]
                // use an arrow function expression so 'this' points to the photographer
                // instance inside it and it is possible to access the superclass's method
                } ].map(x => this.create(x));

            // append i to span
            [ i ].forEach(x => span.appendChild(x));

            // return input and span
            return [ input, span ];
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