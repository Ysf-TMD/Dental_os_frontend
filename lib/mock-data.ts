// Mock data for the dental SaaS — all in-memory, no backend yet.

export type Appointment = {
  id: string;
  patientId: string;
  patient: string;
  practitioner: string;
  start: string; // HH:mm
  end: string;
  date: string; // ISO date
  reason: string;
  status: "confirmé" | "en attente" | "terminé" | "annulé";
  color: string;
};

const reasons = [
  "Consultation", "Détartrage", "Carie - Composite", "Extraction", "Implant",
  "Couronne", "Dévitalisation", "Contrôle ortho", "Blanchiment",
];
const practs = ["Dr. Amine", "Dr. Salma", "Dr. Karim"];
const colors = ["bg-primary", "bg-[var(--teal)]", "bg-accent", "bg-warning"];

export const appointments: Appointment[] = [
  {
    id: "apt_0",
    patientId: "p_1000",
    patient: "Patient Example",
    practitioner: "Dr. Amine",
    start: "09:00",
    end: "10:00",
    date: new Date().toISOString().slice(0, 10),
    reason: "Consultation",
    status: "confirmé",
    color: "bg-primary",
  },
];

export type Invoice = {
  id: string;
  number: string;
  patient: string;
  date: string;
  due: string;
  total: number;
  paid: number;
  status: "payée" | "partielle" | "en attente" | "en retard";
};

export const invoices: Invoice[] = [
  {
    id: "inv_0",
    number: "FA-2026-0120",
    patient: "Patient Example",
    date: "2026-06-01",
    due: "2026-07-01",
    total: 1200,
    paid: 600,
    status: "partielle",
  },
];

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  min: number;
  unit: string;
  expires: string;
  price: number;
};

const items = [
  ["Composite A2 universel", "Restauration"],
  ["Anesthésique Lidocaïne 2%", "Anesthésie"],
  ["Gants nitrile M", "Consommables"],
  ["Aiguilles 27G", "Consommables"],
  ["Ciment verre ionomère", "Restauration"],
  ["Fil de suture 4-0", "Chirurgie"],
  ["Cône gutta-percha", "Endodontie"],
  ["Brossette interdentaire", "Hygiène"],
  ["Empreinte alginate 500g", "Prothèse"],
  ["Masques FFP2", "Consommables"],
  ["Adhésif universel", "Restauration"],
  ["Pivot fibre de verre", "Endodontie"],
];

export const products: Product[] = items.map(([n, c], i) => ({
  id: `prd_${i}`,
  sku: `SKU-${(2000 + i).toString().padStart(4, "0")}`,
  name: n,
  category: c,
  stock: i % 5 === 0 ? 3 : 12 + (i * 7) % 80,
  min: 10,
  unit: ["boîte", "fl.", "u"][i % 3],
  expires: `2026-${(((i % 12) + 1)).toString().padStart(2, "0")}-15`,
  price: 45 + (i * 23) % 600,
}));

export const revenueSeries = [
  { m: "Jan", ca: 48000, soins: 32000 },
  { m: "Fév", ca: 52000, soins: 35000 },
  { m: "Mar", ca: 61000, soins: 41000 },
  { m: "Avr", ca: 58000, soins: 39000 },
  { m: "Mai", ca: 67000, soins: 45000 },
  { m: "Juin", ca: 74000, soins: 51000 },
];

export const treatmentMix = [
  { name: "Soins conservateurs", value: 38 },
  { name: "Prothèse", value: 22 },
  { name: "Implantologie", value: 18 },
  { name: "Orthodontie", value: 14 },
  { name: "Chirurgie", value: 8 },
];

export const employees = [
  { id: "u1", name: "Dr. Amine Tazi", role: "Dentiste - Propriétaire", email: "amine@cabinet.ma", color: "bg-primary" },
  { id: "u2", name: "Dr. Salma Benali", role: "Dentiste - Orthodontiste", email: "salma@cabinet.ma", color: "bg-[var(--teal)]" },
  { id: "u3", name: "Dr. Karim El Idrissi", role: "Dentiste - Implantologue", email: "karim@cabinet.ma", color: "bg-accent" },
  { id: "u4", name: "Nora Chraibi", role: "Assistante dentaire", email: "nora@cabinet.ma", color: "bg-warning" },
  { id: "u5", name: "Imane Sefrioui", role: "Secrétaire médicale", email: "imane@cabinet.ma", color: "bg-primary" },
  { id: "u6", name: "Hamza Squalli", role: "Comptable", email: "hamza@cabinet.ma", color: "bg-[var(--teal)]" },
];

export const labOrders = [
  { id: "L-0421", patient: "Karim El Idrissi", type: "Couronne céramique 36", lab: "Lab Dental Pro", sent: "2026-06-01", due: "2026-06-12", status: "En cours" },
  { id: "L-0422", patient: "Salma Tazi", type: "Bridge 24-26", lab: "Ortho Lab", sent: "2026-06-03", due: "2026-06-15", status: "En cours" },
  { id: "L-0423", patient: "Mehdi Bennani", type: "Gouttière nuit", lab: "Lab Dental Pro", sent: "2026-05-28", due: "2026-06-08", status: "Livré" },
  { id: "L-0424", patient: "Imane Sefrioui", type: "Implant - couronne 46", lab: "Implants Lab", sent: "2026-06-05", due: "2026-06-20", status: "En cours" },
  { id: "L-0425", patient: "Walid Bouhlal", type: "Aligneurs phase 2", lab: "Smile Tech", sent: "2026-05-20", due: "2026-06-06", status: "Retard" },
];

export const notifications = [
  { id: "n1", type: "rdv", title: "Rappel RDV - Karim El Idrissi", body: "Demain à 14h30 — Détartrage", time: "il y a 5 min", channel: "WhatsApp" },
  { id: "n2", type: "paiement", title: "Paiement en retard - FA-2026-0125", body: "2 400 MAD - Salma Tazi", time: "il y a 1 h", channel: "Email" },
  { id: "n3", type: "stock", title: "Stock critique : Composite A2", body: "3 unités restantes (min 10)", time: "il y a 2 h", channel: "Système" },
  { id: "n4", type: "anniv", title: "Anniversaire patient", body: "Nora Chraibi fête ses 32 ans aujourd'hui", time: "il y a 4 h", channel: "SMS" },
  { id: "n5", type: "rdv", title: "Nouveau RDV en ligne", body: "Mehdi Bennani - 12 juin 10h00", time: "hier", channel: "Portail" },
];
