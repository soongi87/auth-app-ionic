import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class LoadingProvider {
    loading = false;
    constructor(
        public loadingCtrl: LoadingController,
    ) {
    }

    async show(text = '') {

        const config = {
            message: text
        };

        return await this.loadingCtrl.create(config).then(a => {
            a.present().then(() => {
                console.log('presented');
                if (!this.loading) {
                    a.dismiss().then(() => console.log('abort presenting'));
                }
            });
        });
    }

    async hide() {
        if(this.loading === true) {
            this.loading = false;
            return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
        }
    }
}
