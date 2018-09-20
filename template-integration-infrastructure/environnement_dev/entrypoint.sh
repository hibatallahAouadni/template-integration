#!/usr/bin/env bash

cd /var/www/html

set -e

npm install
#install Ruby
apt-get install -y ruby-full
gem install compass

/usr/sbin/apache2ctl -D FOREGROUND
