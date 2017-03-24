const RequestHandler = require('./client/requestHandler.js');

var ansi = require('ansi')
  , cursor = ansi(process.stdout)

var p = new RequestHandler();

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//cursor.goto(0,process.stdout.getWindowSize()[1]);
rl.question('> ', (answer) => {
    cursor.goto(0,process.stdout.getWindowSize()[1]-1);
    cursor.eraseLine();
    cursor.goto(0,process.stdout.getWindowSize()[1]);

    p.parse(answer)
    rl.prompt(true);
});

rl.on('line', (line) => {
    cursor.goto(0,process.stdout.getWindowSize()[1]-1);
    cursor.write('\x1b[' + '0' + 'K');
    cursor.goto(0,process.stdout.getWindowSize()[1]);

    p.parse(line);
    rl.prompt(true);
});

function readRequest(){
    
}

function lf () { return '\n' }

cursor.write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(lf).join('')).eraseData(2).goto(1, 1);

readRequest();

//Testing commands

/*
p.parse("connect localhost 3000");
p.parse("login user" + +Date.now());
setTimeout(function() {
    p.parse("history");
}, 300);
*/