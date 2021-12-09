import React, { useState, useRef, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { defaultForm } from "./helpers/constants";
import "./contacts.scss";
import NewField from "../new_contact/NewField.component";
import { useLocation } from "react-router-dom";
const ContactInformation = () => {
  let history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  const inputEl = useRef([]);
  const [inputFields, setInputFields] = useState(defaultForm);
  useEffect(() => {
    const contact = JSON.parse(localStorage.getItem("contacts"));
    if (location.pathname !== "/new") {
    
      setInputFields(contact[id]);
    }
  }, [location, id]);
  useEffect(() => {
    const inp = document.querySelector("input.edit");
    if (inp !== null) {
      inp.focus();
    }
  }, [inputFields]);

  const handleSubmit = (e) => {
    const contactBook = JSON.parse(localStorage.getItem("contacts")) || {};
    const contactId = inputFields[0].value + " " + inputFields[1].value;
    const newContact = (contacts, newFields) =>
      JSON.stringify({
        ...contacts,
        [contactId.trim()]: newFields,
      });

    if (inputFields[0].value) {
      const newFields = inputFields.map((elem) => {
        return { ...elem, change: false, hasChanges: false };
      });
      setInputFields(newFields);

      if (location.pathname === "/new") {
        if (!contactBook[inputFields[0].value + " " + inputFields[1].value]) {
          localStorage.setItem("contacts", newContact(contactBook, newFields));
        } else {
          alert("contact already exist");
          return;
        }
      } else {
        delete contactBook[id];
        localStorage.setItem("contacts", newContact(contactBook));
      }
      delete localStorage["prevValues"];

      for (const p of document.querySelectorAll(".edit")) {
        p.style.pointerEvents = "none";
      }
      history.push("/");
    } else {
      document.querySelector(".must").style.display = "block";
    }
    e.preventDefault();
  };

  const editField = (el, e) => {
    setInputFields(
      inputFields.map((inp) =>
        inp.name === el.name
          ? { ...inp, change: true }
          : { ...inp, change: false }
      )
    );
  };

  const saveValue = (el) => {
    let confirmChange = window.confirm(`${el.name}:${el.value}`);
    if (confirmChange) {
      const prevValues = JSON.parse(localStorage.getItem("prevValues")) || {};
      localStorage.setItem(
        "prevValues",
        JSON.stringify({ [el.name]: el.value, ...prevValues })
      );
      setInputFields(
        inputFields.map((inm) =>
          inm.name === el.name
            ? {
                ...inm,
                className: "",
                value: inputEl.current[inm.name].value,
                change: true,
                isChanging: false,
                lastChange: true,
                hasChanges: true,
              }
            : { ...inm, isChanging: false, lastChange: false }
        )
      );
    } else {
      inputEl.current[el.name].value = "";
    }
  };
  const validateInputValue = (el, e) => {
    if (e.target.value !== el.value) {
      setInputFields(
        inputFields.map((inp) => {
          if (inp.name === "Номер") {
            return {
              ...inp,
              isChanging: e.target.value.length === 13 ? true : false,
            };
          }
          return {
            ...inp,
            isChanging: inp.name === el.name ? true : false,
          };
        })
      );
    }

    if (el.name === "Номер") {
      const f = Array.from(Array(10).keys()).map((e) => String(e));
      if (
        !f.includes(e.nativeEvent.data) &&
        e.nativeEvent.data !== " " &&
        e.nativeEvent.data !== null
      ) {
        alert("only digits");
        inputEl.current[el.name].value = inputEl.current[el.name].value.slice(
          0,
          inputEl.current[el.name].value.length - 1
        );
        return;
      }
      if (e.nativeEvent.data === " " || e.nativeEvent.data === null) {
        return;
      }
      const newValue = e.target.value.match(/\d/g).join("");
      console.log(+e.nativeEvent.data);
      if (isNaN(+e.nativeEvent.data)) return;

      if (newValue.length > 2) {
        inputEl.current[el.name].value = `(${newValue})`;
      }
      if (newValue.length > 5) {
        inputEl.current[el.name].value = newValue.replace(
          /([0-9]{3})([0-9]{1,3})/gm,
          "($1) $2"
        );
      }
      if (newValue.length > 9) {
        inputEl.current[el.name].value = newValue.replace(
          /([0-9]{3})([0-9]{3})([0-9]{1,4})/gm,
          "($1) $2-$3"
        );
      }
    }
  };
  const discardChange = (el, e) => {
    let f = JSON.parse(localStorage.getItem("prevValues"));
    const prevValue = f[el.name] || "";
    setInputFields(
      inputFields.map((inl) =>
        inl.name === el.name
          ? {
              ...inl,
              lastChange: false,
              value: prevValue,
              hasChanges: false,
            }
          : { ...inl, lastChange: false }
      )
    );
    delete f[el.name];
    localStorage.setItem("prevValues", JSON.stringify(f));
    e.target.style.display = "none";
    inputEl.current[el.name].value = Object.values(prevValue);
  };
  const discardLastChange = (e) => {
    let prevValues = JSON.parse(localStorage.getItem("prevValues"));
    setInputFields(
      inputFields.map((inl) =>
        inl.name === Object.keys(prevValues)[0]
          ? {
              ...inl,
              lastChange: false,
              value: prevValues[inl.name],
              hasChanges: false,
            }
          : { ...inl, lastChange: false }
      )
    );

    inputEl.current[Object.keys(prevValues)[0]].value =
      prevValues[Object.keys(prevValues)[0]];
    delete prevValues[Object.keys(prevValues)[0]];
    if (!Object.keys(prevValues).length) e.target.style.display = "none";
    localStorage.setItem("prevValues", JSON.stringify(prevValues));
  };
  const deleteField = (el, e) => {
    setInputFields(inputFields.filter((elem) => elem.name !== el.name));
  };
  return (
    <form className="contact_fields">
      <Link to="/">Назад</Link>

      {inputFields.findIndex((elem) => elem.hasChanges) !== -1 ? (
        <button className="discard" type="button" onClick={discardLastChange}>
          <ion-icon name="arrow-undo"></ion-icon>
        </button>
      ) : null}
      {inputFields.map((el) => (
        <div className="field" key={el.id}>
          {el.name !== "Имя" && el.name !== "Номер телефона 0" ? (
            <button
              type="button"
              className={`delete`}
              onClick={(e) => deleteField(el, e)}
            >
              <ion-icon data-id={el.name} name="close-outline"></ion-icon>
            </button>
          ) : (
            <p className="must">объязательное поле*</p>
          )}
          <img src="../../assets/images/telegram.png" alt="" />
          <p
            className={` edit ${el.change ? "input" : ""}`}
            onClick={() => editField(el)}
          >
            {!el.value ? el.name : el.value}
          </p>
          <input
            ref={(elem) => (inputEl.current[el.name] = elem)}
            id={el.isChanging || el.name !== "Номер" ? "" : "red_border"}
            className={el.change ? "edit" : "input"}
            type="text"
            onChange={(e) => validateInputValue(el, e)}
            maxLength={el.name === "Номер" ? 14 : undefined}
            required={el.name === "Имя" || el.name === "Номер" ? true : false}
          />
          {el.isChanging ? (
            <button onClick={() => saveValue(el)} type="button">
              <ion-icon name="save"></ion-icon>{" "}
            </button>
          ) : null}
          {el.hasChanges ? (
            <button
              onClick={(e) => {
                discardChange(el, e);
              }}
              type="button"
            >
              <ion-icon name="arrow-undo"></ion-icon>
            </button>
          ) : null}

          <p className="hidden">Отменить</p>
        </div>
      ))}
      <NewField inputFields={inputFields} setInputFields={setInputFields} />

      <input type="submit" value="Сохранить" onClick={handleSubmit} />
    </form>
  );
};
export default ContactInformation;
