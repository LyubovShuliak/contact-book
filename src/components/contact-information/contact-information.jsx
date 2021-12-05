import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { defaultForm } from "./helpers/constants";
import "./contacts.scss";
import NewField from "../new_contact/NewField.component";
import { useLocation } from "react-router-dom";
const ContactInformation = () => {
  let history = useHistory();
  const location = useLocation();
  const { id } = useParams();

  const contact = JSON.parse(localStorage.getItem("contacts"));

  const inputEl = useRef([]);
  const [editContact, setEditContact] = useState(false);
  const [prevValue, setPrevValue] = useState({});
  const [inputFields, setInputFields] = useState(defaultForm);

  useLayoutEffect(() => {
    if (location.pathname !== "/new") {
      setInputFields(contact[id]);
    }
  }, []);
  useEffect(() => {
    const inp = document.querySelector("input.edit");
    if (inp !== null) {
      inp.focus();
    }
  }, [inputFields]);
  const valPhone = (a) => {
    const b =
      a.match(/[^\d]/gim) !== null
        ? ""
        : a.replace(/([0-9]{3})([0-9]{3})([0-9]{4})/gm, "($1) $2-$3");

    return b;
  };

  const handleSubmit = (e) => {
    const contactBook = JSON.parse(localStorage.getItem("contacts")) || {};

    if (inputFields[0].value) {
      setEditContact(true);
      const fh = inputFields.map((elem) => {
        return { ...elem, change: false };
      });
      setInputFields(fh);

      if (location.pathname === "/new") {
        if (!contactBook[inputFields[0].value + " " + inputFields[1].value]) {
          localStorage.setItem(
            "contacts",
            JSON.stringify({
              ...contactBook,
              [inputFields[0].value + " " + inputFields[1].value]: fh,
            })
          );
        } else {
          alert("contact already exist");
          return;
        }
      } else {
        delete contactBook[id];

        localStorage.setItem(
          "contacts",
          JSON.stringify({
            ...contactBook,
            [inputFields[0].value + " " + inputFields[1].value]: fh,
          })
        );
      }

      for (const p of document.querySelectorAll(".edit")) {
        p.style.pointerEvents = "none";
      }
      history.push("/");
    }

    e.preventDefault();
  };

  const editField = (el, e) => {
    setPrevValue({ [el.name]: el.value });

    setInputFields(
      inputFields.map((inp) =>
        inp.name === el.name
          ? { ...inp, change: true }
          : { ...inp, change: false }
      )
    );
  };

  const saveValue = (el) => {
    setInputFields(
      inputFields.map((inm) =>
        inm.name === el.name
          ? {
              ...inm,
              className: "",
              value:
                el.name === "Номер"
                  ? valPhone(inputEl.current[inm.name].value)
                  : inputEl.current[inm.name].value,
              change: true,
              isChanging: false,
              lastChange: true,
            }
          : { ...inm, isChanging: false, lastChange: false }
      )
    );
  };
  const validateInputValue = (el, e) => {
    if (e.target.value !== el.value) {
      setInputFields(
        inputFields.map((inp) =>
          inp.name === el.name
            ? { ...inp, isChanging: true }
            : { ...inp, isChanging: false }
        )
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
        return
      }
      const value = e.target.value.match(/\d/g).join("");
      if (value.length > 2 && +e.nativeEvent.data !== NaN) {
        inputEl.current[el.name].value = `(${value})`;
      }
      if (value.length > 5 && +e.nativeEvent.data !== NaN) {
        inputEl.current[el.name].value = value.replace(
          /([0-9]{3})([0-9]{1,3})/gm,
          "($1) $2"
        );
      }
      if (value.length > 9 && +e.nativeEvent.data !== NaN) {
        inputEl.current[el.name].value = value.replace(
          /([0-9]{3})([0-9]{3})([0-9]{1,4})/gm,
          "($1) $2-$3"
        );
      }
    }
  };

  return (
    <form className="contact_fields">
      <Link to="/">Назад</Link>
      <div className="icon">
        <ion-icon name="person"></ion-icon>
      </div>

      {inputFields.map((el) => (
        <div className="field" key={el.id}>
          {el.name !== "Имя" && el.name !== "Номер телефона 0" ? (
            <button
              type="button"
              className={`delete`}
              onClick={(e) => {
                setInputFields(
                  inputFields.filter((elem) => elem.name !== el.name)
                );
              }}
            >
              <ion-icon data-id={el.name} name="close-outline"></ion-icon>
            </button>
          ) : (
            <p className="must">объязательное поле*</p>
          )}
          <p
            className={` edit ${el.change ? "input" : ""}`}
            onClick={() => editField(el)}
            onMouseDown={(e) => console.log(e)}
          >
            {!el.value ? el.name : el.value}
          </p>
          <input
            ref={(elem) => (inputEl.current[el.name] = elem)}
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

          {el.lastChange ? (
            <button
              type="button"
              onClick={(e) => {
                setInputFields(
                  inputFields.map((inl) =>
                    inl.name === el.name ? { ...inl, lastChange: false } : inl
                  )
                );
              }}
            >
              <ion-icon name="return-up-back-outline"></ion-icon>
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
