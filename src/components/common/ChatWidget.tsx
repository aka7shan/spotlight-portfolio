import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import styles from "./ChatWidget.module.css";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  // Pause the looping orb pulse for users who asked the OS to reduce motion.
  const reduce = useReducedMotion();

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
      {/* Launcher pill: frosted bar with a label + a live "AI orb" that
          gently pulses to invite a click. The label crossfades between
          "Ask anything!" and "Close" as the window toggles. */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
          aria-expanded={isOpen}
          className="group flex items-center gap-2.5 rounded-full border border-white/50 bg-white/80 py-2 pl-4 pr-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-gray-800/80 dark:hover:bg-gray-800"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                <X className="h-4 w-4" />
                Close
              </motion.span>
            ) : (
              <motion.span
                key="ask"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100"
              >
                <Sparkles className="h-4 w-4 text-purple-600" />
                Ask anything!
              </motion.span>
            )}
          </AnimatePresence>

          {/* The orb. A breathing core plus an expanding halo "blink".
              Both loops stop when the window is open or motion is reduced. */}
          <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center">
            {!reduce && !isOpen && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
                animate={{ scale: [1, 1.45, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <motion.span
              aria-hidden="true"
              className="relative h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-emerald-400 shadow-inner ring-1 ring-white/40"
              animate={reduce || isOpen ? undefined : { scale: [1, 1.06, 1] }}
              transition={
                reduce || isOpen
                  ? undefined
                  : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </span>
        </button>
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
