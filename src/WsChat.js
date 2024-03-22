import { useState, useEffect, useRef } from "react";

const SystemMessage = {
  id: 1,
  body: "Welcome to the Nest Chat app",
  author: "Bot",
};

export function WsChat({ currentUser, onLogout }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([SystemMessage]);

  const webSocketUrl = `ws://localhost:3031`;
  const webSocketChannel = "ws-chat";

  let ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(webSocketUrl);

    ws.current.onopen = () => {
      console.log("Socket connected");
    };

    ws.current.onclose = (error) => {
      console.log("Socket disconnected");
    };

    ws.current.onerror = (error) => {
      console.log("connection error " + webSocketUrl);
      console.log(error);
    };

    ws.current.onmessage = (newMessage) => {
      const parseMessage = JSON.parse(newMessage.data); // JSON.parse(newMessage.data);
      // console.log(`${JSON.stringify(newMessage)}`);
      // console.log(`New message added: ${parseMessage}`);
      // console.log(parseMessage);
      // console.log(parseMessage.author);
      setMessages((previousMessages) => [...previousMessages, parseMessage]);
    };

    return () => {
      console.log("clean up");
      ws.current.onopen = null;
      ws.current.onclose = null;
      ws.current.onerror = null;
      ws.current.onmessage = null;
    };
  }, []);

  const websocketSend = (channel, data) => {
    ws.current.send(
      JSON.stringify({
        event: channel,
        data: JSON.stringify(data),
      })
    );
  };

  const handleSendMessage = (e) => {
    if (e.key !== "Enter" || inputValue.trim().length === 0) return;

    const data = {
      author: currentUser,
      body: inputValue.trim(),
    };

    websocketSend(webSocketChannel, data);
    // ws.current.send(
    //   JSON.stringify({
    //     event: webSocketChannel,
    //     data: JSON.stringify(data),
    //   })
    // );

    setInputValue("");
  };

  const handleLogout = () => {
    ws.current.close();
    onLogout();
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <span>Nest Chat App</span>
        <button className="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="chat-message-list">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`chat-message ${
              currentUser === message.author ? "outgoing" : ""
            }`}
          >
            <div className="chat-message-wrapper">
              <span className="chat-message-author">{message.author}</span>
              <div className="chat-message-bubble">
                <span className="chat-message-body">{message.body}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-composer">
        <input
          className="chat-composer-input"
          placeholder="Type message here"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSendMessage}
        />
      </div>
    </div>
  );
}
