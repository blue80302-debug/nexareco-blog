#!/bin/bash
set -e
cd /var/www/nexareco
git pull origin main
npm ci --production=false
npm run build
pm2 restart nexareco || pm2 start npm --name nexareco -- start
echo "Deploy complete"
