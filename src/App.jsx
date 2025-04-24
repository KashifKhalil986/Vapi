import { useState, useEffect } from 'react';
import Vapi from "@vapi-ai/web";

const App = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [specialization ,setSpecialization]=useState("webDev");
  const [vapi] = useState(new Vapi("6bfd58d2-f9b8-4aae-97e7-7d575d588017"));

  const MODES = {
    webDev: {
      instruction: `You are a web development expert. Only answer questions about:
      - HTML, CSS, JavaScript
      - Frontend frameworks (React, Vue, Angular)
      - Backend technologies (Node.js, APIs)
      - Web architecture and best practices
      Redirect other questions to web topics.`,
      response: "I specialize in web development. Ask me about HTML, React, or Node.js!"
    },
    ai: {
      instruction: `You are an artificial intelligence expert. Only answer questions about:
      - Machine Learning, Deep Learning
      - AI tools, frameworks (TensorFlow, PyTorch)
      - Natural Language Processing (NLP), Computer Vision
      - Use cases of AI in various industries
      Redirect other questions to AI topics.`,
      response: "I specialize in AI and machine learning. Ask me about models, training, or datasets!"
    },
    flutter: {
      instruction: `You are a Flutter and Dart expert. Only answer questions about:
      - Building mobile apps with Flutter
      - Dart programming language
      - Flutter widgets, layouts, and navigation
      - State management (Provider, Riverpod, Bloc)
      Redirect other questions to Flutter-related topics.`,
      response: "I specialize in Flutter. Ask me about widgets, layouts, or Dart!"
    } ,
    general: {
      instruction: `The user has pressed the button,say hello kashif and reply to his question`,
      response: "I specialize in everything"
    }
  
  
   
  };

  const updateSpecialized = (mode) =>{
 
    setSpecialization(mode);
    sendSystemMessage(MODES[mode].instruction)

  }
  

  useEffect(() => {
    const handleSpeechStart = () => console.log("Assistant speech has started.");
    const handleSpeechEnd = () => console.log("Assistant speech has ended.");
    const handleCallStart = () => setIsCallActive(true);
    const handleCallEnd = () => setIsCallActive(false);

    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);

    return () => {
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
    };
  }, [vapi]);

  const startCall = async () => {
    try {
      await vapi.start("7e57e4f1-5069-4dfb-891c-9ade804ef30a");
    } catch (error) {
      console.error("Failed to start call:", error);
    }
  };

  const stopCall = () => {
    vapi.stop();
  };

  const sendSystemMessage = (instruction) => {
    vapi.send({
      type: "add-message",
      message: {
        role: "system",
        content: `${instruction}`,
      },
    });
  };

  const toggleMute = () => {
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Voice Assistant
        </h1>

        <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Status: {isCallActive ? 'Active' : 'Inactive'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={startCall}
                disabled={isCallActive}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  isCallActive ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                Start Call
              </button>

              <button
                onClick={stopCall}
                disabled={!isCallActive}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  !isCallActive ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Stop Call
              </button>

              <button
                onClick={toggleMute}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isMuted ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}>
                {isMuted ? 'Unmute' : 'Mute'}
              </button>

      
            </div>
            <div className="mt-5 space-x-2">
            <button
                onClick={()=>updateSpecialized("webDev")}
                disabled={!isCallActive}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  !isCallActive ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'
                }`}>
                Web Development
              </button>

              <button
                onClick={()=>updateSpecialized("ai")}
                disabled={!isCallActive}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  !isCallActive ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'
                }`}>
                Ai
              </button>

              <button
                onClick={()=>updateSpecialized("flutter")}
                disabled={!isCallActive}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  !isCallActive ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'
                }`}>
                Flutter
              </button>

              <button
                onClick={()=>updateSpecialized("general")}
                disabled={!isCallActive}
                className={`px-6 py-2 rounded-lg text-white font-medium 
                ${!isCallActive ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'}`}>
                General
              </button>

            </div>

            <div className="mt-5">
              <p> {MODES[specialization].response}</p>
            </div>
          </div>

    
        </div>

        <p className="text-center text-gray-500 text-sm">
          Make sure to allow microphone access when prompted
        </p>
      </div>
    </div>
  );
};

export default App;