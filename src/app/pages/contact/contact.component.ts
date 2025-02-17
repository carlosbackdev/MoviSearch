import { Component } from '@angular/core';
import { InfoPageComponent } from "../../components/info-page/info-page.component";
import { ContactSocialComponent } from "../../components/contact-social/contact-social.component";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-contact',
  imports: [InfoPageComponent, ContactSocialComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
    animations: [
      trigger('fadeIn', [
        transition('void => *', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('1s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
})
export class ContactComponent {

}
