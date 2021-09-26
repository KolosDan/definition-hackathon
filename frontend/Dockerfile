FROM node:14 as build-deps

WORKDIR /usr/src/app
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn

COPY . .
RUN yarn build

FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/frontend