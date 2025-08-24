import { InputType } from '../enums/input-type';
import { FormControl } from '@angular/forms';

export class FormField {
  id?: number | string;
  label?: string;
  type?: InputType;
  value?: string | number;
  formControl?: FormControl;
  isRequired?: boolean = false;
  options?: SelectFieldOption[];
  infoText?: string;
  class?: string;
  colorizeOptions?: boolean;
  addOptions?: boolean;
  addMetrics?: boolean;
  metricsLabel?: string;
  metricControl?: FormControl<string | null>;
}

export class SelectFieldOption {
  label?: string;
  value: any;
  fieldName?: string;
}
