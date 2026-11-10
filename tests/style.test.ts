import { expect, test } from "vite-plus/test";
import type { AugProps } from "../src/aug/index.ts";
import { styleAttributes, type ThemeProps } from "../src/style/index.ts";

test("no aug and no style returns an empty object", () => {
  expect(styleAttributes({})).toStrictEqual({});
  expect(styleAttributes({}, undefined)).toStrictEqual({});
});

test("no aug passes the style through untouched", () => {
  const style = { color: "red" };
  expect(styleAttributes({}, style)).toStrictEqual({ style });
  expect(styleAttributes({}, "color:red")).toStrictEqual({ style: "color:red" });
});

test("an aug with no mixins is treated as no aug", () => {
  expect(styleAttributes({ aug: {} })).toStrictEqual({});
  expect(styleAttributes({ aug: {} }, { color: "red" })).toStrictEqual({ style: { color: "red" } });
});

test("a bare region mixin emits only the token", () => {
  expect(styleAttributes({ aug: { tl: "clip", br: "2-rect-xy" } })).toStrictEqual({
    "data-augmented-ui": "tl-clip br-2-rect-xy",
  });
});

test("tokens come out in region order, then all, border and inlay", () => {
  expect(
    styleAttributes({
      aug: { inlay: true, border: true, l: "clip", bl: "clip", t: "clip", tl: "clip" },
    }),
  ).toStrictEqual({
    "data-augmented-ui": "tl-clip t-clip bl-clip l-clip border inlay",
    "data-aug-border": "",
    "data-aug-inlay": "",
  });
});

test("every corner option maps to its custom property", () => {
  const aug: AugProps = {
    tr: {
      mixin: "2-clip-xy",
      size: "1px",
      size1: "2px",
      size2: "3px",
      width1: "4px",
      height1: "5px",
      width2: "6px",
      height2: "7px",
      inset1: "8px",
      inset2: "9px",
      extend1: "10px",
      extend2: "11px",
      clipmodX1: 0.5,
      clipmodY1: "0.6",
      clipmodX2: 0.7,
      clipmodY2: 0,
    },
  };
  expect(styleAttributes({ aug })).toStrictEqual({
    "data-augmented-ui": "tr-2-clip-xy",
    style: {
      "--aug-tr": "1px",
      "--aug-tr1": "2px",
      "--aug-tr2": "3px",
      "--aug-tr1-width": "4px",
      "--aug-tr1-height": "5px",
      "--aug-tr2-width": "6px",
      "--aug-tr2-height": "7px",
      "--aug-tr-inset1": "8px",
      "--aug-tr-inset2": "9px",
      "--aug-tr-extend1": "10px",
      "--aug-tr-extend2": "11px",
      "--aug-tr1-clipmod-x": "0.5",
      "--aug-tr1-clipmod-y": "0.6",
      "--aug-tr2-clipmod-x": "0.7",
      "--aug-tr2-clipmod-y": "0",
    },
  });
});

test("every edge option maps to its custom property", () => {
  const aug: AugProps = {
    b: {
      mixin: "scoop-xy",
      size: "1px",
      size1: "2px",
      size2: "3px",
      width1: "4px",
      height1: "5px",
      width2: "6px",
      height2: "7px",
      inset1: "8px",
      extend1: "10px",
      clipmodX1: 1,
      clipmodY1: 2,
      clipmodX2: 3,
      clipmodY2: 4,
      center: "50%",
      offset: "12px",
    },
  };
  expect(styleAttributes({ aug })).toStrictEqual({
    "data-augmented-ui": "b-scoop-xy",
    style: {
      "--aug-b": "1px",
      "--aug-b1": "2px",
      "--aug-b2": "3px",
      "--aug-b1-width": "4px",
      "--aug-b1-height": "5px",
      "--aug-b2-width": "6px",
      "--aug-b2-height": "7px",
      "--aug-b-inset1": "8px",
      "--aug-b-extend1": "10px",
      "--aug-b1-clipmod-x": "1",
      "--aug-b1-clipmod-y": "2",
      "--aug-b2-clipmod-x": "3",
      "--aug-b2-clipmod-y": "4",
      "--aug-b-center": "50%",
      "--aug-b-offset": "12px",
    },
  });
});

test("undefined options are skipped", () => {
  expect(
    styleAttributes({ aug: { t: { mixin: "clip", size: undefined, center: "10px" } } }),
  ).toStrictEqual({
    "data-augmented-ui": "t-clip",
    style: { "--aug-t-center": "10px" },
  });
});

test("all takes a bare mixin or width and height", () => {
  expect(styleAttributes({ aug: { all: "hex" } })).toStrictEqual({
    "data-augmented-ui": "all-hex",
  });
  expect(
    styleAttributes({ aug: { all: { mixin: "triangle-up", width: "30px", height: "20px" } } }),
  ).toStrictEqual({
    "data-augmented-ui": "all-triangle-up",
    style: { "--aug-all-width": "30px", "--aug-all-height": "20px" },
  });
});

