import { createFileRoute } from '@tanstack/react-router';
import { FitnessApp } from '@/components/fitness-app';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return <FitnessApp />;
}
