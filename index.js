#!/usr/bin/env node
'use strict'

const cmd = require('commander');
const fs = require('fs');
const pathJs = require('path');
const raml2md = require('./libs/index.js');

cmd.arguments('[path]')
    .option('-r, --recursive', 'Scan <path> recursively.')
    .option('-t, --template <template>', 'Template file to use for output generation.', checkTemplate)
    .option('-o, --output-type <type>', 'Where to put the output. Possible values: stdout, file, file-per-resource.', parseOutputType)
    .option('-f, --output-file <file>', 'File to output results to if output type is file.', checkOutputFile)
    .option('-p, --output-path <path>', 'Path to output results to if output type is file-per-resource.', checkOutputDir)
    .option('-c, --config <file>', 'Path to a JSON config file to use.', loadConfig)
    .option('--output-ext <extension>', 'File extension of result files if output type is file-per-resource.', validateExt)
    .option('--file-filter <regexp>', 'RegExp for filtering files.', createRegExp)
    .action((path, cmd) =>
    {
        var config = cmd.config || {
                input : {
                    paths : [ path ],
                    recursive : cmd.recursive || raml2md.DefaultConfig.input.recursive,
                    fileFilter : cmd.fileFilter || raml2md.DefaultConfig.input.fileFilter,
                    templateFile : cmd.template || raml2md.DefaultConfig.input.templateFile
                },
                output : {
                    type : (cmd.outputType && cmd.outputType.type) || raml2md.OutputType.StdOut,
                    file : {
                        splitting : (cmd.outputType && cmd.outputType.splitting) || raml2md.FileSplitting.AllInOne,
                        path : cmd.outputFile || cmd.outputPath,
                        extension : cmd.outputExt || raml2md.DefaultConfig.output.file.extension
                    }
                }
            }

        raml2md.render(config);
    })
    .parse(process.argv);


function checkTemplate(path)
{
    path = pathJs.resolve(path);

    if(!fs.existsSync(path))
        throw new Error('Template could not be found: ' + path);

    return path;
}

function parseOutputType(input)
{
    switch(input.toLowerCase())
    {
        case 'stdout':
            return { type : raml2md.OutputType.StdOut };
        case 'file':
            return { type : raml2md.OutputType.File, splitting : raml2md.FileSplitting.AllInOne };
        case 'file-per-resource':
            return { type : raml2md.OutputType.File, splitting : raml2md.FileSplitting.OnePerResource };
    }

    throw new Error('Invalid output type: ' + input);
}

function checkOutputFile(path)
{
    return checkOutputDir(pathJs.dirname(path)) + '/' + pathJs.basename(path);
}

function checkOutputDir(path)
{
    path = pathJs.resolve(path);

    if(!fs.existsSync(path))
        throw new Error('Output path could not be found: ' + path);

    return path;
}

function loadConfig(path)
{
    path = pathJs.resolve(path);

    if(!fs.existsSync(path))
        throw new Error('Config file does not exist: ' + path);

    var config = JSON.parse(fs.readFileSync(path));

    if(config.input.fileFilter)
        config.input.fileFilter = new RegExp(config.input.fileFilter);

    return config;
}

function validateExt(input)
{
    return input.startsWith('.') ? input : '.' + input;
}

function createRegExp(input)
{
    return new RegExp(input);
}
