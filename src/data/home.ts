export interface ServiceGroup {
  /** matches the file name and slug in src/content/services */
  slug: string;
  title: string;
  image: string;
  alt: string;
  pills: string[];
  /** overrides the service page tagline as the card's one-line description */
  description?: string;
}

/** The six service groups on the home page, one per service page, in this order. */
export const serviceGroups: ServiceGroup[] = [
  { slug: 'dental-care', title: 'Dental care', image: 'gallery-teeth', alt: 'Teeth whitening before and after at TRICIA-V',
    pills: ['Teeth whitening', 'Teeth scaling', 'Teeth polishing'],
    description: 'A cleaner, brighter smile, for women and men.' },
  { slug: 'facials', title: 'Facials', image: 'gallery-01', alt: 'Facial treatment with steam at TRICIA-V',
    pills: ['Acne facial', 'Hyperpigmentation facial', 'Vampire facial', 'Moroccan radiance therapy', 'Skin consultation'] },
  { slug: 'hair-and-barbing', title: 'Hair and barbing', image: 'gallery-03', alt: 'Long curly braids, finished, in front of the TRICIA-V sign',
    pills: ['Braiding', 'Dreadlocks', 'Barbing', 'Hair tint and colouring', 'Wig revamping'] },
  { slug: 'nails-and-spa', title: 'Nails and spa', image: 'gallery-06', alt: 'Almond nails with black French tips',
    pills: ['Pedicure', 'Manicure', 'Nail designs', 'Massage', 'Spa body treatments', 'Waxing'] },
  { slug: 'tattoos-brows-and-lashes', title: 'Tattoos, brows and lashes', image: 'gallery-08', alt: "Winged dollar-sign tattoo on a client's shoulder",
    pills: ['Permanent and semi-permanent tattoos', 'Microblading', 'Lash extensions', 'Piercing'] },
  { slug: 'home-service', title: 'Home service', image: 'about-poster', alt: 'Inside TRICIA-V Unisex Salon and Spa',
    pills: ['Most treatments at your home', 'Nnewi and across Anambra'] },
];

export interface GalleryItem {
  name: string;
  alt: string;
  /** the service shown in the viewer's header row */
  label: string;
}

export const gallery: GalleryItem[] = [
  { name: 'gallery-01', alt: 'Facial treatment with steam at TRICIA-V', label: 'Facials' },
  { name: 'gallery-02', alt: 'Client under an LED light therapy mask', label: 'Facials' },
  { name: 'gallery-03', alt: 'Long curly braids, finished, in front of the TRICIA-V sign', label: 'Hair and barbing' },
  { name: 'gallery-04', alt: 'Knotless box braids, finished', label: 'Hair and barbing' },
  { name: 'gallery-05', alt: 'Foot massage during a spa pedicure', label: 'Nails and spa' },
  { name: 'gallery-06', alt: 'Almond nails with black French tips', label: 'Nails and spa' },
  { name: 'gallery-07', alt: 'Eyelash extensions being applied at TRICIA-V', label: 'Lash extensions' },
  { name: 'gallery-08', alt: "Winged dollar-sign tattoo on a client's shoulder", label: 'Tattoos' },
  { name: 'gallery-teeth', alt: 'Teeth whitening before and after at TRICIA-V', label: 'Dental care' },
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
