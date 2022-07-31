import * as Babel from '@babel/core';
export declare type TransformOptions = {
    filename: string;
    resourceDirectory: string;
    inputSourceMap: Babel.TransformOptions['inputSourceMap'];
    enableSourceMaps: boolean;
};
export declare type TransformResult = {
    code: string;
    cssRules: string[] | undefined;
    sourceMap: NonNullable<Babel.BabelFileResult['map']> | undefined;
};
/**
 * Transforms passed source code with Babel, uses user's config for parsing, but ignores it for transforms.
 */
export declare function transformSync(sourceCode: string, options: TransformOptions): TransformResult;
