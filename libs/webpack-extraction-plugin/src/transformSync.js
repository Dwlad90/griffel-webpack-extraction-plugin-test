"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformSync = void 0;
const Babel = require("@babel/core");
const babelPluginStripGriffelRuntime_1 = require("./babelPluginStripGriffelRuntime");
/**
 * Transforms passed source code with Babel, uses user's config for parsing, but ignores it for transforms.
 */
function transformSync(sourceCode, options) {
    // Parse the code first so Babel will use user's babel config for parsing
    // During transforms we don't want to use user's config
    const babelAST = Babel.parseSync(sourceCode, {
        caller: { name: 'griffel' },
        filename: options.filename,
        inputSourceMap: options.inputSourceMap,
        sourceMaps: options.enableSourceMaps,
    });
    if (babelAST === null) {
        throw new Error(`Failed to create AST for "${options.filename}" due unknown Babel error...`);
    }
    const babelFileResult = Babel.transformFromAstSync(babelAST, sourceCode, {
        // Ignore all user's configs and apply only our plugin
        babelrc: false,
        configFile: false,
        plugins: [[babelPluginStripGriffelRuntime_1.babelPluginStripGriffelRuntime, { resourceDirectory: options.resourceDirectory }]],
        filename: options.filename,
        sourceMaps: options.enableSourceMaps,
        sourceFileName: options.filename,
        inputSourceMap: options.inputSourceMap,
    });
    if (babelFileResult === null) {
        throw new Error(`Failed to transform "${options.filename}" due unknown Babel error...`);
    }
    return {
        code: babelFileResult.code,
        cssRules: babelFileResult.metadata.cssRules,
        sourceMap: babelFileResult.map === null ? undefined : babelFileResult.map,
    };
}
exports.transformSync = transformSync;
//# sourceMappingURL=transformSync.js.map