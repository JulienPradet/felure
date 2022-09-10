import { canvasJp, CanvasJpDrawable, CanvasJpStrokeStyle } from "canvas-jp";
import { devMode } from "canvas-jp/plugins/devMode";
import { exportable } from "canvas-jp/plugins/exportable";
import { seedNavigation } from "canvas-jp/plugins/seedNavigation";
import { inOutBounce, inOutQuad, inOutSine, outSine } from "canvas-jp/ease";
import {
  CanvasJpColorHsv,
  CanvasJpGradient,
  Color,
  Gradient,
  hsvToRgb,
  RadialGradient,
  rgbToHsv,
} from "canvas-jp/Color";
import { CanvasJpPoint, Point } from "canvas-jp/Point";
import {
  isInPolygon,
  Polygon,
  polygonArea,
  PolygonFromRect,
} from "canvas-jp/Polygon";
import {
  CanvasJpShape,
  CanvasJpSmoothShape,
  Shape,
  SmoothShape,
} from "canvas-jp/Shape";
import { getInBetween } from "canvas-jp/position";
import { mapRange, clamp } from "canvas-sketch-util/math";
import { rotate, translateVector } from "canvas-jp/transform";
import { angle } from "canvas-jp/angle";
import { distance } from "canvas-jp/distance";
import { edgesFromPoints } from "canvas-jp/edges";
import { getIntersection } from "canvas-jp/intersection";
import { UpdateImageData } from "canvas-jp/UpdateImageData";
import { Circle } from "canvas-jp/Circle";

const fast = false;

