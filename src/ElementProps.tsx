import { YogaNode } from "yoga-layout";

export type ElementProps = {
  id: string;
  element: Element;
  bounds: DOMRect;
  node: YogaNode;
  children?: ElementProps[];
  node_id?: number;
};
