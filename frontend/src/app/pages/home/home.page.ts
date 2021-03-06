import {Component, OnInit} from '@angular/core';
import {MenuController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {DeviceUUID} from 'device-uuid';
import {first} from 'rxjs/operators';

import {CodeService} from '../../providers/code/code.service';
import {HttpService} from '../../providers/http/http.service';
import {DispenseService} from '../../providers/dispense/dispense.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    code: any = '';
    isChecked = false;
    attemptCount = 0;
    isReadPrivacy = false;

    constructor(
        public router: Router,
        public menu: MenuController,
        public codeService: CodeService,
        public toastController: ToastController,
        public httpRequest: HttpService,
        public dispenseService: DispenseService
    ) {
    }

    ngOnInit() {
        this.dispenseService.setDispense({});
        this.codeService.isReadPrivacySubject.subscribe(isRead => {
            this.isReadPrivacy = isRead;
        })
    }

    ionWillViewEnter() {
        if (this.codeService.currentCodeValue) {
            this.gotoNextPage();
        }
    }

    openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu');
    }

    onChange() {
        this.isChecked = !this.isChecked;
        if (this.isChecked && !this.isReadPrivacy) {
            this.router.navigate(['/privacy'])
        }
    }

    code_check() {
        if (this.code === undefined || this.code === null || this.code === '') {
            this.presentToast('Bitte geben Sie Ihren Code ein.');
            return;
        }
        this.codeService.code_check(this.code).pipe(first()).subscribe(res => {
                if (res.isAdmin === 1) this.router.navigate(['/admin']);
                else {
                    this.gotoNextPage();
                }
            }, error => {
                console.log(error);
                this.attemptCount++;
                if (this.attemptCount === 5) {
                    this.attemptCount = 0;
                    this.gotoBackup();
                }
                this.presentToast('Dieser Code ist leider nicht korrekt');
            }
        )
    }

    async presentToast(text) {
        const toast = await this.toastController.create({
            message: text,
            duration: 2000,
            position: 'top',
        });
        toast.present();
    }

    gotoNextPage() {
        // this.httpRequest.get_dispenseByDeviceId(new DeviceUUID().get()).subscribe((response: any) => {
            // if (response.result.length > 0) {
            //     this.dispenseService.setDispense(response.result[0]);
            //     const dispense = response.result[0];
            //     this.httpRequest.get_feedback(dispense).subscribe(
            //         (result: any) => {
            //             if (result['day' + dispense.day_after] !== null) {
            //                 this.router.navigate(['/challenge-progress'])
            //             } else {
            //                 this.router.navigate(['/daily-feedback/' + response.result[0]?.day_after]);
            //             }
            //         }, error => console.log(error)
            //     )
            // } else {
                this.router.navigate(['/video-guide']);
            // }
        // })
    }

    gotoForgot() {
        this.router.navigate(['/forgot']);
    }

    gotoBackup() {
        this.router.navigate(['/backup']);
    }
}
