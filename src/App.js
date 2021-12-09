import "./App.css";

import { Switch, Route } from "react-router-dom";

import React from "react";
import ContactInformation from "./components/contact-information/contact-information";

import ContactPage from "./pages/contact-page/ContactPage";
const App = () => {
    return (
    <div className="contacts">
      <Switch>
        <Route exact path="/" component={ContactPage} />
        <Route exact path="/new"  component={ContactInformation} />
        <Route exact path="/contact/:id" component={ContactInformation} />
      </Switch>
    </div>
  );
};

export default App;
