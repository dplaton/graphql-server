/**
 * A custom implementation of the Apollo Server so that it works in a serverless environment.
 */
import {openwhiskApollo} from './openwhiskApollo';
import {ApolloServerBase} from 'apollo-server-core';
import {renderPlaygroundPage} from '@apollographql/graphql-playground-html';

import HttpResponse from './http-response';

class ApolloServer extends ApolloServerBase {
    constructor(options) {
        super(options);
        this.playgroundOptions = {
            version: 1
        };
    }

    createGraphQLServerOptions(req, res) {
        console.log(`Create GraphqlServerOptions...`);
        return super.graphQLServerOptions({req, res});
    }

    /**
     * Creates a function that will handle all our requests
     * @param {} param0
     */
    createHandler({cors = undefined} = {}) {
        console.log(`[Apollo Server] Creating handler...`);
        const promiseWillStart = this.willStart();

        return (req, res) => {
            console.log('[ApolloServer] What is our request?', req);

            let response;
            const headers = req['__ow_headers'];

            if (req['__ow_method'] === 'OPTIONS') {
                return new HttpResponse({body: ''}, 204, {}).toJson();
            }

            // if this is a plain HTTP GET request then we just render the playground
            if (this.playgroundOptions && req['__ow_method'] === 'get') {
                console.log(`[ApolloServer] Playground page requested`);
                const acceptHeader = headers.accept;
                if (acceptHeader && acceptHeader.includes('text/html')) {
                    const playgroundRenderPageOptions = {
                        endpoint: process.env.OW_ENDPOINT,
                        ...this.playgroundOptions
                    };
                    return {
                        body: renderPlaygroundPage(playgroundRenderPageOptions)
                    };
                }
            }

            const options = async () => {
                console.log('Executing options...');
                await promiseWillStart;
                return this.createGraphQLServerOptions(req, res);
            };

            return openwhiskApollo(options)(req, res);
        };
    }
}

export default ApolloServer;
