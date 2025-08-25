import OpenAI from "openai";
import type { ResponseCreateParams } from "openai/resources/responses";
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
import { tools } from "./tool.js";
import { systemPrompt } from "./system.js";

const input:  ResponseCreateParams["input"] = [
    ...systemPrompt, {role: "user" as const, content: [{type: "text" as const, text: "return all orders"}]}
];


    let response = await openai.responses.create({
    model: "gpt-4.1",
    tools,
    input
})
