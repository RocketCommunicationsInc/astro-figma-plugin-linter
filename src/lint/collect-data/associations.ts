import { AssociationSet } from "../../types/associations";

const associations: Map<string, AssociationSet> = new Map();

const clearAssociations = () => {
  associations.clear();
};

const addAssociation = (
  nodeId: string,
  associationSet: AssociationSet,
) => {
  associations.set(nodeId, associationSet);
};

const getAssociation = (id: string) => {
  const association = associations.get(id);
  return association;
};

export { clearAssociations, addAssociation, getAssociation };
