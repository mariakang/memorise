exports.handler = (event, context, callback) => {
    const AWS = require('aws-sdk');
    let DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });

    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    } else {
        console.log("Authorization configured");
    }

    const username = event.requestContext.authorizer.claims['cognito:username'];
    if (username != JSON.parse(event.body).username) {
        errorResponse('Usernames do not match', context.awsRequestId, callback);
        return;
    } else {
        console.log("Usernames match");
    }

    let responseData = {
        usernameLists: [],
        publicLists: []
    };
    
    let usernameQueryParams = {
        ExpressionAttributeValues: {
            ":username": {
                S: username
            }
        },
        KeyConditionExpression: "username = :username",
        TableName: "memorise",
        IndexName: "username-index"
    };
    let usernameQueryFinished = false;
        
    let publicQueryParams = {
        ExpressionAttributeValues: {
            ":publicOrPrivate": {
                S: "public"
            }
        },
        KeyConditionExpression: "publicOrPrivate = :publicOrPrivate",
        TableName: "memorise",
        IndexName: "publicOrPrivate-index"
    };
    let publicQueryFinished = false;

    DDB.query(usernameQueryParams, (usernameErr, usernameResults) => {
        if (usernameErr) {
            errorResponse(usernameErr.message, context.awsRequestId, callback);
            return;
        } else {
            for (let i = 0; i < usernameResults.Items.length; i++) {
                responseData.usernameLists.push(reformat(usernameResults.Items[i]));
            }
            if (publicQueryFinished) {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(responseData),
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                return;
            }
            usernameQueryFinished = true;
        }
    });
    
    DDB.query(publicQueryParams, (publicErr, publicResults) => {
        if (publicErr) {
            errorResponse(publicErr.message, context.awsRequestId, callback);
            return;
        } else {
            for (let i = 0; i < publicResults.Items.length; i++) {
                responseData.publicLists.push(reformat(publicResults.Items[i]));
            }
            if (usernameQueryFinished) {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(responseData),
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                return;
            }
            publicQueryFinished = true;
        }
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
    
    function reformat(queryResultsItem) {
        let reformattedItem = {
            id: queryResultsItem.id.S,
            username: queryResultsItem.username.S,
            title: queryResultsItem.title.S,
            column1: queryResultsItem.column1.S,
            column2: queryResultsItem.column2.S,
            items: [],
            publicOrPrivate: queryResultsItem.publicOrPrivate.S
        };
        for (let i = 0; i < queryResultsItem.items.L.length; i++) {
            let originalPair = queryResultsItem.items.L[i];
            let reformattedPair = [originalPair.L[0].S, originalPair.L[1].S];
            reformattedItem.items.push(reformattedPair);
        }
        return reformattedItem;
    }
};
