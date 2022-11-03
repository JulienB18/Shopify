const { resolve } = require("path");
const glob = require("glob")
const ESLintPlugin = require("eslint-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
    context: resolve(__dirname, "./src"),
    output: {
        path: resolve(__dirname),
    },
    resolve: {
        extensions: ['.ts'],
    },
    performance: {
        hints: false,
    },
    mode: "production",
    watch: true,
};

const defaultScssFiles = glob.sync(resolve(__dirname, "./src/scss/*.scss"))
let AllEntryScss = {};
if(defaultScssFiles && defaultScssFiles.length > 0){
    defaultScssFiles.forEach(x => {
        const fileName = x.match(/[ \w-]+?(?=\.)/g)
        AllEntryScss[fileName[0]] = x;
    });
}

const assetsSCSS = Object.assign({}, config, {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { url: false, importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer(), cssnano()]},},},
                    { loader: 'sass-loader' },
                ],
            },
        ],
    },
    plugins: [
        new StylelintPlugin({
            extensions: ["scss"],
            fix: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
    ],
    name: "AssetsSCSS",
    entry: AllEntryScss,
    output: {
        path: resolve(__dirname, 'assets/'),
    },
});

const defaultTsFiles = glob.sync(resolve(__dirname, "./src/ts/*.ts"))
let AllEntryTs = {};
if(defaultTsFiles && defaultTsFiles.length > 0){
    defaultTsFiles.forEach(x => {
        const fileName = x.match(/[ \w-]+?(?=\.)/g)
        AllEntryTs[fileName[0]] = x;
    });
}

const assetsTS = Object.assign({}, config, {
    module: {
        rules: [
            {
                test: [/\.ts?$/],
                use: ["babel-loader", "ts-loader"],
                exclude: /node_modules/,

            },
        ],
    },
    plugins: [
        new ESLintPlugin({
            extensions: ["ts"],
            exclude: ["node_modules/", "assets/"],
            emitError: true,
            emitWarning: true,
            failOnError: true,
            failOnWarning: true,
        }),
    ],
    name: "AssetsTS",
    entry: AllEntryTs,
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'assets/'),
    },
});

module.exports = [
    assetsSCSS, assetsTS
];