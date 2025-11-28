import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { createChatCompletion } from '@/sdk/api-clients/OpenAIGPTChat';
import type { CreateChatCompletionResponses } from '@/sdk/api-clients/OpenAIGPTChat';

/**
 * Message role in the conversation
 */
export type MessageRole = 'system' | 'user' | 'assistant';

/**
 * Individual message in the conversation
 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

/**
 * Input for chat completion request
 */
export interface ChatCompletionInput {
  /**
   * The conversation messages. Must contain at least one message.
   */
  messages: ChatMessage[];
  /**
   * Optional model name. Defaults to "MaaS_4.1" if not provided.
   */
  model?: string;
}

/**
 * Response from chat completion
 */
export interface ChatCompletionResponse {
  /**
   * The AI assistant's response content
   */
  content: string;
  /**
   * Unique identifier for the completion
   */
  id: string;
  /**
   * The model used for completion
   */
  model: string;
  /**
   * Unix timestamp of when the completion was created
   */
  created: number;
  /**
   * Reason why the model stopped generating tokens
   */
  finishReason: 'stop' | 'length' | 'function_call' | 'content_filter' | 'null';
  /**
   * Token usage statistics
   */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  /**
   * Optional reasoning content if provided by the model
   */
  reasoningContent?: string | null;
}

/**
 * Hook for creating chat completions with OpenAI GPT models
 *
 * @example
 * ```tsx
 * function WorkoutPlanGenerator() {
 *   const chatMutation = useOpenAIGPTChatMutation();
 *
 *   const generatePlan = async () => {
 *     const result = await chatMutation.mutateAsync({
 *       messages: [
 *         {
 *           role: 'system',
 *           content: 'You are a professional fitness coach. Create personalized workout plans.'
 *         },
 *         {
 *           role: 'user',
 *           content: 'I want to build muscle, intermediate level, 3 days per week'
 *         }
 *       ]
 *     });
 *     console.log(result.content);
 *   };
 *
 *   return (
 *     <button onClick={generatePlan} disabled={chatMutation.isPending}>
 *       {chatMutation.isPending ? 'Generating...' : 'Generate Plan'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useOpenAIGPTChatMutation(): UseMutationResult<
  ChatCompletionResponse,
  Error,
  ChatCompletionInput
> {
  return useMutation({
    mutationFn: async (input: ChatCompletionInput): Promise<ChatCompletionResponse> => {
      // Validate input
      if (!input.messages || input.messages.length === 0) {
        throw new Error('At least one message is required');
      }

      // Validate each message
      for (const message of input.messages) {
        if (!message.role || !message.content) {
          throw new Error('Each message must have a role and content');
        }
        if (!['system', 'user', 'assistant'].includes(message.role)) {
          throw new Error(`Invalid message role: ${message.role}`);
        }
        if (typeof message.content !== 'string' || message.content.trim() === '') {
          throw new Error('Message content must be a non-empty string');
        }
      }

      // Use default model if not provided
      const model = input.model || 'MaaS_4.1';

      // Call the API
      const response = await createChatCompletion({
        body: {
          model,
          messages: input.messages,
        },
        headers: {
          'X-CREAO-API-NAME': 'OpenAIGPTChat',
          'X-CREAO-API-PATH': '/v1/ai/zWwyutGgvEGWwzSa/chat/completions',
          'X-CREAO-API-ID': '688a0b64dc79a2533460892c',
        },
      });

      // Handle errors
      if (response.error) {
        const errorMessage =
          typeof response.error === 'object' && response.error !== null && 'message' in response.error
            ? String(response.error.message)
            : 'Chat completion failed';
        throw new Error(errorMessage);
      }

      // Validate response data exists
      if (!response.data) {
        throw new Error('No data returned from chat completion');
      }

      const data = response.data as CreateChatCompletionResponses[200];

      // Validate response has choices
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No completion choices returned');
      }

      const firstChoice = data.choices[0];

      // Validate message content exists
      if (!firstChoice.message || typeof firstChoice.message.content !== 'string') {
        throw new Error('No valid content in completion response');
      }

      // Return formatted response
      return {
        content: firstChoice.message.content,
        id: data.id,
        model: data.model,
        created: data.created,
        finishReason: firstChoice.finish_reason,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        reasoningContent: firstChoice.message.reasoning_content,
      };
    },
  });
}

/**
 * Convenience hook for building multi-turn conversations
 *
 * @example
 * ```tsx
 * function ChatInterface() {
 *   const { messages, addUserMessage, addAssistantMessage, chat, isLoading } = useChatConversation();
 *
 *   const handleSend = async (userMessage: string) => {
 *     addUserMessage(userMessage);
 *
 *     const response = await chat({
 *       messages: [...messages, { role: 'user', content: userMessage }]
 *     });
 *
 *     addAssistantMessage(response.content);
 *   };
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useChatConversation(systemPrompt?: string) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => {
    if (systemPrompt) {
      return [{ role: 'system' as const, content: systemPrompt }];
    }
    return [];
  });

  const chatMutation = useOpenAIGPTChatMutation();

  const addUserMessage = React.useCallback((content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
  }, []);

  const addAssistantMessage = React.useCallback((content: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
  }, []);

  const addSystemMessage = React.useCallback((content: string) => {
    setMessages(prev => [...prev, { role: 'system', content }]);
  }, []);

  const clearMessages = React.useCallback(() => {
    if (systemPrompt) {
      setMessages([{ role: 'system', content: systemPrompt }]);
    } else {
      setMessages([]);
    }
  }, [systemPrompt]);

  const chat = React.useCallback(
    async (input: Omit<ChatCompletionInput, 'messages'> & { messages?: ChatMessage[] }) => {
      const messagesToSend = input.messages || messages;
      return chatMutation.mutateAsync({
        ...input,
        messages: messagesToSend,
      });
    },
    [messages, chatMutation]
  );

  return {
    messages,
    setMessages,
    addUserMessage,
    addAssistantMessage,
    addSystemMessage,
    clearMessages,
    chat,
    isLoading: chatMutation.isPending,
    error: chatMutation.error,
  };
}

// Re-export React for the conversation hook
import * as React from 'react';
