import yoga, { Node, YogaNode } from "yoga-layout";

const SPACING = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 20,
  "6": 24,
  "7": 28,
  "8": 32,
  "9": 36,
  "10": 40,
  "11": 44,
  "12": 48,
  "14": 56,
  "16": 64,
  "20": 80,
  "24": 96,
  "28": 112,
  "32": 128,
  "36": 144,
  "40": 160,
  "44": 176,
  "48": 192,
  "52": 208,
  "56": 224,
  "60": 240,
  "64": 256,
  "72": 288,
  "80": 320,
  "96": 384,
};

const ALIGN = {
  auto: yoga.ALIGN_AUTO,
  start: yoga.ALIGN_FLEX_START,
  end: yoga.ALIGN_FLEX_END,
  center: yoga.ALIGN_CENTER,
  baseline: yoga.ALIGN_BASELINE,
  stretch: yoga.ALIGN_STRETCH,
  between: yoga.ALIGN_SPACE_BETWEEN,
  around: yoga.ALIGN_SPACE_AROUND,
};

const JUSTIFY = {
  start: yoga.JUSTIFY_FLEX_START,
  end: yoga.JUSTIFY_FLEX_END,
  center: yoga.JUSTIFY_CENTER,
  between: yoga.JUSTIFY_SPACE_BETWEEN,
  around: yoga.JUSTIFY_SPACE_AROUND,
};

const resolvePadding = (className: string, node: YogaNode) => {
  const [padding, value] = className.split("-");

  const setPadding = (edge: yoga.YogaEdge) => {
    node.setPadding(edge, SPACING[value as keyof typeof SPACING]);
  };

  switch (padding) {
    case "p":
      setPadding(yoga.EDGE_ALL);
      break;
    case "pt":
      setPadding(yoga.EDGE_TOP);
      break;
    case "pl":
      setPadding(yoga.EDGE_LEFT);
      break;
    case "px":
      setPadding(yoga.EDGE_HORIZONTAL);
      break;
    case "py":
      setPadding(yoga.EDGE_VERTICAL);
      break;
    case "pb":
      setPadding(yoga.EDGE_BOTTOM);
      break;
    case "pr":
      setPadding(yoga.EDGE_RIGHT);
      break;
    default:
      break;
  }
};

const resolveMargin = (className: string, node: YogaNode) => {
  const [margin, value] = className.split("-");

  const setMargin = (edge: yoga.YogaEdge) => {
    node.setMargin(edge, SPACING[value as keyof typeof SPACING]);
  };

  switch (margin) {
    case "m":
      setMargin(yoga.EDGE_ALL);
      break;
    case "mt":
      setMargin(yoga.EDGE_TOP);
      break;
    case "ml":
      setMargin(yoga.EDGE_LEFT);
      break;
    case "mx":
      setMargin(yoga.EDGE_HORIZONTAL);
      break;
    case "my":
      setMargin(yoga.EDGE_VERTICAL);
      break;
    case "mb":
      setMargin(yoga.EDGE_BOTTOM);
      break;
    case "mr":
      setMargin(yoga.EDGE_RIGHT);
      break;
    default:
      break;
  }
};

const resolveAlign = (className: string, node: YogaNode) => {
  const [align, value] = className.split("-");

  // Early return if not in ALIGN
  if (!Object.keys(ALIGN).includes(value)) return;

  switch (align) {
    case "items":
      node.setAlignItems(ALIGN[value as keyof typeof ALIGN]);
      break;
    case "self":
      node.setAlignSelf(ALIGN[value as keyof typeof ALIGN]);
      break;
    case "content":
      node.setAlignContent(ALIGN[value as keyof typeof ALIGN]);
      break;
    default:
      break;
  }
};

const resolveJustify = (className: string, node: YogaNode) => {
  const [justify, value] = className.split("-");

  // Early return if not in JUSTIFY
  if (!Object.keys(JUSTIFY).includes(value)) return;

  switch (justify) {
    case "justify":
      node.setJustifyContent(JUSTIFY[value as keyof typeof JUSTIFY]);
      break;
    default:
      break;
  }
};

const resolveFlex = (className: string, node: YogaNode) => {
  switch (className) {
    case "flex-1":
      node.setFlexGrow(1);
      node.setFlexShrink(1);
      node.setFlexBasis("0%");
      break;
    case "flex-initial":
      node.setFlexGrow(0);
      node.setFlexShrink(1);
      node.setFlexBasis("auto");
      break;
    case "flex-none":
      node.setFlexGrow(0);
      node.setFlexShrink(0);
      node.setFlexBasis("auto");
      break;
    case "flex-auto":
      node.setFlexGrow(1);
      node.setFlexShrink(1);
      node.setFlexBasis("auto");
      break;
    case "flex-row":
      node.setFlexDirection(yoga.FLEX_DIRECTION_ROW);
      break;
    case "flex-row-reverse":
      node.setFlexDirection(yoga.FLEX_DIRECTION_ROW_REVERSE);
      break;
    case "flex-column":
      node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN);
      break;
    case "flex-column-reverse":
      node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN_REVERSE);
      break;
    case "flex-wrap":
      node.setFlexWrap(yoga.WRAP_WRAP);
      break;
    case "flex-nowrap":
      node.setFlexWrap(yoga.WRAP_NO_WRAP);
      break;
    case "flex-wrap-reverse":
      node.setFlexWrap(yoga.WRAP_WRAP_REVERSE);
      break;
    case "flex-grow":
      node.setFlexGrow(1);
      break;
    case "grow":
      node.setFlexGrow(1);
      break;
    case "grow-0":
      node.setFlexGrow(0);
      break;
    case "flex-shrink":
      node.setFlexShrink(1);
      break;
    case "shrink":
      node.setFlexShrink(1);
      break;
    case "shrink-0":
      node.setFlexShrink(0);
      break;
    default:
      break;
  }
};

export const getDefaultNode = (
  bounds: DOMRect,
  classList: DOMTokenList
): YogaNode => {
  const arr = Array.from(classList);
  const node = Node.create();

  node.setWidth(bounds.width);
  node.setHeight(bounds.height);

  for (let i = 0; i < arr.length; i++) {
    const className = arr[i].toString();
    resolvePadding(className, node);
    resolveMargin(className, node);
    resolveAlign(className, node);
    resolveJustify(className, node);
    resolveFlex(className, node);
  }

  return node;
};
