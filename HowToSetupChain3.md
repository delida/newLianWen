This is a simple guide to get you started with using the Ethereum Javascript API (chain3.js) with the Create React Native App project. This is not an in-depth guide.

It will only print log in console.

If you are lazy and just want to get started, I have this project ready for you. It should work out-of-the-box.

Installation guide
Make sure you have Node version 6 or later installed, if not, get it on the Node website

node --version

Install Create React Native App

npm install -g create-react-native-app

Use create-react-native-app to create the project boilerplate

create-react-native-app my-app

Install node-libs-browser

npm install --save node-libs-browser

Create a file called rn-cli.config.js on the root of the project and add the following code into it:

const extraNodeModules = require('node-libs-browser');

module.exports = {
  extraNodeModules,
};
Create a file called global.js on the root of the project and add the following code into it:

// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
global.process = require('process');

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  };
}
Import the global.js file into your App.js file

import './global';
Install babel-preset-es2015

npm install --save-dev babel-cli babel-preset-es2015

Now we can install the chain3.js api

npm install --save chain3

Require the API in your App.js file

const Chain3 = require('chain3');
Add the following code inside your React component in App.js to get started with consuming the API. The code will print information of the latest block on the console.

componentWillMount() {
  const chain3 = new Chain3(
    new Chain3.providers.HttpProvider('https://www.moacwalletonline.com/test')
  );

  chain3.mc.getBlock('latest', (error,response) => {
      if (!error) 
        console.log(response);
    });
}
Test it

npm start

or

npm run ios

or

npm run android