import React from "react"
import {render} from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const renderWithQuery = (ui: React.ReactNode) => {

 const queryClient = new QueryClient();

 return render(
   <QueryClientProvider client={queryClient}>
      {ui}
   </QueryClientProvider>
 );

};