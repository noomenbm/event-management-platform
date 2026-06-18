import { RouterProvider } from 'react-router-dom';
import './App.css';
import { queryClient } from './queries/queryClient';
import { createAppRouter } from './router/router';

const router = createAppRouter(queryClient);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
