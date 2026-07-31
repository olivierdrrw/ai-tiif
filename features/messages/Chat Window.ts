"use client";

import {
  useState,
} from "react";

import {
  useMessageStore,
} from "@/features/messages/messages-store";

export function ChatWindow() {
  const [text, setText] =
    useState("");

  const {
    messages,
    sendMessage,
  } = useMessageStore();

  function handleSend() {
    if (!text) return;

    sendMessage({
      id:
        crypto.randomUUID(),

      senderId:
        "current-user",

      receiverId:
        "other-user",

      content: text,

      createdAt:
        new Date().toISOString(),
    });

    setText("");
  }

  return (
    <div className="space-y-4">

      <div className="h-96 overflow-y-auto">

        {messages.map(
          (message) => (
            <div
              key={
                message.id
              }
            >
              {message.content}
            </div>
          )
        )}

      </div>

      <div className="flex gap-2">

        <input
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          className="
            flex-1
            rounded-xl
            border
            p-3
          "
        />

        <button
          onClick={
            handleSend
          }
          className="
            rounded-xl
            bg-navy-600
            px-4
          "
        >
          Send
        </button>

      </div>

    </div>
  );
}