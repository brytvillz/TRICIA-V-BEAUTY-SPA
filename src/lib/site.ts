export const SITE = 'https://tricia-v.vercel.app';
export const NAME = 'TRICIA-V Unisex Salon and Spa';
export const PHONE_E164 = '+2348061172417';
export const PHONE_DISPLAY = '0806 117 2417';
export const WA_NUMBER = '2348061172417';
export const BASE_MESSAGE =
  'Hello TRICIA-V, I found you on your website and would like to book an appointment.';

/** WhatsApp link with the standard pre-filled message, optionally naming the service. */
export function wa(service?: string): string {
  const text = service
    ? BASE_MESSAGE.replace(/\.$/, ` for ${service}.`)
    : BASE_MESSAGE;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const INSTAGRAM = 'https://www.instagram.com/tricia_v_beauty_spa_and_salon_/';
export const TIKTOK = 'https://www.tiktok.com/@tricia_v_beauty_spa_and_salon_';
export const GOOGLE_PROFILE = 'https://share.google/2gv11sHZ3atTrzJFW';

export const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.670079585762!2d6.90988237498889!3d6.039928493945734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1043bdecd73c0e31%3A0x58f78d905924cfad!2sTRICIA-V%20unisex%20salon%20and%20spa!5e0!3m2!1sen!2sng!4v1792064027332!5m2!1sen!2sng';

export const DEFAULT_TITLE =
  'TRICIA-V Unisex Salon and Spa | Pedicure, Nails & Spa in Nnewi Anambra';
export const DEFAULT_DESCRIPTION =
  'TRICIA-V Unisex Salon and Spa - premium pedicure, manicure, facials, barbing, dental care, Moroccan radiance therapy, permanent and semi-permanent tattoos and home services in Nnewi, Anambra. Book on WhatsApp.';

export const GSC_TOKEN = 'IA82cpRnAMXx5dLhMAHY866CLLZern5DEceP69nfLAY';
