import { useCallback, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from './utils';

interface PhoneInputComponentProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export function PhoneInputComponent({
  value,
  onChange,
  placeholder = "Enter phone number",
  className,
  disabled = false,
  error = false,
}: PhoneInputComponentProps) {
  // `react-phone-number-input` is only *semi-controlled*: it keeps its own
  // internal phone-digits state and reconciles it against the `value` prop on
  // every keystroke. Wiring the prop straight to parent state means each edit
  // round-trips parent -> input -> parent, and when the field is cleared
  // (backspacing to empty) that reconciliation can run away into
  // "Maximum update depth exceeded". StrictMode's double-render makes it
  // reproducible in dev; production's single pass usually hides it.
  //
  // Buffer the value locally so live editing is decoupled from the parent
  // echo. We only adopt the external value when it genuinely changes (initial
  // load, CV autofill, reset) — our own emits are a no-op here because
  // `internalValue` already matches the normalized external value.
  const normalizedExternal = value || undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    normalizedExternal,
  );

  useEffect(() => {
    setInternalValue((prev) =>
      prev === normalizedExternal ? prev : normalizedExternal,
    );
  }, [normalizedExternal]);

  const handleChange = useCallback(
    (next: string | undefined) => {
      // The library emits `undefined` for an empty field; keep that contract
      // and never let an empty string leak upward.
      const normalized = next || undefined;
      setInternalValue(normalized);
      onChange(normalized);
    },
    [onChange],
  );

  return (
    <div className={cn("phone-input-container", className)}>
      <PhoneInput
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        defaultCountry="US"
        international
        countryCallingCodeEditable={false}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          error && "border-red-500 focus-within:ring-red-500",
          disabled && "cursor-not-allowed opacity-50"
        )}
      />
      <style>{`
        :global(.phone-input-container .PhoneInput) {
          display: flex;
          align-items: center;
          width: 100%;
        }
        
        :global(.phone-input-container .PhoneInputCountry) {
          display: flex;
          align-items: center;
          margin-right: 0.5rem;
        }
        
        :global(.phone-input-container .PhoneInputCountryIcon) {
          width: 1.2em;
          height: 1.2em;
        }
        
        :global(.phone-input-container .PhoneInputCountrySelect) {
          background: transparent;
          border: none;
          outline: none;
          font-size: 1rem;
          margin-left: 0.25rem;
        }
        
        :global(.phone-input-container .PhoneInputInput) {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          flex: 1;
          min-width: 0;
        }
        
        :global(.phone-input-container .PhoneInputInput::placeholder) {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
