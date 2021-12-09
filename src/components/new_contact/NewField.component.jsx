import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from "../../app/ContactsSlice";

const NewField = ({ setInputFields, inputFields }) => {
  const [isSeen, setIsSeen] = useState(false);
  const dispatch = useDispatch();
  const count = useSelector(selectCount);
  useEffect(()=>{
    console.log(count);
  })
  return (
    <div className="add_field">
      <button
        onClick={(e) => {
          setIsSeen(true);
        }}
      >
        {" "}
        <ion-icon name="add-sharp"></ion-icon>
      </button>

      <p className={isSeen ? "new_field" : ""}> Добавить поле</p>
      <input
        placeholder="Введите название поля..."
        type="tel"
        className={isSeen ? "" : "new_field"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setInputFields([
              ...inputFields,
              {
                id: uuidv4(),
                lastChange: false,
                isChanging: false,
                change: false,
                className: "hidden",
                name: e.target.value,
                value: "",
                hasChanges: false,
              },
            ]);

            e.target.value = "";
            setIsSeen(false);
          }
        }}
      />
    </div>
  );
};
export default NewField;
