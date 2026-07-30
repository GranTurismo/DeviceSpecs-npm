import { DeviceSpecsResponse } from "./types";

export interface IQueryExecutor {
  executeFilterQuery(
    queryString: string,
    signal?: AbortSignal
  ): Promise<DeviceSpecsResponse[]>;
}

export class DeviceQueryBuilder {
  private readonly _executor?: IQueryExecutor;
  private readonly _params = new Map<string, string>();

  constructor(executor?: IQueryExecutor) {
    this._executor = executor;
  }

  /**
   * Fluent entry point returning this builder (e.g. client.where().manufacturerIs("Samsung")).
   */
  public where(): this {
    return this;
  }

  /**
   * Adds a custom or raw key-value filter parameter.
   */
  public withCustomFilter(
    propertyKey: string,
    opOrValue: string,
    value?: any
  ): this {
    if (!propertyKey || propertyKey.trim() === "") return this;

    if (value === undefined) {
      // Direct key-value setting
      if (opOrValue !== undefined && opOrValue !== null) {
        this._params.set(propertyKey.trim(), String(opOrValue));
      }
    } else {
      // Key with operator suffix (e.g. key_gte=value)
      const op = opOrValue ? opOrValue.trim() : "eq";
      const paramKey =
        op === "eq" ? propertyKey.trim() : `${propertyKey.trim()}_${op}`;

      let valStr: string;
      if (typeof value === "boolean") {
        valStr = value ? "true" : "false";
      } else {
        valStr = String(value);
      }
      this._params.set(paramKey, valStr);
    }

    return this;
  }

  // ==========================================
  //  General & Root Metrics
  // ==========================================

  public manufacturerIs(manufacturer: string): this {
    return this.withCustomFilter("manufacturer", "eq", manufacturer);
  }

  public manufacturerIn(...manufacturers: string[]): this {
    return this.withCustomFilter("manufacturer", "in", manufacturers.join(","));
  }

  public manufacturerBetween(...manufacturers: string[]): this {
    return this.manufacturerIn(...manufacturers);
  }

  public manufacturerContains(substring: string): this {
    return this.withCustomFilter("manufacturer", "contains", substring);
  }

  public modelIs(model: string): this {
    return this.withCustomFilter("model", "eq", model);
  }

  public modelContains(substring: string): this {
    return this.withCustomFilter("model", "contains", substring);
  }

  public chipsetIs(chipset: string): this {
    return this.withCustomFilter("chipset", "eq", chipset);
  }

  public chipsetContains(substring: string): this {
    return this.withCustomFilter("chipset", "contains", substring);
  }

  public androidVersionIs(version: string): this {
    return this.withCustomFilter("androidversion", "eq", version);
  }

  public androidVersionGreaterThanOrEqual(version: string): this {
    return this.withCustomFilter("androidversion", "gte", version);
  }

  public priceUsdIs(price: number): this {
    return this.withCustomFilter("price_usd", "eq", price);
  }

  public priceUsdGreaterThan(minPrice: number): this {
    return this.withCustomFilter("price_usd", "gt", minPrice);
  }

  public priceUsdGreaterThanOrEqual(minPrice: number): this {
    return this.withCustomFilter("price_usd", "gte", minPrice);
  }

  public priceUsdLessThan(maxPrice: number): this {
    return this.withCustomFilter("price_usd", "lt", maxPrice);
  }

  public priceUsdLessOrEqual(maxPrice: number): this {
    return this.withCustomFilter("price_usd", "lte", maxPrice);
  }

  public priceUsdBetween(minPrice: number, maxPrice: number): this {
    return this.withCustomFilter("price_usd", "between", `${minPrice},${maxPrice}`);
  }

  public priceEurLessOrEqual(maxPrice: number): this {
    return this.withCustomFilter("price_eur", "lte", maxPrice);
  }

  public priceGbpLessOrEqual(maxPrice: number): this {
    return this.withCustomFilter("price_gbp", "lte", maxPrice);
  }

  public colorContains(color: string): this {
    return this.withCustomFilter("colors", "contains", color);
  }

  // ==========================================
  //  Display Metrics
  // ==========================================

  public displaySizeGreaterThan(minInches: number): this {
    return this.withCustomFilter("display.size_inches", "gt", minInches);
  }

  public displaySizeGreaterThanOrEqual(minInches: number): this {
    return this.withCustomFilter("display.size_inches", "gte", minInches);
  }

  public displaySizeLessThan(maxInches: number): this {
    return this.withCustomFilter("display.size_inches", "lt", maxInches);
  }

  public displaySizeLessOrEqual(maxInches: number): this {
    return this.withCustomFilter("display.size_inches", "lte", maxInches);
  }

  public displaySizeBetween(minInches: number, maxInches: number): this {
    return this.withCustomFilter(
      "display.size_inches",
      "between",
      `${minInches},${maxInches}`
    );
  }

  public displayPanelTypeContains(panelType: string): this {
    return this.withCustomFilter("display.panel_type", "contains", panelType);
  }

  public displayRefreshRateIs(hz: number): this {
    return this.withCustomFilter("display.refresh_rate_hz", "eq", hz);
  }

