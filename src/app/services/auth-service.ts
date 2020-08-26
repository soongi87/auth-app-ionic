import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders  } from '@angular/common/http';
import { Events } from '../services/events/events.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LoadingProvider } from '../services/loading/loading';
import { environment as ENV } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    apiUrl = ENV.yourSiteApiUrl;
    errorMessage = '';
    loginFormData = { email: '', password: '' };
    signUpFormData = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    };
    token = null;
    user = null;

    constructor(
        public http: HttpClient,
        public events: Events,
        private router: Router,
        public navCtrl: NavController,
        private storage: Storage,
        public loading: LoadingProvider,
    ) {
    }

    login() {
        this.loading.show();
        this.errorMessage = '';

        this.http.post(this.apiUrl + 'login', this.loginFormData).subscribe((data: any) => {
            this.loading.hide();
            if (data.success === 1) {
                this.token = data.token;
                this.storage.set('token', data.token);
                // this.router.navigate(['home']);
                this.navCtrl.navigateRoot('/home');
            } else {
                this.errorMessage = data.message;
            }
        });
    }

    openSignUpPage() {
        this.router.navigate(['sign-up']);
    }

    signUp() {
        this.loading.show();
        this.errorMessage = '';
        this.http.post(this.apiUrl + 'register', this.signUpFormData).subscribe((data: any) => {
            this.loading.hide();
            if (data.success === 1) {
                this.token = data.token;
                this.storage.set('token', data.token);
                this.navCtrl.navigateRoot('/home');
            }
            if (data.success === 0) {
                this.errorMessage = data.message;
            }
        });
    }

    getHomeDetail() {
        this.loading.show();
        let headers = new HttpHeaders();
        headers = headers.set('x-access-token', this.token);

        this.http.get(this.apiUrl + 'home', {headers}).subscribe((data: any) => {
            this.loading.hide();
            if (data.success === 1) {
               this.user = data.user;
            }
            if (data.success === 0) {
               this.token = null;
               this.storage.remove('token');
               this.user = {};
            }
        });
    }

    logout() {
        this.token = null;
        this.storage.remove('token');
        this.navCtrl.navigateRoot('/login');
    }

    ionViewDidLeave() {
        this.errorMessage = '';
        this.loginFormData = { email: '', password: '' };
        this.signUpFormData = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        };
    }

}

