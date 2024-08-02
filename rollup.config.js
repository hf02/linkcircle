
import pkg from "./package.json" with { type: "json" };
import typescript from "@rollup/plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

export default [
	{
		input: "src/run.ts",
		output: {
			name: "LinkcircleRunner",
			file: pkg.browser,
			format: "iife",

		},
		plugins: [
			typescript(),
			uglify()
		],
	},
	{
		input: "src/main.ts",
		output: {
			name: "Linkcircle",
			file: pkg.module,
			format: "es",

		},
		plugins: [
			typescript(),
			uglify()
		],
	},
];
