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
        console.log(`Using method ${method}`);

        const hasPostBody = req['__ow_body'] && req['__ow_body'].length > 0;
        if (method === 'post' && !hasPostBody) {
            console.log('[GraphqlHandler] POST body missing');

            const httpResponse = new HttpResponse(
                {body: 'POST body missing.'},
                500,
                {}
            );
            return httpResponse.toJson();
        }

        console.log(`Do we have a body? ${hasPostBody}`);
        console.log(`What's our body ${req['__ow_body']}`);
        console.log(`Running the HTTPquery...`);
        runHttpQuery([req, res], {
            method: method.toUpperCase(),
            options: options,
            query: {query: 'query { hello }'},
            request: {
                query: {query: 'query { hello }'},
                url: req.url,
                method: method.toUpperCase(),
                headers: new Headers(req['__ow_headers']) // ? Check if this actually works
            }
        })
            .then(
                ({graphqlResponse, responseInit}) => {
                    res = {
                        statusCode: 200,
                        body: {
                            ...graphqlResponse
                        }
                    };
                    const httpResponse = new HttpResponse(
                        {...graphqlResponse},
                        200,
                        {
                            ...responseInit.headers
                        }
                    );
                    Promise.resolve(httpResponse.toJson());
                },
                error => {
                    console.log(`We have some errors`, error);
                    if ('HttpQueryError' !== error.name) {
                        res.status(500).send(error);
                        return;
                    }
                    res = {
                        statusCode: 400,
                        message: error.message
                    };
                    return res;
                }
            )
            .then(res => {
                console.log(`...and`, res);
            });
    };
    return graphqlHandler;
}

module.exports.openwhiskApollo = openwhiskApollo;
