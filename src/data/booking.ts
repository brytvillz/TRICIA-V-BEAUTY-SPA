/** The treatments offered in the booking form, grouped like the service pages. */
export interface BookingGroup {
  slug: string;
  label: string;
  options: string[];
}

export const bookingGroups: BookingGroup[] = [
  { slug: 'dental-care', label: 'Dental care', options: ['Teeth whitening', 'Teeth scaling', 'Teeth polishing'] },
  { slug: 'facials', label: 'Facials', options: ['Acne facial', 'Hyperpigmentation facial', 'Vampire facial', 'Moroccan radiance therapy', 'Skin consultation'] },
  { slug: 'hair-and-barbing', label: 'Hair and barbing', options: ['Braiding', 'Dreadlocks', 'Barbing', 'Hair tint and colouring', 'Wig revamping'] },
  { slug: 'nails-and-spa', label: 'Nails and spa', options: ['Pedicure', 'Manicure', 'Nail designs', 'Massage', 'Spa body treatments', 'Waxing'] },
  { slug: 'tattoos-brows-and-lashes', label: 'Tattoos, brows and lashes', options: ['Tattoo', 'Microblading', 'Lash extensions', 'Piercing'] },
];

export const NOT_SURE = "Not sure yet, I'd like advice";

export const TIMES = [
  { value: 'Morning (8am to 12pm)', label: 'Morning', hours: '8am to 12pm' },
  { value: 'Afternoon (12pm to 4pm)', label: 'Afternoon', hours: '12pm to 4pm' },
  { value: 'Evening (4pm to 9pm)', label: 'Evening', hours: '4pm to 9pm' },
];

/** Link to the booking page, optionally pre-selecting a service name or a group slug. */
export function bookingHref(service?: string): string {
  return service ? `/booking?service=${encodeURIComponent(service)}` : '/booking';
}
