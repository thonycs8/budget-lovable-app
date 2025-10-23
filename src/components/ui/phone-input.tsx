import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const COUNTRY_CODES = [
  { code: '+351', country: 'PT', flag: '🇵🇹', name: 'Portugal', format: 'XXX XXX XXX' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brasil', format: '(XX) XXXXX-XXXX' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'EUA', format: '(XXX) XXX-XXXX' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'Reino Unido', format: 'XXXX XXX XXX' },
  { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Espanha', format: 'XXX XX XX XX' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'França', format: 'X XX XX XX XX' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Alemanha', format: 'XXX XXXXXXX' },
];

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PhoneInput({ value = '', onChange, placeholder, className }: PhoneInputProps) {
  const [countryCode, setCountryCode] = React.useState('+351');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  React.useEffect(() => {
    if (value) {
      // Parse existing value
      const country = COUNTRY_CODES.find(c => value.startsWith(c.code));
      if (country) {
        setCountryCode(country.code);
        setPhoneNumber(value.slice(country.code.length).trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handlePhoneChange = (newPhone: string) => {
    // Remove non-numeric characters except spaces and dashes
    const cleaned = newPhone.replace(/[^\d\s-]/g, '');
    setPhoneNumber(cleaned);
    onChange?.(`${countryCode} ${cleaned}`.trim());
  };

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    onChange?.(`${newCode} ${phoneNumber}`.trim());
  };

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode);

  return (
    <div className={cn('flex gap-2', className)}>
      <Select value={countryCode} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[140px] bg-background">
          <SelectValue>
            {selectedCountry && (
              <span className="flex items-center gap-2">
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.code}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-background">
          {COUNTRY_CODES.map((country) => (
            <SelectItem key={country.country} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span className="font-semibold">{country.code}</span>
                <span className="text-muted-foreground">{country.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder={placeholder || selectedCountry?.format || 'Número de telefone'}
        className="flex-1"
      />
    </div>
  );
}
