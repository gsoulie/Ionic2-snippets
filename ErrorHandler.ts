import { AlertController } from "ionic-angular";

@Injectable
export class CompoHandleError{
    constructor (private alertCtrl: AlertController){}

    // Handle errors
    handleError(errorMessage: string) {
        const alert = this.alertCtrl.create({
            title: 'An error occured',
            message: errorMessage,
            buttons: ['Ok']
        });
        alert.present();
    }
}
