import { GriffelRenderer, StyleBucketName } from '@griffel/core';
import { Element } from 'stylis';
export declare function getSelectorFromElement(element: Element): string;
export declare function getElementMetadata(element: Element): string;
export declare function getElementReference(element: Element, suffix?: string): string;
export declare function getStyleBucketNameFromElement(element: Element): StyleBucketName;
export declare function sortCSSRules(css: string, compareMediaQueries: GriffelRenderer['compareMediaQueries']): string;
