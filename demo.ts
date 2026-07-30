import { Brands, DeviceSpecsApiException, DeviceSpecsClient } from "./src";

async function main() {
  console.log("=============================================");
  console.log("     DeviceSpecs NPM TypeScript Demo         ");
  console.log("=============================================");

  const apiKey = process.argv[2] || "DUMMY_API_KEY_FOR_TESTING";
  console.log(`Configuring client with key: ${apiKey}\n`);

  const client = new DeviceSpecsClient(apiKey);

  // Test 1: Fetch specs for Google Pixel 9 Pro
  console.log("--> [Test 1] client.getSpecs('Google', 'Pixel 9 Pro')...");
  try {
    const phone = await client.getSpecs(Brands.Google, "Pixel 9 Pro");
    if (phone) {
      console.log(`   Found: ${phone.manufacturer} ${phone.model}`);
      console.log(`   Chipset: ${phone.chipset}`);
    } else {
      console.log("   Device not found (404).");
    }
  } catch (err: any) {
    if (err instanceof DeviceSpecsApiException) {
      console.log(`   API Response (Status ${err.statusCode}): ${err.responseContent.trim()}`);
    } else {
      console.log(`   Error: ${err.message}`);
    }
  }

  // Test 2: Expressive Fluent Filter Query
  console.log("\n--> [Test 2] Constructing Fluent Deep Filter Query (client.where()...)...");
  const query = client
    .where()
    .manufacturerIs(Brands.Samsung)
    .chipsetContains("Snapdragon")
    .ramGreaterThanOrEqual(8)
    .ramLessOrEqual(16)
    .displayRefreshRateGreaterThanOrEqual(120)
    .displaySizeGreaterThanOrEqual(6.5)
    .batteryGreaterThanOrEqual(5000)
    .hasWirelessCharging()
    .hasStereoSpeakers()
    .priceUsdLessOrEqual(1200);

  console.log(`   Generated Query String:\n   ${query.toQueryString()}`);
  console.log("   Executing Query...");
  try {
    const results = await query.execute();
    console.log(`   Returned ${results.length} matching device(s).`);
  } catch (err: any) {
    if (err instanceof DeviceSpecsApiException) {
      console.log(`   API Response (Status ${err.statusCode}): ${err.responseContent.trim()}`);
    } else {
      console.log(`   Error: ${err.message}`);
    }
  }

  // Test 3: Multi-brand query
  console.log("\n--> [Test 3] Multi-brand Query with manufacturerBetween(Samsung, Xiaomi, Oppo)...");
  const multiBrandQuery = client
    .where()
    .manufacturerBetween(Brands.Samsung, Brands.Xiaomi, Brands.Oppo)
    .ramGreaterThan(8)
    .hasNfc()
    .priceUsdLessThan(800);

  console.log(`   Generated Multi-Brand Query String:\n   ${multiBrandQuery.toQueryString()}`);

  // Test 4: Model Number Variant Lookup
  console.log("\n--> [Test 4] client.getDeviceByModelNumber('SM-S928B')...");
  try {
    const variant = await client.getDeviceByModelNumber("SM-S928B");
    if (variant) {
      console.log(`   Found Variant: ${variant.manufacturer} ${variant.model}`);
    } else {
      console.log("   Model number variant not found (404).");
    }
  } catch (err: any) {
    if (err instanceof DeviceSpecsApiException) {
      console.log(`   API Response (Status ${err.statusCode}): ${err.responseContent.trim()}`);
    } else {
      console.log(`   Error: ${err.message}`);
    }
  }

  console.log("\nDemo completed successfully.");
  console.log("=============================================");
}

main().catch((err) => {
  console.error("Fatal demo error:", err);
});
