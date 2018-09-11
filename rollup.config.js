import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-replace';

export default {
	input: 'index.js',
	context: 'this',
	plugins: [
		// Hack to not add three.js twice to the final bundle as A-Frame provides it
		replace({
			'simbol': `import Simbol from './node_modules/simbol/build/simbol.nothree.js'`,
			include: 'index.js',
			delimiters: ['import Simbol from \'', '\'']
		}),
		replace({
			[`readable-stream`]: `require('stream')`,
			include: 'node_modules/simple-peer/index.js',
			delimiters: ['require(\'', '\')']
		}),
		commonJS({
			ignoreGlobal: true
		}),
		json(),
		globals(),
		builtins(),
		resolve({
			preferBuiltins: false,
			browser: true
		})
	],
	output: [
		{
			format: 'cjs',
			sourcemap: true,
			exports: 'named',
			dir: 'build',
			file: 'a-simbol.cjs.js'
		},
		{
			format: 'es',
			sourcemap: true,
			exports: 'named',
			dir: 'build',
			file: 'a-simbol.js'
		}
	]
};
