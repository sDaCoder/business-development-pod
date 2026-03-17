// export async function POST(req: Request) {
//     const body = await req.json();

//     const response = await fetch("http://localhost:8080/invocations", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(body)
//     });

//     const data = await response.json();
//     const content: string = data.content ?? data.error ?? "No response";

//     // Format as AI SDK Data Stream Protocol so useChat can parse message parts.
//     // Spec: https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol
//     const enc = new TextEncoder();
//     const stream = new ReadableStream({
//         start(controller) {
//             // 0: prefix = text part
//             controller.enqueue(enc.encode(`0:${JSON.stringify(content)}\n`));
//             // d: prefix = finish signal
//             controller.enqueue(enc.encode(`d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`));
//             controller.close();
//         }
//     });

//     return new Response(stream, {
//         headers: {
//             "Content-Type": "text/plain; charset=utf-8",
//             "x-vercel-ai-data-stream": "v1"   // tells useChat this is a data stream
//         }
//     });
// }