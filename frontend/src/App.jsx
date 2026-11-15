import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Router from "routers/Router";
import queryClient from "configs/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
