/*
 * grunt-git
 * https://github.com/rubenv/grunt-git
 *
 * Copyright (c) 2013 Ruben Vermeersch
 * Licensed under the MIT license.
 */

'use strict';

var commands = require('../lib/commands');

module.exports = function (grunt) {
    function exec() {
        var args = Array.prototype.slice.call(arguments);
        var callback = args.pop();

        if (typeof(grunt.task.current.options().gitdir) !== "undefined") {
            args.unshift("--git-dir=" + grunt.task.current.options().gitdir + "/.git");
        }
        
        grunt.util.spawn({
            cmd: 'git',
            args: args,
            cwd: grunt.task.current.options().gitdir
        }, function () {
            callback.apply(this, arguments);
        });
    }

    function wrapCommand(fn) {
        return function () {
            var done = this.async();
            fn(this, exec, done);
        };
    }

    for (var command in commands) {
        var fn = commands[command];
        grunt.registerMultiTask("git" + command, fn.description || "", wrapCommand(fn));
    }
};
