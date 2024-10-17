import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'SNotification',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
}
