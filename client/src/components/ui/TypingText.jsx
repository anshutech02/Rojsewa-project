import React, { useEffect, useState } from "react";

const messages = [
  "Starting ROZSEVA...",
  "Waking up the server...",
  "Preparing your experience...",
  "Almost there..."
];

const TypingText = () => {
  const [text, setText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < messages[messageIndex].length) {
        setText(messages[messageIndex].slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);

        setTimeout(() => {
          setText("");
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 1500);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [messageIndex]);

  return (
    <p className="mt-4 text-lg font-medium text-gray-700 min-h-[28px]">
      {text}
      <span className="animate-pulse">|</span>
    </p>
  );
};

export default TypingText;