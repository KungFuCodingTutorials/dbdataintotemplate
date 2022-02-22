const fs = require('fs');

let handlers = {};

handlers.read = function(data,callback){
    fs.readFile(__dirname+'/data.json','utf-8',function(err,data){
        let dbData = parseJsonToObject(data);
        if(!err && data){
            let templateData = {
                'title' : dbData.title,
                'description' : dbData.shortDescription,
                'tag1' : dbData.tag[0],
                'tag2' : dbData.tag[1],
                'tag3' : dbData.tag[2],
                'readingMinutes' : dbData.readingMinutes
            }
            fs.readFile(__dirname+'/index.html','utf-8',function(err,data){
                let mergedString = mergeData(data,templateData);
                callback(mergedString,'html');
            })
        } else {
            console.log(err);
        }
    })

}

handlers.notFound = function(data,callback){
    callback(404);
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

let mergeData = function(str,data){
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};

    for(let key in data){
        if(data.hasOwnProperty(key) && typeof(data[key] == 'string')){
            let replace = data[key];
            let find = '{'+key+'}';
            str = str.replace(find,replace);
        }
    }
    return str;
}

module.exports = handlers;