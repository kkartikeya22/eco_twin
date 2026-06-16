import { GoogleGenerativeAI } from "@google/generative-ai";
import { INDIA_GRID_EMISSION_FACTOR } from "../utils/constants.js";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const bufferToGenerativePart = (
  buffer,
  mimeType
) => ({
  inlineData: {
    data: buffer.toString("base64"),
    mimeType,
  },
});

export const analyseReceiptText = async (
  receiptText
) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You are an expert carbon footprint analyst.

Below is OCR text extracted from a shopping receipt:

${receiptText}

Extract all purchased items.

Use these emission factors: ((kgCO₂eq per kilogram))
Apples	- 0.43 kg
Bananas	- 0.86 kg
Barley	- 1.18 kg
Beef (beef herd)	- 99.48 kg
Beef (dairy herd)	- 33.30 kg
Beet Sugar	- 1.81 kg
Berries & Grapes	- 1.53 kg
Brassicas	- 0.51 kg
Cane Sugar	- 3.20 kg
Cassava	- 1.32 kg
Cheese- 23.88 kg
Citrus Fruit	- 0.39 kg
Coffee	- 28.53 kg
Dark Chocolate	- 46.65 kg
Eggs	- 4.67 kg
Fish (farmed)	- 13.63 kg
Groundnuts	- 3.23 kg
Lamb & Mutton	- 39.72 kg
Maize	- 1.70 kg
Milk	- 3.15 kg
Nuts	- 0.43 kg
Oatmeal	- 2.48 kg
Onions & Leeks	- 0.50 kg
Other Fruit	- 1.05 kg
Other Pulses	-1.79 kg
Other Vegetables	- 0.53 kg
Peas	- 0.98 kg
Pig Meat	- 12.31 kg
Potatoes	- 0.46 kg
Poultry Meat	- 9.87 kg
Prawns (farmed)	- 26.87 kg
Rice	- 4.45 kg
Root Vegetables	- 0.43 kg
Soy milk	- 0.43 kg
Tofu	- 3.16 kg
Tomatoes	- 2.09 kg
Wheat & Rye	- 1.57 kg
Wine	- 1.79 kg


For each item estimate:
- item
- quantity
- unit
- category
- estimatedKgCO2

Return ONLY valid JSON.

Example:

[
  {
    "item":"Milk",
    "quantity":1,
    "unit":"litre",
    "category":"dairy",
    "estimatedKgCO2":1.2
  }
]
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();


    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);


    return parsed;
  } catch (error) {
    console.error("Gemini Analysis Error:");
    console.error(error);
    throw error;
  }
};

export const analyseFood = async (
  imageBuffer,
  mimeType = "image/jpeg"
) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const imagePart = bufferToGenerativePart(
      imageBuffer,
      mimeType
    );

    const prompt = `
You are a food sustainability expert.

Analyze this food image.

Identify:
- Dish name
- Main ingredients
- Estimated grams of each ingredient

Use these emission factors (kgCO2e/kg):

beef: 60
mutton: 24
lamb: 24
chicken: 6
fish: 5
eggs: 4.5
milk: 3
cheese: 21
rice: 4
bread: 1.2
vegetables: 0.8
fruits: 0.7
oil: 3

Return ONLY valid JSON.

{
  "dish": "Chicken Biryani",
  "ingredients": [
    {
      "name": "Rice",
      "estimatedGrams": 250,
      "kgCO2PerKg": 4,
      "kgCO2": 1
    }
  ],
  "totalKgCO2": 2.5,
  "swapSuggestion": {
    "description": "Replace chicken with vegetables",
    "totalKgCO2": 1.2,
    "savedKgCO2": 1.3
  }
}
`;

    const result =
      await model.generateContent([
        prompt,
        imagePart,
      ]);

    const text =
      result.response.text();


    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "Food Analysis Error:",
      error
    );
    throw error;
  }
};

export const analyseElectricityBill = async (
  imageBuffer,
  mimeType = "image/jpeg"
) => {
  try {

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType:
            "application/json",
        },
      });

    const imagePart =
      bufferToGenerativePart(
        imageBuffer,
        mimeType
      );

    const prompt = `
Analyze this electricity bill image.

Extract:

- total electricity units consumed (kWh)
- billing period in days

Calculate:

kgCO2 =
units_kwh × ${INDIA_GRID_EMISSION_FACTOR}

monthly_estimate_kgCO2 =
(kgCO2 / billing_period_days) × 30

Return ONLY valid JSON:

{
  "units_kwh": 250,
  "billing_period_days": 30,
  "kgCO2": 205,
  "monthly_estimate_kgCO2": 205
}
`;

    const result =
      await model.generateContent([
        prompt,
        imagePart,
      ]);

    const text =
      result.response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error(
      "Electricity Analysis Error:",
      error
    );

    throw error;
  }
};

export const generateCoachNote = async (userName, dailySummary, context = {}) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // safer stable choice than 2.5 if not available
    });

    const { weeklyGoalKgCO2, streakDays, thisWeekTotalKgCO2 } = context;

    const contextLines = [];

    if (typeof weeklyGoalKgCO2 === "number") {
      contextLines.push(`Weekly carbon goal: ${weeklyGoalKgCO2} kg CO2e.`);
    }

    if (typeof thisWeekTotalKgCO2 === "number") {
      contextLines.push(`Total so far this week (last 7 days): ${thisWeekTotalKgCO2.toFixed(2)} kg CO2e.`);
    }

    if (typeof streakDays === "number" && streakDays > 0) {
      contextLines.push(`Current daily logging streak: ${streakDays} day(s).`);
    }

    const prompt = `
You are EcoTwin, an expert but friendly AI climate coach.

User name: ${userName}

Daily carbon footprint data:
${JSON.stringify(dailySummary, null, 2)}

${contextLines.length > 0 ? `Additional context:\n${contextLines.join("\n")}` : ""}

TASK:
Write a warm evening message (max 120 words) that:

1. Clearly states today's total CO2 (kg)
2. Identifies the highest emission category (food/travel/electricity/shopping)
3. Gives exactly 3 practical tips for tomorrow with estimated CO2 savings
4. If a weekly goal or streak is provided, briefly acknowledge progress toward it
5. Keep tone encouraging, not guilt-inducing
6. End with a short motivational line

Rules:
- No markdown
- No bullet symbols like * or #
- Keep it human and conversational
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("CoachService error:", err);
    throw new Error("Failed to generate coach note");
  }
};