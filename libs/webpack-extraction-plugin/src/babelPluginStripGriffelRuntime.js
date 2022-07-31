"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.babelPluginStripGriffelRuntime = exports.toURIComponent = exports.transformUrl = void 0;
const core_1 = require("@babel/core");
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const core_2 = require("@griffel/core");
const path = require("path");
const template_1 = require("@babel/template");
const virtualLoaderPath = process.env.NODE_ENV === 'test'
    ? path.relative(__dirname, 'virtual-loader')
    : '@griffel/webpack-extraction-plugin/virtual-loader';
const resourcePath = `${virtualLoaderPath}/griffel.css`;
function transformUrl(filename, resourceDirectory, assetPath) {
    // Get the absolute path to the asset from the path relative to the JS file
    const absoluteAssetPath = path.resolve(path.dirname(filename), assetPath);
    // Replace asset path with new path relative to the output CSS
    return path.relative(resourceDirectory, absoluteAssetPath);
}
exports.transformUrl = transformUrl;
/**
 * Escapes a CSS rule to be a valid query param.
 * Also escapes escalamation marks (!) to not confuse webpack.
 *
 * @param rule
 * @returns
 */
const toURIComponent = (rule) => {
    const component = encodeURIComponent(rule).replace(/!/g, '%21');
    return component;
};
exports.toURIComponent = toURIComponent;
exports.babelPluginStripGriffelRuntime = (0, helper_plugin_utils_1.declare)((api, options) => {
    api.assertVersion(7);
    return {
        name: '@griffel/webpack-extraction-plugin/babel',
        pre() {
            this.cssRules = [];
        },
        post() {
            this.file.metadata.cssRules = this.cssRules;
        },
        visitor: {
            Program: {
                enter(path, state) {
                    if (typeof options.resourceDirectory === 'undefined') {
                        throw new Error([
                            '@griffel/webpack-extraction-plugin: This plugin requires "resourceDirectory" option to be specified. ',
                            "It's automatically done by our loaders. ",
                            "If you're facing this issue, please check your setup.\n\n",
                            'See: https://babeljs.io/docs/en/options#filename',
                        ].join(''));
                    }
                    if (typeof state.filename === 'undefined') {
                        throw new Error([
                            '@griffel/webpack-extraction-plugin: This plugin requires "filename" option to be specified by Babel. ',
                            "It's automatically done by our loaders. ",
                            "If you're facing this issue, please check your setup.\n\n",
                            'See: https://babeljs.io/docs/en/options#filename',
                        ].join(''));
                    }
                },
                exit(path, state) {
                    var _a;
                    path.traverse({
                        ImportSpecifier(path) {
                            const importedPath = path.get('imported');
                            if (!importedPath.isIdentifier({ name: '__styles' })) {
                                return;
                            }
                            const declarationPath = path.findParent(p => p.isImportDeclaration());
                            if (declarationPath === null) {
                                throw path.buildCodeFrameError([
                                    'Failed to find "ImportDeclaration" path for an "ImportSpecifier".',
                                    'Please report a bug (https://github.com/microsoft/griffel/issues) if this error happens',
                                ].join(' '));
                            }
                            declarationPath.pushContainer('specifiers', core_1.types.identifier('__css'));
                        },
                        /**
                         * Visits all call expressions (__styles function calls):
                         * - replaces "__styles" calls "__css"
                         * - removes CSS rules from "__styles" calls
                         */
                        CallExpression(path) {
                            const calleePath = path.get('callee');
                            if (!calleePath.isIdentifier({ name: '__styles' })) {
                                return;
                            }
                            calleePath.replaceWith(core_1.types.identifier('__css'));
                            const argumentPaths = path.get('arguments');
                            if (argumentPaths.length !== 2) {
                                throw calleePath.buildCodeFrameError([
                                    '"__styles" function call should have exactly two arguments.',
                                    'Please report a bug (https://github.com/microsoft/griffel/issues) if this error happens',
                                ].join(' '));
                            }
                            argumentPaths[1].traverse({
                                TemplateLiteral(literalPath) {
                                    const expressionPath = literalPath.get('expressions.0');
                                    if (Array.isArray(expressionPath) || !expressionPath.isIdentifier()) {
                                        throw literalPath.buildCodeFrameError([
                                            'A template literal with an imported asset should contain an expression statement.',
                                            'Please report a bug (https://github.com/microsoft/griffel/issues) if this error happens',
                                        ].join(' '));
                                    }
                                    const expressionName = expressionPath.node.name;
                                    const expressionBinding = literalPath.scope.getBinding(expressionName);
                                    if (typeof expressionBinding === 'undefined') {
                                        throw expressionPath.buildCodeFrameError([
                                            'Failed to resolve a binding in a scope for an identifier.',
                                            'Please report a bug (https://github.com/microsoft/griffel/issues) if this error happens',
                                        ].join(' '));
                                    }
                                    const importDeclarationPath = expressionBinding.path.findParent(p => p.isImportDeclaration());
                                    if (importDeclarationPath === null) {
                                        throw expressionBinding.path.buildCodeFrameError([
                                            'Failed to resolve an import for the identifier.',
                                            'Please report a bug (https://github.com/microsoft/griffel/issues) if this error happens',
                                        ].join(' '));
                                    }
                                    expressionPath.replaceWith(core_1.types.stringLiteral(
                                    // When imports are inlined, we need to adjust the relative paths inside url(..) expressions
                                    // to allow css-loader resolve an imported asset properly
                                    transformUrl(state.filename, options.resourceDirectory, importDeclarationPath.get('source').node.value)));
                                    importDeclarationPath.remove();
                                },
                            });
                            // Returns the styles as a JavaScript object
                            const evaluationResult = argumentPaths[1].evaluate();
                            if (!evaluationResult.confident) {
                                throw argumentPaths[1].buildCodeFrameError([
                                    'Failed to evaluate CSS rules from "__styles" call.',
                                    'Please report a bug (https://github.com/microsoft/griffel/issues) if this error happens',
                                ].join(' '));
                            }
                            const cssRulesByBucket = evaluationResult.value;
                            Object.values(cssRulesByBucket).forEach(cssBucketEntries => {
                                const cssRules = cssBucketEntries.map(cssBucketEntry => {
                                    const [cssRule] = (0, core_2.normalizeCSSBucketEntry)(cssBucketEntry);
                                    return cssRule;
                                });
                                state.cssRules.push(...cssRules);
                            });
                            argumentPaths[1].remove();
                        },
                    });
                    // Each found atomic rule will create a new import that uses the styleSheetPath provided.
                    // The benefit is two fold:
                    // (1) thread safe collection of styles
                    // (2) caching -- resulting in faster builds (one import per rule!)
                    const params = (0, exports.toURIComponent)(((_a = state === null || state === void 0 ? void 0 : state.cssRules) === null || _a === void 0 ? void 0 : _a.join('\n')) || '');
                    path.pushContainer('body', template_1.default.ast(`import "${virtualLoaderPath}!${resourcePath}?style=${params}";`));
                },
            },
        },
    };
});
//# sourceMappingURL=babelPluginStripGriffelRuntime.js.map