import './App.css';
import "@fontsource/inter";
import {
  QueryClient,
  QueryClientProvider,
 
} from '@tanstack/react-query'
import ExamplePage from './pages/ExamplePage';

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="Main">
        <ExamplePage/>
      </div>
    </QueryClientProvider>
  );
}

export default App;
