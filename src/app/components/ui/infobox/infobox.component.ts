import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface InfoboxData {
  label: string;
  rows: { label: string; value: string }[];
}

@Component({
  selector: 'app-infobox',
  imports: [TranslateModule],
  templateUrl: './infobox.component.html',
  styleUrl: './infobox.component.css',
})
export class InfoboxComponent {
  @Input({ required: true }) info!: InfoboxData;
}