canvasJp(
  document.querySelector("#container") as HTMLElement,
  function* (random, { width: windowWidth, height: windowHeight, resolution }) {
    const width = 1920;
    const height = 1920;

    const center = translateVector(
      mapRange(random.value(), 0, 1, 0.15, 0.25) * Math.min(width, height),
      random.value() * Math.PI * 2,
      Point(width / 2, height / 2)
    );
    //   mapRange(random.value(), 0, 1, 0.3 * width, 0.7 * width),
    //   mapRange(random.value(), 0, 1, 0.3 * height, 0.7 * height)
    // );
    const progressCurve = 0.8;
    const isIrregularGrid = random.value() > 0.17;
    const isGiganticSize = isIrregularGrid && random.value() > 0.995;
    const mainShapeProgressFactor = random.value();

    const isDullLight = !isGiganticSize && random.value() > 0.88;
    const isColorful = random.value() > 0.92;
    let isDarkBackground =
      (!isColorful && !isDullLight) || random.value() > 0.2;

    const isLightPicker = random.value() > 0.15;
    if (isLightPicker) {
      isDarkBackground = false;
    }

    const isColoredBackground = random.value() > 0.2;

    const baseHue =
      isColorful || isColoredBackground
        ? 0
        : isLightPicker
        ? random.gaussian(0, 0.05)
        : random.gaussian(0, 0.1);

    const firstPaletteColors = {
      darkBlue: Color(baseHue + 214 / 360, 0.56 * 1.05, 0.5 * 0.9),
      greyBlue: Color(baseHue + 178 / 360, 0.15 * 1.05, 0.65 * 0.9),
      red: Color(baseHue + 5 / 360, 0.65, 0.72),
      yellow: Color(baseHue + 41 / 360, 0.64 * 0.95, 1 * 0.9),
      beige: Color(baseHue + 37 / 360, 0.17 * 1.05, 0.99 * 0.85), // this one must be last for psychedelic
    };
    const secondPaletteColors = {
      red: Color(baseHue + 265 / 360, 0.53, 0.52),
      green: Color(baseHue + 78 / 360, 0.73, 0.75),
      dark: Color(baseHue + 180 / 360, 0.34, 0.25 * (isLightPicker ? 1.8 : 1)),
      orange: Color(baseHue + 18 / 360, 0.82, 0.95),
      white: Color(baseHue + 40 / 360, 0.57, 0.99),
    };
    const thirdPaletteColors = {
      red: Color(0.96, 0.65, 0.85),
      purple: Color(0.435, 0.4, 0.85),
      blue: Color(0.68, 0.2, 0.58),
      white: Color(0.24, 0.2, 0.97),
      //   black: Color(40 / 360, 0.05, 0.1),
    };
    const paletteColors = random.pick(
      new Array<{ [key in string]: CanvasJpColorHsv }>().concat([
        secondPaletteColors,
        firstPaletteColors,
        thirdPaletteColors,
      ])
    );

    const palette = Object.values(
      //   firstPaletteColors
      paletteColors
    );

    const pickedBackground = random.pick(palette);
    // pickedBackground.s = pickedBackground.s * 0.8;
    // pickedBackground.v = pickedBackground.v * 1.1;

    let mainHue = random.value();
    // if (0.6 < mainHue && mainHue < 0.8) {
    //   mainHue = random.value();
    // }

    const white = Color(mainHue, 0.03, 0.99);
    const black = Color(mainHue, 0.4, 0.18);
    let blackAndWhitePalette = [white, black];

    const gradientAngle = random.value() * Math.PI * 2;
    const hasGradient = isColorful || random.value() > 0.05;
    const gradientStrength = Math.pow(random.value(), 0.3);
    const hasCellGradientHomogeneity = random.value() > 0.2;

    const threshold = isDarkBackground ? 0.4 : 0.2;

    const smoothFactor = 0.01 * (isGiganticSize ? 1.3 : 1);

    const invertProgress = random.value() > 0.95;

    Color.mix.fxname = "Default";

    function oppositeMix(
      colorA: CanvasJpColorHsv,
      colorB: CanvasJpColorHsv,
      factor: number
    ): CanvasJpColorHsv {
      let hueA = colorA.h;
      let hueB = colorB.h;
      if (hueA - hueB > threshold) {
        hueB += 1;
      } else if (hueB - hueA > threshold) {
        hueA += 1;
      }
      return Color(
        (hueA * factor + hueB * (1 - factor)) % 1,
        colorA.s * factor + colorB.s * (1 - factor),
        colorA.v * factor + colorB.v * (1 - factor)
      );
    }
    oppositeMix.fxname = "clickwiseMix";

    function randomMix(
      colorA: CanvasJpColorHsv,
      colorB: CanvasJpColorHsv,
      factor: number
    ): CanvasJpColorHsv {
      return random.pick([Color.mix, oppositeMix])(colorA, colorB, factor);
    }
    randomMix.fxname = "Glitch";

    type ColorMixer = (
      colorA: CanvasJpColorHsv,
      colorB: CanvasJpColorHsv,
      factor: number
    ) => CanvasJpColorHsv;

    const rgbMix = (
      colorA: CanvasJpColorHsv,
      colorB: CanvasJpColorHsv,
      factor: number
    ) => {
      const rgbA = hsvToRgb(colorA.h, colorA.s, colorA.v);
      const rgbB = hsvToRgb(colorB.h, colorB.s, colorB.v);

      const normalMix = Color.mix(colorA, colorB, factor);

      const rgbResult = Color(
        ...rgbToHsv(
          rgbA[0] * factor + rgbB[0] * (1 - factor),
          rgbA[1] * factor + rgbB[1] * (1 - factor),
          rgbA[2] * factor + rgbB[2] * (1 - factor)
        )
      );

      return Color(
        rgbResult.h,
        rgbResult.s * 0.4 + normalMix.s * 0.6,
        rgbResult.v
      );
    };

    const colorMixer: ColorMixer = random.pick(
      new Array<ColorMixer>()
        .concat(new Array(10).fill(oppositeMix))
        .concat(new Array(10).fill(Color.mix))
        .concat(new Array(isLightPicker ? 1 : 10).fill(randomMix))
    );

    function blackAndWhite(): ReturnType<ColorPicker> {
      const mainColor = isDarkBackground || !isLightPicker ? black : white;
      const secondColor = random.pick(
        blackAndWhitePalette.filter((color) => color !== mainColor)
      );
      return {
        name: "black&white",
        getBackgroundColor: () => mainColor,
        getMainColor: () => mainColor,
        getSecondColor: (mainColor: CanvasJpColorHsv) => secondColor,
      };
    }

    function multicolor(): ReturnType<ColorPicker> {
      const mainColor = isColorful
        ? firstPaletteColors.beige
        : random.pick(palette);
      return {
        name: "multicolor",
        getBackgroundColor: () => mainColor,
        getMainColor: () => mainColor,
        getSecondColor: (mainColor: CanvasJpColorHsv) =>
          random.pick(palette.filter((color) => color !== mainColor)),
      };
    }

    const darkBackground = Color(270 / 360, 0.53, 0.1);

    function multicolorDarkBackground(): ReturnType<ColorPicker> {
      const mainColor = darkBackground;
      return {
        name: "multicolor",
        getBackgroundColor: () => mainColor,
        getMainColor: () => mainColor,
        getSecondColor: (mainColor: CanvasJpColorHsv) =>
          random.pick(palette.filter((color) => color !== mainColor)),
      };
    }

    function psychedelic(): ReturnType<ColorPicker> {
      return {
        name: "psychedelic",
        getBackgroundColor: () => palette[palette.length - 1],
        getMainColor: () => random.pick(palette),
        getSecondColor: (mainColor: CanvasJpColorHsv) =>
          random.pick(palette.filter((color) => color !== mainColor)),
      };
    }

    function psychedelicDark(): ReturnType<ColorPicker> {
      return {
        name: "psychedelic",
        getBackgroundColor: () => darkBackground,
        getMainColor: () => random.pick(palette),
        getSecondColor: (mainColor: CanvasJpColorHsv) =>
          random.pick(palette.filter((color) => color !== mainColor)),
      };
    }

    const duochromeBackground = isLightPicker
      ? isColoredBackground
        ? pickedBackground
        : random.pick(palette)
      : darkBackground;

    const duochromeColorOptions = palette.filter(
      (color) =>
        Math.abs(color.v - duochromeBackground.v) > 0.2 &&
        Math.abs(color.s - duochromeBackground.s) > 0.2
    );

    function duochrome(): ReturnType<ColorPicker> {
      const firstColor = random.pick(duochromeColorOptions);
      const secondColor = random.pick(
        duochromeColorOptions
          .filter((color) => color !== firstColor)
          .concat(
            hasGradient &&
              (!hasCellGradientHomogeneity || gradientStrength > 0.2)
              ? []
              : [blackAndWhitePalette[0]]
          )
      );
      const colors = [firstColor, firstColor, firstColor, secondColor];

      return {
        name: "duochrome",
        getBackgroundColor: () => duochromeBackground,
        getMainColor: () => random.pick(colors),
        getSecondColor: (mainColor: CanvasJpColorHsv) => random.pick(colors),
      };
    }

    type ColorPicker = () => {
      name: string;
      getBackgroundColor: () => CanvasJpColorHsv;
      getMainColor: () => CanvasJpColorHsv;
      getSecondColor: (
        mainColor: CanvasJpColorHsv,
        progress: number
      ) => CanvasJpColorHsv;
    };

    const makeColorPickerFactory: () => ColorPicker = () =>
      colorMixer === randomMix
        ? psychedelic
        : random.pick(
            new Array<ColorPicker>()
              .concat(
                new Array(isLightPicker || isColorful ? 0 : 3).fill(
                  blackAndWhite
                )
              )
              .concat(
                new Array(
                  duochromeColorOptions.length < 2
                    ? //    ||
                      //   (!isLightPicker && !isDarkBackground) ||
                      //   (!isLightPicker && isColorful) ||
                      //   (isDarkBackground && Math.abs(baseHue) > 0.1)
                      0
                    : 40
                ).fill(duochrome)
              )
              .concat(new Array(isColorful ? 0 : 16).fill(multicolor))
              .concat(new Array(4).fill(multicolorDarkBackground))
              .concat(new Array(isColorful ? 0 : 16).fill(psychedelic))
              .concat(new Array(4).fill(psychedelicDark))
          );

    const colorPickerFactory = makeColorPickerFactory();

    const coreColorPicker = colorPickerFactory();

    function testPicker(): ReturnType<ColorPicker> {
      const darkSaturation =
        !isColorful && isDarkBackground
          ? mapRange(
              Math.pow(random.value(), 3),
              0,
              1,
              0.1,
              colorMixer === rgbMix ? 0.3 : 0.5
            )
          : 0.5;
      const darkValue = mapRange(darkSaturation, 0.1, 0.5, 0.1, 0.06);

      const mainColor = coreColorPicker.getMainColor();

      const backgroundColor = isColorful
        ? coreColorPicker.getBackgroundColor()
        : isDarkBackground
        ? Color(mainHue, darkSaturation, darkValue)
        : Color(mainHue, 0.1, 0.98);

      const dullColor = isColorful
        ? mainColor
        : isDarkBackground
        ? Color(
            mainHue,
            isDullLight
              ? Math.max(0.0, coreColorPicker.getBackgroundColor().s * 0.2)
              : 0.13,
            isDullLight
              ? Math.max(0.08, coreColorPicker.getBackgroundColor().v * 0.2)
              : Math.max(
                  backgroundColor.v + random.gaussian(0.05, 0.02),
                  backgroundColor.v
                )
          )
        : Color(mainHue, 0.05, 0.96);

      return {
        name: "test",
        getBackgroundColor: () => backgroundColor,
        getMainColor: () => dullColor,
        getSecondColor(mainColor, progress) {
          const easedProgress = clamp(random.gaussian(progress, 0.01), 0, 1);

          if (isColorful && isDullLight) {
            const color = coreColorPicker.getSecondColor(
              mainColor,
              easedProgress
            );
            return colorMixer(backgroundColor, color, Math.pow(progress, 1));
          }

          let secondColor = isDarkBackground
            ? Color(
                (random.gaussian(coreColorPicker.getMainColor().h, 0.1) + 1) %
                  1,
                dullColor.s,
                dullColor.v
              )
            : Color(
                random.gaussian(
                  coreColorPicker.getMainColor().h * 0.5 + mainHue * 0.5,
                  0.1
                ),
                dullColor.s,
                dullColor.v
              );
          let mixFactor = Math.pow(easedProgress, 0.9);
          let saturationFactor = 0.6;
          let valueFactor = 0.8;
          let saturationDim = 0;

          if (isNaN(mixFactor)) {
            console.log("here?");
          }

          if (
            isDullLight ||
            (easedProgress < random.gaussian(0.2, 0.05) &&
              random.value() > 0.15) ||
            random.value() > 0.99
          ) {
            secondColor = coreColorPicker.getSecondColor(
              coreColorPicker.getMainColor(),
              progress
            );
            mixFactor = clamp(2 * mixFactor, 0, 1);
            saturationFactor = isDullLight
              ? mapRange(easedProgress, 0, 1, 0.2, 0.6)
              : 0.8;
            saturationDim = 0.2;
          } else if (
            (easedProgress < random.gaussian(0.4, 0.05) &&
              random.value() > 0.3) ||
            random.value() > 0.95
          ) {
            secondColor = coreColorPicker.getSecondColor(
              coreColorPicker.getMainColor(),
              clamp(mapRange(easedProgress, 0.2, 0.4, 0, 1), 0, 1)
            );
            mixFactor = mapRange(
              clamp(
                Math.pow(
                  clamp(mapRange(easedProgress, 0.2, 0.4, 0, 1), 0, 1),
                  0.1
                ),
                0,
                1
              ),
              0,
              1,
              0.4,
              1
            );
            saturationFactor = mapRange(mixFactor, 0.4, 1, 0.5, 0);
            valueFactor = mapRange(mixFactor, 0.4, 1, 0.6, 0.8);
          }

          const mixed = colorMixer(
            mainColor,
            Color(
              secondColor.h + random.gaussian(0, 0.05),
              secondColor.s,
              secondColor.v
            ),
            mixFactor
          );

          const saturation =
            colorPickerFactory === blackAndWhite
              ? 0.05
              : clamp(
                  (mixed.s * (1 - saturationFactor) +
                    secondColor.s * saturationFactor) *
                    (1 - saturationDim),
                  0,
                  1
                );
          const value = clamp(
            (secondColor.v * (1 - valueFactor) + mixed.v * valueFactor) * 1.05,
            0,
            1
          );

          return Color(clamp(mixed.h, 0, 1), saturation, value);
        },
      };
    }

    const lightPicker: ColorPicker = () => {
      //   const background = coreColorPicker.getBackgroundColor();
      //   const background = Color(
      //     backgroundBaseColor.h,
      //     clamp(backgroundBaseColor.s * 0.8, 0, 1),
      //     clamp(backgroundBaseColor.v * 1.3, 0, 1)
      //   );
      const background = isColoredBackground
        ? pickedBackground
        : colorPickerFactory === blackAndWhite
        ? coreColorPicker.getBackgroundColor()
        : colorPickerFactory === multicolorDarkBackground ||
          colorPickerFactory === psychedelicDark
        ? coreColorPicker.getBackgroundColor()
        : Color(33 / 360, 0.21, 0.99);
      return {
        getBackgroundColor: () => background,
        getMainColor: () => coreColorPicker.getMainColor(),
        getSecondColor: (mainColor, progress) => {
          const easedProgress = clamp(random.gaussian(progress, 0.01), 0, 1);

          const color = coreColorPicker.getSecondColor(mainColor, progress);

          const dullLight = colorMixer(
            background,
            coreColorPicker.getMainColor(),
            0.9
          );

          if (
            easedProgress < random.gaussian(0.25, 0.05) &&
            random.value() > 0.2
          ) {
            return colorMixer(color, background, 1 - progress);
          } else {
            return rgbMix(
              dullLight,
              colorMixer(
                dullLight,
                color,
                clamp(random.gaussian(Math.pow(1 - progress, 0.3), 0.1), 0, 1)
              ),
              0.9
            );
          }
        },
        name: "lightPicker",
      };
    };

    const colorPicker = isLightPicker ? lightPicker() : testPicker();

    const amountOfCells =
      !isIrregularGrid || isGiganticSize
        ? 1
        : mapRange(Math.pow(random.value(), 10), 0, 1, 1, 3);
    const row = Math.round(
      Math.max(
        4,
        Math.ceil(mapRange(random.value(), 0, 1, height / 500, height / 200))
      ) *
        (4 * amountOfCells)
    );
    const column = Math.round(
      Math.max(
        4,
        Math.ceil(mapRange(random.value(), 0, 1, width / 500, width / 200))
      ) *
        (4 * amountOfCells)
    );

    const minGridMargin = 0;
    // width / 10 / Math.max(row, column);
    const maxGridMargin =
      Math.min(width / column, height / row) * (isIrregularGrid ? 0.1 : 0.1);
    const gridMargin = mapRange(
      Math.pow(random.value(), 5),
      0,
      1,
      minGridMargin,
      maxGridMargin
    );
    const cellHeight = (height - (row - 1) * gridMargin) / row;
    const cellWidth = (width - (column - 1) * gridMargin) / column;

    // const maxColumns = Math.round(mapRange(random.value(), 0, 1, 2, 6));
    // const maxRows = Math.round(mapRange(random.value(), 0, 1, 2, 6));

    const bigCellsRatio =
      !isIrregularGrid || isGiganticSize ? 6 : 6 * amountOfCells;
    const maxColumns = isIrregularGrid
      ? isGiganticSize
        ? Math.floor(Math.min(column, row) * 0.8)
        : Math.max(2, Math.floor(Math.max(column, row * 0.7) / bigCellsRatio))
      : 1;
    const maxRows = isIrregularGrid
      ? isGiganticSize
        ? Math.floor(Math.min(column, row) * 0.8)
        : Math.max(2, Math.floor(Math.max(column * 0.7, row) / bigCellsRatio))
      : 1;

    const splitDistance =
      random.value() > 0.02
        ? (Math.min(cellHeight, cellWidth) /
            mapRange(
              Math.pow(random.value(), 0.3),
              0,
              1,
              isIrregularGrid ? 160 : 160,
              200
            )) *
          (isDullLight ? 0.7 : 1)
        : 0;

    const offsetFactor = mapRange(random.value(), 0, 1, 10, 20);

    const progressPrecision = mapRange(random.value(), 0, 1, 0.0003, 0.001);

    let perlinMin = 1;
    let perlinMax = 0;
    for (let x = 0.2; x < 0.8; x += 0.05) {
      for (let y = 0.3; y < 0.7; y += 0.05) {
        let noiseValue = random.noise2D(
          x,
          y,
          progressPrecision * Math.min(width, height)
        );
        perlinMin = Math.min(perlinMin, noiseValue);
        perlinMax = Math.max(perlinMax, noiseValue);
      }
    }

    const perlinProgress = (x: number, y: number): number => {
      return Math.pow(
        clamp(
          mapRange(
            random.noise2D(
              x / Math.min(width, height),
              y / Math.min(width, height),
              progressPrecision * Math.min(width, height)
            ),
            perlinMin * mapRange(random.value(), 0, 1, 0.8, 1),
            perlinMax * mapRange(random.value(), 0, 1, 1, 1.2),
            0,
            1
          ),
          0,
          1
        ),
        0.5
      );
    };
    perlinProgress.fxname = "Noise";

    const randomProgress = (x: number, y: number): number => {
      return mapRange(random.value(), 0, 1, 0, 0.1);
    };
    randomProgress.fxname = "Random";

    const radius =
      Math.min(width, height) * mapRange(random.value(), 0, 1, 0.12, 0.3);

    const circleProgress = (x: number, y: number): number => {
      try {
        const radiusForProgress =
          radius *
          mapRange(
            Math.abs(
              random.noise1D((angle(center, Point(x, y)) / (Math.PI * 2)) * 2)
            ),
            0,
            1,
            1,
            1.1
          );
        const secondCut = radiusForProgress * 2.3;

        const d = distance(center, Point(x, y));
        const progress = clamp(
          d < random.gaussian(radiusForProgress, 0.05)
            ? Math.pow(
                clamp(mapRange(d, 0, radiusForProgress, 1, 0), 0, 1),
                0.3
              )
            : d < random.gaussian(secondCut, 0.05)
            ? Math.pow(
                clamp(mapRange(d, radiusForProgress, secondCut, 0, 0.8), 0, 1),
                0.4
              )
            : mapRange(d, secondCut, radiusForProgress * 4, 0.5, 1),
          0,
          1
        );

        const circleValue = Math.pow(clamp(progress, 0, 1), 1.1);

        if (isNaN(progress)) {
          console.log("circle", d, radiusForProgress, secondCut);
        }

        return clamp(circleValue, 0, 1);
      } catch (e) {
        console.log(x, y);
        throw e;
      }
    };
    circleProgress.fxname = "Circle";

    const rosaceProgress = () => {
      const radius = (1400 / 4) * random.gaussian(1, 0.1);
      const numberOfCircles = Math.round(mapRange(random.value(), 0, 1, 2, 6));
      const phase = random.value() * Math.PI * 2;
      const cutAboveRadius = mapRange(random.value(), 0, 1, 1, 8);

      const circles = new Array(numberOfCircles).fill(null).map((_, index) => {
        const progress = index / numberOfCircles;
        const angle = progress * Math.PI * 2 + phase;

        return {
          radius: radius * 1.4,
          center: translateVector(radius, angle, center),
        };
      });

      const progress = (x: number, y: number): number => {
        const distanceFromRosace = Math.min(
          ...circles.map(({ center, radius }) => {
            radius = radius * 1.1;
            const d = distance(center, Point(x, y));

            return d < radius
              ? Math.pow(1 - d / radius, 0.4)
              : Math.pow((d - radius) / radius, 0.4);
          })
        );

        const factor = Math.pow(1 - distanceFromRosace, 2);
        const rosaceProgress =
          Math.pow(distanceFromRosace, 1.5) * factor +
          Math.pow(distanceFromRosace, 0.6) * (1 - factor);

        const mainCircleProgress =
          distance(center, Point(x, y)) - radius * cutAboveRadius;

        if (mainCircleProgress > 0) {
          const outerProgress = Math.pow(
            0.5 +
              clamp(
                mainCircleProgress / (radius * 2),
                0,
                Number.MAX_SAFE_INTEGER
              ) *
                0.5,
            0.1
          );

          return Math.pow(
            rosaceProgress * (1 - factor) + outerProgress * factor,
            0.6
          );
        } else {
          return Math.pow(rosaceProgress, 0.7);
        }
      };

      progress.fxname = "Rosace";
      return progress;
    };

    const sineCircleProgress = () => {
      const frequency = mapRange(random.value(), 0, 1, 2.5, 4.5);
      const circles: CanvasJpPoint[] = [center];
      if (
        random.value() > 0.2 &&
        distance(center, Point(width / 2, height / 2)) >
          Math.min(width, height) / 7
      ) {
        circles.push(
          translateVector(
            distance(center, Point(width / 2, height / 2)) * 2,
            angle(center, Point(width / 2, height / 2)),
            center
          )
        );
      }
      const progress = (x: number, y: number): number => {
        return Math.min(
          ...circles.map((center, index) => {
            const angleForCenter = angle(Point(x, y), center);
            const distanceProgress = distance(Point(x, y), center) / 1080;
            if (isNaN(angleForCenter) || isNaN(distanceProgress)) {
              console.log("HERE", x, y);
            }
            const distanceFromCenter = clamp(
              (distance(Point(x, y), center) *
                mapRange(
                  random.noise1D(angleForCenter + distanceProgress),
                  -1,
                  1,
                  0.93,
                  1.07
                )) /
                (1080 * 0.7),
              0,
              1
            );

            const wave =
              Math.abs(
                Math.cos(Math.pow(distanceFromCenter, 1) * Math.PI * frequency)
              ) *
              (circles.length === 1
                ? 1
                : mapRange(index / (circles.length - 1), 0, 1, 0.9, 1));

            const linear = mapRange(
              Math.pow(distanceFromCenter, 2),
              0,
              1,
              0,
              1
            );

            return clamp(wave * (1 - linear) + 1 * linear, 0, 1);
          })
        );
      };

      progress.fxname = "Wave";
      return progress;
    };

    const heliceProgress = () => {
      const heliceStrength = mapRange(random.value(), 0, 1, 0.45, 0.7);
      const numberOfDivisions = Math.ceil(mapRange(random.value(), 0, 1, 1, 4));
      const phase = random.value() * Math.PI * 2;
      const angleModulo = (Math.PI * 2) / numberOfDivisions;
      const maxDistance = Math.max(
        ...[
          Point(0, 0),
          Point(width, 0),
          Point(0, height),
          Point(width, height),
        ].map((corner) => distance(center, corner))
      );
      const referenceDistance = maxDistance * 2;
      const progress = (x: number, y: number): number => {
        const distanceFromCenter =
          distance(center, Point(x, y)) / referenceDistance;

        const angleFromCenter =
          angle(center, Point(x, y)) +
          Math.PI * 2 +
          random.gaussian(
            Math.pow(distanceFromCenter, 0.5) * Math.PI * heliceStrength,
            0.01
          ) +
          phase +
          random.noise1D(Math.pow(distanceFromCenter, 1) * 2.3) * 0.5;

        let progress = 1;
        const baseCut = Math.min(random.gaussian(0.05, 0.05), 0.1);
        if (distanceFromCenter < baseCut) {
          progress = randomProgress(x, y) * 0.1;
        } else if (
          angleFromCenter % angleModulo <
          random.gaussian(angleModulo * 0.5, 0.04)
        ) {
          const emptySpaceCut = 0.1;
          progress =
            clamp(random.gaussian(1, 0.1), 0, 1) *
            (distanceFromCenter < emptySpaceCut
              ? Math.pow(
                  mapRange(distanceFromCenter, 0, emptySpaceCut, 0, 1),
                  0.3
                )
              : Math.pow(
                  1 - mapRange(distanceFromCenter, emptySpaceCut, 1, 0, 1),
                  0.3
                ));
        } else {
          progress =
            Math.pow(mapRange(distanceFromCenter, baseCut, 1, 0, 1), 0.3) * 0.6;
        }

        return clamp(progress, 0, 1);
      };
      progress.fxname = "Helix";
      return progress;
    };

    const churchProgress = () => {
      const numberOfWindows = clamp(
        Math.round(random.gaussian(6, 0.5) / 2) * 2 + 1,
        3,
        Number.MAX_SAFE_INTEGER
      );
      let paddingHorizontal = (cellWidth + gridMargin) * 2;
      let paddingVertical = (cellHeight + gridMargin) * 2;

      const widthRatio = mapRange(random.value(), 0, 1, 0.4, 0.8);
      const heightRatio = mapRange(random.value(), 0, 1, 0.6, 0.8);

      const windowWidth =
        ((width - 2 * paddingHorizontal) / numberOfWindows -
          paddingHorizontal) *
        widthRatio;
      const windowHeight = 780;

      paddingHorizontal =
        (width - windowWidth * numberOfWindows) / (numberOfWindows + 1);
      paddingVertical = (1080 - windowHeight) / 2 + (1920 - 1080) / 2;

      const windows = new Array(numberOfWindows).fill(null).map((_, index) => {
        const progress = index / (numberOfWindows - 1);
        const symmetricalProgress = Math.pow(
          progress > 0.5
            ? mapRange(progress, 0.5, 1, 1, 0)
            : mapRange(progress, 0, 0.5, 0, 1),
          2
        );

        return PolygonFromRect(
          paddingHorizontal + (windowWidth + paddingHorizontal) * index,
          paddingVertical +
            windowHeight * mapRange(symmetricalProgress, 0, 1, 0.2, 0),
          windowWidth,
          windowHeight * mapRange(symmetricalProgress, 0, 1, 0.6, 1)
        );
      });

      const distanceFromClosestPoint = (x, y) => {
        return Math.min(
          ...windows.map((window) => {
            return Math.min(
              ...window.points.map((point) => distance(point, Point(x, y)))
            );
          }),
          ...windows.map((window) => {
            const cornerBottomLeft = window.points[0];
            const cornerTopRight = window.points[2];
            return Math.min(
              x < cornerBottomLeft.x &&
                y > cornerBottomLeft.y &&
                y < cornerTopRight.y
                ? Math.abs(x - cornerBottomLeft.x)
                : Number.MAX_SAFE_INTEGER,
              x > cornerTopRight.x &&
                y > cornerBottomLeft.y &&
                y < cornerTopRight.y
                ? Math.abs(x - cornerTopRight.x)
                : Number.MAX_SAFE_INTEGER,

              y < cornerBottomLeft.y &&
                x > cornerBottomLeft.x &&
                x < cornerTopRight.x
                ? Math.abs(y - cornerBottomLeft.y)
                : Number.MAX_SAFE_INTEGER,
              y > cornerTopRight.y &&
                x > cornerBottomLeft.x &&
                x < cornerTopRight.x
                ? Math.abs(y - cornerTopRight.y)
                : Number.MAX_SAFE_INTEGER
            );
          })
        );
      };

      const progress = (x: number, y: number): number => {
        return windows.some((window) => isInPolygon(window, Point(x, y)))
          ? 0
          : Math.pow(
              distanceFromClosestPoint(x, y) /
                Math.min(
                  (windowWidth / widthRatio - windowWidth) / 2 +
                    paddingHorizontal / 2,
                  (windowHeight / heightRatio - windowHeight) / 2 +
                    paddingVertical / 2
                ),
              0.3
            );
      };

      progress.fxname = "Stained Glass";
      return progress;
    };

    const treesProgress = () => {
      const numberOfRows = Math.round(mapRange(random.value(), 0, 1, 2, 5));

      const trees = new Array(numberOfRows).fill(null).flatMap((_, index) => {
        const rowProgress = index / numberOfRows;
        const numberOfTrees = clamp(
          Math.round(random.gaussian(index * 5 + 3, 2)),
          2,
          Number.MAX_SAFE_INTEGER
        );

        return new Array(numberOfTrees).fill(null).map((_, index) => {
          const progress = random.gaussian(index / (numberOfTrees - 1), 0.05);
          const treeWidth =
            (mapRange(random.value(), 0, 1, 0.4, 0.8) * width) / numberOfTrees;
          const treeHeight =
            mapRange(random.value(), 0, 1, 0.3, 0.5) * height +
            rowProgress * height * 0.7;
          return {
            shape: Polygon([
              Point(width * progress - treeWidth, 0),
              Point(
                width * progress +
                  treeWidth * mapRange(random.value(), 0, 1, -0.5, 0.5),
                treeHeight
              ),
              Point(width * progress + treeWidth, 0),
            ]),
            value: Math.pow(rowProgress, 0.7),
          };
        });
      });

      const progress = (x: number, y: number): number => {
        const point = Point(x, y);
        const tree = trees.find((tree) => isInPolygon(tree.shape, point));
        return tree ? tree.value : 1;
      };
      progress.fxname = "Forest";
      return progress;
    };

    const bombProgress = () => {
      const center = rotate(
        Point(width / 2, height / 2),
        (Math.PI / 2) * Math.floor(random.value() * 4),
        Point(width / 2, height / 3)
      );
      const progress = (x: number, y: number): number => {
        return inOutBounce(
          clamp(
            distance(Point(x, y), center) /
              distance(center, Point(0, height / 2)),
            0,
            1
          )
        );
      };

      progress.fxname = "Inner";

      return progress;
    };

    const shapeProgress = () => {
      const numberOfEdges = Math.ceil(mapRange(random.value(), 0, 1, 2, 4));

      const radius = mapRange(random.value(), 0, 1, 1080 / 3, 1080 / 1.5);
      const phase = random.value() * Math.PI * 2;
      const shape = Polygon(
        new Array(numberOfEdges).fill(null).map((_, index) => {
          const progress = index / numberOfEdges;
          const angle = progress * Math.PI * 2 + phase;
          return Point(
            center.x + radius * Math.cos(angle),
            center.y + radius * Math.sin(angle)
          );
        })
      );

      const progress = (x: number, y: number): number => {
        return isInPolygon(shape, Point(x, y))
          ? 0
          : Math.pow(clamp(distance(center, Point(x, y)) / 1000, 0, 1), 0.3);
      };

      progress.fxname = "Shape";

      return progress;
    };

    const progressOptions = isGiganticSize
      ? [perlinProgress]
      : new Array<(x: number, y: number) => number>()
          .concat(
            new Array(amountOfCells > 1.1 ? 0 : isIrregularGrid ? 60 : 10).fill(
              perlinProgress
            )
          )
          .concat(new Array(isIrregularGrid ? 14 : 7).fill(circleProgress))
          .concat(new Array(isDullLight ? 0 : 7).fill(rosaceProgress()))
          .concat(
            new Array(isIrregularGrid ? 10 : 2).fill(sineCircleProgress())
          )
          .concat(new Array(invertProgress ? 0 : 3).fill(bombProgress()))
          .concat(
            new Array(!isIrregularGrid || invertProgress ? 0 : 3).fill(
              shapeProgress()
            )
          )
          //   .concat(new Array(isIrregularGrid ? 10 : 0).fill(heliceProgress()))
          .concat(
            new Array(isDullLight ? 0 : isIrregularGrid ? 6 : 3).fill(
              churchProgress()
            )
          )
          .concat(
            new Array(isIrregularGrid && hasGradient ? 6 : 0).fill(
              treesProgress()
            )
          );
    const progressForm = random.pick(progressOptions);

    const getProgress = (x: number, y: number): number => {
      const progress = Math.pow(
        clamp(
          random.gaussian(
            progressForm(x, y) * 0.8 +
              perlinProgress(x, y) * 0.1 +
              randomProgress(x, y) * 0.1,
            0.02
          ),
          0,
          1
        ),
        invertProgress ? 0.8 : 2
      );

      if (invertProgress) {
        return 1 - progress;
      } else {
        return progress;
      }
    };

    const randomNumberOfSplits = random.value();
    const shouldIncreaseNumberOfSplits =
      isGiganticSize ||
      progressForm.fxname === "Rosace" ||
      progressForm.fxname === "Wave";
    const numberOfSplits = Math.max(
      2,
      Math.round(
        mapRange(
          Math.pow(randomNumberOfSplits, 0.8),
          0,
          1,
          shouldIncreaseNumberOfSplits ? 3 : 1,
          shouldIncreaseNumberOfSplits ? 6 : 3.5
        ) * mapRange(random.value(), 0, 1, 1, amountOfCells)
      ) *
        (isGiganticSize
          ? 5
          : Math.pow(clamp(Math.min(maxColumns, maxRows) / 4, 0, 1), 0.5))
    );

    const rect = PolygonFromRect(0, 0, width, height).toShape(undefined, {
      color: black,
      opacity: 0.4,
      width: 1,
      style: CanvasJpStrokeStyle.round,
    });

    const makeShape = (
      shape: CanvasJpShape,
      newPoints: CanvasJpPoint[]
    ): CanvasJpShape => {
      if (shape.__type === "SmoothShape") {
        return SmoothShape(
          newPoints,
          shape.smoothness,
          shape.fill,
          shape.stroke
        );
      } else {
        return Shape(newPoints, shape.fill, shape.stroke);
      }
    };

    const shrink = (amount: number, shape: CanvasJpShape): CanvasJpShape => {
      const center = polygonCenter(Polygon(shape.points));

      const maxDistanceFromCenter = Math.max(
        ...shape.points.map((point) => distance(point, center))
      );

      const newPoints = shape.points.map((point) => {
        const distanceFromCenter =
          distance(point, center) / maxDistanceFromCenter;
        return translateVector(
          Math.min(amount * distanceFromCenter),
          angle(point, center),
          point
        );
      });

      return makeShape(shape, newPoints);
    };

    const translateOffset = (
      distance: number,
      angle: number,
      shape: CanvasJpShape
    ): CanvasJpShape => {
      const newPoints = shape.points.map((point) => {
        return translateVector(distance, angle, point);
      });

      return makeShape(shape, newPoints);
    };

    const split = (shape: CanvasJpShape): CanvasJpShape[] => {
      const sides = new Array(shape.points.length)
        .fill(null)
        .map((_, index) => index);

      let firstPick = random.pick(sides);
      let secondPick = random.pick(sides.filter((side) => side !== firstPick));

      const firstSide = Math.min(firstPick, secondPick);
      const secondSide = Math.max(firstPick, secondPick);

      const firstSplit = getInBetween(
        shape.points[firstSide],
        shape.points[(firstSide + 1) % shape.points.length],
        mapRange(random.value(), 0, 1, 0.25, 0.75)
      );
      const secondSplit = getInBetween(
        shape.points[secondSide],
        shape.points[(secondSide + 1) % shape.points.length],
        mapRange(random.value(), 0, 1, 0.25, 0.75)
      );

      return [
        makeShape(shape, [
          ...shape.points.slice(0, firstSide + 1),
          firstSplit,
          secondSplit,
          ...shape.points.slice(secondSide + 1),
        ]),
        makeShape(shape, [
          firstSplit,
          ...shape.points.slice(firstSide + 1, secondSide + 1),
          secondSplit,
        ]),
      ];
    };

    const tiltAmount =
      random.value() > 0.95 && !isGiganticSize
        ? mapRange(random.value(), 0, 1, width / 8, width / 5)
        : 0;
    const transformDirection = random.value() > 0.5 ? -1 : 1;

    const shouldMainSplit = !isGiganticSize && tiltAmount === 0;

    console.table({
      "Color Mixer": colorMixer.name,
      "Color Picker": coreColorPicker.name,
      isDullLight: isDullLight,
      isIrregularGrid,
      isGiganticSize,
      isDarkBackground,
      isColorful,
      mainHue,
      smoothFactor,
      hasGradient,
      gradientStrength,
      hasCellGradientHomogeneity,
      numberOfSplits,
      progressForm: progressForm.fxname,
      shouldMainSplit: shouldMainSplit,
      transformAmount: tiltAmount,
      invertProgress: invertProgress,
      test: "test",
    });

    const mainSplits = new Array(
      Math.round(mapRange(random.value(), 0, 1, 3, 5))
    )
      .fill(null)
      .map(() => {
        const mainCenter = Point(
          mapRange(random.value(), 0, 1, 1 / 6, 5 / 6) * width,
          mapRange(random.value(), 0, 1, 1 / 6, 5 / 6) * height
        );
        const mainWidth =
          mapRange(Math.pow(random.value(), 0.5), 0, 1, 0.15, 0.35) *
          Math.max(width, height);
        const numberOfEdges = Math.ceil(mapRange(random.value(), 0, 1, 2, 4));
        let phase = (random.value() * Math.PI * 2) / numberOfEdges;
        if (phase < 0.1) {
          phase = 0.1;
        }
        return Polygon(
          new Array(numberOfEdges).fill(null).map((_, index) => {
            const progress = index / numberOfEdges;
            const angle = progress * Math.PI * 2 + phase;
            return Point(
              mainCenter.x + mainWidth * Math.cos(angle),
              mainCenter.y + mainWidth * Math.sin(angle)
            );
          })
        );
      });

    const splitShape = (intersectionShape: {
      points: CanvasJpPoint[];
    }): ((shape: CanvasJpShape) => CanvasJpShape[]) => {
      const splitEdges = edgesFromPoints(intersectionShape.points, []);
      return (shape: CanvasJpShape) => {
        const edges = edgesFromPoints(shape.points, []);

        let mainEdgeIndex: number | null = null;
        const intersections = edges.map((edge) => {
          return splitEdges
            .map((mainEdge, index) => {
              if (mainEdgeIndex !== null && index !== mainEdgeIndex) {
                return null;
              }

              const intersection = getIntersection(edge, mainEdge);
              if (intersection) {
                mainEdgeIndex = index;
              }

              return intersection;
            })
            .find((intersection) => intersection !== null);
        });

        if (intersections.filter(Boolean).length < 2) {
          return [shape];
        }

        const firstIntersectionIndex = intersections.findIndex(Boolean);
        const secondIntersectionIndex = intersections.findIndex(
          (point, index) => index !== firstIntersectionIndex && point
        );

        const firstShape = [
          ...shape.points.slice(0, firstIntersectionIndex + 1),
          intersections[firstIntersectionIndex],
          intersections[secondIntersectionIndex],
          ...shape.points.slice(secondIntersectionIndex + 1),
        ] as CanvasJpPoint[];

        const secondShape = [
          intersections[firstIntersectionIndex],
          ...shape.points.slice(
            firstIntersectionIndex + 1,
            secondIntersectionIndex + 1
          ),
          intersections[secondIntersectionIndex],
        ] as CanvasJpPoint[];

        if (
          firstShape.some((point) => isNaN(point.x)) ||
          secondShape.some((point) => isNaN(point.x))
        ) {
          console.log("split", shape);
          console.log("intersections", intersections);

          console.log({
            first: firstShape,
            center: polygonCenter({ points: firstShape }),
          });
          console.log({
            first: secondShape,
            center: polygonCenter({ points: secondShape }),
          });
        }

        return [makeShape(shape, firstShape), makeShape(shape, secondShape)]
          .filter(
            (shape) =>
              !shape.points.every(
                (point) =>
                  point.x === shape.points[0].x && point.y === shape.points[0].y
              )
          )
          .map((cshape, index) => {
            const center = polygonCenter(cshape);
            if (isNaN(center.x)) {
              console.log("center", shape, cshape, index);
            }
            const progress = getProgress(center.x, center.y);

            if (isNaN(progress)) {
              console.log("> progress", progress);
            }

            if (isNaN(shrink(0, cshape).points[0].x)) {
              console.log("shrink", shrink(0, cshape), cshape);
            }

            return shrink(0, cshape);
          });
      };
    };

    const mainSplitShape = (intersectionShape) => {
      return ({ shape, progress, shapeWidth, shapeHeight }) => {
        return splitShape(intersectionShape)(shape).map((shape) => ({
          shape,
          progress,
          shapeWidth,
          shapeHeight,
        }));
      };
    };

    type ShapeDefinition = {
      x: number;
      y: number;
      columns: number;
      rows: number;
    }[];
    let shapeDefinitions: ShapeDefinition = [];

    if (isIrregularGrid) {
      type Grid = boolean[][];
      let grid: Grid = new Array(column)
        .fill(null)
        .map(() => new Array(row).fill(false));

      let x = Math.floor(random.value() * column);
      let y = Math.floor(random.value() * row);
      const easeSizeFactor = 0.1;
      function getCellSize(
        grid: Grid,
        x: number,
        y: number
      ): { columns: number; rows: number } {
        if (random.value() > 0.5) {
          let rows = 0;
          for (rows = 0; rows < maxRows && y + rows < row; rows++) {
            if (grid[x][y + rows]) {
              break;
            }
          }

          if (rows === 0) {
            return { columns: 0, rows: 0 };
          }

          rows = Math.ceil(Math.pow(random.value(), easeSizeFactor) * rows);

          let columns = 0;
          for (
            columns = 0;
            columns < maxColumns && x + columns < column;
            columns++
          ) {
            if (
              new Array(rows)
                .fill(null)
                .some((_, index) => grid[x + columns][y + index])
            ) {
              break;
            }
          }

          if (columns === 0) {
            return { rows: 0, columns: 0 };
          }
          columns = Math.ceil(
            Math.pow(random.value(), easeSizeFactor) * columns
          );

          return { rows, columns };
        } else {
          let columns = 0;
          for (
            columns = 0;
            columns < maxColumns && x + columns < column;
            columns++
          ) {
            if (grid[x + columns][y]) {
              break;
            }
          }

          if (columns === 0) {
            return { columns: 0, rows: 0 };
          }

          columns = Math.ceil(
            Math.pow(random.value(), easeSizeFactor) * columns
          );

          let rows = 0;
          for (rows = 0; rows < maxRows && y + rows < row; rows++) {
            if (
              new Array(columns)
                .fill(null)
                .some((_, index) => grid[x + index][y + rows])
            ) {
              break;
            }
          }

          if (rows === 0) {
            return { rows: 0, columns: 0 };
          }
          rows = Math.ceil(Math.pow(random.value(), easeSizeFactor) * rows);

          return { rows, columns };
        }
      }

      function getFirstEmptyPosition(grid) {
        for (let x = 0; x < column; x++) {
          for (let y = 0; y < row; y++) {
            if (!grid[x][y]) {
              return { x, y };
            }
          }
        }
        return null;
      }

      let shouldContinue = true;
      while (shouldContinue) {
        if (x >= column && y >= row) {
          let emptyPosition = getFirstEmptyPosition(grid);
          if (emptyPosition) {
            x = emptyPosition.x;
            y = emptyPosition.y;
            continue;
          } else {
            shouldContinue = false;
            continue;
          }
        }

        if (x >= column) {
          x = 0;
          y++;
          continue;
        }
        if (grid[x][y]) {
          x++;
          continue;
        }

        let { columns, rows } = getCellSize(grid, x, y);

        if (rows === 0) {
          x++;
          continue;
        }

        for (let i = 0; i < columns; i++) {
          for (let j = 0; j < rows; j++) {
            grid[x + i][y + j] = true;
          }
        }

        // if (random.value() > 0.01) {
        shapeDefinitions.push({
          x,
          y,
          rows,
          columns,
        });
        // }

        x = Math.floor(random.value() * column);
        y = Math.floor(random.value() * row);
      }
    } else {
      shapeDefinitions = new Array(row * column).fill(null).map((_, index) => {
        const x = index % column;
        const y = Math.floor(index / column);
        return {
          x,
          y,
          columns: 1,
          rows: 1,
        };
      });
    }

    let shapes: {
      progress: number;
      shapeWidth: number;
      shapeHeight: number;
      shape: CanvasJpShape;
      color: CanvasJpColorHsv;
      firstColor: CanvasJpColorHsv;
    }[] = shapeDefinitions
      .map(({ x, y, columns, rows }, index) => {
        const shapeX = (cellWidth + gridMargin) * x;
        const shapeY = (cellHeight + gridMargin) * y;

        const shapeWidth = (cellWidth + gridMargin) * columns - gridMargin;
        const shapeHeight = (cellHeight + gridMargin) * rows - gridMargin;

        const progress = getProgress(
          shapeX + shapeWidth / 2,
          shapeY + shapeHeight / 2
        );

        return {
          shape: PolygonFromRect(
            shapeX,
            shapeY,
            shapeWidth,
            shapeHeight
          ).toShape(rect.fill || undefined, rect.stroke || undefined),
          progress,
          shapeWidth,
          shapeHeight,
        };
      })
      .map(({ shape, progress, shapeWidth, shapeHeight }) => {
        const newShape = makeShape(
          shape,
          shape.points.map((point) => {
            const yProgress = point.y / height;
            const tiltedX = point.x + tiltAmount * yProgress;
            const biggerWidthRatio =
              (width + 2 * tiltAmount) / (width - tiltAmount);
            const newX = tiltedX * biggerWidthRatio - 2 * tiltAmount;

            if (transformDirection === -1) {
              return Point((1 - newX / width) * width, point.y);
            } else {
              return Point(newX, point.y);
            }
            // return rotate(Point(width / 2, height / 2), tilt, point);
          })
        );

        return {
          shape: newShape,
          shapeWidth: shapeWidth,
          shapeHeight: shapeHeight,
          progress: 1,
        };
      })
      .flatMap(({ shape, progress, shapeWidth, shapeHeight }) => {
        if (!shouldMainSplit) {
          return [{ shape, progress, shapeWidth, shapeHeight }];
        }

        let result = [{ shape, progress, shapeWidth, shapeHeight }];
        for (let mainSplit of mainSplits) {
          result = result.flatMap(mainSplitShape(mainSplit));
        }
        return result;
      })
      .filter(({ progress }) => {
        return progress !== -1;
      })
      .map(({ shape, progress, shapeWidth, shapeHeight }) => {
        const center = polygonCenter(shape);
        return {
          shape,
          progress: getProgress(center.x, center.y),
          shapeWidth,
          shapeHeight,
        };
      })
      .map(({ shape, progress, shapeWidth, shapeHeight }, index) => {
        const center = polygonCenter(shape);
        const newProgress = getProgress(center.x, center.y);
        const numberOfMainSplitsShapes = mainSplits.reduce(
          (amount, mainSplit) =>
            isInPolygon(mainSplit, center) ? 1 : 0 + amount,
          0
        );
        const factor = Math.pow(
          1 - numberOfMainSplitsShapes / mainSplits.length,
          3
        );
        progress = newProgress * factor;

        // progress = clamp(random.gaussian(outSine(progress), 0.07), 0, 1);
        const color = colorPicker.getMainColor();
        const firstColor = colorPicker.getSecondColor(
          color,
          Math.pow(progress, 1)
        );

        return {
          progress,
          shape,
          shapeWidth,
          shapeHeight,
          color: color,
          firstColor: firstColor,
        };
      });

    for (let i = 0; i < numberOfSplits; i++) {
      shapes = shapes
        .flatMap(
          (
            { shape, progress, shapeWidth, shapeHeight, color, firstColor },
            index
          ) => {
            try {
              if (isNaN(shape.points[0].x)) {
                console.log(shape);
              }
              const center = polygonCenter(Polygon(shape.points));
              const newProgress = getProgress(center.x, center.y);
              if (isNaN(newProgress)) {
                console.log("newProgress", center.x, center.y);
              }
              const newShapes =
                random.value() > random.gaussian(newProgress, 0.1) &&
                polygonArea(shape) >
                  Math.max(
                    cellHeight * maxRows * cellWidth * maxColumns * 0.2,
                    30 * 30
                  )
                  ? split(shape)
                  : [shape];
              return newShapes.map((shape) => ({
                shape,
                progress: Math.pow(newProgress, 2),
                shapeWidth,
                shapeHeight,
                color,
                firstColor,
              }));
            } catch (e) {
              console.log(polygonCenter(Polygon(shape.points)), shape);
              throw e;
            }
          }
        )
        .map(
          ({ shape, progress, shapeWidth, shapeHeight, color, firstColor }) => {
            return {
              progress,
              shape: shrink(splitDistance * (5 - smoothFactor * 50), shape),
              shapeWidth,
              shapeHeight,
              color,
              firstColor,
            };
          }
        )
        .map(
          ({ shape, progress, shapeWidth, shapeHeight, color, firstColor }) => {
            const maxDistance =
              splitDistance *
              offsetFactor *
              mapRange(Math.pow(progress, 0.4), 0, 1, 0.2, 0.1);
            shape = translateOffset(
              mapRange(random.value(), 0, 1, 0, maxDistance),
              mapRange(random.value(), 0, 1, 0, Math.PI * 2),
              shape
            );

            return {
              progress,
              shape,
              shapeWidth,
              shapeHeight,
              color,
              firstColor,
            };
          }
        );
    }

    shapes = shapes.flatMap(
      ({ shape, progress, shapeWidth, shapeHeight, color, firstColor }) => {
        const newShapes =
          random.value() > 0.8 &&
          progress < 0.01 &&
          polygonArea(shape) < (shapeWidth * shapeHeight) / 8
            ? split(shape)
            : [shape];
        return newShapes.map((shape) => ({
          progress,
          shape: shape,
          shapeWidth,
          shapeHeight,
          color,
          firstColor,
        }));
      }
    );

    const makeGradient = (
      color: CanvasJpColorHsv,
      firstColor: CanvasJpColorHsv,
      progress: number
    ): CanvasJpGradient => {
      let gradientStart, gradientEnd;
      if (hasCellGradientHomogeneity) {
        gradientStart = colorMixer(
          firstColor,
          colorPicker.getSecondColor(color, progress),
          1 - gradientStrength
        );
        gradientEnd = colorMixer(
          colorPicker.getSecondColor(color, progress),
          firstColor,
          clamp(random.gaussian(gradientStrength, 0.1), 0, 1)
        );
      } else {
        const mainColor = colorPicker.getMainColor();
        gradientStart = colorPicker.getSecondColor(mainColor, progress);
        gradientEnd = colorMixer(
          colorPicker.getSecondColor(color, progress),
          firstColor,
          clamp(random.value() * (1 - progress), 0, 1)
        );
        // if (Math.abs(gradientEnd.v - gradientStart.v) > 0.1) {
        //   gradientEnd.v =
        //     gradientEnd.v > gradientStart.v
        //       ? gradientStart.v + 0.1
        //       : gradientStart.v - 0.1;
        // }
      }
      const gradientSteps = 2;

      return Gradient(
        new Array(gradientSteps)
          .fill(null)
          .map((_, index) =>
            colorMixer(gradientStart, gradientEnd, index / (gradientSteps - 1))
          ),
        gradientAngle + (random.value() * Math.PI) / 2
        //   angle(center, Point(width / 2, height / 2))
      );
    };

    let elements = shapes
      .map(
        ({ shape, progress, shapeWidth, shapeHeight, color, firstColor }) => {
          // const color = colorPicker.getMainColor();
          const bigRatio = Math.pow(
            1 - polygonArea(shape) / (shapeWidth * shapeHeight),
            1
          );

          const center = polygonCenter(shape);
          const newProgress = Math.pow(getProgress(center.x, center.y), 1.5);

          return SmoothShape(shape.points, smoothFactor * bigRatio, {
            // color: firstColor,
            color: hasGradient
              ? makeGradient(color, firstColor, newProgress)
              : colorPicker.getSecondColor(color, newProgress),
            opacity: isColorful
              ? clamp(mapRange(Math.pow(newProgress, 0.2), 0, 1, 2, -0.3), 0, 1)
              : 1 - newProgress * 0.5,
            //   opacity: 1 - progress,
          });
        }
      )
      //   .flatMap((shape) => {
      //     return makeFlowPattern(
      //       shape
      //     );
      //   })
      .filter(Boolean) as CanvasJpShape[];

    const windowRatio = windowWidth / windowHeight;
    const maxWindowSize = Math.max(windowWidth, windowHeight);
    let windowOffset: CanvasJpPoint;
    if (windowRatio > 1) {
      windowOffset = Point(0, (windowWidth - windowHeight) / 2);
    } else {
      windowOffset = Point((windowHeight - windowWidth) / 2, 0);
    }
    const margin = Math.min(windowWidth, windowHeight) / 30;

    elements.sort((a, b) => {
      const diff = (a.fill?.opacity || 0) - (b.fill?.opacity || 0);

      let result;
      if (Math.abs(diff) > 0.001) {
        result = diff;
      } else {
        result =
          distance(polygonCenter(Polygon(a.points)), center) -
          distance(polygonCenter(Polygon(b.points)), center);
      }
      if (isLightPicker) {
        return -result;
      } else {
        return -result;
      }
    });

    const mainColor = colorPicker.getMainColor();
    const tint = random.gaussian(0, 0.4);

    let amountOfLight = 0;
    const tinyShapes = new Array(fast ? 0 : 700).fill(null).flatMap(() => {
      const tinyShapesSize =
        mapRange(Math.pow(random.value(), 3.5), 0, 1, width / 100, width / 10) *
        (isGiganticSize ? 3 : 1);
      const numberOfPoints = clamp(
        Math.ceil(random.value() * 6),
        3,
        Number.MAX_SAFE_INTEGER
      );
      const center = Point(random.value() * width, random.value() * height);
      const phase = random.value() * Math.PI * 2;

      const points = new Array(numberOfPoints).fill(null).map((_, index) => {
        const progress = index / numberOfPoints;
        const angle = random.gaussian(progress * Math.PI * 2, 0.1) + phase;

        return Point(
          center.x +
            clamp(random.gaussian(1, 1), 0.3, 8) *
              tinyShapesSize *
              Math.cos(angle),
          center.y +
            clamp(random.gaussian(1, 1), 0.3, 8) *
              tinyShapesSize *
              Math.sin(angle)
        );
      });

      const progress = getProgress(center.x, center.y);
      if (progress > 0.3) {
        return [];
      }

      const gradient = makeGradient(
        mainColor,
        colorPicker.getSecondColor(mainColor, progress),
        progress
      );
      gradient.colors = gradient.colors.map((color) => {
        return Color((color.h + tint + 1) % 1, color.s, color.v);
      });

      const value = Math.max(
        gradient.colors[0].v,
        gradient.colors[gradient.colors.length - 1].v
      );

      const shouldLighten = !(
        value > 0.95 &&
        random.value() > 0.8 &&
        colorPickerFactory !== blackAndWhite
      );

      if (shouldLighten) {
        amountOfLight += Math.pow(value, 3);
      } else {
        amountOfLight += isLightPicker ? 0.4 : 0.6;
      }
      if (
        amountOfLight >
        (progressOptions.fxname === "Shape" ? 120 : 300) *
          (colorPicker.getBackgroundColor().v > 0.8 ? 0.3 : 1)
      ) {
        return [];
      }
      return new Array<CanvasJpDrawable>()
        .concat(
          value > 0.55
            ? SmoothShape(points.concat(points[0], points[1]), 0.3, {
                color: gradient,
                opacity: isLightPicker ? 0.35 : 0.25,
                compositionOperation: "overlay",
                filter: `blur(${
                  (clamp(
                    Math.pow(tinyShapesSize / 2, 1.3),
                    5,
                    Number.MAX_SAFE_INTEGER
                  ) /
                    width) *
                  windowWidth *
                  resolution
                }px)`,
              })
            : []
        )
        .concat(
          shouldLighten
            ? SmoothShape(points.concat(points[0], points[1]), 0.3, {
                color: gradient,
                opacity: value < 0.55 ? 0.2 : 0.1,
                compositionOperation: "lighter",
                filter: `blur(${
                  (clamp(
                    Math.pow(tinyShapesSize / 3, 1.8),
                    5,
                    Number.MAX_SAFE_INTEGER
                  ) /
                    width) *
                  windowWidth *
                  resolution
                }px)`,
              })
            : []
        );
    });

    let mainElementsLength = elements.length;

    elements = elements.concat(tinyShapes);

    elements = elements
      .map((shape) =>
        makeShape(
          shape,
          shape.points
            .map((point) => {
              // scale to window
              return Point(
                mapRange(point.x, 0, 1920, margin, maxWindowSize - margin),
                mapRange(point.y, 0, 1920, margin, maxWindowSize - margin)
              );
            })
            .map((point) => {
              // center to window
              return Point(point.x - windowOffset.x, point.y - windowOffset.y);
            })
        )
      )
      .flatMap(
        splitShape({
          points: [
            Point(margin, margin),
            Point(windowWidth - margin, margin),
            Point(windowWidth - margin, windowHeight - margin),
            Point(margin, windowHeight - margin),
          ],
        })
      )
      .filter((shape) => {
        const isInFrame = shape.points.reduce((acc, point) => {
          const isClearlyOutOfFrame =
            point.x < margin * 0.7 ||
            point.x > windowWidth - margin * 0.7 ||
            point.y < margin * 0.7 ||
            point.y > windowHeight - margin * 0.7;
          const isClearlyInsideOfFrame =
            point.x > margin * 1.3 &&
            point.x < windowWidth - margin * 1.3 &&
            point.y > margin * 1.3 &&
            point.y < windowHeight - margin * 1.3;

          const outOfFrameAmount = isClearlyInsideOfFrame
            ? 1000
            : isClearlyOutOfFrame
            ? -1000
            : 1;

          return acc + outOfFrameAmount;
        }, 0);

        return isInFrame > 50;
      });

    const frames = Math.round(1000 / 60);

    let themeColor = document.querySelector("meta[name=theme-color]");
    if (!themeColor) {
      themeColor = document.createElement("meta");
      themeColor.setAttribute("name", "theme-color");
      document.head.append(themeColor);
    }
    themeColor.setAttribute("content", colorPicker.getBackgroundColor().hex());
    document.body.style.backgroundColor = colorPicker
      .getBackgroundColor()
      .hex();

    yield {
      background: colorPicker.getBackgroundColor(),
      elements: [],
    };

    const increment = Math.ceil(mainElementsLength / (frames - 1));
    let latestElementDrawn = 0;
    for (let i = 0; i < mainElementsLength; i += increment) {
      const start = i;
      latestElementDrawn = Math.min(i + increment, mainElementsLength);

      yield {
        elements: new Array().concat(elements.slice(start, latestElementDrawn)),
      };
    }

    yield {
      elements: elements.slice(latestElementDrawn, mainElementsLength),
    };

    let numberOfTinyShapesDrawn = 0;
    for (let i = mainElementsLength; i < elements.length; i += 20) {
      numberOfTinyShapesDrawn = Math.min(i + 20, elements.length);
      yield {
        elements: elements.slice(i, i + 20),
      };
    }

    yield {
      elements: elements.slice(numberOfTinyShapesDrawn),
    };

    if (colorPickerFactory === blackAndWhite && random.value() > 0) {
      const frame = PolygonFromRect(0, 0, width - 0 * 2, height - 0 * 2);
      const tintPicker = makeColorPickerFactory()();
      const mainColor = tintPicker.getMainColor();

      const gradient = RadialGradient(
        [
          tintPicker.getSecondColor(mainColor, 0),
          tintPicker.getSecondColor(mainColor, 0),
        ].map((color) => Color(color.h, color.s, clamp(color.v * 1.5, 0, 1))),
        center,
        Math.max(...frame.points.map((p) => distance(p, center))) * 1.3
      );
      yield {
        elements: [
          frame.toShape({
            color: gradient,
            opacity: 0.1,
            compositionOperation: "saturation",
          }),
          frame.toShape({
            color: gradient,
            opacity: 0.4,
            compositionOperation: "hue",
          }),
        ],
      };
    }

    if (!fast) {
      yield {
        elements: [
          UpdateImageData((imageData) => {
            for (let i = 0; i < imageData.data.length; i += 4) {
              const value = Math.pow(
                (imageData.data[i] +
                  imageData.data[i + 1] +
                  imageData.data[i + 2]) /
                  256 /
                  3,
                0.3
              );
              const x = ((i - (i % 4)) / resolution) % width;
              const y = Math.floor((i - (i % 4)) / resolution / width);
              const gA =
                0.04 *
                Math.pow(mapRange(random.noise2D(x, y, 0.1), -1, 1, 0, 1), 2);

              const darker = mapRange(
                Math.pow(
                  mapRange(random.noise2D(x, y, 0.01), -1, 1, 0, 1),
                  0.3
                ),
                0,
                1,
                mapRange(Math.pow(value, 0.5), 0, 1, 0.8, 1),
                1
              );
              const noise = random.gaussian(
                1,
                gA * mapRange(Math.pow(value, 3), 0, 1, 2, 0.7)
              );
              imageData.data[i] = clamp(
                Math.round(imageData.data[i] * darker * noise),
                0,
                255
              );
              imageData.data[i + 1] = clamp(
                Math.round(imageData.data[i + 1] * darker * noise),
                0,
                255
              );
              imageData.data[i + 2] = clamp(
                Math.round(imageData.data[i + 2] * darker * noise),
                0,
                255
              );
              imageData.data[i + 3] = imageData.data[i + 3];
            }

            return imageData;
          }),
        ],
      };
    }
  },
  () => {
    const params = new URLSearchParams(window.location.search);

    const windowRatio = window.innerWidth / window.innerHeight;
    let width = Number(params.get("width")) || window.innerWidth;
    let height = width / windowRatio;

    var isFxpreview = params.get("preview") === "1";
    if (isFxpreview) {
      width = Number(params.get("width")) || 1920;
      height = (width * 21) / 29.7;
    }

    const imageRatio = width / height;
    const resolutionFactor =
      windowRatio > imageRatio
        ? window.innerHeight / height
        : window.innerWidth / width;
    const resolution =
      params.get("width") || isFxpreview ? 1 : resolutionFactor;

    return {
      width: width,
      height: height,
      resolution: resolution,
      interactive: false,
      plugins: [exportable("break"), seedNavigation, devMode],
    };
  }
);

function polygonCenter({ points }: { points: CanvasJpPoint[] }): CanvasJpPoint {
  let sum = points.slice(1).reduce(({ x, y }, point) => {
    return Point(x + point.x, y + point.y);
  }, points[0]);

  return Point(sum.x / points.length, sum.y / points.length);
}
