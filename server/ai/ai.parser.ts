export async function parser(response: any) {
    const functionName = response.output[0].name
    const args = JSON.parse(response.output[0].arguments);
    const status = args.status || "no status"
    return {functionName, status}
}