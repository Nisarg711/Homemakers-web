import {tavily} from "@tavily/core"
import {requireAuth} from "@/lib/api-helpers"; 
//Created requireAuth helper so as to prevent
//any attacker from sending requests out of nowhere.


export const GET = async (request) => {
    const { session, error } = await requireAuth();
    if (error) {
        return error;
    }
    try{
        const tavilykey= process.env.TAVILY_KEY
        const tvly = tavily({ apiKey: tavilykey });
        const response = await tvly.search("Give me only three (3) latest news about real estate in India");
        return new Response(JSON.stringify({response}), {status: 200})
    }
    catch(error){
        return new Response(JSON.stringify({error: error.message}), {status: 500})
    }

} 