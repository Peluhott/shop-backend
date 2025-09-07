import dotenv from 'dotenv'
dotenv.config()

import OpenAI from 'openai'
import { toolsToUse } from './ai.tools'
import { systemPrompt } from './ai.prompt'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const MODEL = 'gpt-4.1'
const INSTRUCTIONS = systemPrompt
const TOOLS = toolsToUse

export async function retrieveMessage(message: string){
  try {
    const response = await openai.responses.create({
      model: MODEL,
      instructions: INSTRUCTIONS,
      tools: TOOLS,
      input: message
    })

    return response 
  } catch (err: any) {
    console.log("error sending message to api")
  }
}


