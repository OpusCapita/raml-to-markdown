# raml-to-markdown
[![Coverage Status](https://coveralls.io/repos/github/OpusCapita/raml-to-markdown/badge.svg)](https://coveralls.io/github/OpusCapita/raml-to-markdown)

RAML to Markdown is a simple tool to create documentations out of RAML service definitions. Its output is template based to enable developers to change the output structure, style or even the output type e.g. by creating html [templates](#templating).

This module provides a comfortable APIs and a full featured command line client.

### Install

```
npm install -g raml-to-markdown
```

### Command-line interface

After installing you may use the command-line interface (CLI) on the terminal of your computer. The command is named "raml2md".

```
raml2md --help

Usage: raml2md [options] [path]

Options:

  -h, --help                 output usage information
  -r, --recursive            Scan <path> recursively.
  -t, --template <template>  Template file to use for output generation.
  -o, --output-type <type>   Where to put the output. Possible values: stdout, file, file-per-resource.
  -f, --output-file <file>   File to output results to if output type is file.
  -p, --output-path <path>   Path to output results to if output type is file-per-resource.
  -c, --config <file>        Path to a JSON config file to use.
  --output-ext <extension>   File extension of result files if output type is file-per-resource.
  --file-filter <regexp>     RegExp for filtering files.
```

#### Config file

The config file represents all configuration options available to run the tool from command line. These are almost the same options as shown in the [DefaultConfig](#defaultconfig) section of the API description. In order to use the module programmatically, you will have to use the [DefaultConfig](#defaultconfig) settings instead.

```JS
{
    "input": {
        "paths": [],
        "recursive": false,
        "fileFilter": "\\.raml$",
        "templateFile": "./templates/index.njk"
    },
    "output": {
        "type": "StdOut",
        "file": {
            "splitting": "AllInOne",
            "path": null,
            "extension": ".md"
        }
    }
}
```

### API

You might also want to use the API of this tool as a library. The library provides two methods to call. A parse() and a render() method.

The **parse()** method returns an array with objects containing all information extracted from the source. Each array index represents one source file parsed.

The **render()** method does the same but outputs a processed template depending on the input and output settings of the passed configuration object.

Both methods return a Promise object. Depending on the configuration settings, the promise contains the rendered output or undefined.

```JS
const raml2md = require('raml-to-markdown');

raml2md.parse({ input : { paths : [ '...' ] } }).then(console.log);
raml2md.render({ input : { paths : [ '...' ] } }).then(console.log);
```

For configuration options please have a look at the [DefaultConfig](#defaultconfig) section.

#### Templating

This module uses [Nunjucks](https://www.npmjs.com/package/nunjucks) in order to structure the parsed RAML. By changing the provided or creating a new template, you would be able to create almost every formatted text output.

#### DefaultConfig

```JS
{
   input : {
       paths : [ ],
       recursive : false,
       fileFilter : new RegExp('\.raml$'),
       templateFile : './templates/index.njk',
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
```
