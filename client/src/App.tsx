import { BrowserRouter, Route, Routes } from "react-router-dom";
import Form from "./components/Form";
import ThankYou from "./components/Thankyou";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Form />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
