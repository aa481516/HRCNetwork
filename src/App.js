import { useRoutes } from "react-router-dom";
import Themeroutes, { AuthRoutes } from "./routes/Router";

const App = () => {
  const routing = useRoutes(Themeroutes);
  const auth = useRoutes(AuthRoutes);

  return <div className="dark">{auth}</div>;
};

export default App;
