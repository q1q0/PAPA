import axios from 'axios'

export async function findWalletAddress(address: string): Promise<any> {
    if(!process.env.REACT_APP_API_BASE_URL) return {error: 'not exist endpoint url'};
    try {
        console.log(`${process.env.REACT_APP_API_BASE_URL}claim`);
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}claim`, {address})
        console.log("===========api=============",res.data)
        return {data: res.data, error: res.data.error, warn: res.data.warn, message: res.data.message}
    } catch(e) {
        return {error: e}
    }
}