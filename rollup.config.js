import path from "path";
import resolve from "@rollup/plugin-node-resolve"; // 依赖引用插件
import commonjs from "@rollup/plugin-commonjs"; // commonjs模块转换插件
import typescript from "@rollup/plugin-typescript";
// import { eslint } from 'rollup-plugin-eslint' // eslint插件
import dts from "rollup-plugin-dts";

const getPath = (_path) => path.resolve(__dirname, _path);
import packageJSON from "./package.json";

const extensions = [".js", ".ts", ".tsx"];

// ts
const tsPlugin = typescript({
  tsconfig: getPath("./tsconfig.json"), // 导入本地ts配置
});

// // eslint
// const esPlugin = eslint({
//   throwOnError: true,
//   include: ['src/**/*.ts'],
//   exclude: ['node_modules/**', 'lib/**']
// })

// 基础配置
const commonConf = {
  input: getPath("./src/index.ts"),
  plugins: [
    resolve(extensions),
    commonjs({ extensions }),
    // esPlugin,
    tsPlugin,
  ],
};

// 需要导出的模块类型
const outputMap = [
  {
    file: packageJSON.main, // 通用模块
    format: "umd",
  },
  {
    file: packageJSON.module, // es6模块
    format: "es",
  },
  // {
  //   customize: true,
  //   input: getPath("./types/index.d.ts"),
  //   output: {
  //     file: packageJSON.typings,
  //     format: "es",
  //   },
  //   plugins: [dts()],
  // },
  {
    customize: true,
    input: [getPath("./src/index.ts"), getPath("./src/useWxJsSdk.ts")],
    output: {
      dir: "lib/types",
      format: "es",
    },
    plugins: [dts()],
  },
];

const buildConf = (options) => Object.assign({}, commonConf, options);

export default outputMap.map((output) =>
  output.customize
    ? (delete output.customize, output)
    : buildConf({ output: { name: packageJSON.name, ...output } })
);
