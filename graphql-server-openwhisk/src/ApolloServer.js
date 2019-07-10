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

    // This translates the arguments from the middleware into graphQL options It
    // provides typings for the integration specific behavior, ideally this would
    // be propagated with a generic to the super class
    createGraphQLServerOptions(req, res) {
        console.log(`Create GraphqlServerOptions...`);
        return super.graphQLServerOptions({req, res});
    }

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

            if (this.playgroundOptions && req['__ow_method'] === 'get') {
                console.log(`Playground page requested`);
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
