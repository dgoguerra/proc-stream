proc-stream
===========

Get process output as a single stream.

This package splits a process's stdout and stderr into lines
and merges them into a single stream, to make it easy to print
its output with [debug](https://www.npmjs.com/package/debug)
or similar libraries.

Optionally stdout and stderr can be transformed line by line
before or after merging.

Installation
------------

```
npm install proc-stream
```

Usage
-----

```js
var procStream = require('proc-stream');

var proc = spawn('script.sh', []);

// basic usage, get stdout and stderr in a single stream
procStream(proc).pipe(process.stdout);

// decorate stderr and log with debug()
procStream(proc, {
  // show stderr lines in red
  stderr: function(chunk) {
    return chalk.red(chunk);
  },
  // transform both stdout and stderr
  both: function(chunk) {
    return 'cmd: '+chunk;
  },
  // do not add newlines after each line
  newline: null
}).on('data', function(data) {
  debug(data);
});

// decorate stdout, disable stderr and set a custom newline
var stream = procStream(proc, {
  // transform stdout
  stdout: function(chunk) {
    return chalk.green(chunk);
  },
  // disable stderr
  stderr: null,
  // custom newline (default is '\n')
  newline: '\r\n'
}).pipe(process.stdout);
```

License
-------
MIT license - http://www.opensource.org/licenses/mit-license.php

