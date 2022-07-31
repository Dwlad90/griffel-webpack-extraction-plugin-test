"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortCSSRules = exports.getStyleBucketNameFromElement = exports.getElementReference = exports.getElementMetadata = exports.getSelectorFromElement = void 0;
const core_1 = require("@griffel/core");
const stylis_1 = require("stylis");
function getSelectorFromElement(element) {
    return (0, stylis_1.tokenize)(element.value).slice(1).join('');
}
exports.getSelectorFromElement = getSelectorFromElement;
function getElementMetadata(element) {
    if (element.type === stylis_1.MEDIA) {
        return element.value.replace(/^@media/, '').trim();
    }
    return '';
}
exports.getElementMetadata = getElementMetadata;
function getElementReference(element, suffix = '') {
    if (element.type === stylis_1.RULESET || element.type === stylis_1.KEYFRAMES) {
        return element.value + suffix;
    }
    if (Array.isArray(element.children)) {
        return element.value + '[' + element.children.map(child => getElementReference(child, suffix)).join(',') + ']';
    }
    function removeRootProperty(element) {
        return Object.assign(Object.assign({}, element), { children: Array.isArray(element.children)
                ? element.children.map(child => removeRootProperty(child))
                : element.children, root: undefined, parent: undefined });
    }
    throw new Error([
        'getElementReference(): An unhandled case, please report if it happens and provide debug information about an element:',
        JSON.stringify(removeRootProperty(element), null, 2),
    ].join('\n'));
}
exports.getElementReference = getElementReference;
function getStyleBucketNameFromElement(element) {
    if (element.type === stylis_1.KEYFRAMES) {
        return 'k';
    }
    return (0, core_1.getStyleBucketName)(getSelectorFromElement(element), element.type === '@layer' ? element.value : '', element.type === stylis_1.MEDIA ? element.value : '', element.type === stylis_1.SUPPORTS ? element.value : '');
}
exports.getStyleBucketNameFromElement = getStyleBucketNameFromElement;
function sortCSSRules(css, compareMediaQueries) {
    const childElements = (0, stylis_1.compile)(css)
        // Remove top level comments as it is unclear how to sort them
        .filter(element => element.type !== stylis_1.COMMENT)
        .map(element => (Object.assign(Object.assign({}, element), { bucketName: getStyleBucketNameFromElement(element), metadata: getElementMetadata(element), reference: getElementReference(element) })));
    const uniqueElements = childElements.reduce((acc, element) => {
        acc[element.reference] = element;
        return acc;
    }, {});
    const sortedElements = Object.values(uniqueElements).sort((elementA, elementB) => {
        if (elementA.bucketName === 'm' && elementB.bucketName === 'm') {
            return compareMediaQueries(elementA.metadata, elementB.metadata);
        }
        if (elementA.bucketName === elementB.bucketName) {
            return 0;
        }
        return core_1.styleBucketOrdering.indexOf(elementA.bucketName) - core_1.styleBucketOrdering.indexOf(elementB.bucketName);
    });
    return (0, stylis_1.serialize)(sortedElements, stylis_1.stringify);
}
exports.sortCSSRules = sortCSSRules;
//# sourceMappingURL=sortCSSRules.js.map