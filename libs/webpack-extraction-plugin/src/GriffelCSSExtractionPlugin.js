"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GriffelCSSExtractionPlugin = void 0;
const core_1 = require("@griffel/core");
const webpack_1 = require("webpack");
const sortCSSRules_1 = require("./sortCSSRules");
/**
 * Forces all files with `griffel.css` be concatenated into a single asset.
 */
function forceCSSIntoOneStyleSheet(compiler) {
    var _a, _b, _c;
    var _d, _e, _f;
    (_a = (_d = compiler.options).optimization) !== null && _a !== void 0 ? _a : (_d.optimization = {});
    (_b = (_e = compiler.options.optimization).splitChunks) !== null && _b !== void 0 ? _b : (_e.splitChunks = {});
    (_c = (_f = compiler.options.optimization.splitChunks).cacheGroups) !== null && _c !== void 0 ? _c : (_f.cacheGroups = {});
    compiler.options.optimization.splitChunks.cacheGroups['griffel'] = {
        name: `griffel`,
        type: 'css/mini-extract',
        chunks: 'all',
        test: /virtual-loader\/griffel\.css$/,
        enforce: true,
    };
}
function getAssetSourceContents(assetSource) {
    const source = assetSource.source();
    if (typeof source === 'string') {
        return source;
    }
    return source.toString();
}
class GriffelCSSExtractionPlugin {
    constructor(options) {
        var _a;
        this.compareMediaQueries = (_a = options === null || options === void 0 ? void 0 : options.compareMediaQueries) !== null && _a !== void 0 ? _a : core_1.defaultCompareMediaQueries;
    }
    apply(compiler) {
        forceCSSIntoOneStyleSheet(compiler);
        compiler.hooks.compilation.tap('GriffelExtractPlugin', compilation => {
            compilation.hooks.processAssets.tap({
                name: 'GriffelExtractPlugin',
                stage: webpack_1.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
            }, assets => {
                const griffelAsset = Object.entries(assets).find(([assetName]) => assetName.includes('griffel'));
                if (!griffelAsset) {
                    return;
                }
                const [assetName, assetSource] = griffelAsset;
                const unsortedCSSRules = getAssetSourceContents(assetSource);
                const sortedCSSRules = (0, sortCSSRules_1.sortCSSRules)(unsortedCSSRules, this.compareMediaQueries);
                compilation.updateAsset(assetName, new compiler.webpack.sources.RawSource(sortedCSSRules));
            });
        });
    }
}
exports.GriffelCSSExtractionPlugin = GriffelCSSExtractionPlugin;
GriffelCSSExtractionPlugin.loader = require.resolve('./webpackLoader');
//# sourceMappingURL=GriffelCSSExtractionPlugin.js.map