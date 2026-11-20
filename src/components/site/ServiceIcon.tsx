import { Building2, Ruler, Layers, Map, FlaskConical, Home, Sofa, type LucideProps } from "lucide-react";
import type { Service } from "@/lib/services";

const map = { building: Building2, ruler: Ruler, layers: Layers, map: Map, flask: FlaskConical, home: Home, sofa: Sofa };

export function ServiceIcon({ name, ...props }: { name: Service["icon"] } & LucideProps) {
  const Icon = map[name] ?? Building2;
  return <Icon {...props} />;
}
