import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

// Initialize Lambda client using v3
const lambda = new LambdaClient({ region: process.env.AWS_REGION || "ap-southeast-2" });

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON from request body

    console.log("AWS_UPLOAD_LAMBDA:", process.env.AWS_UPLOAD_LAMBDA); // Debugging
    console.log("Received payload:", body); // Debugging

    if (!body) {
      return new Response(JSON.stringify({ error: "Request body is missing" }), { status: 400 });
    }

    // Ensure FunctionName is not empty
    const functionName = process.env.AWS_UPLOAD_LAMBDA;
    if (!functionName) {
      return new Response(JSON.stringify({ error: "AWS_UPLOAD_LAMBDA is not set" }), { status: 500 });
    }

    const params = {
      FunctionName: functionName,
      Payload: JSON.stringify({ body: JSON.stringify(body) }), // Ensure payload is properly formatted
    };

    const command = new InvokeCommand(params);
    const response = await lambda.send(command);

    // Decode response payload
    const responseData = JSON.parse(new TextDecoder().decode(response.Payload));

    console.log("Lambda response:", responseData);

    return new Response(
      JSON.stringify({
        message: "Image uploaded successfully",
        result: responseData,
      }),
      { status: response.StatusCode }
    );
  } catch (error) {
    console.error("Error invoking Lambda:", error);

    return new Response(
      JSON.stringify(error),
      { status: 500 }
    );
  }
}
