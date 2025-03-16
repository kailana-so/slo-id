import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

// Initialize Lambda client using v3
const lambda = new LambdaClient({ region: process.env.AWS_REGION || "ap-southeast-2" });

export async function POST(req: Request) {
  const body = await req.json();  // Parse JSON from request body

  console.log("AWS_UPLOAD_LAMBDA:", process.env.AWS_UPLOAD_LAMBDA); // Debugging

  const payload = body;
  const params = {
    FunctionName: process.env.AWS_UPLOAD_LAMBDA || "",
    Payload: Buffer.from(JSON.stringify(payload)),
  };

  try {
    const command = new InvokeCommand(params);
    const response = await lambda.send(command);  // Use .send() with the v3 client
    const responseData = JSON.parse(new TextDecoder().decode(response.Payload));  // Decode the payload

    return new Response(
      JSON.stringify({
        message: "Image uploaded successfully",
        result: responseData,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return new Response(
      JSON.stringify({ error }),
      { status: 500 }
    );
  }
}
