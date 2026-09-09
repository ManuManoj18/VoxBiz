import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Pencil, Check } from 'lucide-react';

const VoiceSearchModal = ({ onClose, onQuery }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(
    'Click the microphone to start speaking'
  );

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      setMessage('Voice recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setMessage('Listening... Speak your query');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }

      setTranscript(finalTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      setMessage(
        'Recording stopped. You can edit your query or submit it.'
      );
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setMessage(`Error occurred: ${event.error}`);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setIsEditing(false);
    setTranscript('');
    setMessage('Starting voice recognition...');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
    setMessage(
      'Recording complete. You can edit your query or submit it.'
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('Edit your query using the keyboard.');
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    setMessage('Query updated. You can submit it now.');
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onClose();
      onQuery(transcript.trim());
    } else {
      setMessage('Please speak or type a query first.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-lg p-6 max-w-md w-full bg-slate-800 text-white">

        <h2 className="text-xl font-bold mb-4">
          Query Database
        </h2>

        <div className="flex flex-col items-center space-y-4">

          {/* Microphone Controls */}
          <div className="flex gap-4">

            {!isListening ? (
              <button
                onClick={startListening}
                className="p-6 rounded-full transition-all bg-indigo-600 hover:bg-indigo-700 text-white"
                title="Start voice input"
              >
                <Mic className="h-8 w-8" />
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="p-6 rounded-full transition-all bg-red-600 animate-pulse text-white"
                title="Stop voice input"
              >
                <MicOff className="h-8 w-8" />
              </button>
            )}

            {isListening && (
              <button
                onClick={stopListening}
                className="px-4 py-2 self-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Done
              </button>
            )}

          </div>

          {/* Status Message */}
          <p className="text-sm text-center text-gray-300">
            {message}
          </p>

          {/* Query Editor */}
          {!isListening && (
            <div className="mt-4 p-4 rounded-lg w-full bg-slate-700">

              <div className="flex items-center justify-between mb-2">

                <p className="text-sm font-medium text-gray-300">
                  Your query:
                </p>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-sm"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishEditing}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-sm"
                  >
                    <Check className="h-4 w-4" />
                    Done
                  </button>
                )}

              </div>

              {isEditing ? (
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  autoFocus
                  rows={4}
                  className="w-full mt-1 p-3 rounded-md bg-slate-900 text-white border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Type or correct your database query..."
                />
              ) : (
                <div className="w-full min-h-[100px] mt-1 p-3 rounded-md bg-slate-900 text-gray-200">
                  {transcript ? (
                    <p className="text-lg break-words">
                      {transcript}
                    </p>
                  ) : (
                    <p className="text-gray-500">
                      No voice query yet. Click Edit to type your query manually.
                    </p>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-between mt-6">

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!transcript.trim()}
            className={`px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white ${
              !transcript.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-indigo-600 hover:to-purple-600'
            }`}
          >
            Submit Query
          </button>

        </div>

      </div>
    </div>
  );
};

export default VoiceSearchModal;