const { graphqlSync, buildSchema, getIntrospectionQuery, buildClientSchema } = require('graphql')
const request = require("sync-request")
const fs = require('fs');

const converter = require('graphql-2-json-schema');

module.exports = function (graphUrl, authHeader) { 
    if (graphUrl.includes("file://")) {
        return fetchSchemaFromFile(graphUrl);
    } else {
        return fetchSchemaFromUrl(graphUrl, authHeader);
    }
    

}

function fetchSchemaFromFile(graphUrl) {
  const filePath = graphUrl.replace("file://", "");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const graphQLSchema = buildSchema(fileContent);
  
  const introspection = graphqlSync(graphQLSchema, getIntrospectionQuery()).data;

  const jsonSchema = converter.fromIntrospectionQuery(introspection);

  return {
    jsonSchema,
    graphQLSchema
  }
}

function fetchSchemaFromUrl(graphUrl, authHeader) {
    const requestBody = {
        operationName: "IntrospectionQuery",
        query: getIntrospectionQuery()
    };

    const headers = authHeader ? Object.fromEntries([authHeader.split(":")]) : {};

    const responseBody = request("POST", graphUrl, {
        headers,
        json: requestBody
    }).getBody('utf8');

    const introspectionResponse = JSON.parse(responseBody);   

    const graphQLSchema = buildClientSchema(introspectionResponse.data);
    const jsonSchema = converter.fromIntrospectionQuery(introspectionResponse.data);

    return {
        jsonSchema,
        graphQLSchema
    }
}
