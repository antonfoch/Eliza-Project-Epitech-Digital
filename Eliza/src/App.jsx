import { useState } from 'react';
import logo from './assets/Logo.png';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

function App() {
  const [typing, setTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: 'Bonjour, Je suis TeckHelp, votre assistant concernant vos questions sur les teckels !',
      sender: 'ChatGPT',
    },
  ]);
  const [step, setStep] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState('');

  const predefinedQuestions = [
    'Quelle est l\'espérance de vie d\'un teckel?',
    'Comment dresser un teckel?',
    'Quels sont les problèmes de santé courants chez les teckels?'
  ];

  const followUpQuestions = {
    'Quelle est l\'espérance de vie d\'un teckel?': [
      'Comment puis-je améliorer l\'espérance de vie de mon teckel ?',
      'Quels facteurs influencent l\'espérance de vie des teckels ?',
    ],
    'Comment dresser un teckel?': [
      'Quelles sont les meilleures méthodes pour dresser un teckel ?',
      'Combien de temps cela prend-il pour dresser un teckel ?',
    ],
    'Quels sont les problèmes de santé courants chez les teckels?': [
      'Comment prévenir ces problèmes de santé chez les teckels ?',
      'Les teckels sont-ils plus susceptibles de développer certains problèmes de santé ?',
    ],
  };

  const handlePredefinedQuestionClick = (question) => {
    setSelectedQuestion(question);
    setStep(1);
    handleSendMessage(question);
  };

  const handleFollowUpQuestionClick = (question) => {
    setStep(2);
    handleSendMessage(question);
  };

  const handleSendMessage = (message) => {
    const userMessage = { message, sender: 'user', direction: 'outgoing' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    sendToChatGPT(newMessages);
  };


  const toggleChat = () => setShowChat(!showChat);

  const sendMessage = async (message) => {
    const userMessage = { message, sender: 'user', direction: 'outgoing' };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setTyping(true);
    await sendToChatGPT(newMessages);
  };


  async function sendToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map(({ sender, message }) => ({
      role: sender === 'ChatGPT' ? 'assistant' : 'user',
      content: sender === 'ChatGPT' ? message : `Vous êtes un assistant spécialisé uniquement dans les teckels et ne pouvez répondre qu'aux questions strictement liées à cette race de chien. Si une question ne concerne pas les teckels, ne répondez pas. : ${message}`
    }));

    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:"Vous êtes un assistant spécialisé uniquement dans les teckels et ne pouvez répondre qu'aux questions strictement liées à cette race de chien. Si une question ne concerne pas les teckels, ne répondez pas.",
        },
        ...apiMessages,
      ],
      temperature: 0.5,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer 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`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    const chatGPTResponse = data.choices[0].message.content;

    setMessages([...chatMessages, { message: chatGPTResponse, sender: 'ChatGPT' }]);
    setTyping(false);
  }

  return (
  <div>
    <header className="header">
      <img src={logo} alt="logo" className="logo" />
    </header>
  <section className="banner">
    <h2> Le chatbot qui teckel-tout en bavardant! </h2>
  </section>
  <div className="button-container">
        <button className="button" onClick={toggleChat}>Parler avec TeckHelp !</button>
      </div>
      {showChat && (
    <div className="chat-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
      <div className='Chatbot'>
        <MainContainer className='Maincontainer'>
        <ChatContainer>
          <MessageList>
            {messages.map(({ message, sender, direction }) => (
              <Message model={{ message, sender, direction }}>{message}</Message>
            ))}
            {typing && <TypingIndicator content="TeckHelp is typing" />}

          </MessageList>
          <MessageInput
            placeholder="Tapez votre message ici..."
            onSend={(message) => sendMessage(message)}
          />
        </ChatContainer>
      </MainContainer>
      </div>
      <div className="predefined-questions-container">
        {step === 0 && (
  <div className="predefined-questions">
    
    {predefinedQuestions.map((question) => (
      <button
        className="button predefined-question"
        onClick={() => handlePredefinedQuestionClick(question)}
      >
        {question}
      </button>
    ))}
  </div>
)}</div>
      
{step === 1 && selectedQuestion && (
  <div className="follow-up-questions">
    {followUpQuestions[selectedQuestion].map((question) => (
      <button
        className="button follow-up-question"
        onClick={() => handleFollowUpQuestionClick(question)}
      >
        {question}
      </button>
    ))}
  </div>
)}

    </div>
  )}
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
  </section>
  <div className="footer-container">
  <footer>
    <p>&copy; 2023 TeckHelp. Tous droits réservés.</p>
  </footer>
</div>
</div>


  )
}

export default App