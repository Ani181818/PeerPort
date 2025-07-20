import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import CodeEditor from "./CodeEditor";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [socket, setSocket] = useState(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const scrollRef = useRef(null);

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });

    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!user) return;
    const socketConnection = createSocketConnection();
    setSocket(socketConnection);

    socketConnection.emit("joinChat", { userId, targetUserId });

    socketConnection.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    // Listen for code editor toggle from other user
    socketConnection.on("codeEditorToggled", ({ isVisible }) => {
      setShowCodeEditor(isVisible);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    socket?.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMsg,
    });

    setNewMsg("");
  };

  const toggleCodeEditor = () => {
    const newState = !showCodeEditor;
    setShowCodeEditor(newState);
    
    // Notify other user about code editor toggle
    socket?.emit("toggleCodeEditor", {
      userId,
      targetUserId,
      isVisible: newState
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-full mx-auto my-10 border border-gray-700 bg-gray-900 text-white rounded-xl shadow-md h-[80vh] flex overflow-hidden">
      {/* Chat Section */}
      <div className={`${showCodeEditor ? 'w-1/2' : 'w-full'} flex flex-col transition-all duration-300`}>
        {/* Chat Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div className="text-lg font-semibold">Chat Room</div>
          <button
            onClick={toggleCodeEditor}
            className={`px-4 py-2 rounded font-medium transition ${
              showCodeEditor
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {showCodeEditor ? '✕ Close Editor' : '⚡ Code Editor'}
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => {
            const isMe = user.firstName === msg.firstName;
            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg text-sm shadow-md ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 text-white rounded-bl-none"
                  }`}
                >
                  <div className="text-xs font-semibold opacity-80 mb-1">
                    {msg.firstName} {msg.lastName}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Chat Input */}
        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex gap-3 items-center">
          <textarea
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            className="flex-1 p-2 bg-gray-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-20"
            rows="1"
          />
          <button
            onClick={sendMessage}
            disabled={!newMsg.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition px-4 py-2 rounded text-white font-medium"
          >
            Send
          </button>
        </div>
      </div>

      {/* Code Editor Section */}
      {showCodeEditor && (
        <div className="w-1/2 border-l border-gray-700">
          <CodeEditor 
            userId={userId} 
            targetUserId={targetUserId} 
            socket={socket}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;