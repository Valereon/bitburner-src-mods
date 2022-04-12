/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = (env, argv) => {
  const isDevServer = (env || {}).devServer === true;
  const runInContainer = (env || {}).runInContainer === true;
  const isDevelopment = argv.mode === "development";
  const isFastRefresh = argv.fast === "true";
  const outputDirectory = "dist";
  const entry = "./src/index.tsx";

  const statsConfig = {
    builtAt: true,
    children: false,
    chunks: false,
    chunkGroups: false,
    chunkModules: false,
    chunkOrigins: false,
    colors: true,
    entrypoints: false,
  };

  const devServerSettings = {
    hot: true,
    port: 8000,
    publicPath: `/`,
    stats: statsConfig,
  };

  // By default, the webpack-dev-server is not exposed outside of localhost.
  // When running in a container we need it accessible externally.
  if (runInContainer) {
    devServerSettings.disableHostCheck = true;
    devServerSettings.host = "0.0.0.0";
    devServerSettings.watchOptions = {
      poll: true,
    };
  }

  // Get the current commit hash to inject into the app
  // https://stackoverflow.com/a/38401256
  const commitHash = require("child_process").execSync("git rev-parse --short HEAD").toString().trim();

  const htmlConfig = {
    title: "Bitburner",
    template: "src/index.html",
    favicon: "favicon.ico",
    googleAnalytics: {
      trackingId: "UA-100157497-1",
    },
    meta: {},
    minify: isDevelopment
      ? false
      : {
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: false,
          collapseWhitespace: false,
          conservativeCollapse: false,
          html5: true,
          includeAutoGeneratedTags: false,
          keepClosingSlash: true,
          minifyCSS: false,
          minifyJS: false,
          minifyURLs: false,
          preserveLineBreaks: false,
          preventAttributesEscaping: false,
          processConditionalComments: false,
          quoteCharacter: '"',
          removeAttributeQuotes: false,
          removeComments: false,
          removeEmptyAttributes: false,
          removeEmptyElements: false,
          removeOptionalTags: false,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: false,
          removeTagWhitespace: false,
          sortAttributes: false,
          sortClassName: false,
          useShortDoctype: false,
        },
  };
  if (!isDevelopment) {
    htmlConfig.filename = "../index.html";
  }

  return {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": isDevelopment ? '"development"' : '"production"',
      }),
      // http://stackoverflow.com/questions/29080148/expose-jquery-to-real-window-object-with-webpack
      new webpack.ProvidePlugin({
        // Automtically detect jQuery and $ as free var in modules
        // and inject the jquery library
        // This is required by many jquery plugins
        jquery: "jquery",
        jQuery: "jquery",
        $: "jquery",
      }),
      new HtmlWebpackPlugin(htmlConfig),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
      new webpack.DefinePlugin({
        __COMMIT_HASH__: JSON.stringify(commitHash || "DEV"),
      }),
      // In dev mode, use a faster method of create sourcemaps
      // while keeping lines/columns accurate
      isDevServer &&
        new webpack.EvalSourceMapDevToolPlugin({
          // Exclude vendor files from sourcemaps
          // This is a huge speed improvement for not much loss
          exclude: ["vendor"],
          columns: true,
          module: true,
        }),
      !isDevServer &&
        new webpack.SourceMapDevToolPlugin({
          filename: "[file].map",
          columns: true,
          module: true,
        }),
      isFastRefresh && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    target: "web",
    // node: {
    //   fs: "mock",
    // },
    entry: entry,
    output: {
      path: path.resolve(__dirname, outputDirectory),
      filename: "[name].bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.(js$|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: [isFastRefresh && require.resolve("react-refresh/babel")].filter(Boolean),
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.s?css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|jp2|webp)$/,
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            outputPath: "images",
          },
        },
      ],
    },
    optimization: {
      removeAvailableModules: true,
      removeEmptyChunks: true,
      mergeDuplicateChunks: true,
      flagIncludedChunks: true,
      occurrenceOrder: true,
      sideEffects: true,
      providedExports: true,
      usedExports: true,
      concatenateModules: false,
      namedModules: false,
      namedChunks: false,
      minimize: !isDevelopment,
      portableRecords: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: `vendor`,
            chunks: "all",
          },
        },
      },
    },
    devServer: devServerSettings,
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    stats: statsConfig,
  };
};
