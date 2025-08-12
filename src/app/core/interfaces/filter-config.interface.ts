import {Option} from "./option.interface"

export interface FilterConfig {
  key: string;
  label: string;
  placeholder?: string;
  options: Option[];
}
