//color1 = [r, g, b]

export default function checkContrast(color1, color2) {
  //   for debugging
  //    let color1 = [255, 255, 255];
  //   let color2 = [0, 0, 0];

  function sRGB(color) {
    if (color <= 0.03928) {
      return color / 12.92;
    } else {
      return Math.pow((color + 0.055) / 1.055, 2.4);
    }
  }
  let r1 = color1[0] / 255;
  let g1 = color1[1] / 255;
  let b1 = color1[2] / 255;

  let R1 = sRGB(r1);
  let G1 = sRGB(g1);
  let B1 = sRGB(b1);

  let L1 = 0.2126 * R1 + 0.7152 * G1 + 0.0722 * B1;

  let r2 = color2[0] / 255;
  let g2 = color2[1] / 255;
  let b2 = color2[2] / 255;

  let R2 = sRGB(r2);
  let G2 = sRGB(g2);
  let B2 = sRGB(b2);

  let L2 = 0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2;

  let biggest = Math.max(L1, L2);
  let smallest = Math.min(L1, L2);

  const ratio = (biggest + 0.05) / (smallest + 0.05);
  const AA = ratio > 3;
  const AAA = ratio > 4.5;

  // console.log(ratio, AA, AAA);
  return { AA: AA, AAA: AAA, ratio: ratio };
}

//Source https://www.w3.org/TR/WCAG20/#relativeluminancedef

//Contrast ratio =
// (L1 + 0.05) / (L2 + 0.05)
// According to google constrat checker in the devtool,
// To get AAA, you need 4.5
// To get AA, you need 3

//Where Lx =
//L = 0.2126 * R + 0.7152 * G + 0.0722 * B

//Where R G B :
// if RsRGB <= 0.03928 then R = RsRGB/12.92 else R = ((RsRGB+0.055)/1.055) ^ 2.4
// if GsRGB <= 0.03928 then G = GsRGB/12.92 else G = ((GsRGB+0.055)/1.055) ^ 2.4
// if BsRGB <= 0.03928 then B = BsRGB/12.92 else B = ((BsRGB+0.055)/1.055) ^ 2.4

// // and
// RsRGB = R8bit/255
// GsRGB = G8bit/255
// BsRGB = B8bit/255
