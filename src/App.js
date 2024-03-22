import { useState } from "react";

import { WsChat } from "./WsChat";
import { Login } from "./Login";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  console.log("currentUser", currentUser);

  return (
    <div className="app">
      {currentUser ? (
        <WsChat
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
        />
      ) : (
        <Login onLogin={setCurrentUser} />
      )}
    </div>
  );
}

export default App;
