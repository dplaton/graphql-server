const openwhiskApollo = require('./openwhiskApollo');
const {ApolloServerBase} = require('apollo-server-core');

class ApolloServer extends ApolloServerBase {
    constructor(options) {
        if (process.env.ENGINE_API_KEY || options.engine) {
            options.engine = {
                sendReportsImmediately: true,
                ...(typeof options.engine !== 'boolean' ? options.engine : {})
            };
        }
        super(options);
    }

    // This translates the arguments from the middleware into graphQL options It
    // provides typings for the integration specific behavior, ideally this would
    // be propagated with a generic to the super class
    createGraphQLServerOptions(req, res) {
        return super.graphQLServerOptions({req, res});
    }

    createHandler({cors = undefined} = {}) {
        console.log(`Creating handler...`);
        const promiseWillStart = this.willStart();
        const corsHeaders = {};

        if (cors) {
            console.log(`We have CORS`);
            if (cors.methods) {
                if (typeof cors.methods === 'string') {
                    corsHeaders['Access-Control-Allow-Methods'] = cors.methods;
                } else if (Array.isArray(cors.methods)) {
                    corsHeaders[
                        'Access-Control-Allow-Methods'
                    ] = cors.methods.join(',');
                }
            }
            if (cors.allowedHeaders) {
                if (typeof cors.allowedHeaders === 'string') {
                    corsHeaders['Access-Control-Allow-Headers'] =
                        cors.allowedHeaders;
                } else if (Array.isArray(cors.allowedHeaders)) {
                    corsHeaders[
                        'Access-Control-Allow-Headers'
                    ] = cors.allowedHeaders.join(',');
                }
            }
            if (cors.exposedHeaders) {
                if (typeof cors.exposedHeaders === 'string') {
                    corsHeaders['Access-Control-Expose-Headers'] =
                        cors.exposedHeaders;
                } else if (Array.isArray(cors.exposedHeaders)) {
                    corsHeaders[
                        'Access-Control-Expose-Headers'
                    ] = cors.exposedHeaders.join(',');
                }
            }

            if (cors.credentials) {
                corsHeaders['Access-Control-Allow-Credentials'] = 'true';
            }
            if (cors.maxAge) {
                corsHeaders['Access-Control-Max-Age'] = cors.maxAge;
            }
        }

        return (req, res) => {
            console.log(`[ApolloServer] Inspect the arguments:`);
            console.log('[ApolloServer] What is our request?', req);
            console.log('Do we have a response?', res);
            if (req.path && !['', '/', '/graphql'].includes(req.path)) {
                res.status(404).end();
                return;
            }

            if (cors) {
                if (typeof cors.origin === 'string') {
                    res.set('Access-Control-Allow-Origin', cors.origin);
                } else if (
                    typeof cors.origin === 'boolean' ||
                    (Array.isArray(cors.origin) &&
                        cors.origin.includes(req.get('origin') || ''))
                ) {
                    res.set('Access-Control-Allow-Origin', req.get('origin'));
                }

                if (!cors.allowedHeaders) {
                    res.set(
                        'Access-Control-Allow-Headers',
                        req.get('Access-Control-Request-Headers')
                    );
                }
            }

            if (req.method === 'OPTIONS') {
                res.status(204).send('');
                return;
            }

            if (this.playgroundOptions && req.method === 'GET') {
                const acceptHeader = req.headers['accept'];
                if (acceptHeader && acceptHeader.includes('text/html')) {
                    const playgroundRenderPageOptions = {
                        endpoint: req.get('referer'),
                        ...this.playgroundOptions
                    };

                    res.status(200).send(
                        renderPlaygroundPage(playgroundRenderPageOptions)
                    );
                    return;
                }
            }
            res.set(corsHeaders);

            openwhiskApollo(async () => {
                await promiseWillStart;
                return this.createGraphQLServerOptions(req, res);
            })(req, res);
        };
    }
}

module.exports = ApolloServer;