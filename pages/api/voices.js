import { getGoogleCloudCredentials } from "@/utils/googleCloudCredentials";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const client = new TextToSpeechClient({
  credentials: getGoogleCloudCredentials(),
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send({ message: "Only GET requests are allowed" });
  }

  try {
    // Fetch available voices from Google Cloud Text-to-Speech
    const [result] = await client.listVoices({});
    const voices = result.voices;

    // Return the voices list in the response
    res.status(200).json({ voices });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(400).json({ error: "Error fetching voices" });
  }
}
