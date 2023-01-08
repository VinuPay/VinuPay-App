const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const port = process.env.PORT || 2989;
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash].js',
    },
    devtool: 'inline-source-map',
    devServer: {
        host: 'localhost',
        port: port,
        historyApiFallback: true,
        open: true
    },
    plugins: [
        new WebpackBundleAnalyzer(),
        new HtmlWebpackPlugin({
            title: 'Custom template',
            // Load a custom template (lodash by default)
            template: './public/index.html'
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),

    ],
    resolve: {
        extensions: ['', '.js', '.jsx'],
        fallback: {
            "path": require.resolve("path-browserify"),
            fs: false,
            "crypto": require.resolve("crypto-browserify"),
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify'),
            "os": require.resolve("os-browserify/browser"),
            process: require.resolve("process/browser"),
        }
    },

    module: {
        rules: [
            // JS, JSX
            {
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
                use:{
                    loader: 'babel-loader'
                }
            },
            // CSS
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            // png/jpeg/gif
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'images/',
                            }
                        }
                    ],
            },
            // woff2,ttf,eot
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: './fonts/[name][ext]',
                },
            },
            // svg
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    }
};