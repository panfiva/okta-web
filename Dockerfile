# Created using https://mherman.org/blog/dockerizing-a-react-app/

# you can use different versions by specifying it (https://hub.docker.com/_/node?tab=tags)
# naming this build so we can reference it later in NGNIX
FROM node:current-alpine3.15 as WEBSERVER


# Create Directory for the Container
# Copy command will prepend destination with WORKDIR
WORKDIR /app

RUN yarn global add serve

# Copy needed files only
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsconfig.path.json ./

# Install all Packages
RUN yarn install --frozen-lockfile

# Copy all other source code to work directory
# This will ignore files that are
COPY src  ./src
COPY public ./public


# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# RUN yarn global add serve

# # Build app
RUN yarn run build


# # Start manually (testing only)
# CMD ["npm", "start"]
# EXPOSE 3000

# # Set nginx image
FROM nginx:latest AS NGNIX

COPY --from=WEBSERVER /app/build /usr/share/nginx/html
COPY webconfig/default.conf /etc/nginx/conf.d/default.conf
COPY webconfig/mysite.crt /etc/nginx/certs/mysite.pem
COPY webconfig/mysite.key /etc/nginx/certs/mysite.key
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]

## BUILD:   docker build . -t basic-react-admin
## DELETE: docker container rm -f basic-react-admin
## RUN:     docker run -d --name basic-react-admin -p 80:80 -p:443:443 --restart=always basic-react-admin
## first port is host, second port is docker guest (see EXPOSE command)
# docker image prune
# docker container ls
