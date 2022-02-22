let http = require('http');
let url = require('url');
let stringDecoder = require('string_decoder').StringDecoder;
let buffer = require('buffer');
let handlers = require('./handlers');

const hostname = '127.0.0.1';
const port = 3000;

let httpServer = http.createServer(function(req,res){
    let queryUrl = req.url;
    let parsedUrl = new URL(queryUrl,'http://localhost:3000');
    let path = parsedUrl.pathname;
    let newPath = path.replace(/^\/+|\/+$/g,'');
    let decoder = new stringDecoder('base64');
    let buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    })
    req.on('end',function(){
        buffer += decoder.end();
        let data = {
            'newPath' : newPath,
            'payload' : parseJsonToObject(Buffer.from(buffer,'base64').toString('utf-8')),
        }
        let pathRouter = typeof(router[newPath]) !== 'undefined' ? router[newPath] : handlers.notFound;
        pathRouter(data,function(payload,contentType){
            
            contentType = typeof(contentType) == 'string' ? contentType : 'json';
            let payloadstring = '';
            if(contentType == 'json'){
                res.setHeader('Content-Type','application/json');
                payload = typeof(payload) == 'object' ? payload : {};
                payloadstring = JSON.stringify(payload);
            }
            if(contentType == 'html'){
                res.setHeader('Content-Type','text/html');
                payloadstring = typeof(payload) == 'string' ? payload : '';
                
            }
            res.end(payloadstring);
        })
    })
})

// Define the request router 

router = {
    '': handlers.read,
}

//Helpers function
let parseJsonToObject = function(str){
    try{
        let obj = JSON.parse(str);
        return obj;
    } catch(e){
        return {}
    }
}

// Init the server

init = function(){
    httpServer.listen(port,hostname,function(){
        console.log('Server running on port: '+port);
    })
}
init();