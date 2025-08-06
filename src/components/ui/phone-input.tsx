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
  ...otherProps
}: PhoneInputComponentProps) {
  // Filter out the error prop to prevent it from being passed to the DOM
  const { error: _, ...restProps } = otherProps as any;

  return (
    <div className={cn("phone-input-container", className)}>
      <PhoneInput
        value={value || undefined}
        onChange={onChange}
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
        {...restProps}
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