test("border and inlay accept true, a string, or options", () => {
  expect(styleAttributes({ aug: { border: true, inlay: true } })).toStrictEqual({
    "data-augmented-ui": "border inlay",
    "data-aug-border": "",
    "data-aug-inlay": "",
  });
  expect(styleAttributes({ aug: { border: "2px", inlay: "4px" } })).toStrictEqual({
    "data-augmented-ui": "border inlay",
    "data-aug-border": "",
    "data-aug-inlay": "",
    style: { "--aug-border-all": "2px", "--aug-inlay-all": "4px" },
  });
  const options = {
    all: "1px",
    x: "2px",
    y: "3px",
    top: "4px",
    right: "5px",
    bottom: "6px",
    left: "7px",
    bg: "var(--theme-line)",
    opacity: 0.5,
  };
  expect(
    styleAttributes({ aug: { border: options, inlay: { ...options, opacity: "0.25" } } }),
  ).toStrictEqual({
    "data-augmented-ui": "border inlay",
    "data-aug-border": "",
    "data-aug-inlay": "",
    style: {
      "--aug-border-all": "1px",
      "--aug-border-x": "2px",
      "--aug-border-y": "3px",
      "--aug-border-top": "4px",
      "--aug-border-right": "5px",
      "--aug-border-bottom": "6px",
      "--aug-border-left": "7px",
      "--aug-border-bg": "var(--theme-line)",
      "--aug-border-opacity": "0.5",
      "--aug-inlay-all": "1px",
      "--aug-inlay-x": "2px",
      "--aug-inlay-y": "3px",
      "--aug-inlay-top": "4px",
      "--aug-inlay-right": "5px",
      "--aug-inlay-bottom": "6px",
      "--aug-inlay-left": "7px",
      "--aug-inlay-bg": "var(--theme-line)",
      "--aug-inlay-opacity": "0.25",
    },
  });
});

test("component style keys win over aug vars", () => {
  const { style } = styleAttributes(
    { aug: { tl: { mixin: "clip", size: "8px" }, border: "2px" } },
    { color: "red", "--aug-tl": "20px" },
  );
  expect(style).toStrictEqual({ "--aug-tl": "20px", "--aug-border-all": "2px", color: "red" });
});

test("a string style stays a string and keeps its own declarations last", () => {
  const aug: AugProps = { tl: { mixin: "clip", size: "8px" }, border: "2px" };
  const expected = "--aug-tl:8px;--aug-border-all:2px;color:red";
  expect(styleAttributes({ aug }, "color:red").style).toBe(expected);
  expect(styleAttributes({ aug }, "color:red;").style).toBe(expected);
  expect(styleAttributes({ aug }, "  color:red ;; ").style).toBe(expected);
  expect(styleAttributes({ aug }, "").style).toBe("--aug-tl:8px;--aug-border-all:2px");
});

test("an aug with no custom properties leaves the style as given", () => {
  expect(styleAttributes({ aug: { tl: "clip" } }, "color:red")).toStrictEqual({
    "data-augmented-ui": "tl-clip",
    style: "color:red",
  });
  const style = { color: "red" };
  expect(styleAttributes({ aug: { tl: "clip" } }, style).style).toBe(style);
});

test("the style object passed in is not mutated", () => {
  const style = { color: "red" };
  styleAttributes({ aug: { tl: { mixin: "clip", size: "8px" } } }, style);
  expect(style).toStrictEqual({ color: "red" });
});

test("the types reject mixins and options a region cannot take", () => {
  // @ts-expect-error edge regions have no plain step mixin
  const edgeStep: AugProps = { t: "step" };
  // @ts-expect-error corner mixins do not exist on edge regions
  const edgeCorner: AugProps = { t: "2-clip-x" };
  // @ts-expect-error unknown mixin
  const unknown: AugProps = { tl: "bogus" };
  // @ts-expect-error inset2 is corner only
  const edgeInset2: AugProps = { t: { mixin: "clip", inset2: "1px" } };
  // @ts-expect-error extend2 is corner only
  const edgeExtend2: AugProps = { l: { mixin: "clip", extend2: "1px" } };
  // @ts-expect-error center is edge only
  const cornerCenter: AugProps = { tl: { mixin: "clip", center: "1px" } };
  // @ts-expect-error offset is edge only
  const cornerOffset: AugProps = { br: { mixin: "clip", offset: "1px" } };
  // @ts-expect-error the mixin of an options object is checked against its region
  const wrongOptionMixin: AugProps = { r: { mixin: "step" } };
  // @ts-expect-error lengths are strings
  const numericLength: AugProps = { tl: { mixin: "clip", size: 8 } };
  // @ts-expect-error all takes an all mixin
  const badAll: AugProps = { all: "clip" };
  // @ts-expect-error border options have no unknown keys
  const badBorder: AugProps = { border: { color: "red" } };
  expect([
    edgeStep,
    edgeCorner,
    unknown,
    edgeInset2,
    edgeExtend2,
    cornerCenter,
    cornerOffset,
    wrongOptionMixin,
    numericLength,
    badAll,
    badBorder,
  ]).toHaveLength(11);
});

