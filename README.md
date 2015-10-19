<p align="center">
  <img src="https://raw.githubusercontent.com/xpush/node-xpush/master/logo.png" width="200px"/>
</p>


xpush-link
=======

xpush-link is a realtime communication service between operators and customers.
xpush-link run on the basis of **XPUSH** (eXtensional PUSH)





## 1. Prepare

To use the xpus-link is, [nodejs](http://nodejs.org/), [mongoDB](https://www.mongodb.org/downloads#production), [angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack) is required .


### nodejs
[nodejs installation](http://nodejs.org/download/) by referring to Download and unzip the nodejs.

	mkdir -p $HOME/xpush
	cd $HOME/xpush
	wget http://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz
	tar zvf node-v0.12.7-linux-x64.tar.gz

Set the PATH environment variable so that you can use the node and npm to global.

	PATH=$HOME/xpush/node-v0.12.7-linux-x64/bin:$PATH

### mongoDB
Install and run mongoDB with reference [mongoDB installation](http://docs.mongodb.org/manual/installation/).

The follow is the code to install and run mongoDB 2.6.4

	cd $HOME/xpush
	wget --no-check-certificate https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.6.4.tgz
	tar xzf mongodb-linux-x86_64-2.6.4.tar.gz
 
<p/>

	cd mongodb-linux-x86_64-2.6.4
 mkdir db
 mkdir logs
 bin/mongod --fork --dbpath db --logpath logs



### angular-fullstack
angular-fullstack requires several modules.

Install yo, grunt-cli, bower, and generator-angular-fullstack

	npm install -g yo grunt-cli bower generator-angular-fullstack
	git clone https://github.com/xpush/xpush-link.git
	cd xpush-link
	
Install modules

	bower install
	npm install
	
## 2. Run your application


### Run Server

	grunt serve
