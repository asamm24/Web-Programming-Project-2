/*
 * Module html-utils
 * helpful functions for manipulating the DOM and other
 * tasks
 */

// create a "template" DOM element that we can use
// in our functions for creating and returning DOM elements
const template = document.createElement("template");

/**
 * Convert a string to DOM elements
 * @param {String} htmlString 
 * @returns DOM tree for the provided html string
 */
export const parseHTML = function(htmlString) {
    template.innerHTML = htmlString;
    // returns a copy of the parsed DOM nodes, performing
    // a "deep" copy...deep copy means nodes and descendents
    // get duplicated
    return template.content.cloneNode(true);
};

/**
 *  Return a promise that resolves in a given time period
 * @param {Number} ms number of milliseconds
 * @returns Promise that resolves after a given time
 */
export const wait = function(ms) {
    return new Promise( resolve => {
        setTimeout(resolve, ms);
    });
}

