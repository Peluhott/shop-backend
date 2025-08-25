import { Request, Response} from 'express'
import { retrieveMessage } from './ai.client'
import { parser } from './ai.parser'
import { executeFunction } from './ai.executor'


export async function postMessage(req: Request, res:Response) {
    const { message } = req.body
    if (!message || typeof message !== 'string'){
        return res.status(400).json({message: 'message is required'})
    }
    try {
        const resMessage = await retrieveMessage(message)
        const functionCall = await parser(resMessage)
        const {functionName, status} = functionCall
        const response = await executeFunction(functionName, status)
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({message: 'error'})
    }
}