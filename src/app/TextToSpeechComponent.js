"use client";

import { useEffect, useRef, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

export default function TextToSpeechComponent() {
  const audioRef = useRef(null);
  // free text to speech --------------------------------
  const [value, setValue] = useState(
    "Movies, oh my gosh, I just just absolutely love them. They're like time machines taking you to different worlds and landscapes, and um, and I just can't get enough of it."
  );
  const { speak, voices, cancel } = useSpeechSynthesis();
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);

  const handleVoiceChange = (event) => {
    const selectedVoiceIndex = voices[event.target.value];
    console.log(selectedVoiceIndex);
    setSelectedVoice(selectedVoiceIndex);
  };
  // free text to speech --------------------------------

  // google text to speech --------------------------------

  const [text, setText] = useState(
    "Movies, oh my gosh, I just just absolutely love them. They're like time machines taking you to different worlds and landscapes, and um, and I just can't get enough of it."
  );
  const [voice, setVoice] = useState("");
  const [listOfVoices, setListOfVoices] = useState([]);

  // Fetch available voices from the API when the component mounts
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch("/api/voices");
        if (response.ok) {
          const data = await response.json();
          setListOfVoices(data.voices);

          // Optionally set a default voice
          if (data.voices.length > 0) {
            setVoice(data.voices[0].name);
          }
        } else {
          console.error("Failed to fetch voices");
        }
      } catch (error) {
        console.error("Error fetching voices:", error);
      }
    };

    fetchVoices();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, voiceName: voice }),
    });

    if (response.ok) {
      const { audioContent } = await response.json();

      const audioBlob = new Blob(
        [
          new Uint8Array(
            atob(audioContent)
              .split("")
              .map((char) => char.charCodeAt(0))
          ),
        ],
        { type: "audio/mp3" }
      );

      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = audio;
      audio.play();
    } else {
      console.error("Failed to synthesize speech");
    }
  };

  const handleStop = () => {
    // Stop the react-speech-kit speech
    cancel();

    // Stop the Google TTS audio if it's playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset the audio playback
    }
  };

  return (
    <div className="text-black">
      <div>
        <div>
          <h1 className="text-2xl font-bold text-center text-white">
            Text to Speech Completely free
          </h1>
          <form className="flex flex-col items-center gap-y-4">
            <textarea
              value={value}
              className=" w-2/4"
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter text to listen the speech"
            />
            <div>
              {" "}
              <label htmlFor="voiceSelect " className="text-white">
                Select Voice:
              </label>
              <select
                id="voiceSelect"
                onChange={handleVoiceChange}
                className="ml-2 p-2 border rounded-md "
                disabled={voices.length === 0}
              >
                {voices.map((voice, index) => (
                  <option key={index} value={index} className="">
                    {index} - {voice.name} - {voice.lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="button"
                className="p-2 border rounded-md text-white"
                onClick={() =>
                  speak({
                    text: value,
                    voice: selectedVoice,
                  })
                }
              >
                Speak
              </button>
              <button
                type="button"
                onClick={handleStop}
                className="ml-2 p-2 border rounded-md text-white"
              >
                Stop
              </button>
            </div>
          </form>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-center text-white">
          Text to Speech from google 4 million character per month free
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-y-4"
        >
          <textarea
            value={text}
            className=" w-2/4"
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to listen to the speech"
          />
          <div>
            <label htmlFor="voiceSelect" className="text-white">
              Select Voice:
            </label>
            <select
              id="voiceSelect"
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="ml-2 p-2 border rounded-md"
              disabled={listOfVoices.length === 0}
            >
              {listOfVoices.map((v, index) => (
                <option key={index} value={v.name}>
                  {index} - {v.name} ({v.languageCodes.join(", ")})
                </option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" className="p-2 border rounded-md text-white">
              Speak
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="ml-2 text-white p-2 border rounded-md "
            >
              Stop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
