import { InputType } from '../enums/input-type';
import { FormControl } from '@angular/forms';

export class FormField {
  id?: number | string;
  label?: string;
  type?: InputType;
  formControl?: FormControl;
  options?: SelectFieldOption[];
  infoText?: string;
  metrics?: boolean;
  metricsLabel?: string;
  class?: string;
}

export class SelectFieldOption {
  label?: string;
  value: any;
  fieldName?: string;
}
