import { Component } from '@angular/core';
import { InfoPageComponent } from "../../components/info-page/info-page.component";
import { ContactSocialComponent } from "../../components/contact-social/contact-social.component";

@Component({
  selector: 'app-contact',
  imports: [InfoPageComponent, ContactSocialComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

}
