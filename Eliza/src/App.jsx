import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react'


function App() {
  const [typing, setTyping]= useState(false)
  const [messages, setMessages] = useState([
    {
      message:"Hello, I am ChatGPT",
      sender: "ChatGPT"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction:"outgoing"
  }
    const newMessages = [...messages, newMessage]

    setMessages(newMessages)

    setTyping(true);

    await processMessageToChatGPT (newMessages)
  }

  async function processMessageToChatGPT (chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender ==='ChatGPT') {
        role="assistant"
      }else{
        role = "user"
      }
      return { role: role,content: messageObject.message}
    });

    const systemMessage= {
      role:"system",
      content:"Explique moi comme si tous les sujets avaient un rapport avec les teckels"
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) =>{
      console.log(data)
      console.log(data.choices[0].message.content)
      setMessages(
        [...chatMessages, {
          message : data.choices[0].message.content,
          sender: "ChatGPT"
        }]
      );
      setTyping(false)
    })
  }

  return (
    <div>
      <div className="App">
    <header className="App-header">
      <img src="logo.png" alt="Logo" />
      <h1>Nom de l'application</h1>
      <p>Bienvenue sur notre page d'accueil !</p>
    </header>
    <main>
      <section className="teckel-section">
        <h2>Les races de teckel</h2>
        <div className="teckel-container">
          <div className="teckel-item">
            <img src="https://www.espritdog.com/wp-content/uploads/2021/12/le-teckel.jpg" alt="Teckel 1" />
            <h3>Race 1</h3>
            <p>Brève description de la race 1</p>
          </div>
          <div className="teckel-item">
            <img src="https://media.discordapp.net/attachments/809896269333921872/1089920023558103040/amproute_realistic_dachshund_white_background_da4f4f28-499a-421e-9f82-e5041be0f0d7.png?width=525&height=525" alt="Teckel 2" />
            <h3>Race 2</h3>
            <p>Brève description de la race 2</p>
          </div>
          <div className="teckel-item">
            <img src="teckel3.jpg" alt="Teckel 3" />
            <h3>Race 3</h3>
            <p>Brève description de la race 3</p>
          </div>
        </div>
      </section>
      <section className="chatbot-section">
        <h2>Les avantages de notre chatbot</h2>
        <ul>
          <li>Réponses rapides et précises aux questions sur les teckels</li>
          <li>Disponible 24 heures sur 24, 7 jours sur 7</li>
          <li>Interaction intuitive et conviviale</li>
        </ul>
        <button>Démarrer le chatbot</button>
      </section>
      <div style={{position: "relative", height: "400px", width: "100%"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList scrollBehavior='smooth' typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}>
              {messages.map((message, i) => {
                return <Message key={i} model= {message}/>
              })}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </main>
  </div>
  </div>
  )
}

export default App
