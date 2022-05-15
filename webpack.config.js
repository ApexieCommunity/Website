const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        app: "./src/index.ts",
        sw: "./src/sw.js"
    },
    devServer: {
        watchFiles: ["src/**/*"],
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
                return 'dist/[name].js';
            }
            return 'dist/bundle.js';
        },
        path: path.resolve(__dirname)
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/index.html", to: "dist/index.html" },
                { from: "src/manifest.json", to: "dist/manifest.json" },
                { from: "src/assets", to: "dist/assets" }
            ]
        })
    ]
}