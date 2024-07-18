import 'dotenv/config';

const question = "Midjourneyで画像を生成するコツ";
const url = process.env.DIFY_ENDPOINT;
const api_key = process.env.DIFY_KEY;

try {
    //fetch chatbot response from server
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${api_key}`},
        body: JSON.stringify({
          inputs: {},
          query: question,
          response_mode: "blocking",
          conversation_id: "",
          user: 12345,                
        })
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data.answer);
        });
} catch (error) {
    console.error(error);
}