test("border and inlay each emit their own mark and nothing else does", () => {
  expect(styleAttributes({ aug: { border: true } })).toStrictEqual({
    "data-augmented-ui": "border",
    "data-aug-border": "",
  });
  expect(styleAttributes({ aug: { inlay: "2px" } })).toStrictEqual({
    "data-augmented-ui": "inlay",
    "data-aug-inlay": "",
    style: { "--aug-inlay-all": "2px" },
  });
  expect(styleAttributes({ aug: { tl: "clip" } })).toStrictEqual({
    "data-augmented-ui": "tl-clip",
  });
});

test("theme emits inline custom properties and no attribute", () => {
  expect(
    styleAttributes({ theme: { inkInverse: "#fff", surfaceFloat: "rgb(0 0 0 / 0.5)" } }),
  ).toStrictEqual({
    style: { "--theme-ink-inverse": "#fff", "--theme-surface-float": "rgb(0 0 0 / 0.5)" },
  });
});

test("theme keys cover constants and shadow geometry", () => {
  expect(
    styleAttributes({
      theme: { lineWidth: "0.5px", shadowFloatGeometry: "0 0 12px 0", shadowFloatColor: "cyan" },
    }),
  ).toStrictEqual({
    style: {
      "--theme-line-width": "0.5px",
      "--theme-shadow-float-geometry": "0 0 12px 0",
      "--theme-shadow-float-color": "cyan",
    },
  });
});

test("theme and aug custom properties coexist", () => {
  const attributes = styleAttributes({
    aug: { tl: { mixin: "clip", size: "8px" }, border: "1px" },
    theme: { line: "cyan" },
  });
  expect(attributes.style).toStrictEqual({
    "--aug-tl": "8px",
    "--aug-border-all": "1px",
    "--theme-line": "cyan",
  });
  expect(attributes["data-augmented-ui"]).toBe("tl-clip border");
});

test("component style wins over theme and aug vars", () => {
  const { style } = styleAttributes(
    { aug: { border: "2px" }, theme: { line: "cyan", ink: "red" } },
    { "--theme-line": "blue", "--aug-border-all": "9px", color: "red" },
  );
  expect(style).toStrictEqual({
    "--aug-border-all": "9px",
    "--theme-line": "blue",
    "--theme-ink": "red",
    color: "red",
  });
});

test("a string style keeps its own declarations after theme and aug vars", () => {
  const props = { aug: { border: "2px" }, theme: { line: "cyan" } } satisfies {
    aug: AugProps;
    theme: ThemeProps;
  };
  expect(styleAttributes(props, "color:red;").style).toBe(
    "--aug-border-all:2px;--theme-line:cyan;color:red",
  );
  expect(styleAttributes({ theme: { line: "cyan" } }, "").style).toBe("--theme-line:cyan");
});

test("empty theme and aug objects emit nothing", () => {
  expect(styleAttributes({ aug: {}, theme: {} })).toStrictEqual({});
  expect(styleAttributes({ theme: {} }, { color: "red" })).toStrictEqual({
    style: { color: "red" },
  });
  expect(styleAttributes({ theme: { ink: undefined } })).toStrictEqual({});
});

test("theme alone leaves the style object it was given untouched", () => {
  const style = { color: "red" };
  styleAttributes({ theme: { ink: "blue" } }, style);
  expect(style).toStrictEqual({ color: "red" });
});

test("the types reject theme keys outside the token table", () => {
  // @ts-expect-error unknown token key
  const unknownKey: ThemeProps = { inkk: "red" };
  // @ts-expect-error css names are not keys, camelCase is
  const cssName: ThemeProps = { "ink-inverse": "red" };
  // @ts-expect-error values are strings
  const numeric: ThemeProps = { lineWidth: 1 };
  expect([unknownKey, cssName, numeric]).toHaveLength(3);
});

test("a theme ink also colors the element and a style color replaces it", () => {
  expect(styleAttributes({ theme: { ink: "red" } })).toStrictEqual({
    style: { "--theme-ink": "red", color: "var(--theme-ink)" },
  });
  expect(styleAttributes({ theme: { ink: "red" } }, { color: "blue" })).toStrictEqual({
    style: { "--theme-ink": "red", color: "blue" },
  });
  expect(styleAttributes({ theme: { ink: "red" } }, "padding:0;")).toStrictEqual({
    style: "--theme-ink:red;color:var(--theme-ink);padding:0",
  });
  expect(styleAttributes({ theme: { line: "red" } })).toStrictEqual({
    style: { "--theme-line": "red" },
  });
});
