"use client";

import { useState } from "react";

export function AIChat() {

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    response,
    setResponse,
  ] = useState("");

  const sendMessage =
    async () => {

      const res =
        await fetch(
          "/api/ai-companion",
          {
            method: "POST",

            body:
              JSON.stringify({
                message,
              }),
          }
        );

      const data =
        await res.json();

      setResponse(
        data.message
      );
    };

  return (

    <div>

      <textarea
        value={message}
        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }
      />

      <button
        onClick={
          sendMessage
        }
      >
        Send
      </button>

      <div
        className="
        mt-6
        "
      >
        {response}
      </div>

    </div>

  );
}