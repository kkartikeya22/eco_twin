import Tesseract from "tesseract.js";

export const extractReceiptText = async (
  imageBuffer
) => {
  try {

    const {
      data: { text },
    } = await Tesseract.recognize(
      imageBuffer,
      "eng"
    );

    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  }
};