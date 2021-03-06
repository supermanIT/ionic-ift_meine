import {Component, OnInit} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';

import {DispenseService} from '../../providers/dispense/dispense.service';
import {HttpService} from '../../providers/http/http.service';
import {DeviceUUID} from 'device-uuid';
@Component({
    selector: 'app-daily-feedback',
    templateUrl: './daily-feedback.page.html',
    styleUrls: ['./daily-feedback.page.scss'],
})
export class DailyFeedbackPage implements OnInit {

    dispense: any;
    day: any;

    constructor(
        public menu: MenuController,
        public router: Router,
        public route: ActivatedRoute,
        public dispenseService: DispenseService,
        public httpRequest: HttpService
    ) {
    }

    ngOnInit() {
         this.day = this.route.snapshot.paramMap.get('day');
    }

    ionViewWillEnter() {
        this.dispense = this.dispenseService.dispenseValue;
    }

    openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu')
    }

    setFeedback(feedback: boolean) {
        if (this.dispense.day_after === 0) {
            return;
        }
        this.httpRequest.daily_Success(feedback, this.dispense.id, this.day).subscribe(() => {
            this.router.navigate(['/after-feedback/' + this.day]);
        }, error => console.log(error))
    }
}
