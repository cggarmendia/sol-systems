import { Subscription } from 'rxjs';

const unsubscribe = (subscriptions: Subscription[]): void => {
    subscriptions.forEach((sub) => {
        sub?.unsubscribe();
    });
};

const handleError = (err: any) => {
    let errorMessage: string;

    if (err.error instanceof ErrorEvent) {
        errorMessage = `An error occurred: ${err.error.message}`;
    } else {
        errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    return { error: errorMessage };
};

const isValidEmail = (email: string) => {
    let validateEmailExp = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$');
    if (!(email && validateEmailExp.test(email))) {
        return false;
    }

    return true;
}

const areAllValidEmails = (emails: string[]) => {
    let validations: boolean[] = [];
    emails.forEach((email) => {
        validations.push(isValidEmail(email));
    });

    return !(validations.indexOf(false) >= 0);
}

export const utils = {
    unsubscribe,
    handleError,
    isValidEmail,
    areAllValidEmails
};
