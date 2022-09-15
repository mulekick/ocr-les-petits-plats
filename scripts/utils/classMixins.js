const
    // use a symbol so the callback property name does not collide with anything in the prototype chain
    NOTIFICATION_CALLBACK = Symbol(`notification callback`),
    // add the observee feature to native objects through a class mixin
    observeeMixin = baseClass => class extends baseClass {
        // constructor (rest parameters and retrieve an array)
        constructor(...params) {
            // call base class constructor (spread parameters array and pass individual parameters)
            super(...params);
            // store observers list
            this.observers = new Set();
        }

        // subscribe method
        subscribe(o) {
            // throw error if object does not extend observer
            if (NOTIFICATION_CALLBACK in o === false)
                throw new Error(`object does not extend the observer class`);
            // throw error if object is already subbed
            if (this.observers.has(o) === true)
                throw new Error(`object passed as parameter is already a subscriber`);
            // append object to the observers set
            this.observers.add(o);
        }

        // unsubscribe method
        unsubscribe(o) {
            // throw error if object is not subbed
            if (this.observers.has(o) === false)
                throw new Error(`object passed as parameter is not a subscriber`);
            // remove object from the observers set
            this.observers.delete(o);
        }

        // notify method
        notify(e) {
            // loop on registered observers
            for (const o of this.observers)
                // fire callbacks
                void o[NOTIFICATION_CALLBACK](e);
        }
    },
    // add the observer feature to native objects through a class mixin
    observerMixin = baseClass => class extends baseClass {
        // constructor (rest parameters and retrieve an array)
        constructor(...params) {
            const
                // extract callback
                cb = params.pop();
            // throw error if cb is not a function
            if (typeof cb !== `function`)
                throw new TypeError(`callback parameter is not a function`);
            // call base class constructor (spread parameters array and pass individual parameters)
            super(...params);
            // and store the callback to execute on observee's notifications
            this[NOTIFICATION_CALLBACK] = cb;
        }
    };

export {observeeMixin, observerMixin};