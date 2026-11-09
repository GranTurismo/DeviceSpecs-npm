# DeviceSpecs JavaScript/TypeScript SDK

[![NPM Version](https://img.shields.io/npm/v/@granturismo/devicespecs.svg)](https://www.npmjs.com/package/@granturismo/devicespecs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A strongly-typed, modern TypeScript & JavaScript client library for the **[DeviceSpecs API](https://ds.gtgroup.dev)**. Access structured, clean, and normalized specifications, chipsets, and physical metrics for over 12,000 mobile devices.

---

## 📦 Repository

Source code, issues and releases: **[github.com/GranTurismo/DeviceSpecs-npm](https://github.com/GranTurismo/DeviceSpecs-npm)**

## 🌐 Official Website & Live API Portal

For live interactive testing, API key acquisition, documentation, and endpoint playgrounds, visit our official website:

👉 **[https://ds.gtgroup.dev](https://ds.gtgroup.dev)**

### What you can do on [ds.gtgroup.dev](https://ds.gtgroup.dev):
* 🔑 **Get API Keys**: Register for a free developer API key or upgrade your plan.
* 🧪 **Interactive Testing & Playground**: Test queries, parameters, and endpoints directly in your browser.
* 📖 **API Documentation**: Browse full spec models, filter parameters, and schema definitions.

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

## ⚙️ Client Options

By default the client calls the RapidAPI gateway (`https://deviceultraparser.p.rapidapi.com/`) and sends your key in the `x-rapidapi-key` / `x-rapidapi-host` headers. Both can be overridden, for example to target a self-hosted gateway:

```typescript
import { DeviceSpecsClient } from "@granturismo/devicespecs";

const client = new DeviceSpecsClient({
  apiKey: "YOUR_API_KEY",
  baseUrl: "https://deviceultraparser.p.rapidapi.com/", // default
  apiHost: "deviceultraparser.p.rapidapi.com",          // default; derived from baseUrl when omitted
});
```

| Option | Default | Description |
|---|---|---|
| `apiKey` | required | Your RapidAPI key. |
| `baseUrl` | `https://deviceultraparser.p.rapidapi.com/` | Gateway base URL. |
| `apiHost` | `deviceultraparser.p.rapidapi.com` | Value of the `x-rapidapi-host` header. |

---

## 🛠️ Usage Quick Start

### Basic Device Query
```typescript
import { DeviceSpecsClient, Brands } from "@granturismo/devicespecs";

// Obtain your API key from https://ds.gtgroup.dev
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

For detailed interactive API testing and live requests, visit **[ds.gtgroup.dev](https://ds.gtgroup.dev)**.

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

## 🧰 Other SDKs & Integrations

* **Python**: `pip install devicespecs` — [GranTurismo/DeviceSpecs-python](https://github.com/GranTurismo/DeviceSpecs-python)
* **.NET / C#**: `dotnet add package DeviceSpecs` — [GranTurismo/DeviceSpecs-nuget](https://github.com/GranTurismo/DeviceSpecs-nuget)
* **MCP server** (Claude, Cursor, VS Code): `npx -y @granturismo/devicespecs-mcp` — [GranTurismo/DeviceSpecs-mcp](https://github.com/GranTurismo/DeviceSpecs-mcp)

---

## 📄 License
This library is licensed under the MIT License.
