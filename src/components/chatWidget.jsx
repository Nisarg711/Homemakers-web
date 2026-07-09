"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Search } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hi! I'm your Homemakers assistant. Ask me anything about real estate in India!",
      isUser: false,
      isLoading: false,
      searchInfo: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [checkpointId, setCheckpointId] = useState(null);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    setInput("");

    const newMessageId = messages.length > 0
      ? Math.max(...messages.map((m) => m.id)) + 1
      : 2;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: newMessageId, content: userInput, isUser: true, isLoading: false, searchInfo: null },
    ]);

    const aiResponseId = newMessageId + 1;

    // Add empty AI placeholder
    setMessages((prev) => [
      ...prev,
      {
        id: aiResponseId,
        content: "",
        isUser: false,
        isLoading: true,
        searchInfo: { stages: [], query: "", urls: [] },
      },
    ]);

    try {
      let url = `https://homemakers-latest.onrender.com/chat_stream/${encodeURIComponent(userInput)}`;
      if (checkpointId) {
        url += `?checkpoint_id=${encodeURIComponent(checkpointId)}`;
      }
      const eventSource = new EventSource(url);
      let streamedContent = "";
      let searchData = null;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "checkpoint") {
            setCheckpointId(data.checkpoint_id);
          }

          else if (data.type === "content") {
            streamedContent += data.content
              .replace(/\\n/g, "\n")
              .replace(/\\'/g, "'");

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiResponseId
                  ? { ...msg, content: streamedContent, isLoading: false }
                  : msg
              )
            );
          }

          else if (data.type === "search_start") {
            searchData = {
              stages: ["searching"],
              query: data.query,
              urls: [],
            };

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiResponseId
                  ? { ...msg, searchInfo: searchData, isLoading: false }
                  : msg
              )
            );
          }

          else if (data.type === "search_results") {
            const urls = typeof data.urls === "string"
              ? JSON.parse(data.urls)
              : data.urls;

            searchData = {
              stages: searchData ? [...searchData.stages, "reading"] : ["reading"],
              query: searchData?.query || "",
              urls,
            };

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiResponseId
                  ? { ...msg, searchInfo: searchData, isLoading: false }
                  : msg
              )
            );
          }

          else if (data.type === "search_error") {
            searchData = {
              stages: searchData ? [...searchData.stages, "error"] : ["error"],
              query: searchData?.query || "",
              urls: [],
              error: data.error,
            };

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiResponseId
                  ? { ...msg, searchInfo: searchData, isLoading: false }
                  : msg
              )
            );
          }

          else if (data.type === "end") {
            if (searchData) {
              const finalSearchInfo = {
                ...searchData,
                stages: [...searchData.stages, "writing"],
              };
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiResponseId
                    ? { ...msg, searchInfo: finalSearchInfo, isLoading: false }
                    : msg
                )
              );
            }
            eventSource.close();
          }
        } catch (err) {
          console.error("Failed to parse SSE event:", event.data, err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("EventSource error:", err);
        eventSource.close();

        if (!streamedContent) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiResponseId
                ? {
                  ...msg,
                  content: "Sorry, something went wrong. Please try again.",
                  isLoading: false,
                }
                : msg
            )
          );
        }
      };

    } catch (err) {
      console.error("Chat setup error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiResponseId
            ? {
              ...msg,
              content: "Sorry, could not connect to the assistant.",
              isLoading: false,
            }
            : msg
        )
      );
    }
  };

  const handleNewConversation = () => {
    setCheckpointId(null);
    setMessages([
      {
        id: 1,
        content: "Hi! I'm your Homemakers assistant. Ask me anything about real estate in India!",
        isUser: false,
        isLoading: false,
        searchInfo: null,
      },
    ]);
  };

  // Helper to render search stages
  const renderSearchInfo = (searchInfo) => {
    if (!searchInfo || searchInfo.stages.length === 0) return null;

    const stageLabels = {
      searching: "🔍 Searching the web...",
      reading: "📖 Reading sources...",
      writing: "✍️ Writing answer...",
      error: "❌ Search failed",
    };

    return (
      <div className="mt-2 space-y-1">
        {searchInfo.stages.map((stage, i) => (
          <div key={i} className="text-xs text-dark-text-muted flex items-center gap-1">
            <span>{stageLabels[stage] || stage}</span>
          </div>
        ))}
        {searchInfo.urls.length > 0 && (
          <div className="mt-1.5 space-y-1">
            <p className="text-xs text-dark-text-secondary font-medium">Sources:</p>
            {searchInfo.urls.slice(0, 3).map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-accent-primary hover:underline truncate"
              >
                {url}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed z-50 ${open ? 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6' : 'bottom-4 right-4 sm:bottom-6 sm:right-6'}`}>
      {open && (
        <div className="w-full sm:w-96 h-full sm:h-[520px] bg-dark-bg-secondary sm:border border-dark-border/60 sm:rounded-2xl shadow-dark-xl flex flex-col sm:mb-4 overflow-hidden">

          {/* Header — gradient bar */}
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-primary via-accent-light to-accent-secondary" />
            <div className="flex items-center justify-between p-4 border-b border-dark-border/50">
              <div>
                <h3 className="font-semibold text-dark-text text-sm">Homemakers Assistant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs text-dark-text-muted">Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNewConversation}
                  className="text-xs text-dark-text-secondary hover:text-accent-primary transition px-2 py-1 rounded-lg hover:bg-dark-bg-hover"
                >
                  New chat
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-dark-bg-hover transition">
                  <X size={16} className="text-dark-text-secondary" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"} animate-in`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-sm whitespace-pre-wrap ${msg.isUser
                    ? "bg-accent-primary text-white rounded-2xl rounded-br-md"
                    : "bg-dark-bg-tertiary text-dark-text rounded-2xl rounded-bl-md border border-dark-border/30"
                    }`}
                >
                  {/* Loading dots */}
                  {msg.isLoading && !msg.content ? (
                    <div className="flex gap-1 items-center py-1">
                      <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  ) : (
                    <>
                      {msg.content}
                      {/* Blinking cursor while streaming */}
                      {msg.isLoading && msg.content && (
                        <span className="inline-block w-0.5 h-3 bg-accent-primary ml-0.5 animate-pulse" />
                      )}
                    </>
                  )}

                  {/* Search info below message */}
                  {!msg.isUser && renderSearchInfo(msg.searchInfo)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-dark-border/50 flex gap-2 pb-6 sm:pb-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about properties..."
              className="flex-1 bg-dark-bg-primary text-dark-text border border-dark-border/60 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary transition placeholder:text-dark-text-muted"
            />
            <button
              onClick={sendMessage}
              className="bg-accent-primary text-white p-2.5 rounded-xl hover:bg-accent-dark transition hover:shadow-glow"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button — pulse glow FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-br from-accent-primary to-accent-secondary text-white p-4 rounded-2xl shadow-dark-xl hover:shadow-glow transition-shadow flex items-center justify-center pulse-glow"
        >
          <MessageCircle size={22} />
        </button>
      )}
    </div>
  );
}