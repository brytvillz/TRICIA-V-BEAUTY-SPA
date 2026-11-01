export interface HomeService {
  id: string;
  icon: string;
  title: string;
  /** plain-text name used in aria-labels */
  label: string;
  text: string;
  /** the service page this card links to */
  page: string;
  featured?: boolean;
}

export const homeServices: HomeService[] = [
  { id: 'dental-care', icon: 'i-teeth', title: 'Dental Care', label: 'Dental Care', page: '/dental-care', featured: true,
    text: 'Teeth whitening, teeth scaling and teeth polishing. Ask us which treatment suits you.' },
  { id: 'pedicure', icon: 'i-pedicure', title: 'Pedicure', label: 'Pedicure', page: '/nails-and-spa',
    text: 'Classic, spa and luxury pedicures, from a simple tidy-up to a full indulgence.' },
  { id: 'manicure-nail-art', icon: 'i-manicure', title: 'Manicure & Nail Art', label: 'Manicure and Nail Art', page: '/nails-and-spa',
    text: 'Classic and gel manicures, acrylics and all types of nail designs, made around you.' },
  { id: 'facials', icon: 'i-facial', title: 'Facials & Skin Renewal', label: 'Facials and Skin Renewal', page: '/facials',
    text: 'All types of facials, including acne, hyperpigmentation and vampire facials, chosen to suit your skin.' },
  { id: 'moroccan-radiance', icon: 'i-radiance', title: 'Moroccan Radiance Therapy', label: 'Moroccan Radiance Therapy', page: '/facials',
    text: 'A Moroccan-inspired treatment for skin that looks rested and glowing.' },
  { id: 'waxing', icon: 'i-wax', title: 'Waxing & Hair Removal', label: 'Waxing and Hair Removal', page: '/nails-and-spa',
    text: 'Careful, clean hair removal for a smooth finish.' },
  { id: 'spa-body', icon: 'i-body', title: 'Spa Body Treatments', label: 'Spa Body Treatments', page: '/nails-and-spa',
    text: 'Slow, restorative body treatments to switch off and unwind.' },
  { id: 'hair-styling', icon: 'i-hair', title: 'Hair Styling & Colour', label: 'Hair Styling and Colour', page: '/hair-and-barbing',
    text: 'Styling, tint and colouring for women and men, for everyday looks and special occasions.' },
  { id: 'barbing', icon: 'i-barber', title: 'Barbing', label: 'Barbing', page: '/hair-and-barbing',
    text: 'Haircuts and beard grooming for men, sharp and well finished.' },
  { id: 'braids-locs', icon: 'i-braid', title: 'Braids & Locs', label: 'Braids and Locs', page: '/hair-and-barbing',
    text: 'Braids and locs, styled and maintained.' },
  { id: 'wig-revamping', icon: 'i-wig', title: 'Wig Revamping', label: 'Wig Revamping', page: '/hair-and-barbing',
    text: 'Washing, restyling and refreshing your wigs.' },
  { id: 'lash-extensions', icon: 'i-lash', title: 'Lash Extensions', label: 'Lash Extensions', page: '/tattoos-brows-and-lashes',
    text: 'Lash extensions for a fuller, defined look.' },
  { id: 'microblading', icon: 'i-brow', title: 'Microblading', label: 'Microblading', page: '/tattoos-brows-and-lashes',
    text: 'Hair-stroke brows for a natural, defined shape.' },
  { id: 'tattoos', icon: 'i-tattoo', title: 'Tattoos', label: 'Tattoos', page: '/tattoos-brows-and-lashes',
    text: 'Permanent and semi-permanent tattoos: brows, eyeliner, lip blush and body designs.' },
  { id: 'piercing', icon: 'i-pierce', title: 'Piercing', label: 'Piercing', page: '/tattoos-brows-and-lashes',
    text: 'Piercing, done with care.' },
  { id: 'massage', icon: 'i-massage', title: 'Massage', label: 'Massage', page: '/nails-and-spa',
    text: 'Massage to release tension and help you relax.' },
  { id: 'skin-consultation', icon: 'i-consult', title: 'Skin Consultation', label: 'Skin Consultation', page: '/facials',
    text: 'Talk through your skin with us and leave knowing which treatment is right for you.' },
  { id: 'home-services', icon: 'i-home', title: 'Home Services', label: 'Home Services', page: '/home-service',
    text: 'Most of our treatments, at your home. Message us on WhatsApp to check which ones we can bring to you.' },
];

export interface GalleryItem {
  name: string;
  alt: string;
}

export const gallery: GalleryItem[] = [
  { name: 'gallery-01', alt: 'Facial treatment with steam at TRICIA-V' },
  { name: 'gallery-02', alt: 'Client under an LED light therapy mask' },
  { name: 'gallery-03', alt: 'Long curly braids, finished, in front of the TRICIA-V sign' },
  { name: 'gallery-04', alt: 'Knotless box braids, finished' },
  { name: 'gallery-05', alt: 'Foot massage during a spa pedicure' },
  { name: 'gallery-06', alt: 'Almond nails with black French tips' },
  { name: 'gallery-07', alt: 'Eyelash extensions being applied at TRICIA-V' },
  { name: 'gallery-08', alt: "Winged dollar-sign tattoo on a client's shoulder" },
  { name: 'gallery-teeth', alt: 'Teeth whitening before and after at TRICIA-V' },
];

export interface Pkg {
  title: string;
  what: string;
  text: string;
  items: string[];
}

export const packages: Pkg[] = [
  { title: 'The TRICIA-V Glow', what: 'Pedicure + Manicure + Facial',
    text: 'Feet, hands and face looked after in a single visit. Come in tired, leave ready for whatever is next.',
    items: ['Pedicure', 'Manicure', 'Facial'] },
  { title: 'The Radiance Package', what: 'Moroccan Radiance + Skin Renewal',
    text: 'Moroccan Radiance Therapy paired with skin renewal in one booking. Tell us what your skin needs and we plan around it.',
    items: ['Moroccan Radiance Therapy', 'Skin Renewal facial', 'Skin consultation'] },
  { title: 'The Full Glam', what: 'Nails + Hair + Semi-Permanent Makeup',
    text: 'Nails, hair and semi-permanent makeup arranged together. One place, one appointment, ready for the occasion.',
    items: ['Manicure & nail art', 'Hair styling & colour', 'Semi-permanent makeup'] },
];

/** The ticker under the hero: label + the service page it links to. */
export const ticker: { label: string; href: string }[] = [
  { label: 'Dental care', href: '/dental-care' },
  { label: 'Facials', href: '/facials' },
  { label: 'Barbing', href: '/hair-and-barbing' },
  { label: 'Braids and locs', href: '/hair-and-barbing' },
  { label: 'Pedicure', href: '/nails-and-spa' },
  { label: 'Nail designs', href: '/nails-and-spa' },
  { label: 'Lash extensions', href: '/tattoos-brows-and-lashes' },
  { label: 'Microblading', href: '/tattoos-brows-and-lashes' },
  { label: 'Tattoos', href: '/tattoos-brows-and-lashes' },
  { label: 'Massage', href: '/nails-and-spa' },
  { label: 'Waxing', href: '/nails-and-spa' },
  { label: 'Home service', href: '/home-service' },
];
