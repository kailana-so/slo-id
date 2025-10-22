import React from "react";
import { IdentificationFormField } from "@/types/form";
import { safeValue } from "@/types/typeGuards";
import { FormData } from "@/types/note";



export function renderFieldHelper(
  field: IdentificationFormField,
  formData: FormData | Record<string, string | boolean | number | undefined>,
  handleColorSelection: (name: string, value: string) => void,
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
) {
  const value = formData[field.name];

  switch (field.type) {
    case "checkbox":
      return (
        <label className="switch ml-4">
          <input
            type="checkbox"
            name={field.name}
            checked={!!value}
            onChange={handleChange}
          />
          <span className="slider" />
        </label>
      );

    case "select":
      return (
        <select
          name={field.name}
          required={field.required}
          value={safeValue(value)}
          onChange={handleChange}
          className="max-w-40"
        >
          <option value=""></option>
          {field.options?.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      );

    case "color-buttons":
      return (
        <div>
          {field.options?.map((color) => (
            <button
              key={color.name}
              type="button"
              className={`color-box ${
                value === color.name ? "ring-highlight" : ""
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => handleColorSelection(field.name, color.name)}
            />
          ))}
        </div>
      );

    case "textarea":
        return (
          <textarea
            className="text-box w-full p-2"
            name={field.name}
            required={field.required}
            value={safeValue(value)}
            onChange={handleChange}
            rows={4}
          />
        );

    default:
      return (
        <input
          className="ml-3"
          type={field.type}
          name={field.name}
          required={field.required}
          value={safeValue(value)}
          onChange={handleChange}
        />
      );
  }
}
