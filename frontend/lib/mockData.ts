import type { AnalysisResult } from "@/types";

/**
 * Mock analysis result — used until the backend is wired up.
 * Keeps the dashboard demoable from day one.
 */
export function getMockAnalysis(
  id: string,
  filename = "superstore.csv"
): AnalysisResult {
  return {
    meta: {
      id,
      filename,
      row_count: 9994,
      column_count: 14,
      uploaded_at: new Date().toISOString(),
    },
    kpis: [
      {
        label: "Total Revenue",
        value: 2_297_201,
        delta: 0.124,
        format: "currency",
        currency: "USD",
        hint: "Sum of Sales column",
      },
      {
        label: "Orders",
        value: 9994,
        delta: 0.082,
        format: "number",
        hint: "Total rows in dataset",
      },
      {
        label: "Avg Order Value",
        value: 229.86,
        delta: 0.038,
        format: "currency",
        currency: "USD",
        hint: "Revenue ÷ orders",
      },
      {
        label: "Profit Margin",
        value: 0.124,
        delta: -0.014,
        format: "percent",
        hint: "Profit ÷ Sales",
      },
    ],
    charts: {
      trend: {
        title: "Revenue over time",
        points: [
          { label: "Jan", value: 168_000, comparison: 142_000 },
          { label: "Feb", value: 175_000, comparison: 156_000 },
          { label: "Mar", value: 198_000, comparison: 170_000 },
          { label: "Apr", value: 184_000, comparison: 178_000 },
          { label: "May", value: 226_000, comparison: 188_000 },
          { label: "Jun", value: 241_000, comparison: 201_000 },
          { label: "Jul", value: 268_000, comparison: 219_000 },
          { label: "Aug", value: 290_000, comparison: 233_000 },
          { label: "Sep", value: 252_000, comparison: 247_000 },
          { label: "Oct", value: 274_000, comparison: 261_000 },
          { label: "Nov", value: 312_000, comparison: 278_000 },
          { label: "Dec", value: 348_000, comparison: 294_000 },
        ],
      },
      bar: {
        title: "Top categories by revenue",
        data: [
          { label: "Technology", value: 836_154 },
          { label: "Furniture", value: 741_999 },
          { label: "Office Supplies", value: 719_047 },
          { label: "Phones", value: 330_007 },
          { label: "Storage", value: 223_843 },
        ],
      },
    },
    anomalies: [
      {
        column: "Sales",
        value: 22_638,
        row_index: 2624,
        severity: "high",
        expected_min: 0,
        expected_max: 5000,
      },
      {
        column: "Discount",
        value: 0.8,
        row_index: 7843,
        severity: "medium",
        expected_min: 0,
        expected_max: 0.5,
      },
      {
        column: "Profit",
        value: -6600,
        row_index: 6286,
        severity: "high",
        expected_min: -500,
        expected_max: 3000,
      },
    ],
    suggested_questions: [
      "Which region performed best last quarter?",
      "Why did revenue drop in April?",
      "What are the top 3 most profitable products?",
      "Are there any seasonal trends in sales?",
      "Which discounts hurt profitability most?",
    ],
    preview_rows: [
      { "Order ID": "CA-2024-152156", Region: "South", Category: "Furniture", Sales: 261.96, Profit: 41.91, Quantity: 2 },
      { "Order ID": "CA-2024-152156", Region: "South", Category: "Furniture", Sales: 731.94, Profit: 219.58, Quantity: 3 },
      { "Order ID": "CA-2024-138688", Region: "West", Category: "Office Supplies", Sales: 14.62, Profit: 6.87, Quantity: 2 },
      { "Order ID": "US-2024-108966", Region: "South", Category: "Furniture", Sales: 957.58, Profit: -383.03, Quantity: 5 },
      { "Order ID": "US-2024-108966", Region: "South", Category: "Office Supplies", Sales: 22.37, Profit: 2.52, Quantity: 2 },
      { "Order ID": "CA-2024-115812", Region: "West", Category: "Furniture", Sales: 48.86, Profit: 14.17, Quantity: 7 },
      { "Order ID": "CA-2024-115812", Region: "West", Category: "Office Supplies", Sales: 7.28, Profit: 1.97, Quantity: 4 },
      { "Order ID": "CA-2024-115812", Region: "West", Category: "Technology", Sales: 907.15, Profit: 90.72, Quantity: 6 },
      { "Order ID": "CA-2024-114412", Region: "Central", Category: "Office Supplies", Sales: 15.55, Profit: 5.44, Quantity: 3 },
      { "Order ID": "CA-2024-161389", Region: "Central", Category: "Office Supplies", Sales: 407.98, Profit: 132.59, Quantity: 3 },
    ],
    schema: [
      { name: "Order ID", dtype: "text", sample_values: ["CA-2024-152156"] },
      { name: "Region", dtype: "text", sample_values: ["South", "West", "Central"] },
      { name: "Category", dtype: "text", sample_values: ["Furniture", "Technology"] },
      { name: "Sales", dtype: "numeric", sample_values: ["261.96", "731.94"] },
      { name: "Profit", dtype: "numeric", sample_values: ["41.91", "219.58"] },
      { name: "Quantity", dtype: "numeric", sample_values: ["2", "3", "5"] },
    ],
  };
}

