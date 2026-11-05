import {
  Award,
  Baby,
  Banknote,
  Bike,
  BookOpen,
  Briefcase,
  Bus,
  Car,
  CarTaxiFront,
  CircleEllipsis,
  Coffee,
  Coins,
  CreditCard,
  Drama,
  Droplet,
  Dumbbell,
  Film,
  Flame,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HandCoins,
  HandHeart,
  Heart,
  HeartPulse,
  House,
  KeyRound,
  Landmark,
  Laptop,
  Luggage,
  Music,
  Package,
  PawPrint,
  Percent,
  PiggyBank,
  Pill,
  Pizza,
  Plane,
  Receipt,
  Repeat,
  Scissors,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  SquareParking,
  Stethoscope,
  Tag,
  Tent,
  Ticket,
  TrainFront,
  TrendingUp,
  Trophy,
  Tv,
  Undo2,
  Users,
  Utensils,
  Wallet,
  WashingMachine,
  Wifi,
  Wine,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

// дзеркало CATEGORY_ICONS з бекенду: ключ — назва іконки lucide в kebab-case.
// категорії бекенд перевіряє за цим списком, рахунки приймають будь-який рядок, але беруть той самий набір
const ICONS = {
  // Їжа
  "shopping-cart": ShoppingCart,
  utensils: Utensils,
  coffee: Coffee,
  pizza: Pizza,
  wine: Wine,
  // Транспорт
  bus: Bus,
  car: Car,
  fuel: Fuel,
  "car-taxi-front": CarTaxiFront,
  "train-front": TrainFront,
  bike: Bike,
  "square-parking": SquareParking,
  // Житло та побут
  house: House,
  "key-round": KeyRound,
  sofa: Sofa,
  zap: Zap,
  droplet: Droplet,
  flame: Flame,
  wifi: Wifi,
  wrench: Wrench,
  "washing-machine": WashingMachine,
  // Здоров'я та догляд
  "heart-pulse": HeartPulse,
  pill: Pill,
  stethoscope: Stethoscope,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  scissors: Scissors,
  // Покупки
  shirt: Shirt,
  "shopping-bag": ShoppingBag,
  package: Package,
  smartphone: Smartphone,
  laptop: Laptop,
  // Розваги та хобі
  "gamepad-2": Gamepad2,
  film: Film,
  drama: Drama,
  tv: Tv,
  music: Music,
  "book-open": BookOpen,
  ticket: Ticket,
  trophy: Trophy,
  // Сім'я, тварини, подарунки
  baby: Baby,
  users: Users,
  "paw-print": PawPrint,
  gift: Gift,
  "hand-heart": HandHeart,
  // Навчання та робота
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  // Подорожі
  plane: Plane,
  luggage: Luggage,
  tent: Tent,
  // Фінанси
  wallet: Wallet,
  banknote: Banknote,
  coins: Coins,
  "piggy-bank": PiggyBank,
  "credit-card": CreditCard,
  landmark: Landmark,
  receipt: Receipt,
  "shield-check": ShieldCheck,
  "hand-coins": HandCoins,
  "trending-up": TrendingUp,
  percent: Percent,
  tag: Tag,
  repeat: Repeat,
  "undo-2": Undo2,
  award: Award,
  // Інше
  heart: Heart,
  "circle-ellipsis": CircleEllipsis,
} satisfies Record<string, LucideIcon>;

type IconName = keyof typeof ICONS;

const ICON_NAMES = Object.keys(ICONS) as IconName[];

function isIconName(name: string): name is IconName {
  return Object.hasOwn(ICONS, name);
}

function getIcon(name: string | null): LucideIcon {
  return name && isIconName(name) ? ICONS[name] : CircleEllipsis;
}

export { ICON_NAMES, ICONS, getIcon, isIconName };
export type { IconName };
