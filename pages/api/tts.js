import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const client = new TextToSpeechClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests are allowed" });
  }

  const {
    text,
    languageCode = "en-US",
    voiceName = "en-US-Wavenet-D",
  } = req.body;

  const request = {
    input: { text },
    voice: { languageCode, name: voiceName },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);

    const audioContent = response.audioContent.toString("base64");
    res.status(200).json({ audioContent });
  } catch (error) {
    console.error("ERROR:", error);
    res
      .status(500)
      .json({ error: "Error processing the text-to-speech request" });
  }
}
