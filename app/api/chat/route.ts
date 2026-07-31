import OpenAI from "openai";

const openai =
 new OpenAI({

  apiKey:
  process.env.OPENAI_API_KEY,

 });

export async function POST(
 req:Request
){

 const body =
 await req.json();

 const stream =
 await openai.responses.create({

  model:"gpt-5",

  input:body.prompt,

  stream:true,

 });

 return stream.toTextStreamResponse();

}