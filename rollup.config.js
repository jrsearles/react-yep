import resolve from "rollup-plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import ts from "@wessberg/rollup-plugin-ts";
import pkg from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: pkg.source,
  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ],
  plugins: [
    external({ includeDependencies: true }),
    resolve({ extensions }),
    ts({ transpiler: "babel" })
  ]
};
