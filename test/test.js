var path = require('path'),
    tape = require('tape'),
    spawn = require('child_process').spawn,
    getStream = require('get-stream'),
    procStream = require('../index.js');

function spawnTestProcess() {
    return spawn(path.resolve(__dirname, './test-cmd.sh'), []);
}

tape('basic usage', function(t) {
    var stream = procStream(spawnTestProcess());

    getStream(stream).then(function(str) {
        t.deepEquals(str.split('\n'), [
            'stdout message 1',
            'stdout message 2',
            'stderr message 1',
            'stderr message 2',
            'stdout message 3',
            'stderr message 3',
            'stdout message 4',
            'stdout message 5',
            ''
        ]);
    });

    t.end();
});

tape('transform stdout', function(t) {
    var stream = procStream(spawnTestProcess(), {
        stdout: function(chunk) {
            return chunk.replace(/message/g, 'STRING');
        }
    });

    getStream(stream).then(function(str) {
        t.deepEquals(str.split('\n'), [
            'stdout STRING 1',
            'stdout STRING 2',
            'stderr message 1',
            'stderr message 2',
            'stdout STRING 3',
            'stderr message 3',
            'stdout STRING 4',
            'stdout STRING 5',
            ''
        ]);
    });

    t.end();
});

tape('disable stdout', function(t) {
    var stream = procStream(spawnTestProcess(), {stdout: null});

    getStream(stream).then(function(str) {
        t.deepEquals(str.split('\n'), [
            'stderr message 1',
            'stderr message 2',
            'stderr message 3',
            ''
        ]);
    });

    t.end();
});

tape('disable stderr', function(t) {
    var stream = procStream(spawnTestProcess(), {stderr: null});

    getStream(stream).then(function(str) {
        t.deepEquals(str.split('\n'), [
            'stdout message 1',
            'stdout message 2',
            'stdout message 3',
            'stdout message 4',
            'stdout message 5',
            ''
        ]);
    });

    t.end();
});

tape('disable both (no output)', function(t) {
    var stream = procStream(spawnTestProcess(), {both: null});

    getStream(stream).then(function(str) {
        t.deepEquals(str.split('\n'), [
            ''
        ]);
    });

    t.end();
});

tape('custom newline', function(t) {
    var stream = procStream(spawnTestProcess(), {newline: '\r\n'});

    getStream(stream).then(function(str) {
        t.deepEquals(str.split('\r\n'), [
            'stdout message 1',
            'stdout message 2',
            'stderr message 1',
            'stderr message 2',
            'stdout message 3',
            'stderr message 3',
            'stdout message 4',
            'stdout message 5',
            ''
        ]);
    });

    t.end();
});

tape('disable newline', function(t) {
    var stream = procStream(spawnTestProcess(), {newline: null});

    getStream(stream).then(function(str) {
        t.deepEquals(str, [
            'stdout message 1',
            'stdout message 2',
            'stderr message 1',
            'stderr message 2',
            'stdout message 3',
            'stderr message 3',
            'stdout message 4',
            'stdout message 5',
            ''
        ].join(''));
    });

    t.end();
});
