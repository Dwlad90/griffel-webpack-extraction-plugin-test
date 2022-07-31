import * as webpack from 'webpack';
declare type WebpackLoaderOptions = never;
declare type WebpackLoaderParams = Parameters<webpack.LoaderDefinitionFunction<WebpackLoaderOptions>>;
declare function webpackLoader(this: webpack.LoaderContext<never>, sourceCode: WebpackLoaderParams[0], inputSourceMap: WebpackLoaderParams[1]): void;
export default webpackLoader;
