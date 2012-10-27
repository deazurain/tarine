#!/usr/bin/env node

var server = require('../index');

var args = process.argv.slice(2);

server.start(args);
