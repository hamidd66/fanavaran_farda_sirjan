import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Router from "routers/Router";
import queryClient from "configs/queryClient";
import UserProvider from "context/UserProvider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <Toaster />
          <Router />
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
