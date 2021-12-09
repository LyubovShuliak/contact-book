import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./contactPage.scss";

function ContactPage() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const contactBook = JSON.parse(localStorage.getItem("contacts"));

    if (contactBook !== null) {
      setContacts(Object.keys(contactBook));
    }
  }, [setContacts]);
  return (
    <div className="contacts">
      <h1> Книга контактов</h1>
      <div className="contacts_manipulations">
        {" "}
        <Link to="/new" className="add-button">
          {" "}
          <ion-icon name="add-outline"></ion-icon>
        </Link>
        <input
          type="text"
          placeholder="&#x1F50E;&#xFE0E;"
          onChange={(e) => {
            const contactBook = JSON.parse(localStorage.getItem("contacts"));
            if (contactBook !== null) {
              if (!e.target.value) {
                setContacts(Object.keys(contactBook));
              } else {
                setContacts(
                  Object.keys(contactBook).filter(
                    (el) => el.match(e.target.value) !== null
                  )
                );
              }
            }
          }}
        />
      </div>
      <div className="names">
        {contacts.sort().map((e, i) => (
          <div className="contact" key={i}>
            <Link to={`/contact/${e}`}>
              {e
                .match(/\w+/g)
                .map((e) => e[0].toUpperCase() + e.slice(1))
                .join(" ")}
            </Link>
            <button
              onClick={() => {
                let contactBook = JSON.parse(localStorage.getItem("contacts"));

                delete contactBook[e];
                if (Object.keys(contactBook).length) {
                  localStorage.setItem("contacts", JSON.stringify(contactBook));
                  setContacts(Object.keys(contactBook));
                } else {
                  delete localStorage.contacts;
                  setContacts([]);
                }
              }}
            >
              {" "}
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ContactPage;
