# Memory

A simple memory game in Javascript vanilla and PHP, made to test my skills.

## Installation

Clone this repository, then run `composer install` to get the needed packages.

This project uses Sass, you have to install it if you haven't already. You can install Sass globally with `npm install -g sass` or locally in the project folder with `npm install sass`.

This project uses a small database with just one table. After creating your database, just import the SQL file in _docs/_. Then, complete _app/config.ini.example_ file with your database credentiels and rename the file _config.ini_.

Just one more step: communication between frontend and backend is handled by fetch and http requests. Find the mentioned lines in the following files and update with your own URL :
* #28 in _app/Controllers/CoreController.php_: `header("Access-Control-Allow-Origin: https://your.url.here");`
* #2 in _assets/js/api.js_: `apiRootUrl: 'https://your.url.here',`

It would be better to have a dedicated config file for these, I might take car of this later 🙃

## Use

You can try this game live and play a bit [here](https://memory.kyborash.com/). It's only available in French for now, it might be translated in the future.

Hope you'll enjoy it, have fun ! 😊