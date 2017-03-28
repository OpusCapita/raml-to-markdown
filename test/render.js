const assert = require('assert');
const fs = require('fs');
const os = require('os');
const pathjs = require('path');
const raml2md = require('../libs/index.js');
const helper = require('../libs/helper.js');

describe('Render', () =>
{
    it('render() #1', (done) =>
    {
        raml2md.render({ input : { paths : [ './test/input' ] } })
            .then(result => assert.equal(JSON.stringify(result), fs.readFileSync('./test/data/rendered.txt', 'utf8')))
            .then(() => done());
    });

    it('render() #2', (done) =>
    {
        var result = raml2md.render({
            input : {
                paths : [ './test/input' ],
                recursive : true,
                fileFilter : (path) => path.endsWith('main.raml')
            },
            output : {
                type : raml2md.OutputType.StdOut
            }
        })

        result.then(() => done());
    });

    it('render() #3', (done) =>
    {
        var outPath = pathjs.join(os.tmpdir(), Math.random() + 'out.md');

        var result = raml2md.render({
            input : {
                paths : [ './test/input' ]
            },
            output : {
                type : raml2md.OutputType.File,
                file : {
                    splitting : raml2md.FileSplitting.AllInOne,
                    path : outPath
                }
            }
        })

        result.then(result =>
        {
            var outContent = fs.readFileSync(outPath, 'utf8');
            var testContent = fs.readFileSync('./test/data/rendered.txt', 'utf8');

            assert.equal(JSON.stringify(outContent), testContent);
        })
        .then(() => done());
    });

    it('render() #4', (done) =>
    {
        var outPath = pathjs.join(os.tmpdir(), Math.random() + '');
        fs.mkdirSync(outPath);

        var result = raml2md.render({
            input : {
                paths : [ './test/input' ]
            },
            output : {
                type : raml2md.OutputType.File,
                file : {
                    splitting : raml2md.FileSplitting.OnePerResource,
                    path : outPath
                }
            }
        })

        result.then(result =>
        {
            var entities = [ 'Countries.md', 'Currencies.md', 'Languages.md' ];

            entities.forEach(outFile =>
            {
                var outContent = fs.readFileSync(pathjs.join(outPath, outFile), 'utf8');
                var testContent = fs.readFileSync(pathjs.join('./test/data', outFile), 'utf8');

                assert.equal(outContent, testContent);
            });

        })
        .then(() =>
        {
            helper.listFiles(outPath).forEach(file => fs.unlinkSync(file));
            fs.rmdirSync(outPath);
        })
        .then(() => done());
    });
});
