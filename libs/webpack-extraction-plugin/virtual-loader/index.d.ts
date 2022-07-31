export default virtualLoader;
/**
 * @this {import('webpack').LoaderContext<unknown>}
 * @return {String}
 */
declare function virtualLoader(): string;
/**
 * Moves CSSloader to the end of the loader queue so it runs first.
 */
/**
 * @this {import('webpack').LoaderContext<unknown>}
 * @return {void}
 */
export function pitch(): void;
