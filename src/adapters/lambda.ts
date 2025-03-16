import AWS from 'aws-sdk';

const lambda = new AWS.Lambda({ region: process.env.AWS_REGION || "ap-southeast-2" }); 

// Adapter function for invoking the Lambda function
export const invokeLambdaUpload = async (payload: object) => {

    console.log(payload)
    const params = {
        FunctionName: process.env.AWS_UPLOAD_LAMBDA || "" ,
        Payload: JSON.stringify(payload),
    };

    try {
        const response = await lambda.invoke(params).promise();
        console.log(response, "response")
        
        // Parse and return Lambda's response
        return JSON.parse(response.Payload as string);
    } catch (error) {
        console.error('Error invoking Lambda:', error);
        throw new Error(`Failed to invoke Lambda function: ${error}`);
    }
};
