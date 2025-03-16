import { invokeLambdaUpload } from "@/adapters/lambda";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // This will be your code to call Lambda
    try {
      const result = await invokeLambdaUpload(req.body); // Use AWS SDK to invoke Lambda
      res.status(200).json({ message: 'Image uploaded successfully', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
