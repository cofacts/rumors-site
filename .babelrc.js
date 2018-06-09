module.exports = {
  "presets": ["next/babel"],
  "plugins": [
    [
      "module-resolver",
      // https://github.com/zeit/next.js/blob/master/examples/with-absolute-imports/.babelrc
      {
        "root": ["./"],
        "alias": {
          "components": "./components",
          "constants": "./constants",
          "pages": "./pages",
          "ducks": "./ducks",
          "routes": "./routes"
        }
      }
    ]
  ],

  // https://github.com/zeit/next.js/tree/master/examples/with-jest
  "env": {
    "test": {
      "presets": [
        ["next/babel", { "preset-env": { "modules": "commonjs" } }]
      ]
    }
  }
}
