'use strict'

const fs = require('fs');
const pathJs = require('path');

module.exports.each = function(items, callback)
{
    for(var key in items)
        callback(items[key], key);
}

module.exports.recursiveEach = function(items, keys, callback)
{
    if(keys && keys.length)
    {
        for(var i in items)
            this.recursiveEach(items[i][keys.shift()], keys, callback);
    }
    else
    {
        for(var i in items)
            callback(items[i], i);
    }
}

module.exports.map = function(items, callback)
{
    var results = [ ];

    for(var key in items)
        results.push(callback(items[key], key));

    return results;
}

module.exports.unwindArray = function(items)
{
    var results = [ ];

    items.forEach(item => Array.isArray(item) ? results = results.concat(this.unwindArray(item)) : results.push(item));

    return results;
}

module.exports.listFiles = function(path, recursive, filter)
{
    var results = [ ];
    var fullPath = pathJs.resolve(path);
    var stats = fs.existsSync(fullPath) && fs.statSync(fullPath);

    if(stats && stats.isFile())
    {
        results.push(fullPath);
    }
    else if(stats && stats.isDirectory())
    {
        if(recursive)
        {
            fs.readdirSync(fullPath)
                .map(item => pathJs.join(fullPath, item))
                .map(item => this.listFiles(item, recursive, filter)
                .forEach(item => results.push(item)));
        }
        else
        {
            results = fs.readdirSync(fullPath).map(item => pathJs.join(fullPath, item));
        }
    }
    else if(!stats)
    {
        throw new Error('Path does not exist: ' + fullPath);
    }

    return (filter && results.filter(item => filter(item))) || results;
}

module.exports.mkdirp = function(path)
{
    let current = "";
    const subPaths = pathJs.dirname(path).split(pathJs.sep);
    
    for(const subPath of subPaths)
    {
        current = `${current}${subPath}${pathJs.sep}`;
        
        if(!fs.existsSync(current))
            fs.mkdirSync(current);
        else if(fs.lstatSync(current).isFile())
            throw new Error(`path '${current}' is a File.`);
    }
};
