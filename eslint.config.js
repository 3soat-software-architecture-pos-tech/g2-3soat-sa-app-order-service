import globals from "globals";
import pluginJs from "@eslint/js";
import jsdoc from 'eslint-plugin-jsdoc';


export default [
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.jest
			}
		},
		plugins: {
			jsdoc,
		},
		rules: {
			"indent": ["error", "tab"],
			"no-trailing-spaces": "error",
			"no-multi-spaces": "error",
			"linebreak-style": ["error", "unix"],
			"no-console": "warn",
			"no-restricted-syntax": ["error"],
			// "no-undef": "off",
			// "no-unused-vars": "off",
			// "no-constant-condition": "off",
			// "no-empty": "off",
			// "no-prototype-builtins": "off",
			// "no-async-promise-executor": "off",
			// "no-extra-boolean-cast": "off",
			// "no-unsafe-finally": "off",
			// "no-useless-catch": "off",
			// "no-useless-escape": "off",
			// "no-irregular-whitespace": "off",
			// "no-regex-spaces": "off",
			// "no-unsafe-negation": "off",
			// "no-sparse-arrays": "off",
		}
	},
	pluginJs.configs.recommended,
];