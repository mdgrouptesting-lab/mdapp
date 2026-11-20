export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: "building" | "ruler" | "layers" | "map" | "flask" | "home" | "sofa";
  features: string[];
  accent: string; // tailwind gradient classes
};

export const services: Service[] = [
  {
    slug: "construction",
    title: "Construction",
    short: "Residential, commercial & industrial construction from foundation to finish.",
    description:
      "Complete turnkey construction handled by experienced engineers and supervisors. We manage labour, material procurement, quality checks and timelines so you get a strong structure delivered on schedule and on budget.",
    icon: "building",
    features: ["Turnkey & labour contracts", "RCC framed structures", "Commercial & industrial buildings", "Renovation & extension", "Daily site supervision", "Transparent BOQ & billing"],
    accent: "from-brand-400 to-brand-600",
  },
  {
    slug: "planning",
    title: "Planning & Design",
    short: "Architectural plans, structural design, 3D elevation and approvals.",
    description:
      "Our planning team turns your idea into practical drawings — Vastu-friendly floor plans, 3D elevations, structural design and estimation — and helps with building plan approvals.",
    icon: "ruler",
    features: ["2D floor plans", "3D elevation & walkthrough", "Structural drawings", "Estimation & BOQ", "Vastu-compliant layouts", "Plan approval assistance"],
    accent: "from-sky-400 to-blue-600",
  },
  {
    slug: "soil-testing",
    title: "Soil Testing",
    short: "Geotechnical investigation to know your ground before you build.",
    description:
      "Know the bearing capacity and soil properties of your plot before designing the foundation. We carry out bore-hole drilling, SPT, sampling and laboratory analysis with a detailed report.",
    icon: "layers",
    features: ["Bore-hole drilling & SPT", "Safe bearing capacity", "Plate load test", "Water table analysis", "Lab analysis of samples", "Foundation recommendation report"],
    accent: "from-amber-500 to-orange-700",
  },
  {
    slug: "survey",
    title: "Land Survey",
    short: "Accurate digital land survey, contour & layout marking.",
    description:
      "Precise surveys using Total Station and DGPS — plot boundary, contour, topographic and layout marking — so your design starts from correct ground data.",
    icon: "map",
    features: ["Total Station survey", "DGPS survey", "Contour & topographic maps", "Plot demarcation", "Building layout marking", "Road & layout survey"],
    accent: "from-emerald-400 to-teal-600",
  },
  {
    slug: "material-testing",
    title: "Material Testing",
    short: "Quality testing of cement, concrete, steel, bricks & aggregates.",
    description:
      "Make sure the materials going into your building meet standards. We test cement, concrete cubes, steel, bricks, sand and aggregates and issue clear test reports.",
    icon: "flask",
    features: ["Concrete cube test", "Cement & sand testing", "Steel (TMT) testing", "Brick & block testing", "Aggregate testing", "Mix design"],
    accent: "from-violet-400 to-purple-600",
  },
  {
    slug: "g-plus-1-construction",
    title: "G+1 House Construction",
    short: "Your dream ground + first floor home, built with a fixed plan & budget.",
    description:
      "Specialised packages for independent G+1 houses — planning, approvals, construction and finishing — with clear per-sq.ft pricing and milestone-based payments.",
    icon: "home",
    features: ["Per sq.ft packages", "Plan + elevation included", "Quality branded materials", "Milestone-based payments", "Electrical & plumbing", "Handover with finishing"],
    accent: "from-rose-400 to-red-600",
  },
  {
    slug: "interior",
    title: "Interior Design",
    short: "Modular kitchens, wardrobes, false ceilings and complete home interiors.",
    description:
      "Beautiful, functional interiors designed around the way you live — modular kitchen, wardrobes, TV units, false ceiling, lighting, painting and décor, executed by our own craftsmen.",
    icon: "sofa",
    features: ["Modular kitchen", "Wardrobes & storage", "False ceiling & lighting", "TV & study units", "Painting & wall textures", "Office interiors"],
    accent: "from-fuchsia-400 to-pink-600",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
