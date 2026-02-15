import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="App min-h-screen bg-gray-900">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
