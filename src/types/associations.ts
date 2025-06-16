import { AstroComponent } from "./astro";
import { TestableNode } from "./figma";

type AssociationSet = {
  directLibraryCounterpartNode: ComponentNode | null;
  astroComponentMeta: AstroComponent | undefined;
  astroComponentFromLibrary: ComponentNode | ComponentSetNode | null;
  nearestLibraryParentAstroComponent: ComponentNode | ComponentSetNode | null;
  correspondingAstroNodeFromLibrary: TestableNode | TextNode | null;
};

export type { AssociationSet };
