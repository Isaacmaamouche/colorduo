import Head from "next/head";
import { ChromePicker } from "react-color";
import { Button, Badge, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import ColorMix from "../components/ColorMix";
import { hexToRGBArray } from "../utilities/hexToRGB";
import checkContrast from "../utilities/checkContrast";

export default function Home() {
  const pickerStyles = {
    default: {
      picker: {
        display: "flex",
        width: "100%",
        alignItems: "center",
        flexDirection: "column-reverse",
        boxShadow: "none",
        border: "none",
        fontFamily:
          'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
      },
    },
  };

  const [darkTheme, setDarkTheme] = useState(false);

  const [colors, setColors] = useState({
    color1: "#F1C40F",
    color2: "#2ECC71",
    color3: "#34495E",
    color4: "#9A1671",
    color5: "#CC5E2E",
  });

  const [colorAmount, setColorAmount] = useState(2);

  const [useBlackAndWhite, setUseBlackAndWhite] = useState(false);

  const [matchs, setMatchs] = useState([]);
  const [filteredMatchs, setFilteredMatchs] = useState([]);

  useEffect(() => {
    setFilteredMatchs(matchs);
  }, [matchs]);

  const [contrastFilters, setContrastFilters] = useState([]);

  function handleFilter(filter) {
    if (filter == "AA et AAA") {
      setFilteredMatchs(
        matchs.filter((match) => match.contrastRatioInfo.AA == true)
      );
    } else if (filter == "AAA uniquement") {
      setFilteredMatchs(
        matchs.filter((match) => match.contrastRatioInfo.AAA == true)
      );
    } else if (filter == "TOUS") {
      setFilteredMatchs(matchs);
    }
  }

  const [showColorPicker, setShowColorPicker] = useState(false);

  const [colorPicker, setColorPicker] = useState(
    <>
      <div className="colorPicker">
        <Button
          variant="light"
          className="btn-close"
          onClick={() => setShowColorPicker(false)}
        />
        <ChromePicker
          disableAlpha={true}
          styles={pickerStyles}
          color="red"
          onChange={(updatedColor) => setColor(color1, updatedColor.hex)}
        />
      </div>
    </>
  );

  function colorPickerSetting(key, color, show) {
    setColorPicker(
      <>
        <div className="colorPicker">
          <Button
            variant="light"
            className="btn-close"
            onClick={() => setShowColorPicker(false)}
          />
          <ChromePicker
            disableAlpha={true}
            styles={pickerStyles}
            color={color}
            onChange={(updatedColor) => setColor(key, updatedColor.hex)}
          />
        </div>
      </>
    );
    setShowColorPicker(show);
  }

  function setColor(key, newColorValue) {
    let newColors = colors;
    newColors[key] = newColorValue.toUpperCase();
    setColors(newColors);
    colorPickerSetting(key, newColorValue, true);
  }

  function removeColor(e, colorToRemove) {
    if (e) e.stopPropagation();

    function randomColor() {
      let color = "#";
      for (let i = 0; i < 6; i++) {
        const random = Math.random();
        const bit = (random * 16) | 0;
        color += bit.toString(16);
      }
      return color;
    }

    let tempColors = Object.values(colors).filter(
      (color) => color !== colorToRemove
    );
    tempColors.push(randomColor());
    let tempKeys = Object.keys(colors);
    let newColors = colors;
    tempColors.forEach((color, index) => {
      newColors[tempKeys[index]] = color;
    });
    setColors(newColors);
    setColorAmount(colorAmount - 1);
  }

  const [sentence, setSentence] = useState(
    "Aventurier de l'inconnu, avant tu riais de l'inconnu"
  );

  function GenerateVisuals() {
    let colorsToMatch = [];
    if (useBlackAndWhite) {
      colorsToMatch = [
        ...new Set([
          ...Object.values(colors).slice(0, colorAmount),
          "#FFFFFF",
          "#000000",
        ]),
      ];
    } else {
      colorsToMatch = [
        ...new Set([...Object.values(colors).slice(0, colorAmount)]),
      ];
    }
    let combination = [];
    let availableFilters = [];
    let ratioValues = [];

    colorsToMatch.forEach((value) => {
      let pairs = colorsToMatch.filter((color) => color != value);
      pairs.forEach((pair) => {
        const contrastRatioInfo = checkContrast(
          hexToRGBArray(value),
          hexToRGBArray(pair)
        );
        combination.push({
          color1: value,
          color2: pair,
          contrastRatioInfo: contrastRatioInfo,
        });
        if (contrastRatioInfo.AA && !contrastRatioInfo.AAA)
          ratioValues.push("AA et AAA");
        if (contrastRatioInfo.AAA) ratioValues.push("AAA uniquement");
        if (!contrastRatioInfo.AA && !contrastRatioInfo.AAA)
          ratioValues.push("TOUS");
      });
    });

    availableFilters = [...new Set(ratioValues)];

    setContrastFilters(availableFilters);
    setMatchs(combination);
  }

  return (
    <>
      <Head>
        <title>Color Matcher</title>
      </Head>
      <div className={`appContainer ${darkTheme && "dark"}`}>
        <h1>Color Matcher</h1>

        <p className="fs-5">
          {
            " Choissisez jusqu'à 5 couleurs et générez toutes les combinaisons de couleurs de fond et de couleur de texte possibles !"
          }
        </p>

        <Button
          size="sm"
          className="themeSwitcher"
          variant={darkTheme ? "outline-light" : "outline-secondary"}
          onClick={() => setDarkTheme(!darkTheme)}
        >
          {darkTheme ? "🌞" : "🌙"}
        </Button>

        <div className="colorContainer">
          {Object.entries(colors).map(([key, color], index) => (
            <>
              {index + 1 <= colorAmount && (
                <div
                  className="coloredSquare shadow"
                  style={{ backgroundColor: color }}
                  onClick={(e) => colorPickerSetting(key, color, true)}
                >
                  {colorAmount > 2 && (
                    <Button
                      variant="danger"
                      className="btn-close btn-delete-color"
                      onClick={(e) => removeColor(e, color)}
                    />
                  )}

                  <p>
                    <Badge bg="light text-dark">{color}</Badge>
                  </p>
                </div>
              )}
            </>
          ))}

          {colorAmount < 5 && (
            <div className="coloredSquare shadow">
              <Button
                variant="primary"
                className="mx-auto"
                onClick={() => setColorAmount(colorAmount + 1)}
              >
                {" "}
                ✚{" "}
              </Button>
            </div>
          )}
        </div>
        <div className="colorPickers">{showColorPicker && colorPicker}</div>
        <Form className="bandwSwith mt-2">
          <Form.Check
            type="switch"
            id="bw-switch"
            label="Utiliser du noir et blanc pour générer des combinaisons supplémentaires"
            onChange={() => setUseBlackAndWhite(!useBlackAndWhite)}
          />
        </Form>
        <Button variant="primary" className="my-4" onClick={GenerateVisuals}>
          Générer des combinaisons
        </Button>

        {filteredMatchs.length > 0 && (
          <div className="options mb-5">
            <div className="demoText">
              <label htmlFor="sentenceInput">Changer le texte demo : </label>
              <input
                maxLength="100"
                id="sentenceInput"
                type="text"
                defaultValue={sentence}
                onChange={(e) => setSentence(e.target.value)}
              />
            </div>

            <div className="contrastFilter text-center">
              <p>
                Filtrer les combinaisons par niveau de contraste{" "}
                <a
                  rel="noopener noreferrer"
                  href="https://web.dev/i18n/en/color-and-contrast-accessibility/"
                  target="_blank"
                  title="contrast guidelines"
                  alt="contrast guidelines"
                >
                  <Badge pill bg="primary">
                    ?
                  </Badge>
                </a>
              </p>
              <div className="filters">
                {contrastFilters.map((filter) => (
                  <>
                    <Badge
                      key={filter}
                      bg="primary"
                      className="px-3 mx-2 filter pointer"
                      onClick={() => handleFilter(filter)}
                    >
                      {filter}
                    </Badge>
                  </>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="visuals">
          {filteredMatchs.map((match, index) => (
            <ColorMix
              darkTheme={darkTheme}
              sentence={sentence}
              key={index}
              color1={match.color1}
              color2={match.color2}
              contrastRatioInfo={match.contrastRatioInfo}
            />
          ))}
        </div>
      </div>
    </>
  );
}
