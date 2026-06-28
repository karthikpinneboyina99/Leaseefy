'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageCircle, X, Send } from 'lucide-react';
import styles from './AIAssistant.module.css';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, status, error, sendMessage } = useChat();

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: 'user', content: input });
    setInput('');
  };

  return (
    <div className={styles.wrapper}>
      {isOpen ? (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <h3>AI Legal Assistant</h3>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.messagesContainer}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                Hi! I'm the Leaseefy AI Assistant. Ask me anything about the MNDA process or legal jargon.
              </div>
            )}
            
            {error && (
              <div className={styles.errorState}>
                API Error: {error.message || 'Please check your API configuration.'}
              </div>
            )}

            {messages.map(m => (
              <div key={m.id} className={m.role === 'user' ? styles.userMessage : styles.aiMessage}>
                {m.content}
              </div>
            ))}
            {isLoading && <div className={styles.aiMessage}>Thinking...</div>}
          </div>

          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              className={styles.inputField}
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendBtn} disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button className={styles.fab} onClick={() => setIsOpen(true)}>
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
