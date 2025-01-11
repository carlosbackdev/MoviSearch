import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { SegmentedControlComponent } from "../../components/segmented-control/segmented-control.component";
import{ SegmentedControlConfig } from "../../interfaces/ui-config/segmented-control-component.interfaces";
import { InputComponent } from "../../components/input/input.component";
import { RateChipComponent} from "../../components/rate-chip/rate-chip.component";

@Component({
  selector: 'app-test',
  imports: [NavBarComponent, SegmentedControlComponent, InputComponent, RateChipComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  segments: SegmentedControlConfig[] = [
    {
    name:'Todas',
    active: true
    },
    {
      name:'Nuevas',
      active: false
    },
    {
      name:'Mismo Genero',
      active: false
    }]
}
