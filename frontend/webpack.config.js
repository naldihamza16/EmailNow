// webpack.config.js
import Dotenv from 'dotenv-webpack';

export default {
  // Your other Webpack configurations (entry, output, etc.)
  plugins: [
    new Dotenv()  // This will load the .env file
  ],
};
