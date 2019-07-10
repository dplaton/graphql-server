'use strict';
const runHttpQuery = require('apollo-server-core').runHttpQuery;
const {Headers} = require('apollo-server-env');
const HttpResponse = require('./http-response');

function openwhiskApollo(options) {
    console.log('Executing openWhiskApollo...');
    if (!options) {
        throw new Error('Need some options');
    }

    const graphqlHandler = (req, res) => {
        console.log(`[openwhiskApollo] Handling graphql...`);
        console.log('[GrapqhHandler] Our request is', req);

        const method = req['__ow_method'];
        if (!method) {
            return;
        }
        console.log(`Using method ${method}`);

        const hasPostBody = req['query'] && req['query'].length > 0;
        if (method === 'post' && !hasPostBody) {
            console.log('[GraphqlHandler] POST body missing');

            const httpResponse = new HttpResponse(
                {body: 'POST body missing.'},
                500,
                {}
            );
            return httpResponse.toJson();
        }

        const query = req['query'];

        console.log(`Do we have a body? ${hasPostBody}`);
        console.log(`What's our body ${query}`);
        console.log(`Running the HTTPquery...`);

        const request = {
            method: method.toUpperCase(),
            options,
            query: {
                query
            },
            headers: new Headers(req['__ow_headers']),
            url: req.url,
            referrer: req.url
        };

        return runHttpQuery([req, res], request).then(
            ({graphqlResponse, responseInit}) => {
                const response = new HttpResponse(graphqlResponse, 200, {
                    ...responseInit.headers
                });

                console.log('runHttpQuery returns', response.toJson());
                return response.toJson();
            },
            error => {
                console.log(`We have some errors`, error);
                if ('HttpQueryError' !== error.name) {
                    return new HttpResponse(
                        {error: error.name},
                        500,
                        {}
                    ).toJson();
                }
                return new HttpResponse(
                    {message: error.message},
                    400,
                    {}
                ).toJson();
            }
        );
    };
    return graphqlHandler;
}

module.exports.openwhiskApollo = openwhiskApollo;
