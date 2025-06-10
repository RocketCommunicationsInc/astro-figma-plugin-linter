import { AstroComponent } from "./astro";
import { FillStyleNode } from "./figma";

type AssociationSet = {
  directLibraryCounterpartNode: ComponentNode | null;
  astroComponentMeta: AstroComponent | undefined;
  astroComponentFromLibrary: ComponentNode | ComponentSetNode | null;
  nearestLibraryParentAstroComponent: ComponentNode | ComponentSetNode | null;
  correspondingAstroNodeFromLibrary: FillStyleNode | null;
};

export type { AssociationSet };
