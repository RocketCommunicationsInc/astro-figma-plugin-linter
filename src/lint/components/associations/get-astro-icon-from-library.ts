import { AstroComponent } from "../../../types/astro";
import { componentLoaderFunction } from "../component-loader";

interface GetAstroComponentFromLibrary {
  (localAstroIconMeta: AstroComponent | null): Promise<
    ComponentNode | ComponentSetNode | null
  >;
}

const getAstroIconFromLibrary: GetAstroComponentFromLibrary = async (
  localAstroIconMeta
) => {
  let astroIconFromLibrary: ComponentNode | ComponentSetNode | null = null;

  if (localAstroIconMeta) {
    // Load the Astro component from Figma
    astroIconFromLibrary = await componentLoaderFunction(
      localAstroIconMeta.type,
      localAstroIconMeta.key
    );
  }

  return astroIconFromLibrary;
};

export { getAstroIconFromLibrary };
