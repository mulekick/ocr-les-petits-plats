const
    // this class will be extended to provide subclasses instances with the ability to create new elements in the DOM
    domElementCreator = class {
        // DOM element creation
        create({tag = null, attributes = null, properties = null, listeners = null}) {
            if (typeof tag !== `string`)
                // throw error if tag is invalid
                throw new TypeError(`impossible to create new element: tag parameter is invalid.`);

            const
                // create DOM element
                element = document.createElement(tag);

            if (attributes instanceof Array)
                // append element attributes
                attributes.forEach(({attr, value}) => {
                    const
                        // create new attribute node
                        newAttribute = document.createAttribute(attr);
                    // set value
                    newAttribute.value = value;
                    // add to new element
                    element.attributes.setNamedItem(newAttribute);
                });

            if (properties instanceof Array)
                // set element DOM properties
                properties.forEach(({prop, value}) => (element[prop] = value));

            if (listeners instanceof Array)
                // set element listeners
                listeners.forEach(({event, callback}) => element.addEventListener(event, callback.bind(this), {
                    // don't override the event dispatching order
                    capture: false,
                    // execute callback each time the event is triggered
                    once: false,
                    // keep the ability to call preventDefault()
                    passive: false
                }));

            // return new element
            return element;
        }
    };

export {domElementCreator};