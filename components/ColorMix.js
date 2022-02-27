import hexToRGB from "../utilities/hexToRGB";
import hexToHSL from "../utilities/hexToHSL";
import { useState } from "react";
import { Badge, Button } from "react-bootstrap";

export default function ColorMix({
  sentence,
  color1,
  color2,
  contrastRatioInfo,
  darkTheme,
}) {
  const color1RGB = hexToRGB(color1);
  const color2RGB = hexToRGB(color2);

  const color1HSL = hexToHSL(color1);
  const color2HSL = hexToHSL(color2);

  const [colorFormat, setColorFormat] = useState("HEX");

  function displayContrastinfo() {
    if (contrastRatioInfo.AA && contrastRatioInfo.AAA)
      return (
        <Badge bg="success">{contrastRatioInfo.ratio.toFixed(2)} AAA</Badge>
      );
    if (contrastRatioInfo.AA && !contrastRatioInfo.AAA)
      return (
        <Badge bg="warning" text="dark">
          {contrastRatioInfo.ratio.toFixed(2)} AA
        </Badge>
      );
    if (!contrastRatioInfo.AA && !contrastRatioInfo.AAA)
      return <Badge bg="danger">{contrastRatioInfo.ratio.toFixed(2)} X</Badge>;
  }

  return (
    <div className="ColorMix shadow">
      <div
        className="combination py-5"
        style={{ backgroundColor: color1, color: color2 }}
      >
        <p className="fs-2">{sentence}</p>
      </div>

      <div className="colorInfo">
        <p>Contrast ratio : {displayContrastinfo()}</p>

        <p>
          Couleur de fond :{" "}
          <Badge bg="light text-dark">
            {colorFormat == "HEX" && color1}
            {colorFormat == "RGB" && color1RGB}
            {colorFormat == "HSL" && color1HSL}
          </Badge>
        </p>

        <p>
          Couleur du texte :{" "}
          <Badge bg="light text-dark">
            {colorFormat == "HEX" && color2}
            {colorFormat == "RGB" && color2RGB}
            {colorFormat == "HSL" && color2HSL}
          </Badge>
        </p>
      </div>

      <div className="colorFormatRadio mb-2">
        <Button
          size="sm"
          variant={`${darkTheme ? "" : "outline-"}secondary`}
          className="lh-1"
          onClick={() => setColorFormat("HEX")}
        >
          HEX
        </Button>
        <Button
          size="sm"
          variant={`${darkTheme ? "" : "outline-"}secondary`}
          className="lh-1"
          onClick={() => setColorFormat("RGB")}
        >
          RGB
        </Button>
        <Button
          size="sm"
          variant={`${darkTheme ? "" : "outline-"}secondary`}
          className="lh-1"
          onClick={() => setColorFormat("HSL")}
        >
          HSL
        </Button>
      </div>
    </div>
  );
}
