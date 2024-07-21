import { RouterProvider } from "react-router-dom";
import RouterBuilder from "./App.router";

function App() {
  const router = RouterBuilder();

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
