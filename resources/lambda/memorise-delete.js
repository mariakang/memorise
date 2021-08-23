exports.handler = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const DDB = new AWS.DynamoDB.DocumentClient();

    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    } else {
        console.log("Authorization configured");
    }

    DDB.delete({
        TableName: "memorise",
        Key: {
            "id": JSON.parse(event.body).listId
        },
        ConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": event.requestContext.authorizer.claims['cognito:username']
        }
    }).promise().then((response) => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify(response),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    }).catch((err) => {
        console.error(err);
        errorResponse(err.message, context.awsRequestId, callback);
        return;
    });

    function errorResponse(errorMessage, awsRequestId, cb) {
        console.error(errorMessage);
        cb(null, {
            statusCode: 500,
            body: JSON.stringify({
                Error: errorMessage,
                Reference: awsRequestId,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};
