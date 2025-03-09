import React from "react";
import InputDatePicker from "../../../styles/inputs/input-fields/input-date-picker-style";


interface InputBaseProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
}

const InputVariantDatePicker: React.FC<InputBaseProps> = ({
  value,
  onChange,
}) => {



  return (
    <InputDatePicker>
      <div>
        <p>Date</p>
        <input
          type="date"
          value={value}
          onChange={onChange}
        />
        
      </div>
    </InputDatePicker>
  );
};

export default InputVariantDatePicker;
