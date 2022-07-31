"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_utils_1 = require("loader-utils");
const path = require("path");
const schema_utils_1 = require("schema-utils");
const transformSync_1 = require("./transformSync");
const schema_1 = require("./schema");
const resourceDirectory = path.resolve(__dirname, '..', 'virtual-loader');
function shouldTransformSourceCode(sourceCode) {
    return sourceCode.indexOf('__styles') !== -1;
}
/**
 * Webpack can also pass sourcemaps as a string, Babel accepts only objects.
 * See https://github.com/babel/babel-loader/pull/889.
 */
function parseSourceMap(inputSourceMap) {
    try {
        if (typeof inputSourceMap === 'string') {
            return JSON.parse(inputSourceMap);
        }
        return inputSourceMap;
    }
    catch (err) {
        return undefined;
    }
}
function webpackLoader(sourceCode, inputSourceMap) {
    this.async();
    // Loaders are cacheable by default, but in edge cases/bugs when caching does not work until it's specified:
    // https://github.com/webpack/webpack/issues/14946
    this.cacheable();
    const options = (0, loader_utils_1.getOptions)(this);
    (0, schema_utils_1.validate)(schema_1.configSchema, options, {
        name: '@griffel/webpack-extraction-plugin/loader',
        baseDataPath: 'options',
    });
    // Early return to handle cases when __styles() calls are not present, allows skipping expensive invocation of Babel
    if (!shouldTransformSourceCode(sourceCode)) {
        this.callback(null, sourceCode, inputSourceMap);
        return;
    }
    let result = null;
    let error = null;
    try {
        result = (0, transformSync_1.transformSync)(sourceCode, {
            filename: path.relative(process.cwd(), this.resourcePath),
            resourceDirectory,
            enableSourceMaps: this.sourceMap || false,
            inputSourceMap: parseSourceMap(inputSourceMap),
        });
    }
    catch (err) {
        error = err;
    }
    if (result) {
        this.callback(null, result.code, result.sourceMap);
        return;
    }
    this.callback(error);
}
exports.default = webpackLoader;
//# sourceMappingURL=webpackLoader.js.map