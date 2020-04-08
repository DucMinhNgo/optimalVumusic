Build beautiful, smart checkout flows
Stripe Elements are rich, prebuilt UI components that help you create your own pixel-perfect checkout flows across desktop and mobile.
db.users.remove({"_id": ObjectId("5e71a03243c7cf5629be4ba0")})
db.users.remove({"_id": ObjectId("5e742c6f1b695a07636233b0")})
db.users.remove({"_id": ObjectId("5e742c9a1b695a07636233b1")})
db.users.remove({"_id": ObjectId("5e742ceb1b695a07636233b2")})
db.users.remove({"_id": ObjectId("5e7426cb1b695a07636233af")})
>> node JS su dung single thead
multithead va da nhan cluster module:
mot so network programs: HTTP, TCP, UDP, DNS, SSL
Websockets. HTTP + JSON, Files, caching Proxy, Google API, RedisDB, MongoDB, CouchDB
Nodejs sử dụng Javascript engine v8 của Google
Single-threaded, Non-blocking I/O, Event loop
nguyên tắc CAP
nodejs: trang chu co the phuc vu trung binh 900 request/giây
nginx: trang web đó có thể phục vụ hơn 1600 request/giây
------------------------------------------------------------------
http://auto-solution.online/cong-nghe-lap-trinh/angular-programming/deploy-express-js-website-len-vps-server-voi-nginx-pm2-va-ubuntu.html
<!-- config nodejs -->
mkdir simpleServer
cd simpleServer
npm init -y
npm install express

<!-- config pm2 -->
npm install pm2 -g
pm2 start server.js
pm2 startup
pm2 save

$ pm2 restart app_name
$ pm2 reload app_name
$ pm2 stop app_name
$ pm2 delete app_name
<!-- config server -->
cd /etc/nginx/sites-available
sudo nano simpleServer
server {

    listen 80;

    server_name <YourVPSIpAddress>;
    location / {

        proxy_pass http://localhost:3000/;

    }

}
<!-- check OK -->
sudo nginx -t
<!-- enable your config -->
sudo ln -s /etc/nginx/sites-available/simpleServer /etc/nginx/sites-enabled
<!-- restart -->
sudo systemctl start nginx 
sudo systemctl stop nginx 
sudo systemctl restart nginx
or:
sudo service nginx start
sudo service nginx stop
sudo service nginx restart
or:
sudo /etc/init.d/nginx start
sudo /etc/init.d/nginx stop
sudo /etc/init.d/nginx restart
ex:
/home/victor/vimusic/sites/http.conf
/usr/local/openresty/nginx/conf/nginx.conf
/etc/init.d/openresty restart|stop|start
--------------------------------------------------------------------------------
docker run --name mynginx1 -p 80:80 -d nginx
pm2 init

build image:
>> docker build -t image-dustin .
run image:
first: output
second: port(nodejs)
>> docker run -p 82:4000 image-dustin
build the port 4000 of your app to the port 82 of the localhost
-----------------------------------------------------------------------
FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "app.js" ]
>> 
------------------------------------------------------------------------------
redis
>> Caching: Sử dụng làm bộ nhớ đệm. Chính tốc độ đọc ghi nhanh mà Redis có thể làm bộ nhớ đệm, nơi chia sẻ dữ liệu giữa các ứng dụng hoặc làm database tạm thời.
>> Counter: Sử dụng làm bộ đếm. Redis hỗ trợ thread safe do đó nó có thể đồng bộ dữ liệu giữa các request.
>> Publish/Suscribe: Tạo kênh chia sẻ dữ liệu.Redis hỗ trợ tạo các channel để trao đổi dữ liệu giữa publisher và subscriber giống như channel trong Socket Cluster hay topic trong Apache Kafka.
>> Queues: Tạo hàng đợi để xử lý lần lượt các request.