/**
 * Generates a fake streaming AI answer one chunk at a time.
 * Used to demo the QueryBar UX before the real Claude endpoint is wired.
 */
export async function* mockStreamAnswer(question: string): AsyncGenerator<string> {
  const lower = question.toLowerCase();
  let response = "";

  if (lower.includes("revenue") && lower.includes("april")) {
    response =
      "Revenue dipped slightly in April (-7.1% MoM) primarily because the Furniture category underperformed by $42K versus March. Two large-ticket orders (>$15K each) shipped late and slipped into May, which accounts for ~63% of the gap. The trend was already recovering by week 3 of April.";
  } else if (lower.includes("region")) {
    response =
      "The West region led with $725K in revenue, followed closely by the East ($678K). The South lagged at $391K, primarily due to fewer Technology orders. Notably, Central had the highest avg order value ($312) despite lower volume.";
  } else if (lower.includes("profit")) {
    response =
      "Your top 3 most profitable products are: 1) Canon imageCLASS 2200 Advanced Copier ($25.2K profit), 2) Fellowes PB500 Binder ($7.7K), and 3) Hewlett Packard LaserJet 3310 ($6.9K). All three are in the Technology category, which explains why discounting Technology aggressively hurt margins.";
  } else if (lower.includes("anomal") || lower.includes("outlier")) {
    response =
      "I flagged 3 anomalies: a $22,638 sale (row 2,624) — 4× higher than any other order, an 80% discount (row 7,843) which is well outside your typical 0–50% range, and a -$6,600 profit row (6,286) caused by a loss-leading bulk order. The first looks like a legitimate enterprise deal; the latter two warrant a review.";
  } else if (lower.includes("season")) {
    response =
      "Yes — there's a clear seasonal pattern. Q4 consistently outperforms (Nov-Dec average +28% vs annual mean), driven by holiday demand for Technology. February is the slowest month. If you control for seasonality, your underlying growth rate is ~9.2% YoY rather than the headline 12.4%.";
  } else {
    response = `Looking at your dataset, here are the key insights: Revenue grew 12.4% YoY to $2.30M across 9,994 orders. Technology is your strongest category by both volume and margin. There are 3 statistical outliers worth investigating. The strongest trend is Q4 seasonality — your December alone delivered ~15% of annual revenue.`;
  }

  const tokens = response.split(/(\s+)/);
  for (const token of tokens) {
    await new Promise((r) => setTimeout(r, 18 + Math.random() * 30));
    yield token;
  }
}
