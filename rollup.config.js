import execute from "rollup-plugin-execute";
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import typescript from "@rollup/plugin-typescript";

import sveltePreprocess from "svelte-preprocess";

import pkg from './package.json';

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.module,
			format: 'es',
			sourcemap: true,
		},
		{
			file: pkg.main,
			format: 'umd',
			name,
			sourcemap: true,
			plugins: [
				// we only want to run this once, so we'll just make it part of this output's plugins
				execute([
					"tsc --outDir ./dist --declaration",
					"node scripts/preprocess.js",
				]),
			],
		}
	],
	plugins: [
		svelte({
			preprocess: sveltePreprocess(),
		}),
		resolve(),
		typescript(),
	]
};
