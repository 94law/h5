export default {
  extends: ['stylelint-config-html/vue', 'stylelint-config-standard'],
  rules: {
    'selector-class-pattern': '^[a-z][a-z-A-Z0-9-]*(?:__|-)?[a-z-A-Z0-9-]*$',
    'keyframes-name-pattern': '^[a-z][a-z-A-Z0-9-]*$',
    'font-family-no-missing-generic-family-keyword': null,
    'keyframe-block-no-duplicate-selectors': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'],
      },
    ],
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['dpx'],
      },
    ],
    'function-url-quotes': 'never',
    'no-descending-specificity': null,
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['v-bind'],
      },
    ],
  },
};
