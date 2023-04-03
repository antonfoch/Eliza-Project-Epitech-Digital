import { useState } from 'react'
import logo from './assets/Logo.png'
import reactLogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react'


function App() {
  const [typing, setTyping]= useState(false)
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    {
      message:"Bonjour, Je suis TeckHelp, votre assistant concernant vos questions sur les teckels !",
      sender: "ChatGPT"
    }
  ])

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

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
      return { role: role, content: messageObject.message}
    });


    const systemMessage= {
      role:"system",
      content:"Répond moi comme si tu etais un professionnel sur les teckels et que tu ne sais rien d'autres."
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

  console.log('API: ', apiRequestBody)

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
    <header>
      <img src={logo} alt="logo" className="logo" />
      
        <nav >
        <ul>
          <li><a>Accueil</a></li>
          <li><a>À propos</a></li>
          <li><a>Galerie</a></li>
          <li><a>Contact</a></li>
        </ul>
      </nav>
      
    </header>
  <section className="banner">
    <h2> Le chatbot qui teckel-tout en bavardant! </h2>
  </section>
  <section className="container">
    <div className="grid">
      <div className="card">
        <img src="https://www.clairiereauxcerfs.com/wp-content/uploads/2022/10/teckel-poil-long-5.jpg" alt="Chien saucisse 1"/>
        <h3>Source fiable !</h3>
        <p>TeckHelp est un chatbot spécialisé dans la race de chien teckel. Il est conçu pour fournir aux amoureux des teckels une source fiable d'informations sur cette race fascinante. </p>
      </div>
      <div className="card">
        <img src="https://media.discordapp.net/attachments/809896269333921872/1089922076812525630/amproute_photo_realistic_dachshund_white_background_41c7036e-59c9-414c-9ff4-16270e3de32e.png?width=583&height=583" alt="Chien saucisse 2"/>
        <h3>Les meilleurs conseils !</h3>
        <p>Si vous êtes propriétaire d'un teckel ou que vous envisagez d'en adopter un, TeckHelp peut vous aider en répondant à toutes vos questions sur la race.</p>
      </div>
      <div className="card">
        <img src="https://media.discordapp.net/attachments/809896269333921872/1089920023558103040/amproute_realistic_dachshund_white_background_da4f4f28-499a-421e-9f82-e5041be0f0d7.png?width=583&height=583" alt="Chien saucisse 3"/>
        <h3>Facile à utiliser !</h3>
        <p>TeckHelp est conçu pour être facile à utiliser et peut être utilisé à tout moment, n'importe où. Il suffit de poser une question sur les teckels et TeckHelp fournira une réponse instantanée.</p>
      </div>
    </div>
    <div className="button-container">
        <button className="button" onClick={toggleChatbot}>Parler avec TeckHelp !</button>
      </div>
  </section>
  {showChatbot && (
        <div className="chat-container" style={{position: "relative", height: "400px", width: "100%"}}>
          <MainContainer>
              <ChatContainer>
                <MessageList scrollBehavior='smooth' typingIndicator={typing ? <TypingIndicator content="TeckHelp est en train d'écrire" /> : null}>
                  {messages.map((message) => {
                    return <Message model= {message}/>
                  })}
                </MessageList>
                <MessageInput placeholder='Poser une question ici' onSend={handleSend}/>
              </ChatContainer>
            </MainContainer>
        </div>
      )}
     <footer>
     <p>&copy; 2023 TeckHelp. Tous droits réservés.</p>
   </footer>
</div>
  )
}

export default App
