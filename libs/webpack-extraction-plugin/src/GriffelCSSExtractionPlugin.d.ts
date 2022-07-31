import { GriffelRenderer } from '@griffel/core';
import type { Compiler } from 'webpack';
declare type GriffelCSSExtractionPluginOptions = {
    compareMediaQueries?: GriffelRenderer['compareMediaQueries'];
};
export declare class GriffelCSSExtractionPlugin {
    static loader: string;
    private readonly compareMediaQueries;
    constructor(options?: GriffelCSSExtractionPluginOptions);
    apply(compiler: Compiler): void;
}
export {};
