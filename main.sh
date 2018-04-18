#!/bin/env sh
cd app
pm2 start index.js --watch --ignore-watch="tmp" --name="mathchat"
