var extend = require('extend'),
    split = require('split2'),
    through = require('through2'),
    merge = require('merge-stream');

// dont do any transformation to the chunk
function noop(chunk) {
    return chunk;
}

// always return empty chunks
function empty(chunk) {
    return null;
}

module.exports = function(proc, opts) {
    opts = extend({
        stdout: noop,
        stderr: noop,
        both: noop,
        newline: '\n'
    }, opts || {});

    // if any transform was set to a falsy value, disable that stream's output
    var transformStdout = opts.stdout || empty,
        transformStderr = opts.stderr || empty,
        transformBoth = opts.both || empty,
        newline = opts.newline;

    // prepare the input stream, with stdout and stderr merged into one.
    // since we want to be able to transform any of the streams separately
    // without affecting their lines order, both streams need to be splitted
    // by lines before merging.
    var output = merge(
        proc.stdout.pipe(split(transformStdout)),
        proc.stderr.pipe(split(transformStderr))
    ).pipe(through(function(chunk, enc, callback) {
        chunk = transformBoth(chunk);

        // do not add a newline on empty chunks
        if (newline && chunk !== null) {
            chunk += newline;
        }

        this.push(chunk);
        callback();
    }));

    return output;
};
