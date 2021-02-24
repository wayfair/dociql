
const yaml = require('js-yaml')
const url = require('url')
const fs = require("fs")
const fetchSchema = require("./fetch-schema")
const composePaths = require("./compose-paths")
const addErrorDefinitions = require("./add-error-definitions");

module.exports = function(specPath, headers) {
    // read spec file content
    const fileContent = fs.readFileSync(specPath, "utf8")
    // deserialise
    const spec = yaml.safeLoad(fileContent)
    // fetch graphQL Schema
    const graphUrl = spec.introspection
    const {graphQLSchema, jsonSchema} = fetchSchema(graphUrl, headers)

    // parse URL
    const parsedUrl = url.parse(graphUrl)

    // generate specification
    const swaggerSpec = {
        openapi: '3.0.0',
        info: spec.info,
        servers: spec.servers,
        host: parsedUrl.host,
        schemes: [ parsedUrl.protocol.slice(0, -1) ],
        basePath: parsedUrl.pathname,
        externalDocs: spec.externalDocs,
        tags: spec.domains.map(_ => ({
            name: _.name,
            description: _.description,
            externalDocs: _.externalDocs
        })),
        paths: composePaths(spec.domains, graphQLSchema),
        securityDefinitions: spec.securityDefinitions,
        definitions: addErrorDefinitions(jsonSchema.definitions),
        errorSection: {
            description: "Aqui ponemos una descripción de los errores catalogue maikel nait",
            errorCatalogue: [
                {
                    name: "UNAUTHENTICATED",
                    description: "The pharmacy has not been found by the criteria provided y resulta que esta es mas larga entoavia",
                    messages: [
                        {
                            message: "Invalid credentials",
                            description: "The client is not recognized by the application. The client is the azp attribute within the token payload."
                        },
                        {
                            message: "Missing credentials",
                            description: "The token was not found in the Authorization header."
                        }
                    ]
                },
                {
                    name: "TODO_MU_MALAMENTERL",
                    description: "this is a description with a very long description",
                    messages: [
                        {
                            message: "Invalid credentials",
                            description: "The client is not recognized by the application. The client is the azp attribute within the token payload."
                        }
                    ]
                }
            ]
        }

    }

    return swaggerSpec
}
