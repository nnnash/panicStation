'use strict';

module.exports = {
    plugins: {
        'postcss-for': true,
        'postcss-random': true,
        'postcss-math': true,
        'postcss-simple-vars': true,
        'postcss-font-magician': {
            variants: {
                'Exo 2': {
                    '100': [],
                    '200': [],
                    '300': []
                }
            },
            foundries: ['google'],
        },
        'postcss-preset-env': {
            stage: 1,
            features: {
                'nesting-rules': true,
            },
        },
        'autoprefixer': true,
    },
};
