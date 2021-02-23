const errorDefinitions = {
    "Errors": {
        "type": "object",
        "properties": {
            "errors": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/Error"
                }
            }
        },
        "required": []
    },
    "Error": {
        "type": "object",
        "properties": {
            "message": {
                "$ref": "#/definitions/String",
                "type": "string"
            },
            "extensions": {
                "$ref": "#/definitions/ErrorExtensions"
            }
        },
        "required": []
    },
    "ErrorExtensions": {
        "type": "object",
        "properties": {
            "code": {
                "$ref": "#/definitions/ErrorCode"
            }
        },
        "required": []
    }
};

const errorCode = {
    "ErrorCode": {
        "type": "string",
        "$ref": "#/definitions/String"
    }
};

module.exports = function (jsonSchemaDefinition) {
    let definitions = {...jsonSchemaDefinition, ...errorDefinitions};

    if (definitions["ErrorCode"] === undefined) {
        definitions = {...definitions, ...errorCode};
    }

    return definitions;
};
