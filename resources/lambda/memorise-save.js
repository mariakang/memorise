exports.handler = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const DDB = new AWS.DynamoDB.DocumentClient();

    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    } else {
        console.log("Authorization configured");
    }

    const requestBody = JSON.parse(event.body);
    
    const username = event.requestContext.authorizer.claims['cognito:username'];
    if (username != requestBody.username) {
        errorResponse('Usernames do not match', context.awsRequestId, callback);
        return;
    } else {
        console.log("Usernames match");
    }

    let itemToSave = {
        id: requestBody.id == "new" ? (username + new Date().getTime()) : requestBody.id,
        username: username,
        title: requestBody.title,
        column1: requestBody.column1,
        column2: requestBody.column2,
        items: requestBody.items,
        publicOrPrivate: requestBody.public ? "public" : "private"
    }

    DDB.put({
        TableName: "memorise",
        Item: itemToSave
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
