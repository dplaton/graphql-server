const {openwhiskApollo} = require('./openwhiskApollo');
const {ApolloServerBase} = require('apollo-server-core');

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
            console.log(`[ApolloServer] Inspect the arguments:`);
            console.log('[ApolloServer] What is our request?', req);
            console.log('[ApolloServer] What is our response?', res);

            let response;

            if (
                req['__ow_path'] &&
                !['', '/', '/graphql'].includes(req['__ow_path'])
            ) {
                response = new HttpResponse(404);
                return res.toJson;
            }

            if (req.method === 'OPTIONS') {
                return new HttpResponse({body: ''}, 204, {}).toJson();
            }

            if (this.playgroundOptions && req.method === 'GET') {
                console.log(`Playground page requested`);
                const acceptHeader = req.headers['accept'];
                if (acceptHeader && acceptHeader.includes('text/html')) {
                    const playgroundRenderPageOptions = {
                        endpoint: req['referer'],
                        ...this.playgroundOptions
                    };

                    response = new HttpResponse(
                        {
                            body: renderPlaygroundPage(
                                playgroundRenderPageOptions
                            )
                        },
                        200,
                        {}
                    );
                    return response.toJson();
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

module.exports = ApolloServer;
