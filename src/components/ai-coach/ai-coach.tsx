import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles, Crown } from 'lucide-react';
import { useChatConversation } from '@/hooks/use-openai-gpt-chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AICoach() {
  const { user, isPremium } = useAuth();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const systemPrompt = `You are FitLife Pro AI Coach, a professional fitness and nutrition expert.
Help users with workout plans, nutrition advice, form corrections, and motivation.
Be encouraging, specific, and provide actionable advice.
Keep responses concise but informative.`;

  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    chat,
    isLoading,
    clearMessages
  } = useChatConversation(systemPrompt);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !isPremium || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    addUserMessage(userMessage);

    try {
      const response = await chat({});
      addAssistantMessage(response.content);
    } catch (error) {
      addAssistantMessage('Sorry, I encountered an error. Please try again.');
    }
  };

  const quickQuestions = [
    'Create a workout plan for muscle gain',
    'What should I eat for breakfast?',
    'How do I improve my squat form?',
    'Tips for staying motivated',
    'Best exercises for abs'
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Coach</h1>
        <p className="text-muted-foreground">
          Get personalized fitness advice powered by AI
        </p>
      </div>

      {!isPremium && (
        <Card className="border-primary bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Premium Feature</h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade to access the AI Coach
                </p>
              </div>
            </div>
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" />
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle>Chat with AI Coach</CardTitle>
                </div>
                {messages.length > 1 && (
                  <Button variant="outline" size="sm" onClick={clearMessages}>
                    Clear Chat
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 py-4">
                  {messages.length === 1 ? (
                    <div className="text-center py-12">
                      <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Start a conversation with your AI Coach
                      </p>
                    </div>
                  ) : (
                    messages.slice(1).map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="bg-primary rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === 'user' && (
                          <div className="bg-secondary rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="bg-primary rounded-full p-2 h-8 w-8 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-secondary rounded-lg px-4 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder={isPremium ? "Ask me anything about fitness..." : "Upgrade to Premium to chat"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    disabled={!isPremium || isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!isPremium || !input.trim() || isLoading}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Questions</CardTitle>
              <CardDescription>Try asking about...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={!isPremium}
                >
                  <span className="text-sm line-clamp-2">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Coach Can Help With</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-1.5 w-1.5 rounded-full p-0" />
                <span>Personalized workout plans</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-1.5 w-1.5 rounded-full p-0" />
                <span>Nutrition recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-1.5 w-1.5 rounded-full p-0" />
                <span>Form corrections</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-1.5 w-1.5 rounded-full p-0" />
                <span>Motivation and tips</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-1.5 w-1.5 rounded-full p-0" />
                <span>Progress analysis</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
