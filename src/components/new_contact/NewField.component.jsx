import React, { useState, useEffect, useRef } from "react";

const NewField = ({ setInputFields, inputFields, id }) => {
  const [isSeen, setIsSeen] = useState(false);

  return (
    <div className="add_field">
      <ion-icon
        name="add-sharp"
        onClick={(e) => {
          setIsSeen(true);
        }}
      ></ion-icon>
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
                isChanging: false,
                change: false,
                className: "hidden",
                name: e.target.value,
                value: "",
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
