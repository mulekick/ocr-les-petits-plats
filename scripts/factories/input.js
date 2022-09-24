/* eslint-disable no-invalid-this */
/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

// import modules
import {domElementCreator} from "../utils/domElementCreator.js";
import {observeeMixin} from "../utils/classMixins.js";
import {EVENT_TEXT_SEARCH, EVENT_TAGS_SEARCH, EVENT_TAGS_LIST_UPDATE, EVENT_TAGS_SELECTED} from "../utils/config.js";
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
                        event: `input`,
                        callback: function(e) {
                            // listener will be bound to searchInput instance during DOM element creation
                            this.notify({
                                event: EVENT_TEXT_SEARCH,
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
                        event: `input`,
                        callback: function(e) {
                            // listener will be bound to searchInput instance during DOM element creation
                            this.notify({
                                event: EVENT_TAGS_SEARCH,
                                element: e.target
                            });
                        }
                    } ]
                }, {
                    tag: `span`,
                    attributes: [ {attr: `class`, value: `icon`} ]
                }, {
                    tag: `i`,
                    attributes: [ {attr: `class`, value: `fa-solid fa-chevron-down select-icon`} ],
                    // managge icon animation
                    listeners: [ {
                        event: `click`,
                        callback: e => {
                            const
                                // retrieve tags list
                                t = e.target.parentElement.parentElement.nextElementSibling;
                            // toggle tags list styles
                            [ `taglist`, `display-none` ].forEach(x => t.classList.toggle(x));
                            // remove animations, recompute styles and repaint document
                            e.target.classList.remove(`list-open`, `list-close`);
                            // first callback is executed before repaint ...
                            requestAnimationFrame(() => {
                                // second callback is executed after repaint, styles have been recomputed
                                requestAnimationFrame(() => {
                                    // add animation styles again so they run on next repaint
                                    e.target.classList.add(t.classList.contains(`taglist`) ? `list-open` : `list-close`);
                                });
                            });
                        }
                    } ]
                // use an arrow function expression so 'this' points to the parent scope
                } ].map(x => this.create(x)),
                // create tags list
                tagList = new resultsFactory(`tag`, function({event, id, tags}) {
                    // if current element is relevant to notification
                    if (event === EVENT_TAGS_LIST_UPDATE &&  id === this.element.id)
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
    // constructor is not specified since it would be empty
    selectedTagsInput = class extends observeeInput {
        // use a factory function to override the superclass method
        get() {
            const
                // specify new DOM elements to create
                [ ul ] = [ {
                    tag: `ul`,
                    attributes: [ {attr: `id`, value: this.id}, {attr: `class`, value: `selectedTagList`} ],
                    // notify observers
                    listeners: [ {
                        event: `wheel`,
                        callback: function(e) {
                            // !!! REMOVE DUPLICATE TAGS !!!
                            // listener will be bound to searchInput instance during DOM element creation
                            this.notify({
                                event: EVENT_TAGS_SELECTED,
                                element: e.target
                            });
                        }
                    } ]
                // use an arrow function expression so 'this' points to the parent scope
                } ].map(x => this.create(x));

            // return div1
            return ul;
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
        case `selected` :
            return new selectedTagsInput(id);
        default :
            throw new TypeError(`invalid values provided, photographer factory can't return an object`);
        }
    };

export {inputFactory};