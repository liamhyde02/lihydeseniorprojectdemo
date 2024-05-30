import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { fromUtf8, toUtf8 } from "@aws-sdk/util-utf8-browser";

export const dynamic = 'force-dynamic' // defaults to auto

const client = new LambdaClient({})

export async function POST(request: Request) {
    const body = await request.json()
    const branch = body.branch
    const githubLink = body.githubLink
    const payloadObject = {
        type: "github",
        branch: branch,
        url: githubLink,
    };

    

    const payloadString = JSON.stringify(payloadObject);
    const params = {
        FunctionName: "Core-Engine-Docker", 
        Payload: fromUtf8(JSON.stringify({
            body: payloadString,
        })),
    };

    console.log('Submitting request with params:', params);

    try {
        const response = await client.send(new InvokeCommand(params));
        const { Payload } = response;
        if (!Payload) {
            console.log("huh")
            throw new Error('No payload returned from Lambda function');
        }
        console.log('Raw response from Lambda:', response);
        const utf8response = toUtf8(Payload);
        console.log('Parsed response from Lambda:', utf8response);
        const parsedResponse = JSON.parse(utf8response).body;
        const imageUrl = parsedResponse; 
        console.log('Image URL:', imageUrl);

        if (response.StatusCode !== 200) {
            throw new Error(`Lambda function returned non-200 status code: ${response.StatusCode}`);
        }
        return Response.json({ imageUrl });
    }

    catch (error) {
        console.error('Error occurred:', error);
        return new Response('Internal server error', { status: 500 });
    }


}