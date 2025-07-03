import { AstroComponent } from "./astro";
import { TestableNode } from "./figma";

type AssociationSet = {
  directLibraryCounterpartNode: ComponentNode | null;
  astroComponentMeta: AstroComponent | undefined;
  astroComponentFromLibrary: ComponentNode | ComponentSetNode | null;
  nearestLibraryParentAstroComponent: ComponentNode | ComponentSetNode | null;
  correspondingAstroNodeFromLibrary: TestableNode | TextNode | null;
  localAstroIconMeta: AstroComponent | null;
  astroIconFromLibrary: ComponentNode | ComponentSetNode | null;
};

export type { AssociationSet };
