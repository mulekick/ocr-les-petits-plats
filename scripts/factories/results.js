/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

// import modules
import {domElementCreator} from "../utils/domElementCreator.js";
import {observerMixin} from "../utils/classMixins.js";

const
    // declare the 'observer element' class
    observerElement = class extends observerMixin(domElementCreator) {
        // constructor (rest parameters and retrieve an array)
        constructor(...params) {
            // call base class constructor (spread parameters array and pass individual parameters)
            super(...params);
            // init DOM element property (DOM may have to be updated somehow on observee's notifications)
            this.domElement = null;
        }

        // DOM element getter
        get element() { return this.domElement; }

        // DOM element setter
        set element(e) { this.domElement = e; }

        // retrieve DOM element to insert (important : this is a method - not a getter)
        // this method will be overriden in subclasses to respect the factory pattern
        get() {}

        // update DOM element content on observee's notifications
        refresh() {}
    },
    // constructor is not specified since it would be empty
    tagList = class extends observerElement {
        // use a factory function to override the superclass method
        get(id) {
            const
                // specify new DOM elements to create
                [ ul ] = [ {
                    tag: `ul`,
                    attributes: [ {attr: `id`, value: id}, {attr: `class`, value: `display-none`} ]
                // use an arrow function expression so 'this' points to the parent scope
                } ].map(x => this.create(x));

            // return ul
            return ul;
        }

        // refresh tags list
        refresh(tags) {
            // clear old list
            this.element.replaceChildren();
            this.element.classList.remove(`taglist-cols-1`, `taglist-cols-2`, `taglist-cols-3`);
            // if there are tags to display ...
            if (tags && tags.length) {
                const
                    // manage display layout
                    cols = Math.min(Math.floor((tags.length - 1) / 10) + 1, 3);
                // populate new list
                this.element.classList.add(`taglist-cols-${ String(cols) }`);
                // use an arrow function expression so 'this' points to the parent scope
                this.element.append(...tags.map(tag => this.create({
                    tag: `li`,
                    properties: [ {prop: `textContent`, value: tag} ],
                    listeners: [ {
                        event: `click`,
                        // we're not using the observer pattern on the tags selection list and
                        // the selected tags list since it is assessed that the only observer
                        // and observee interactions occur between input controls, search engine
                        // and results display controls
                        callback: e => {
                            const
                                // retrieve selected tags list
                                selectedTags = e.target.parentElement.parentElement.parentElement.previousElementSibling;

                            // do not add duplicate tags
                            if (Array.from(selectedTags.children).some(x => x.textContent === e.target.textContent))
                                return;

                            const
                                // clone current node
                                newTag = e.target.cloneNode(true),
                                // create close icon node
                                closeTag = this.create({
                                    tag: `i`,
                                    attributes: [ {attr: `class`, value: `fa-solid fa-rectangle-xmark`} ],
                                    // notify observers
                                    listeners: [ {
                                        event: `click`,
                                        callback: function(ev) {
                                            console.log(`removing tag ${ ev.target.parentElement.textContent }`);
                                            // remove tag from DOM
                                            ev.target.parentElement.remove();
                                            // dispatch element on parent div
                                            this.dispatchEvent(new Event(`wheel`));

                                            // retrieve tags filter inputs
                                            for (let x = this.nextElementSibling.firstElementChild; x instanceof Element; x = x.nextElementSibling)
                                                // dispatch new event to trigger the update
                                                x.firstElementChild.firstElementChild.dispatchEvent(new Event(`input`));
                                        // bind the listener to the selected tags so we can
                                        // dispatch an event on it after the tag is removed
                                        }.bind(selectedTags)
                                    } ]
                                });
                            // add custom class to cloned node
                            newTag.classList.add(`${ e.target.parentElement.id }-selected`);
                            // append icon to element
                            newTag.append(closeTag);
                            // append new tag to list
                            selectedTags.append(newTag);
                            // dispatch input event to it to trigger the update
                            selectedTags.dispatchEvent(new Event(`wheel`));
                            // retrieve tags filter inputs
                            for (let x = selectedTags.nextElementSibling.firstElementChild; x instanceof Element; x = x.nextElementSibling)
                                // dispatch new event to trigger the update
                                x.firstElementChild.firstElementChild.dispatchEvent(new Event(`input`));
                        }
                    } ]
                })));
            }
        }
    },
    // constructor is not specified since it would be empty
    recipeslist = class extends observerElement {
        // use a factory function to override the superclass method
        get(id) {
            const
                // specify new DOM elements to create
                [ div ] = [ {
                    tag: `div`,
                    attributes: [ {attr: `id`, value: id}, {attr: `class`, value: `recipes`} ]
                // use an arrow function expression so 'this' points to the parent scope
                } ].map(x => this.create(x));

            // return input and span
            return div;
        }

        // refresh recipes list
        refresh(recipes) {
            // clear old list
            this.element.replaceChildren();
            // if there are recipes to display ...
            if (recipes && recipes.length) {
                // use an arrow function expression so 'this' points to the parent scope
                recipes.forEach(r => {
                    const
                        // read recipe properties
                        {name, ingredients, time, description} = r,
                        // specify new DOM elements to create
                        [ article, div1, div2, h2, i, span1, div3, span2 ] = [ {
                            tag: `article`
                        }, {
                            tag: `div`
                        }, {
                            tag: `div`
                        }, {
                            tag: `h2`,
                            properties: [ {prop: `textContent`, value: name} ]
                        }, {
                            tag: `i`,
                            attributes: [ {attr: `class`, value: `fa-regular fa-clock`} ]
                        }, {
                            tag: `span`,
                            attributes: [ {attr: `class`, value: `large`} ],
                            properties: [ {prop: `textContent`, value: `${ String(time) } min`} ]
                        }, {
                            tag: `div`
                        }, {
                            tag: `span`,
                            attributes: [ {attr: `class`, value: `small`} ],
                            properties: [ {prop: `textContent`, value: description} ]
                        // use an arrow function expression so 'this' points to the parent scope
                        } ].map(x => this.create(x));
                    // create ingredients list
                    ingredients
                        .forEach(j => {
                            const
                                // read ingredient properties
                                {ingredient, quantity, unit} = j,
                                // specify new DOM elements to create
                                [ span, b ] = [ {
                                    tag: `span`,
                                    attributes: [ {attr: `class`, value: `small`} ]
                                }, {
                                    tag: `b`,
                                    properties: [ {prop: `textContent`, value: ingredient} ]
                                // use an arrow function expression so 'this' points to the parent scope
                                } ].map(x => this.create(x));

                            // append b and string object to span
                            span.append(b, `: ${ quantity || `` } ${ unit || `` }`);

                            // append span to div3
                            div3.append(span);
                        });

                    // append h2, i, span1, div3, span2 to div2
                    div2.append(h2, i, span1, div3, span2);

                    // append div1 and div2 to article
                    article.append(div1, div2);

                    // append article to recipes list
                    this.element.append(article);
                });
            // else, create a span with 'no results" ...
            } else {
                const
                    // specify new DOM elements to create
                    [ span, b ] = [ {
                        tag: `span`,
                        attributes: [ {attr: `class`, value: `large`} ]
                    }, {
                        tag: `b`,
                        properties: [ {prop: `textContent`, value: `Aucune recette ne correspond ?? votre crit??re ... vous pouvez chercher "tarte aux pommes", "poisson", etc ...`} ]
                    // use an arrow function expression so 'this' points to the parent scope
                    } ].map(x => this.create(x));

                // append b to span
                span.append(b);

                // append span to recipes list
                this.element.append(span);
            }
        }
    },
    // actual results factory
    resultsFactory = function(type, cb) {
        // select the instance to create
        switch (type) {
        case `tag` :
            return new tagList(cb);
        case `recipes` :
            return new recipeslist(cb);
        default :
            throw new TypeError(`invalid values provided, photographer factory can't return an object`);
        }
    };

export {resultsFactory};