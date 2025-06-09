import { AstroComponent } from "./astro";

type AssociationSet = {
  sourceCounterpartNode: ComponentNode | null;
  astroComponentMeta: AstroComponent | undefined;
  astroComponentFromLibrary: ComponentNode | ComponentSetNode | null;
  nearestLibraryParentAstroComponent: ComponentNode | ComponentSetNode | null;
};

export type { AssociationSet };
