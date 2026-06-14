// src/components/ChatWidget.jsx
"use client";
import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your Homemakers assistant. Tell me what kind of property you're looking for!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-96 h-[500px] bg-dark-bg-secondary border border-dark-border rounded-xl shadow-dark-xl flex flex-col mb-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-border">
            <h3 className="font-semibold text-dark-text">Homemakers Assistant</h3>
            <button onClick={() => setOpen(false)}>
              <X size={18} className="text-dark-text-secondary" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-accent-primary text-white"
                    : "bg-dark-bg-tertiary text-dark-text"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-dark-bg-tertiary text-dark-text-secondary px-3 py-2 rounded-lg text-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-dark-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about properties..."
              className="flex-1 bg-dark-bg-primary text-dark-text border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-accent-primary text-white p-2 rounded-lg disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-accent-primary text-white p-4 rounded-full shadow-dark-xl hover:bg-accent-dark transition"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}