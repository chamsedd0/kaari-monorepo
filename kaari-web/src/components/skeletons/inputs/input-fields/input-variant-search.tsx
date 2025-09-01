import React, { useEffect, useRef } from "react";
import { Autocomplete } from '@react-google-maps/api';
import InputBaseModel3 from "../../../styles/inputs/input-fields/input-base-model-style-3";
interface InputBaseProps {
  type?: "text" | "number" | "password";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelected?: (formatted: string, lat?: number, lng?: number) => void;
  title?: string;
}

const InputVariantSearch: React.FC<InputBaseProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  title,
  onPlaceSelected,
}) => {
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // No-op here; parent should ensure Maps script is loaded
  }, []);

  return (
    <InputBaseModel3>
      <span>{title}</span>
      {onPlaceSelected ? (
        <Autocomplete
          onLoad={(ac) => {
            acRef.current = ac as any;
            ac.setOptions({ componentRestrictions: { country: ['ma'] }, fields: ['geometry','formatted_address','name'] });
          }}
          onPlaceChanged={() => {
            const p = acRef.current?.getPlace();
            if (!p) return;
            const loc = p.geometry?.location;
            const text = p.formatted_address || p.name || '';
            if (onChange) {
              const synthetic = { target: { value: text } } as any;
              onChange(synthetic);
            }
            if (loc) onPlaceSelected(text, loc.lat(), loc.lng()); else onPlaceSelected(text);
          }}
        >
          <input
            ref={inputRef}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete="off"
          />
        </Autocomplete>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </InputBaseModel3>
  );
};

export default InputVariantSearch;
