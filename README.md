# DeviceSpecs JavaScript/TypeScript SDK

A strongly-typed, modern TypeScript & JavaScript client library for the **DeviceSpecs API**. Access structured, clean, and normalized specifications, chipsets, and physical metrics for over 12,000 mobile devices.

---

## 🔑 Getting an API Key

To use this library, you need an API key:
1. Go to [ds.gtgroup.dev](https://ds.gtgroup.dev).
2. Register for a free developer key or subscribe to a premium plan.
3. Keep your API key secure.

---

## 🚀 Installation

Install the package via npm or yarn:

```bash
npm install @granturismo/devicespecs
```

or

```bash
yarn add @granturismo/devicespecs
```

---

## 🛠️ Usage Quick Start

### Basic Device Query
```typescript
import { DeviceSpecsClient, Brands } from "@granturismo/devicespecs";

// Initialize client with your API key
const client = new DeviceSpecsClient("YOUR_API_KEY");

async function run() {
  // Fetch specific device specifications
  const phone = await client.getSpecs(Brands.Google, "Pixel 9 Pro");

  if (phone) {
    console.log(`Device: ${phone.manufacturer} ${phone.model}`);
    console.log(`Chipset: ${phone.chipset}`);
    console.log(`RAM Options:`, phone.normalized_specs?.memory_options?.available_ram_gb);
  }
}

run();
```

---

## 🔥 Fluent Deep Filtering Syntax

Construct rich, expressive multi-metric queries starting with `client.where()`:

```typescript
const flagshipDevices = await client
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
  .priceUsdLessOrEqual(1200)
  .execute();
```

### Multi-Brand Filtering
Query across multiple manufacturers effortlessly:

```typescript
const budgetMidrangers = await client
  .where()
  .manufacturerBetween(Brands.Samsung, Brands.Xiaomi, Brands.Oppo)
  .ramGreaterThan(8)
  .hasNfc()
  .priceUsdLessThan(800)
  .execute();
```

### Custom & Raw Property Escapes
You can also append custom or raw property filters for maximum flexibility:

```typescript
const customQuery = client
  .where()
  .withCustomFilter("memory.available_storage_gb", "gte", 256)
  .withCustomFilter("physical.ip_rating", "contains", "IP68");

// View generated query string before executing
console.log(customQuery.toQueryString());

const results = await customQuery.execute();
```

---

## 📖 API Reference

### Fluent Query Builder
```typescript
const devices = await client
  .where()
  .manufacturerIs(Brands.Google)
  .ramGreaterThanOrEqual(12)
  .displayRefreshRateGreaterThanOrEqual(120)
  .execute();
```

### Get Devices by Model Number Variant
Retrieve a device matching a specific hardware variant or model string (e.g., "SM-S928B", "A3106").
```typescript
const variant = await client.getDeviceByModelNumber("SM-S928B");
```

### Get Devices by Manufacturer
Retrieve all tracked devices for a specific brand.
```typescript
const appleDevices = await client.getDevicesByManufacturer(Brands.Apple);
```

### Get Devices by Chipset
Retrieve all devices powered by a specific SoC (system on chip).
```typescript
const tensorDevices = await client.getDevicesByChipset("Google Tensor G4");
```

---

## 🛡️ Error Handling

The client throws a strongly-typed `DeviceSpecsApiException` when the API gateway returns a non-success status code.

```typescript
import { DeviceSpecsApiException } from "@granturismo/devicespecs";

try {
  const specs = await client.getSpecs("Google", "NonExistentModel");
} catch (ex) {
  if (ex instanceof DeviceSpecsApiException) {
    console.log(`API Error (${ex.statusCode}): ${ex.message}`);
    console.log(`Raw Response: ${ex.responseContent}`);
  }
}
```

---

## 📄 License
This library is licensed under the MIT License.
