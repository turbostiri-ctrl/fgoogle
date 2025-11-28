# OpenAI GPT Chat Hooks

Production-ready React hooks for integrating AI-powered chat completions into your fitness application.

## Table of Contents

- [Installation](#installation)
- [Hooks](#hooks)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Installation

The hooks are already available in your project at `/home/user/vite-template/src/hooks/use-openai-gpt-chat.ts`.

```typescript
import {
  useOpenAIGPTChatMutation,
  useChatConversation
} from '@/hooks/use-openai-gpt-chat';
```

## Hooks

### `useOpenAIGPTChatMutation`

Core hook for creating chat completions. Returns a TanStack Query mutation.

**Returns:** `UseMutationResult<ChatCompletionResponse, Error, ChatCompletionInput>`

**Features:**
- Full TypeScript type safety
- Automatic error handling
- Loading states
- Input validation
- Token usage tracking

### `useChatConversation`

Higher-level hook for building multi-turn conversations with state management.

**Parameters:**
- `systemPrompt?: string` - Optional system message to initialize the conversation

**Returns:** Object with:
- `messages` - Current conversation messages
- `addUserMessage` - Add a user message
- `addAssistantMessage` - Add an assistant response
- `addSystemMessage` - Add a system message
- `clearMessages` - Reset conversation
- `chat` - Send messages and get response
- `isLoading` - Loading state
- `error` - Error state

## Usage Examples

### 1. Simple Workout Plan Generator

```typescript
import { useOpenAIGPTChatMutation } from '@/hooks/use-openai-gpt-chat';

function WorkoutPlanGenerator() {
  const chatMutation = useOpenAIGPTChatMutation();

  const generatePlan = async () => {
    const result = await chatMutation.mutateAsync({
      messages: [
        {
          role: 'system',
          content: 'You are a professional fitness coach.'
        },
        {
          role: 'user',
          content: 'Create a 3-day muscle building plan for intermediate level'
        }
      ]
    });

    console.log(result.content); // AI-generated workout plan
    console.log(result.usage.totalTokens); // Token usage
  };

  return (
    <button onClick={generatePlan} disabled={chatMutation.isPending}>
      {chatMutation.isPending ? 'Generating...' : 'Generate Plan'}
    </button>
  );
}
```

### 2. Interactive Chat Interface

```typescript
import { useChatConversation } from '@/hooks/use-openai-gpt-chat';

function FitnessChat() {
  const [input, setInput] = useState('');

  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    chat,
    isLoading
  } = useChatConversation(
    'You are a helpful fitness coach. Answer questions about exercise and nutrition.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    addUserMessage(input);
    setInput('');

    const response = await chat({
      messages: [...messages, { role: 'user', content: input }]
    });

    addAssistantMessage(response.content);
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg.role}: {msg.content}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```

### 3. Progress Analysis

```typescript
function ProgressAnalyzer({ workoutData }: { workoutData: WorkoutSession[] }) {
  const chatMutation = useOpenAIGPTChatMutation();

  const analyzeProgress = async () => {
    const sessionsSummary = workoutData
      .map(s => `${s.date}: ${s.exercise} - ${s.sets}x${s.reps} @ ${s.weight}lbs`)
      .join('\n');

    const result = await chatMutation.mutateAsync({
      messages: [
        {
          role: 'system',
          content: 'You are a fitness data analyst. Analyze progress and provide insights.'
        },
        {
          role: 'user',
          content: `Analyze this workout data:\n${sessionsSummary}\n\nWhat patterns do you see?`
        }
      ]
    });

    return result.content;
  };

  return (
    <button onClick={analyzeProgress}>Analyze Progress</button>
  );
}
```

### 4. Custom Model Selection

```typescript
function CustomModelChat() {
  const chatMutation = useOpenAIGPTChatMutation();

  const sendMessage = async (message: string) => {
    const result = await chatMutation.mutateAsync({
      model: 'MaaS_4.1', // Specify model (default if omitted)
      messages: [
        { role: 'user', content: message }
      ]
    });

    return result;
  };

  return <div>...</div>;
}
```

## API Reference

### Types

#### `ChatMessage`

```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

#### `ChatCompletionInput`

```typescript
interface ChatCompletionInput {
  messages: ChatMessage[];  // Required: At least one message
  model?: string;           // Optional: Defaults to "MaaS_4.1"
}
```

#### `ChatCompletionResponse`

```typescript
interface ChatCompletionResponse {
  content: string;                    // AI response content
  id: string;                         // Unique completion ID
  model: string;                      // Model used
  created: number;                    // Unix timestamp
  finishReason: string;               // Why generation stopped
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  reasoningContent?: string | null;   // Optional reasoning
}
```

### Message Roles

- **`system`**: Sets the behavior/context for the AI (e.g., "You are a fitness coach")
- **`user`**: Messages from the user
- **`assistant`**: Previous AI responses (for multi-turn conversations)

## Error Handling

The hooks automatically handle common errors. Always wrap async calls in try-catch:

```typescript
function SafeComponent() {
  const chatMutation = useOpenAIGPTChatMutation();
  const [error, setError] = useState<string | null>(null);

  const handleChat = async () => {
    try {
      const result = await chatMutation.mutateAsync({
        messages: [{ role: 'user', content: 'Hello' }]
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div>
      {chatMutation.error && <Alert>{chatMutation.error.message}</Alert>}
      {error && <div>Error: {error}</div>}
      <button onClick={handleChat}>Send</button>
    </div>
  );
}
```

### Common Errors

- **"At least one message is required"** - Empty messages array
- **"Message content must be a non-empty string"** - Invalid message format
- **"Invalid message role"** - Role not 'system', 'user', or 'assistant'
- **"No data returned from chat completion"** - API returned no response
- **"Chat completion failed"** - Network or API error

## Best Practices

### 1. Use System Messages

Always include a system message to set context:

```typescript
const messages = [
  {
    role: 'system',
    content: 'You are a certified personal trainer specializing in strength training.'
  },
  {
    role: 'user',
    content: 'Design a workout for me'
  }
];
```

### 2. Handle Loading States

```typescript
<Button onClick={generate} disabled={chatMutation.isPending}>
  {chatMutation.isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Generating...
    </>
  ) : (
    'Generate Plan'
  )}
</Button>
```

### 3. Multi-turn Conversations

For conversations, include previous messages:

```typescript
const [conversationHistory, setHistory] = useState<ChatMessage[]>([
  { role: 'system', content: 'You are a fitness coach' }
]);

const sendMessage = async (userMessage: string) => {
  const newMessages = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  const result = await chat({ messages: newMessages });

  setHistory([
    ...newMessages,
    { role: 'assistant', content: result.content }
  ]);
};
```

Or use `useChatConversation` which handles this automatically.

### 4. Token Usage Monitoring

```typescript
const result = await chatMutation.mutateAsync({ messages });

console.log(`Tokens used: ${result.usage.totalTokens}`);
console.log(`Prompt: ${result.usage.promptTokens}`);
console.log(`Completion: ${result.usage.completionTokens}`);
```

### 5. Specific Prompts

Be specific in your prompts for better results:

**Bad:**
```typescript
"Give me a workout plan"
```

**Good:**
```typescript
`Create a 4-week progressive overload workout plan for:
- Goal: Build muscle mass
- Level: Intermediate (1 year experience)
- Days: 4 days per week (Mon/Tue/Thu/Fri)
- Equipment: Full gym access
- Focus: Upper/Lower split
Include exercises, sets, reps, and progression scheme.`
```

### 6. Error Boundaries

Wrap components using the hooks in error boundaries:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <WorkoutPlanGenerator />
</ErrorBoundary>
```

### 7. Debounce User Input

For chat interfaces, debounce to prevent excessive API calls:

```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSend = useDebouncedCallback(
  async (message: string) => {
    await chat({ messages: [{ role: 'user', content: message }] });
  },
  500
);
```

## Fitness Application Use Cases

### 1. Workout Plan Generation
- Personalized plans based on goals, level, equipment
- Progressive overload scheduling
- Exercise variations and substitutions

### 2. Progress Analysis
- Performance trend analysis
- Strength progression tracking
- Volume and intensity recommendations

### 3. Recovery Recommendations
- Post-workout nutrition advice
- Sleep and rest optimization
- Active recovery suggestions

### 4. Form and Technique Coaching
- Exercise form tips
- Common mistake corrections
- Alternative exercise suggestions

### 5. Nutrition Guidance
- Meal planning
- Macro calculations
- Supplement recommendations

### 6. Training Adjustments
- Deload week planning
- Plateau breaking strategies
- Injury prevention and modification

## Complete Example

See `/home/user/vite-template/src/examples/fitness-ai-examples.tsx` for comprehensive examples including:

- Workout Plan Generator
- Progress Analyzer
- Post-Workout Recommendations
- Interactive Q&A Chat
- Training Plan Adjuster
- Batch Nutrition Analyzer

## Support

For issues or questions:
1. Check error messages in browser console
2. Verify API authentication is configured
3. Ensure messages array is properly formatted
4. Review TypeScript types for proper usage

## License

MIT
