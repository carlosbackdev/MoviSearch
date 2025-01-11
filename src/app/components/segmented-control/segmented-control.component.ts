import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import { SegmentedControlConfig } from '../../interfaces/ui-config/segmented-control-component.interfaces';


@Component({
  selector: 'app-segmented-control',
  imports: [CommonModule],
  templateUrl: './segmented-control.component.html',
  styleUrl: './segmented-control.component.scss'
})
export class SegmentedControlComponent {
  @Input() config: SegmentedControlConfig[] =[] ; 

  selectedItem(segment: SegmentedControlConfig){
    this.config.map((item: SegmentedControlConfig) => {
      item.active = segment.name === item.name;
    })
  }
}
