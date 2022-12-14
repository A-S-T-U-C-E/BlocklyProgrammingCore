/**
 * @fileoverview EsLint configuration file.
 * @author preetvadaliya@gmail.com (Preet P. Vadaliya)
 */

module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
    },
    'extends': [
        "google",
        "prettier"
    ],
    'overrides': [],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
    },
    'rules': {},
};