import React from "react";
import InputBaseModel3 from "../../../styles/inputs/input-fields/input-base-model-style-3";
interface InputBaseProps {
  type?: "text" | "number" | "password";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
}

const InputVariantSearch: React.FC<InputBaseProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  title,
}) => {
  return (
    <InputBaseModel3>
      <span>{title}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </InputBaseModel3>
  );
};

export default InputVariantSearch;
