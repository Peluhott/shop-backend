export async function parser(response: any) {
    const functionName = response.output[0].name
    const status = response.output[0].status || "none"
    return {functionName, status}
}