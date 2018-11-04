import fs from "fs";
import path from "path";
import _ from "lodash";
import CopyWebpackPlugin from "copy-webpack-plugin";

const rootDir = path.resolve(__dirname, "..");

function transformIndexExperiment(experiment, config) {
  const scripts = config.scripts || [];
  const styles = config.styles || [];
  return content => {
    const template = _.template(content);
    const templateConfig = {
      ...config,
      experiment,
      scripts,
      styles
    };
    return template(templateConfig);
  };
}

function transformIndexExperiments(experimentConfigs) {
  return content => {
    const template = _.template(content);
    return template({ experiments: experimentConfigs });
  };
}

export default function(experiments, buildType) {
  const entry = {};
  const plugins = [];
  const experimentConfigs = [];
  experiments.forEach(experiment => {
    const experimentPath = path.join(rootDir, `src/experiments/${experiment}`);
    // Ensure we have a directory
    if (!fs.lstatSync(experimentPath).isDirectory()) {
      return;
    }
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const experimentConfig = require(`${experimentPath}/config.js`).default;
    if (experimentConfig.public || buildType === "serve") {
      experimentConfig.id = experiment;
      experimentConfigs.push(experimentConfig);
    }
    entry[experiment] = experimentPath;
    const plugin = new CopyWebpackPlugin([
      {
        from: path.join(rootDir, "src/index-experiment.html"),
        to: path.join(rootDir, `dist/experiments/${experiment}/index.html`),
        transform: transformIndexExperiment(experiment, experimentConfig)
      }
    ]);
    plugins.push(plugin);
  });

  // Copy the static files
  plugins.push(
    new CopyWebpackPlugin([
      {
        from: path.join(rootDir, "src/assets"),
        to: path.join(rootDir, "dist/assets")
      },
      {
        from: path.join(rootDir, "src/libs"),
        to: path.join(rootDir, "dist/libs")
      },
      {
        from: path.join(rootDir, "src/modules"),
        to: path.join(rootDir, "dist/modules")
      },
      {
        from: path.join(rootDir, "src/index-experiments.html"),
        to: path.join(rootDir, "index.html"),
        transform: transformIndexExperiments(experimentConfigs)
      }
    ])
  );

  return {
    mode: "development",
    entry,
    plugins,
    output: {
      path: rootDir,
      filename: "dist/experiments/[name]/bundle.js"
    },
    resolve: {
      modules: ["node_modules", "src"]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: "babel-loader"
        }
      ]
    }
  };
}
