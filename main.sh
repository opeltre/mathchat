#!/bin/env sh
pm2 start index.js --watch --ignore-watch="tmp"