  public displayRefreshRateGreaterThan(hz: number): this {
    return this.withCustomFilter("display.refresh_rate_hz", "gt", hz);
  }

  public displayRefreshRateGreaterThanOrEqual(hz: number): this {
    return this.withCustomFilter("display.refresh_rate_hz", "gte", hz);
  }

  public displayRefreshRateBetween(minHz: number, maxHz: number): this {
    return this.withCustomFilter(
      "display.refresh_rate_hz",
      "between",
      `${minHz},${maxHz}`
    );
  }

  public displayBrightnessGreaterThanOrEqual(nits: number): this {
    return this.withCustomFilter("display.peak_brightness_nits", "gte", nits);
  }

  public displayProtectionContains(protection: string): this {
    return this.withCustomFilter("display.protection_type", "contains", protection);
  }

  // ==========================================
  //  Processor Metrics
  // ==========================================

  public cpuCoresIs(cores: number): this {
    return this.withCustomFilter("processor.total_cores", "eq", cores);
  }

  public cpuCoresGreaterThan(cores: number): this {
    return this.withCustomFilter("processor.total_cores", "gt", cores);
  }

  public cpuCoresGreaterThanOrEqual(cores: number): this {
    return this.withCustomFilter("processor.total_cores", "gte", cores);
  }

  public cpuClockSpeedGreaterThanOrEqual(ghz: number): this {
    return this.withCustomFilter("processor.max_clock_speed_ghz", "gte", ghz);
  }

  // ==========================================
  //  Memory Metrics
  // ==========================================

  public ramIs(ramGb: number): this {
    return this.withCustomFilter("memory.available_ram_gb", "eq", ramGb);
  }

  public ramGreaterThan(minRamGb: number): this {
    return this.withCustomFilter("memory.available_ram_gb", "gt", minRamGb);
  }

  public ramGreaterThanOrEqual(minRamGb: number): this {
    return this.withCustomFilter("memory.available_ram_gb", "gte", minRamGb);
  }

  public ramLessThan(maxRamGb: number): this {
    return this.withCustomFilter("memory.available_ram_gb", "lt", maxRamGb);
  }

  public ramLessOrEqual(maxRamGb: number): this {
    return this.withCustomFilter("memory.available_ram_gb", "lte", maxRamGb);
  }

  public ramBetween(minRamGb: number, maxRamGb: number): this {
    return this.withCustomFilter(
      "memory.available_ram_gb",
      "between",
      `${minRamGb},${maxRamGb}`
    );
  }

  public ramIn(...ramOptionsGb: number[]): this {
    return this.withCustomFilter(
      "memory.available_ram_gb",
      "in",
      ramOptionsGb.join(",")
    );
  }

  public storageIs(storageGb: number): this {
    return this.withCustomFilter("memory.available_storage_gb", "eq", storageGb);
  }

  public storageGreaterThan(minStorageGb: number): this {
    return this.withCustomFilter("memory.available_storage_gb", "gt", minStorageGb);
  }

  public storageGreaterThanOrEqual(minStorageGb: number): this {
    return this.withCustomFilter("memory.available_storage_gb", "gte", minStorageGb);
  }

  public storageLessThan(maxStorageGb: number): this {
    return this.withCustomFilter("memory.available_storage_gb", "lt", maxStorageGb);
  }

  public storageLessOrEqual(maxStorageGb: number): this {
    return this.withCustomFilter("memory.available_storage_gb", "lte", maxStorageGb);
  }

  public storageBetween(minStorageGb: number, maxStorageGb: number): this {
    return this.withCustomFilter(
      "memory.available_storage_gb",
      "between",
      `${minStorageGb},${maxStorageGb}`
    );
  }

  public storageIn(...storageOptionsGb: number[]): this {
    return this.withCustomFilter(
      "memory.available_storage_gb",
      "in",
      storageOptionsGb.join(",")
    );
  }

  public hasCardSlot(hasSlot: boolean = true): this {
    return this.withCustomFilter("memory.has_card_slot", "has", hasSlot);
  }

  public storageTechnologyContains(tech: string): this {
    return this.withCustomFilter("memory.storage_technology", "contains", tech);
  }

  // ==========================================
  //  Power & Battery Metrics
  // ==========================================

  public batteryIs(mah: number): this {
    return this.withCustomFilter("power.capacities_mah", "eq", mah);
  }

  public batteryGreaterThan(mah: number): this {
    return this.withCustomFilter("power.capacities_mah", "gt", mah);
  }

  public batteryGreaterThanOrEqual(mah: number): this {
    return this.withCustomFilter("power.capacities_mah", "gte", mah);
  }

  public batteryLessThan(mah: number): this {
    return this.withCustomFilter("power.capacities_mah", "lt", mah);
  }

  public batteryLessOrEqual(mah: number): this {
    return this.withCustomFilter("power.capacities_mah", "lte", mah);
  }

  public batteryBetween(minMah: number, maxMah: number): this {
    return this.withCustomFilter(
      "power.capacities_mah",
      "between",
      `${minMah},${maxMah}`
    );
  }

