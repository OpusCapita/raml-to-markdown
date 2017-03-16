'use strict'
const extend = require('extend');
const raml2obj = require('raml2obj');
const nunjucks = require('nunjucks');
const pathJs = require('path');
const fs = require('fs');
const helper = require('./helper.js');

/**
 * Enumeration providing a list of all built-in output types.
 * @enum
 */
module.exports.OutputType = {
    /** Just return a string. */
    ReturnOnly : 'ReturnOnly',
    /** Print all to stdout. */
    StdOut : 'StdOut',
    /** Write everything to files. */
    File : 'File'
}

/**
 * Enumeration providing a list of all possible file output types.
 * @enum
 */
module.exports.FileSplitting = {
    /** Put all results into one big file. */
    AllInOne : 'AllInOne',
    /** Create one result file per resource. */
    OnePerResource : 'OnePerResource'
}

/**
 * Defines a default configuration with all possible configuration options.
 *
 * @prop {object} input - Input configuration.
 * @prop {array} input.paths - A list of source paths to look for RAML files. This may contain files and directories.
 * @prop {boolean} input.recursive - Whenever to walk recursively through proviced directory paths.
 * @prop {RegExp} input.fileFilter - Regular Expression for more advanced filtering of files and directories to include.
 * @prop {string} input.templateFile - Nunjucks template file used to create templated output.
 * @prop {string} input.contentFilter - Provides a pre-render content filter.
 * @prop {object} output - Output configuration.
 * @prop {OutputType} output.type - Output type configuration.
 * @prop {object} output.file - Configuration for OutputType.File.
 * @prop {FileSplitting} output.file.splitting - Defines on how file output should be generated.
 * @prop {string} output.file.path - Depending on the splitting option a single file or a directory path.
 * @prop {string} output.file.extension - Extension to add to each output file if *path* does not aleady represent a file path.
 * @prop {function}  output.contentFilter - Provides a post-render content filter.
 */
 module.exports.DefaultConfig = {
    input : {
        paths : [ ],
        recursive : false,
        fileFilter : new RegExp('\.raml$'),
        templateFile : __dirname + '/../templates/index.njk',
        contentFilter : null
    },
    output : {
        type : this.OutputType.ReturnOnly,
        file : {
            splitting : this.FileSplitting.AllInOne,
            path : null,
            extension : '.md'
        },
        contentFilter : item => item.replace(/\n{3,}/g, "\n\n")
    }
}

/**
 * Parses and renders RAML service definitions. Depending on the provided configuration, this method will send its
 * output to different locations.
 * @param {object} config - Configuration based on the options provided by [DefaultConfig](#defaultconfig).
 * @returns {Promise}
 */
module.exports.render = function(config)
{
    config = extend(true, { }, this.DefaultConfig, config);

    var templateFile = pathJs.resolve(config.input.templateFile);
    var contentFilter = config.output.contentFilter;
    var outputPath = config.output.file.path && pathJs.resolve(config.output.file.path);
    var outputExt = config.output.file.extension;
    var outputType = config.output.type;
    var outputSplitting = config.output.file.splitting;

    return this.parse(config).then(files =>
    {
        var writeCallback;
        var result;

        if(outputType === this.OutputType.File)
        {
            if(outputSplitting === this.FileSplitting.AllInOne)
            {
                var rendered = helper.map(files, item =>
                {
                    var rendered = nunjucks.render(templateFile, item);
                    return (contentFilter && contentFilter(rendered)) || rendered;
                });

                fs.writeFileSync(outputPath, rendered.join("\n\n\n"));
            }
            else if(outputSplitting === this.FileSplitting.OnePerResource)
            {
                helper.each(files, item =>
                {
                    helper.each(item.resources, res =>
                    {
                        item.resources = [ res ];

                        var rendered = nunjucks.render(templateFile, item);
                        rendered = (contentFilter && contentFilter(rendered)) || rendered;

                        fs.writeFileSync(pathJs.join(outputPath, res.displayName + outputExt), rendered);
                    });
                });
            }
        }
        else
        {
            var rendered = helper.map(files, item =>
            {
                var rendered = nunjucks.render(templateFile, item);
                return (contentFilter && contentFilter(rendered)) || rendered;

            }).join("\n\n\n");

            if(outputType === this.OutputType.ReturnOnly)
                result = rendered;
            else if(outputType === this.OutputType.StdOut)
                process.stdout.write(rendered);
        }

        return result;
    });
}

/**
 * Parses RAML service definitions returns a promise containing an object with all parsed values when resolved.
 * @param {object} config - Configuration based on the options provided by [DefaultConfig](#defaultconfig)
 * @returns {Promise}
 */
module.exports.parse = function(config)
{
    config = extend(true, { }, this.DefaultConfig, config);

    var contentFilter = config.input.contentFilter;
    var allPromises = [ ];

    helper.each(config.input.paths, path =>
    {
        var files = helper.listFiles(path, config.input.recursive, config.input.fileFilter);
        var promises = Promise.all(helper.map(files, file => raml2obj.parse(file)));

        allPromises.push(promises);
    });

    return Promise.all(allPromises).then(items =>
    {
        var relaxed = helper.unwindArray(items);
        return (contentFilter && relaxed.map(contentFilter)) || relaxed;
    });
}
