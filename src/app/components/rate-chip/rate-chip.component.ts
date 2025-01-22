import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-rate-chip',
  imports: [],
  templateUrl: './rate-chip.component.html',
  styleUrl: './rate-chip.component.scss'
})
export class RateChipComponent implements OnChanges {
  @Input() rate: number = 0;
  @Input() placeDecimals: number=0;
  actualNumber: String='';

  ngOnChanges(changes: SimpleChanges): void{
    if(changes['rate'] || changes['placeDecimals']){
    this.actualNumber = this.rate.toFixed(this.placeDecimals);
    }
  }
}
