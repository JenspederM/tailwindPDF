import yoga from "yoga-layout";
import jsPDF from "jspdf";
import { ElementProps } from "./ElementProps";
import { getDefaultNode } from "./getDefaultNode";
import theme from "./theme";
import { rem2px } from "./utils";

function getColor(color: string, intensity?: string) {
  if (!theme?.colors) return;
  const COLORS = theme.colors;

  const bg = COLORS[color];
  if (typeof bg === "string") {
    if (["black", "white"].includes(color)) {
      return bg;
    }
  } else {
    if (!intensity) {
      console.log("No intensity provided");
      return;
    }
    const _color = bg[intensity];
    if (!_color) {
      console.log("No color found for intensity", intensity);
      return;
    }
    if (typeof _color === "string") {
      return _color;
    }
  }

  return COLORS["white"] as string;
}

const resolveFontSize = (className: string) => {
  if (!className.startsWith("text-") || !theme?.fontSize) return;
  const [, value] = className.split("-");
  if (!Object.keys(theme?.fontSize || {}).includes(value)) return;

  const fontSize = theme.fontSize[value];

  if (!fontSize) {
    console.log("No font size found for", value);
    return;
  }

  if (
    fontSize instanceof Array &&
    fontSize[1] instanceof Object &&
    fontSize[1].lineHeight
  ) {
    return {
      size: fontSize[0],
      lineHeight: fontSize[1].lineHeight,
    };
  }

  return {
    size: "1rem",
    lineHeight: "1.5rem",
  };
};

const resolveTextColor = (className: string) => {
  if (!className.startsWith("text-")) return;
  const [, color, intensity] = className.split("-");
  if (!Object.keys(theme?.colors || {}).includes(color)) return;
  const bg = getColor(color, intensity);
  console.log("Setting text color", { color, intensity });
  return bg;
};

const resolveBackgroundColor = (className: string) => {
  if (!className.startsWith("bg-")) return;
  const [, color, intensity] = className.split("-");
  if (!Object.keys(theme?.colors || {}).includes(color)) return;
  const bg = getColor(color, intensity);
  console.log("Setting background color", { color, intensity });
  return bg;
};

const resolveRounded = (className: string) => {
  if (!className.startsWith("rounded") || !theme?.borderRadius) return;
  const [, value] = className.split("-");
  if (!Object.keys(theme?.borderRadius || {}).includes(value)) return;
  const borderRadius = theme.borderRadius[value];
  if (!borderRadius) {
    console.log("No border radius found for", value);
    return;
  }
  return borderRadius;
};

/*
 * This function is responsible for drawing an ElementProps object
 * to a jsPDF document.
 *
 * @param element The ElementProps object to draw
 * @param doc The jsPDF document to draw to
 *
 * @returns void
 */
