// lib/data.ts

export const USERS = [
  {
    id: "u1",
    username: "manager_coffee",
    password: "password123", // Tambahkan password untuk simulasi login
    role: "client",
    clientName: "Global Coffee Chain",
  },
  {
    id: "u2",
    username: "manager_chocolate",
    password: "password123",
    role: "client",
    clientName: "Luxury Chocolatier",
  },
  {
    id: "admin",
    username: "admin_holicindo",
    password: "adminpassword",
    role: "admin",
    clientName: "Holicindo Admin Portal",
  },
];

export const SHOWCASES = [
  {
    id: "hc-2026-001",
    serialNumber: "HC-2026-001",
    ownerId: "u1", // Global Coffee Chain
    warrantyExpiry: "2027-12-31",
    imageUrl: "/images/gambar1.webp", // Penamaan file yang sinkron
    specs: {
      compressor: "Emerson 5HP",
      glass: "Double Tempered",
    },
  },
  {
    id: "hc-2026-002",
    serialNumber: "HC-2026-002",
    ownerId: "u1", // Global Coffee Chain
    warrantyExpiry: "2024-01-01", // Akan otomatis muncul "Expired"
    imageUrl: "/images/gambar2.webp",
    specs: {
      compressor: "LG Twin",
      glass: "Single Pane",
    },
  },
  {
    id: "hc-2026-003",
    serialNumber: "HC-2026-003",
    ownerId: "u2", // Luxury Chocolatier
    warrantyExpiry: "2026-08-15",
    imageUrl: "/images/gambar3.webp",
    specs: {
      compressor: "Panasonic Inverter",
      glass: "Triple Pane",
    },
  },
];
