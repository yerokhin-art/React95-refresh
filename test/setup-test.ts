import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

function getStyledDeclarations(element: Element): Map<string, string> {
  const declarations = new Map<string, string>();
  const classes = Array.from(element.classList);
  if (classes.length === 0) {
    return declarations;
  }

  const styleTags = Array.from(document.querySelectorAll('style[data-styled]'));
  const cssText = styleTags.map(tag => tag.textContent || '').join('\n');

  for (const className of classes) {
    const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match selector blocks containing .className (but not pseudo-selectors like .className:hover)
    const blockRegex = new RegExp(
      `\\.${escaped}(?![a-zA-Z0-9_-]|\\s*:)[^{]*\\{([^}]*)\\}`,
      'g'
    );
    for (const match of cssText.matchAll(blockRegex)) {
      const body = match[1];
      for (const decl of body.split(';')) {
        const colonIdx = decl.indexOf(':');
        if (colonIdx !== -1) {
          const prop = decl.slice(0, colonIdx).trim();
          const val = decl.slice(colonIdx + 1).trim();
          if (prop && val) {
            declarations.set(prop, val);
          }
        }
      }
    }
  }

  return declarations;
}

function normalizeCssValue(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',')
    .trim();
}

expect.extend({
  toHaveStyleRule(received: unknown, property: string, expected: string) {
    if (!(received instanceof Element)) {
      return {
        pass: false,
        message: () => `Expected ${String(received)} to be a DOM Element`
      };
    }

    const declarations = getStyledDeclarations(received);
    const actual =
      declarations.get(property) ??
      window.getComputedStyle(received).getPropertyValue(property).trim();

    if (!actual) {
      return {
        pass: false,
        message: () =>
          `Property '${property}' not found in style rules for element`
      };
    }

    const pass = normalizeCssValue(actual) === normalizeCssValue(expected);

    return {
      pass,
      message: () =>
        `Expected '${property}' ${this.isNot ? 'not ' : ''}to be '${expected}', but received '${actual}'`
    };
  }
});

declare module 'vitest' {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown
  > extends TestingLibraryMatchers<any, R> {
    toHaveStyleRule(property: string, value: string): R;
  }
}
