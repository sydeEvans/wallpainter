const ExtractTextPlugin = require('extract-text-webpack-plugin');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = process.env.NODE_ENV === 'development';

function styleLoader({
  loaders = [],
  extract = !IS_DEV,
  minimize = !IS_DEV,
  fallback = 'style-loader',
  modules = false,
} = {}) {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize,
      modules,
      importLoaders: 1,
      sourceMap: false,
    },
  };
  return extract ? ExtractTextPlugin.extract({
    fallback,
    use: [cssLoader, ...loaders],
  }) : [
    fallback,
    cssLoader,
    ...loaders,
  ];
}

function styleRule(options = {}) {
  return {
    test: /\.css$/,
    use: styleLoader(options),
  };
}

function merge(obj1, obj2) {
  if (!obj2) return obj1;
  if (Array.isArray(obj1)) return obj1.concat(obj2);
  const obj = Object.assign({}, obj1);
  Object.keys(obj2).forEach(key => {
    if (typeof obj[key] === 'object') {
      obj[key] = merge(obj[key], obj2[key]);
    } else {
      obj[key] = obj2[key];
    }
  });
  return obj;
}

exports.IS_DEV = IS_DEV;
exports.styleLoader = styleLoader;
exports.styleRule = styleRule;
exports.merge = merge;
