import { CanvasRenderingContext2D, loadImage } from "canvas";
// adds a signature to the top left corner of the canvas for pre-production
export const signImage = (ctx: CanvasRenderingContext2D, sig: string) => {
  ctx.fillStyle = "#000000";
  ctx.font = "bold 30pt Helvetica";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(`${sig} bees`, 40, 40);
};

// generate a random color hue
export const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};

export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, width, height);
};

// loads an image from the layer path
// returns the image in a format usable by canvas
export const loadLayerImg = async (layer: any) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${layer.selectedElement.path}`);
    resolve({ layer: layer, loadedImage: image });
  });
};

export const drawElement = (ctx: CanvasRenderingContext2D, element: any) => {
  ctx.drawImage(
    element.loadedImage,
    element.layer.position.x,
    element.layer.position.y,
    element.layer.size.width,
    element.layer.size.height
  );
};
