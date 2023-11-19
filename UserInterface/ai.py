import openai
import os
from dotenv import load_dotenv
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
def chatGPT(text):
    response = openai.ChatCompletion.create(
        model = "gpt-4",
        messages = [{"role": "system", "content": "You are a helpful assistant. I will give you a kind of plant,you should response the range confort humidity, teperature(use centigrade) and suggestion of cultivating this plant in JSON format,like {\"temperature\": \"xxx-xxx\",\"humidity\":\"xxx-xxx\",\"sugesstion\":\"xxx\"},if the input is not a plant,please response unknown. Please do not wrap lines in the result. Low values precede, high values follow"},
                    {"role": "user", "content": text}],
        temperature=0.2,
    )
    return response['choices'][0]['message']['content'].lower()