export const drawElement = (
  element: ElementProps,
  doc: jsPDF,
  initialX = 0,
  initialY = 0
) => {
  const layout = element.node.getComputedLayout();
  const p = element.node.getPadding(yoga.EDGE_ALL).value || 0;
  const pt = element.node.getPadding(yoga.EDGE_TOP).value || 0;
  const pl = element.node.getPadding(yoga.EDGE_LEFT).value || 0;
  const px = element.node.getPadding(yoga.EDGE_HORIZONTAL).value || 0;
  const py = element.node.getPadding(yoga.EDGE_VERTICAL).value || 0;

  const xRect = initialX + layout.left;
  const yRect = initialY + layout.top;

  const w = layout.width;
  const h = layout.height;

  type Styles = {
    default: {
      background: string;
      text: string;
      fontSize: number;
      lineHeightFactor: number;
      roundness: number;
    };
    current: {
      background?: string;
      text?: string;
      fontSize?: number;
      lineHeightFactor?: number;
      roundness: number;
    };
  };

  const applyStyles = (classList: DOMTokenList) => {
    const styles: Styles = {
      default: {
        background: doc.getFillColor(),
        text: doc.getTextColor(),
        fontSize: doc.getFontSize(),
        lineHeightFactor: doc.getLineHeightFactor(),
        roundness: 0,
      },
      current: {
        background: doc.getFillColor(),
        text: doc.getTextColor(),
        fontSize: doc.getFontSize(),
        lineHeightFactor: doc.getLineHeightFactor(),
        roundness: 0,
      },
    };

    classList.forEach((className) => {
      if (className.startsWith("bg-")) {
        const backgroundColor = resolveBackgroundColor(className);
        if (backgroundColor) {
          styles.current.background = backgroundColor;
        }
      }

      if (className.startsWith("text-")) {
        const textColor = resolveTextColor(className);
        const textSize = resolveFontSize(className);
        if (textColor) {
          styles.current.text = textColor;
        }
        if (textSize) {
          const fontSize = rem2px(textSize.size);
          const lineHeight = rem2px(textSize.lineHeight);
          styles.current.fontSize = fontSize;
          styles.current.lineHeightFactor = lineHeight / fontSize;
        }
      }

      if (className.startsWith("rounded")) {
        const roundness = resolveRounded(className);
        if (roundness) {
          styles.current.roundness = rem2px(roundness);
        }
      }
    });

    return styles;
  };

  const resetStyles = (currentStyle: Styles) => {
    doc.setFillColor(currentStyle.default.background);
    doc.setTextColor(currentStyle.default.text);
    doc.setFontSize(currentStyle.default.fontSize);
    doc.setLineHeightFactor(currentStyle.default.lineHeightFactor);
  };

  const styles = applyStyles(element.element.classList);

  if (styles.current.background) {
    doc.setFillColor(styles.current.background);
  }

  doc.roundedRect(
    xRect,
    yRect,
    w,
    h,
    styles.current.roundness,
    styles.current.roundness,
    styles.current.background ? "F" : undefined
  );

  if (styles.current.text) doc.setTextColor(styles.current.text);
  if (styles.current.fontSize) doc.setFontSize(styles.current.fontSize);

  if (element.children && element.children.length > 0) {
    console.log("parent layout", {
      content: element.element.textContent,
      layout,
      bounds: element.bounds,
      padding: { p, pt, pl, px, py },
    });
    element.children.forEach((child) => drawElement(child, doc, xRect, yRect));
  } else {
    console.log("childlayout", {
      content: element.element.textContent,
      layout,
      bounds: element.bounds,
      padding: { p, pt, pl, px, py },
    });

    const xText = xRect + pl + p + px;
    const yText = yRect + pt + p + py + h / 2;

    console.log("rect position", { xRect, yRect }, "text position", {
      xText,
      yText,
    });

    doc.text(element.element.textContent || "", xText, yText, {
      baseline: "middle",
      align: "left",
    });
  }

  resetStyles(styles);
};

/*
 * This function is responsible for creating a tree of ElementProps
 * from a DOM element. It uses yoga-layout to calculate the layout
 * of the element and its children.
 *
 * @param element The DOM element to create a tree from
 *
 * @returns An ElementProps object
 */
export const getElementProps = (element: Element): ElementProps => {
  if (!element.hasChildNodes()) {
    const id = element.id || element.tagName;
    const node = getDefaultNode(
      element.getBoundingClientRect(),
      element.classList
    );
    return {
      id,
      element,
      bounds: element.getBoundingClientRect(),
      node: node,
    };
  }

  const parent = getDefaultNode(
    element.getBoundingClientRect(),
    element.classList
  );

  const children = Array.from(element.children).map((child, i) => {
    child.setAttribute("id", `${element.id}-${i}`);
    const props = getElementProps(child);
    parent.insertChild(props.node, parent.getChildCount());
    return props;
  });

  return {
    id: element.id,
    element,
    bounds: element.getBoundingClientRect(),
    children,
    node: parent,
  };
};
