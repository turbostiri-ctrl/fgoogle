# OpenAI GPT Chat Hooks - Quick Start Guide

## 5-Minute Integration

### Step 1: Import the Hook

```typescript
import { useOpenAIGPTChatMutation } from '@/hooks/use-openai-gpt-chat';
```

### Step 2: Use in Your Component

```typescript
function MyComponent() {
  const chatMutation = useOpenAIGPTChatMutation();

  const handleGenerate = async () => {
    const result = await chatMutation.mutateAsync({
      messages: [
        { role: 'system', content: 'You are a fitness coach' },
        { role: 'user', content: 'Create a workout plan for me' }
      ]
    });

    console.log(result.content); // AI response
  };

  return (
    <button onClick={handleGenerate} disabled={chatMutation.isPending}>
      {chatMutation.isPending ? 'Loading...' : 'Generate'}
    </button>
  );
}
```

### Step 3: Done!

That's it. The hook handles:
- Authentication (automatic via JWT)
- Error handling
- Loading states
- Type safety
- Request validation

## Common Patterns

### Pattern 1: Simple AI Call

```typescript
const chatMutation = useOpenAIGPTChatMutation();

const result = await chatMutation.mutateAsync({
  messages: [
    { role: 'user', content: 'Your question here' }
  ]
});

console.log(result.content);
```

### Pattern 2: With System Prompt

```typescript
const result = await chatMutation.mutateAsync({
  messages: [
    { role: 'system', content: 'You are a helpful assistant' },
    { role: 'user', content: 'Help me with this' }
  ]
});
```

### Pattern 3: Multi-turn Conversation

```typescript
const { messages, chat, addUserMessage, addAssistantMessage } = useChatConversation(
  'You are a fitness coach'
);

// Send message
const response = await chat({
  messages: [...messages, { role: 'user', content: 'Hello' }]
});

// Update conversation
addUserMessage('Hello');
addAssistantMessage(response.content);
```

### Pattern 4: Error Handling

```typescript
try {
  const result = await chatMutation.mutateAsync({ messages });
} catch (error) {
  console.error('Failed:', error.message);
}

// Or use mutation error state
{chatMutation.error && <Alert>{chatMutation.error.message}</Alert>}
```

### Pattern 5: Loading States

```typescript
<button disabled={chatMutation.isPending}>
  {chatMutation.isPending ? 'Generating...' : 'Generate'}
</button>
```

## Fitness App Examples

### Workout Plan Generator

```typescript
const chatMutation = useOpenAIGPTChatMutation();

const generateWorkoutPlan = async (goal: string, level: string, days: number) => {
  const result = await chatMutation.mutateAsync({
    messages: [
      {
        role: 'system',
        content: 'You are a certified personal trainer.'
      },
      {
        role: 'user',
        content: `Create a ${days}-day workout plan for ${goal} at ${level} level`
      }
    ]
  });

  return result.content;
};
```

### Nutrition Advice

```typescript
const getNutritionAdvice = async (meal: string) => {
  const result = await chatMutation.mutateAsync({
    messages: [
      {
        role: 'system',
        content: 'You are a sports nutritionist.'
      },
      {
        role: 'user',
        content: `Analyze this meal and provide macro estimates: ${meal}`
      }
    ]
  });

  return result.content;
};
```

### Progress Analysis

```typescript
const analyzeProgress = async (workoutHistory: string) => {
  const result = await chatMutation.mutateAsync({
    messages: [
      {
        role: 'system',
        content: 'You are a fitness data analyst.'
      },
      {
        role: 'user',
        content: `Analyze my progress:\n${workoutHistory}\n\nWhat should I improve?`
      }
    ]
  });

  return result.content;
};
```

## Tips

1. **Always include a system message** to set the AI's role
2. **Be specific in prompts** for better results
3. **Handle loading states** to prevent double submissions
4. **Show errors** to users with the Alert component
5. **Monitor token usage** via `result.usage.totalTokens`

## Next Steps

- Read full documentation: `/home/user/vite-template/src/hooks/use-openai-gpt-chat.README.md`
- See complete examples: `/home/user/vite-template/src/examples/fitness-ai-examples.tsx`
- Check TypeScript types: `/home/user/vite-template/src/hooks/use-openai-gpt-chat.ts`

## Need Help?

Common issues:
- **"At least one message is required"** - Add messages array
- **Empty response** - Check system prompt and user message
- **Loading forever** - Check network tab for API errors
- **TypeScript errors** - Ensure proper message format with role and content
