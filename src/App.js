import "./App.css";
import { Link } from "react-router-dom";

import { Switch, Route } from "react-router-dom";
import NewField from "./components/new_contact/NewField.component";
import React, { useState, useEffect, useRef } from "react";
import ContactInformation from "./components/contact-information/contact-information";
import addSign from "./assets/images/add-circle-outline.svg";
import search from "./assets/images/search.svg";
import ContactPage from "./pages/contact-page/ContactPage";
const App = () => {
  const contactBook = JSON.parse(localStorage.getItem("contacts"));


  return (
    <div className="contacts">
      <Switch>
        <Route exact path="/" component={ContactPage} />
        <Route exact path="/new" component={ContactInformation} />
        <Route exact path="/contact/:id" component={ContactInformation} />
      </Switch>
    </div>
  );
};

export default App;
