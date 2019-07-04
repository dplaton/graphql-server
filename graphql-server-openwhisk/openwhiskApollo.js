'use strict';
const runHttpQuery = require('apollo-server-core').runHttpQuery;
const {Headers} = require('apollo-server-env');

function openwhiskApollo(options) {
    if (!options) {
        throw new Error('Need some options');
    }

    const graphqlHandler = (req, res) => {
        console.log(`[openwhiskApollo] Handling graphql`);
        const hasPostBody = req.body && Object.keys(req.body).length > 0;
        if (req.method === 'POST' && !hasPostBody) {
            res.status(500).send('POST body missing.');
            return;
        }

        runHttpQuery([req, res], {
            method: req.method,
            options: options,
            query: hasPostBody ? req.body : req.query,
            request: {
                url: req.url,
                method: req.method,
                headers: new Headers(req.headers) // ? Check if this actually works
            }
        }).then(
            ({graphqlResponse, responseInit}) => {
                res.status(200)
                    .set(responseInit.headers)
                    .send(graphqlResponse);
            },
            error => {
                if ('HttpQueryError' !== error.name) {
                    res.status(500).send(error);
                    return;
                }
                res.status(error.statusCode)
                    .set(error.headers)
                    .send(error.message);
            }
        );
    };
    return graphqlHandler;
}

module.exports.openwhiskApollo = openwhiskApollo;