  public wiredChargingGreaterThanOrEqual(watts: number): this {
    return this.withCustomFilter("power.max_wired_charging_w", "gte", watts);
  }

  public hasWirelessCharging(hasWireless: boolean = true): this {
    return this.withCustomFilter("power.has_wireless_charging", "has", hasWireless);
  }

  // ==========================================
  //  Camera Metrics
  // ==========================================

  public mainCameraLensesGreaterThanOrEqual(lenses: number): this {
    return this.withCustomFilter("cameras.main_lenses_count", "gte", lenses);
  }

  public mainCameraResolutionGreaterThan(mp: number): this {
    return this.withCustomFilter("cameras.max_main_resolution_mp", "gt", mp);
  }

  public mainCameraResolutionGreaterThanOrEqual(mp: number): this {
    return this.withCustomFilter("cameras.max_main_resolution_mp", "gte", mp);
  }

  public selfieCameraLensesGreaterThanOrEqual(lenses: number): this {
    return this.withCustomFilter("cameras.selfie_lenses_count", "gte", lenses);
  }

  // ==========================================
  //  Physical Metrics
  // ==========================================

  public weightGramsLessThan(maxWeight: number): this {
    return this.withCustomFilter("physical.weight_g", "lt", maxWeight);
  }

  public weightGramsLessOrEqual(maxWeight: number): this {
    return this.withCustomFilter("physical.weight_g", "lte", maxWeight);
  }

  public ipRatingIs(ipRating: string): this {
    return this.withCustomFilter("physical.ip_rating", "eq", ipRating);
  }

  public ipRatingContains(ipRating: string): this {
    return this.withCustomFilter("physical.ip_rating", "contains", ipRating);
  }

  public isWaterResistant(isWaterResistant: boolean = true): this {
    return this.withCustomFilter("physical.is_water_resistant", "has", isWaterResistant);
  }

  public hasWaterResistance(isWaterResistant: boolean = true): this {
    return this.isWaterResistant(isWaterResistant);
  }

  public buildMaterialContains(material: string): this {
    return this.withCustomFilter("physical.build_materials", "contains", material);
  }

  public simOptionContains(simOption: string): this {
    return this.withCustomFilter("physical.sim_options", "contains", simOption);
  }

  // ==========================================
  //  Sound Metrics
  // ==========================================

  public hasStereoSpeakers(hasStereo: boolean = true): this {
    return this.withCustomFilter("sound.has_stereo_speakers", "has", hasStereo);
  }

  public has35mmJack(hasJack: boolean = true): this {
    return this.withCustomFilter("sound.has_jack_35mm", "has", hasJack);
  }

  public hasHeadphoneJack(hasJack: boolean = true): this {
    return this.has35mmJack(hasJack);
  }

  // ==========================================
  //  Connectivity Metrics
  // ==========================================

  public bluetoothVersionGreaterThanOrEqual(version: number): this {
    return this.withCustomFilter("connectivity.bluetooth_version", "gte", version);
  }

  public hasNfc(hasNfc: boolean = true): this {
    return this.withCustomFilter("connectivity.has_nfc", "has", hasNfc);
  }

  public hasInfrared(hasInfrared: boolean = true): this {
    return this.withCustomFilter("connectivity.has_infrared", "has", hasInfrared);
  }

  public hasRadio(hasRadio: boolean = true): this {
    return this.withCustomFilter("connectivity.has_radio", "has", hasRadio);
  }

  public hasUsbOtg(hasOtg: boolean = true): this {
    return this.withCustomFilter("connectivity.usb_has_otg", "has", hasOtg);
  }

  public usbHasOtg(hasOtg: boolean = true): this {
    return this.hasUsbOtg(hasOtg);
  }

  public usbTypeContains(usbType: string): this {
    return this.withCustomFilter("connectivity.usb_type", "contains", usbType);
  }

  // ==========================================
  //  Benchmarks & EU Label Metrics
  // ==========================================

  public antutuScoreGreaterThanOrEqual(score: number): this {
    return this.withCustomFilter("benchmarks.antutu_score", "gte", score);
  }

  public geekbenchScoreGreaterThanOrEqual(score: number): this {
    return this.withCustomFilter("benchmarks.geekbench_score", "gte", score);
  }

  public euEnergyClassIs(energyClass: string): this {
    return this.withCustomFilter("eulabel.energy_class", "eq", energyClass);
  }

  public euRepairabilityClassIs(repairabilityClass: string): this {
    return this.withCustomFilter("eulabel.repairability_class", "eq", repairabilityClass);
  }

  // ==========================================
  //  Query Serialization & Execution
  // ==========================================

  public getParameters(): Map<string, string> {
    return this._params;
  }

  public toQueryString(): string {
    if (this._params.size === 0) return "";

    const parts: string[] = [];
    this._params.forEach((value, key) => {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });
    return "?" + parts.join("&");
  }

  public async execute(signal?: AbortSignal): Promise<DeviceSpecsResponse[]> {
    if (!this._executor) {
      throw new Error(
        "Cannot execute query because no client instance was supplied to this DeviceQueryBuilder."
      );
    }
    return this._executor.executeFilterQuery(this.toQueryString(), signal);
  }
}
