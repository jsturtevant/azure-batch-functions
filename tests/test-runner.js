var test = require('tape');
var path = require('path');
var fs = require('fs');

test.createStream().pipe(process.stdout);

var testDir = process.argv[2];

// https://stackoverflow.com/a/21459809/697126
var getAllFilesFromFolder = function(dir) {
    var results = [];

    fs.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFilesFromFolder(file))
        } else results.push(file);

    });

    return results;

};

var testFiles = getAllFilesFromFolder(testDir).filter(x => {return x.endsWith('.test.js')});

testFiles.forEach(file => {
    console.log('running test file: ' + file);
    var pathToModule = path.resolve(file);
    require(pathToModule);
}); 

