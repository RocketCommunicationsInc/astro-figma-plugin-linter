import { AstroComponent } from "./astro";

type AssociationSet = {
  sourceCounterpartNode: ComponentNode | null;
  astroComponentMeta: AstroComponent | undefined;
  sourceAstroComponent: ComponentNode | ComponentSetNode | null;
  nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null;
};

export type { AssociationSet };
