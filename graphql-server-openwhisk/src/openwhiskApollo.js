'use strict';
import {runHttpQuery} from 'apollo-server-core';
import {Headers} from 'apollo-server-env';
import HttpResponse from './http-response';

/**
 * Creates a function that handles the GraphQL query
 * @param {*} options
 */
function openwhiskApollo(options) {
    if (!options) {
        throw new Error('Need some options');
    }

    const graphqlHandler = (req, res) => {
        console.log(`[openwhiskApollo] Handling graphql query...`);
        console.log('[GrapqhHandler] Our request is', req);

        const method = req['__ow_method'];
        if (!method) {
            return;
        }

        // naively check the request
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
                // query successful, now we return the results
                const response = new HttpResponse(graphqlResponse, 200, {
                    ...responseInit.headers
                });

                return response.toJson();
            },
            error => {
                // errors were encountered, so we respond with that
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

export {openWhiskApollo};
