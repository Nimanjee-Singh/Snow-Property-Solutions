// =========================================================
// Snow Property Solutions — site build config & shared data
// This folder (_src) is the template source. Pages are generated
// into the project root as static HTML (preserving the original
// static-site stack deployed on Vercel).
// =========================================================
const SITE = {
  name: 'Snow Property Solutions',
  url: 'https://snow-property-solutions.vercel.app',   // canonical base — update when a custom domain is connected
  phoneDisplay: '07407 072094',
  phoneIntl: '+447407072094',
  email: 'nimanjee1@gmail.com',
  whatsapp: 'https://wa.me/447407072094',
  hours: 'Monday – Saturday, 8:00am – 6:00pm',
  hoursShort: 'Mon–Sat, 8am–6pm',
  area: 'London and surrounding areas',
  ogImage: '/assets/images/og-image.jpg',
};

// Service registry — single source of truth for nav, cards, footer, quote options
const SERVICES = [
  { slug: 'interior-painting', key: 'interior', name: 'Interior Painting', short: 'Walls, ceilings, woodwork and doors',
    img: 'project-living-room.jpg', real: true, alt: 'Living room decorated by Snow Property Solutions with soft neutral walls and warm lighting',
    card: 'Walls, ceilings, skirting, doors and frames — carefully prepared and finished in the colour and sheen you choose.' },
  { slug: 'exterior-painting', key: 'exterior', name: 'Exterior Painting', short: 'Masonry, windows, fascias and doors',
    img: 'service-exterior-painting.jpg', real: true, alt: 'Painted London terraced houses with varied exterior finishes',
    card: 'Masonry, render, doors, windows, fascias and soffits cleaned, prepared and coated with suitable exterior finishes.' },
  { slug: 'wallpapering', key: 'wallpapering', name: 'Wallpapering', short: 'Feature walls and full rooms',
    img: 'project-striped-feature-wall.jpg', real: true, alt: 'Bedroom with a navy and white striped feature wall completed by Snow Property Solutions',
    card: 'Feature walls, full rooms and decorative papers hung with careful pattern matching and clean edges.' },
  { slug: 'plastering-repairs', key: 'plastering', name: 'Plastering & Repairs', short: 'Cracks, skimming and surface repair',
    img: 'service-plastering.jpg', real: true, alt: 'Plasterer smoothing a wall surface with a trowel',
    card: 'Cracks, dents and damaged plaster repaired, filled and smoothed so the decoration that follows looks its best.' },
  { slug: 'commercial-decorating', key: 'commercial', name: 'Commercial Decorating', short: 'Offices, retail and communal areas',
    img: 'project-hallway.jpg', real: true, alt: 'Decorated corridor with framed artwork completed by Snow Property Solutions',
    card: 'Offices, retail premises, communal areas and rental properties decorated around the way your property operates.' },
];

// Real project photography supplied by the business (from the existing website)
const PROJECTS = [
  { img: 'project-living-room.jpg', title: 'Living Room Redecoration', cat: 'interior-painting', alt: 'Finished living room with pale walls, cornice and warm table lamps', desc: 'Walls and ceiling redecorated in a soft neutral, with crisp lines along the cornice and window reveals.' },
  { img: 'project-hotel-living.jpg', title: 'Suite Living Area', cat: 'interior-painting', alt: 'Finished living area with neutral walls and doorway through to the next room', desc: 'A calm, consistent finish across walls, ceiling and door frames in a hotel-style living space.' },
  { img: 'project-tv-feature-wall.jpg', title: 'Study & Media Wall', cat: 'interior-painting', alt: 'Decorated room with television wall, desk and round mirror', desc: 'Even, durable wall finish around the media wall and desk area, with neat cutting-in at the ceiling line.' },
  { img: 'project-striped-feature-wall.jpg', title: 'Striped Feature Wall', cat: 'wallpapering', alt: 'Bedroom with a navy and white striped feature wall behind the headboard', desc: 'A bold navy and white striped feature wall, with stripes kept true from ceiling to headboard.' },
  { img: 'project-bedroom.jpg', title: 'Bedroom Feature Wall', cat: 'wallpapering', alt: 'Finished bedroom with striped feature wall and neutral surrounding walls', desc: 'Striped feature wall balanced with neutral surrounding walls for a restful bedroom.' },
  { img: 'project-hallway.jpg', title: 'Corridor Decoration', cat: 'commercial-decorating', alt: 'Long decorated corridor with framed artwork and red patterned carpet', desc: 'Long corridor walls and woodwork decorated to a consistent, hard-wearing finish.' },
  { img: '1.jpg', title: 'Dining Room Refresh', cat: 'interior-painting', alt: 'Dining room with light walls and a dark dining table', desc: 'A dining space refreshed with a light wall finish.' },
  { img: '2.jpg', title: 'Bedroom Refresh', cat: 'interior-painting', alt: 'Bedroom with decorative framed art and layered cushions', desc: 'A calm bedroom interior with a coordinated neutral finish.' },
  { img: 'project-feature-wall-before-after.jpg', title: 'Feature Wall Before & After', cat: 'interior-painting', alt: 'Side-by-side before and after photos of a bedroom feature wall redecoration', desc: 'A bedroom feature wall shown before and after redecoration.', beforeAfter: true },
  { img: '6.jpg', title: 'Feature Wall Detail', cat: 'interior-painting', alt: 'Close view of a deep red feature wall and bedside table', desc: 'A closer look at the colour and finish of a bedroom feature wall.' },
  { img: '7.jpg', title: 'Bedroom Repainting', cat: 'interior-painting', alt: 'Before and after views of a bedroom redecoration', desc: 'Before and after views of a bedroom painting project.' },
  { img: '8.jpg', title: 'Living Room Redecoration', cat: 'interior-painting', alt: 'Before and after views of an interior redecoration', desc: 'Before and after views showing a room refreshed with a new wall colour.' },
  { img: '9.jpg', title: 'Bedroom Colour Refresh', cat: 'interior-painting', alt: 'Before and after views of a bedroom colour refresh', desc: 'A bedroom colour refresh shown before and after the decorating work.' },
  { img: '10.jpg', title: 'Interior Painting', cat: 'interior-painting', alt: 'Interior room before and after painting', desc: 'Before and after views of an interior painting project.' },
  { img: '11.jpg', title: 'Bedroom Refresh', cat: 'interior-painting', alt: 'Bedroom with soft green walls and white bedding', desc: 'A bedroom finished in a soft green wall colour.' },
];

// Customer reviews published on the existing website.
// Only reviews relating to decorating are shown. Confirm all reviews are genuine before launch.
const REVIEWS = [
  { name: 'James Mitchell', text: "Excellent painting and decorating service from start to finish. Very professional, reliable and tidy. The finish was outstanding, and I'm extremely happy with the results. Highly recommended!" },
  { name: 'Emma Wilson', text: 'Great experience from beginning to end. The team was punctual, polite and took real care with our property. Excellent workmanship and great value.' },
];
