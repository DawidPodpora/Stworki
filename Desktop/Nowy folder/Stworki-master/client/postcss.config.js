module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  presets: [
    '@babel/preset-env', // Konfiguracja do przetwarzania ES6+
    '@babel/preset-react', // Dodaj preset dla React, jeśli używasz Reacta
  ],
  transform: {
    '^.+\\.js$': 'babel-jest', // Przekształcanie plików .js przy użyciu babel-jest
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios|jwt-decode)/" // Dodaj axios i inne zależności do listy, które mają być przetwarzane przez Babel
  ],
  testEnvironment: 'node', // Ustawiamy środowisko testowe na jsdom dla aplikacji frontendowych
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
}
