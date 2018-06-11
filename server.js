var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// var http = require('http');
var https = require('https');
var cors = require('cors');
var tweets;
var flag = true;

MongoClient = require('mongodb').MongoClient
var uri = 'mongodb://galapro:galapro12@ds153890.mlab.com:53890/galapro';

mongoose.connect(uri);
var db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error'));
db.once('open', function(){
    console.log('mongo is on');
})

var app = express();
var Schema = mongoose.Schema;

app.use(bodyParser.json());
app.use(cors({origin: '*'}));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(client) {
    
    console.log("connected");

    client.on('disconnect', function() {
        clearInterval(tweets);
        console.log("disconnected");
    });
    
    client.on('askRedirect', function(values) {
        clearInterval(tweets);
          urlData.findOne({"default" : 'true'},
            function(err,data) {
                if (data) {

                    flag = true;

                    io.emit('redirectMsg', 'default URL is: ' + data.url);
                    
                    tweets = setInterval(function () {
                        if(flag){
                            io.emit('redirectMsg', 'Entered URL is: ' + values.url);
                        } else {
                            io.emit('redirectMsg', 'default URL is: ' + data.url);
                        }
                        flag = !flag;
                        
                    }, 10000);

                } else {
                    io.emit('message', 'No default URL');
                }
            });
            
    })
});
server.listen(3000);

// urls
var urlDataScheme = new Schema({
    url: { type: String, required: true, unique: true },
    defaut: { type: Boolean, required: true}
    
},{collection: 'url'});

var urlData = mongoose.model('urlData', urlDataScheme);

// URLs
app.post('/api/v1/url',function(req,res){

    clearInterval(tweets);

    var redirect = req.body.redirect;
    var url = req.body.url;
    
    if(url) {
        // Check if url is valid and return
        urlData.findOne({"url": url }, //{ $regex: '.*' + url + '.*' }
            function (err, data) {
                if (data) {
                    res.json(data);
                } else {
                    res.status(400).json('URL not exist in DB');
                }
            }
        );
    } else {
        res.status(400).json('Please insert URL or click "Redirect" checbox');
    }

});

