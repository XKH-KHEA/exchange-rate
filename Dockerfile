FROM   ghcr.io/puppeteer/puppeteer:21.9.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPEPTEER_EXECUTTABLE_PATH=/usr/bin/googlr-chrom-stable
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node","server.js" ]