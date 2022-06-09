const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        app: "./src/index.ts",
        sw: "./src/sw.js"
    },
    devServer: {
        watchFiles: ["src/**/*"],
        static: {
            directory: path.resolve(__dirname, "src")
        },
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
                include: [path.resolve(__dirname, "src")]
            }
        ]
    },
    output: {
        filename: ({runtime}) => {
            if (runtime === 'sw') {
                return '[name].js';
            }
            return 'bundle.js';
        },
        path: path.resolve(__dirname + "/dist")
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/index.html", to: "index.html" },
                { from: "src/manifest.json", to: "manifest.json" },
                { from: "src/CNAME", to: "." },
                { from: "src/assets", to: "assets" }
            ]
        }),
        new CleanWebpackPlugin()
    ]
}