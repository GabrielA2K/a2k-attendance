import React from "react";

const AutoLinkText = ({ text }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return (
    <p>
      {text.split(urlRegex).map((part, index) =>
        urlRegex.test(part) ? (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        ) : (
          part
        )
      )}
    </p>
  );
};

export default AutoLinkText;