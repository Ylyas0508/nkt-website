export const COMPANY = {
  name: "Nanning Kazan Trading Co., Ltd",
  nameCn: "南宁市卡赞商贸有限公司",
  address:
    "Shop No. A1011, 1st Floor, Building A, Dinisheng International Shopping Center, No. 7 Xiuling Road, Xixiangtang District, Nanning, Guangxi Zhuang Autonomous Region, China",
  addressShort: "No. 7 Xiuling Road, Xixiangtang District, Nanning, Guangxi",
  wechat: "+8618587852360",
  whatsapp: "905380390593",
  email: "nkt@nanning-kazan-trading.online",
  registration: "91450100MAEHB1HX9L",
  mapLat: 22.817,
  mapLng: 108.3665,
};

export const CATEGORIES = [
  {
    id: "oil-petroleum",
    tKey: "oil",
    icon: "Fuel",
    color: "#cd9e66",
    image:
      "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80",
  },
  {
    id: "chemicals",
    tKey: "chemicals",
    icon: "FlaskConical",
    color: "#14b8a6",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
  },
  {
    id: "metallurgy",
    tKey: "metallurgy",
    icon: "Hammer",
    color: "#94a3b8",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
  },
  {
    id: "agricultural",
    tKey: "agricultural",
    icon: "Wheat",
    color: "#84cc16",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
  },
  {
    id: "textiles",
    tKey: "textiles",
    icon: "Shirt",
    color: "#a78bfa",
    image:
      "https://images.unsplash.com/photo-1558171813-01a14e725529?w=800&q=80",
  },
  {
    id: "automotive",
    tKey: "automotive",
    icon: "Car",
    color: "#60a5fa",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
  },
  {
    id: "machinery",
    tKey: "machinery",
    icon: "Cog",
    color: "#f97316",
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
  },
  {
    id: "sulfur",
    tKey: "sulfur",
    icon: "Atom",
    color: "#facc15",
    image:
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80",
  },
  {
    id: "other",
    tKey: "other",
    icon: "Package",
    color: "#2dd4bf",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=800&q=80",
  },
];

export const ADMIN_USER = process.env.ADMIN_USER || "admin";
export const ADMIN_PASS = process.env.ADMIN_PASS || "kazan2024";
export const COOKIE_SECRET = process.env.COOKIE_SECRET || "nkt-super-secret-2024";
export const COOKIE_NAME = "nkt_admin_session";
