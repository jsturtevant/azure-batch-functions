var test = require('tape');
var path = require('path');
var fs = require('fs');

test.createStream().pipe(process.stdout);

var testDir = process.argv[2]

fs.readdirSync(testDir).filter(x => {return x.endsWith('.test.js')}).forEach(file => {
    console.log('running test file: ' + file);
    var pathToModule = path.resolve(path.join(testDir, file));
    require(pathToModule);
}); 