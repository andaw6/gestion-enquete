export interface OptionSelect {
  id: string | number;
  label: string;
  value: string;
  description?: string;
}


export interface Option {
  readonly value: string | number;
  readonly label: string;
}
