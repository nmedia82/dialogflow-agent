import "./App.css";
import Chatbot from "./component/AskBot";
import ProductAgent from "./component/ProductAgent";
// import product_data from "./services/data.json";

// process.env.GOOGLE_APPLICATION_CREDENTIALS = "./google-client.json";

function App() {
  return (
    <div>
      <Chatbot />
    </div>
  );
}

export default App;
