import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import styles from "./ChatWidget.module.css";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSendMessage = useCallback(() => {
    toast.info("AI assistant is coming soon", {
      description: "It will help with portfolio building, design and career questions.",
    });
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleToggle}
          className={styles.chatButton}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Floating tooltip */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={styles.tooltip}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Ask anything!</span>
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 translate-x-full">
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-40 w-80 h-96"
          >
            <Card className={styles.chatCard}>
              <CardHeader className={styles.chatHeader}>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5" />
                  AI Assistant
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-normal">Online</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full flex flex-col">
                {/* Chat Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                  <div className="space-y-4">
                    {/* Welcome Message */}
                    <div className="flex items-start gap-3">
                      <div className={styles.aiAvatar}>
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className={styles.messageBubble}>
                        <p className="text-sm">
                          👋 Hi! I'm your AI assistant. I can help you with:
                        </p>
                        <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                          <li>• Portfolio templates</li>
                          <li>• Design suggestions</li>
                          <li>• Career advice</li>
                          <li>• Technical questions</li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">
                          What would you like to know?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className={styles.inputArea}>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className={styles.inputField}
                      onKeyPress={handleKeyPress}
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                       className={styles.sendButton}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    AI Assistant - Coming Soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
