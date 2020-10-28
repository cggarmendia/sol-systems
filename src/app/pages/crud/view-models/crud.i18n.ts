export interface Translations {
    ['delete-modal.message']: string;
    ['delete-modal.description']: string;
    ['delete-modal.yes']: string;
    ['delete-modal.no']: string;
    ['confirmed-deleted']: string;
}

export function initTranslations(): Translations {
    return {
        ['delete-modal.message']: '',
        ['delete-modal.description']: '',
        ['delete-modal.yes']: '',
        ['delete-modal.no']: '',
        ['confirmed-deleted']: ''
    }
}
