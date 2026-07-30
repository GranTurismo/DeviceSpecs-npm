import { DeviceSpecsApiException } from "./exceptions";
import { DeviceQueryBuilder, IQueryExecutor } from "./query-builder";
import { DeviceSpecsOptions, DeviceSpecsResponse } from "./types";

const DEFAULT_BASE_URL = "https://ds.gtgroup.dev/";
const API_KEY_HEADER = "x-rapidapi-key";
const API_HOST_HEADER = "x-rapidapi-host";

const DEVICES_PATH = "api/values/clean/devices";
const DEVICES_BY_MANUFACTURER_PATH = "api/values/clean/getdevices";
const DEVICES_BY_CHIPSET_PATH = "api/values/clean/devicesbychipset";
const GET_SPECS_PATH = "api/values/clean/getspecs";
const DEVICE_BY_MODEL_NUMBER_PATH = "api/values/clean/devicebymodelnumber";

export class DeviceSpecsClient implements IQueryExecutor {
  private readonly _apiKey: string;
  private readonly _baseUrl: string;
  private readonly _apiHost: string;

  constructor(options: string | DeviceSpecsOptions) {
    if (typeof options === "string") {
      if (!options || options.trim() === "") {
        throw new Error(
          "API key cannot be null or empty. Please get a free key at https://ds.gtgroup.dev"
        );
      }
      this._apiKey = options;
      this._baseUrl = DEFAULT_BASE_URL;
      this._apiHost = "ds.gtgroup.dev";
    } else {
      if (!options || !options.apiKey || options.apiKey.trim() === "") {
        throw new Error(
          "API key cannot be null or empty. Please get a free key at https://ds.gtgroup.dev"
        );
      }
      this._apiKey = options.apiKey;
      this._baseUrl = options.baseUrl || DEFAULT_BASE_URL;
      if (!this._baseUrl.endsWith("/")) {
        this._baseUrl += "/";
      }
      this._apiHost = options.apiHost || "ds.gtgroup.dev";
    }
  }

  /**
   * Initiates a fluent query builder (e.g. client.where().manufacturerIs("Samsung").ramGreaterThanOrEqual(8).execute()).
   */
  public where(): DeviceQueryBuilder {
    return new DeviceQueryBuilder(this);
  }

  /**
   * Alias for where() query builder initiation.
   */
  public query(): DeviceQueryBuilder {
    return new DeviceQueryBuilder(this);
  }

  /**
   * Retrieves a list of mobile devices matching the specified filter parameters or query builder.
   */
  public async getDevices(
    filterOrQuery?:
      | DeviceQueryBuilder
      | {
          batteryGte?: number;
          chipsetContains?: string;
          minRamGb?: number;
          maxRamGb?: number;
        },
    signal?: AbortSignal
  ): Promise<DeviceSpecsResponse[]> {
    if (filterOrQuery instanceof DeviceQueryBuilder) {
      return this.executeFilterQuery(filterOrQuery.toQueryString(), signal);
    }

    const builder = this.where();
    if (filterOrQuery) {
      if (filterOrQuery.batteryGte !== undefined) {
        builder.batteryGreaterThanOrEqual(filterOrQuery.batteryGte);
      }
      if (filterOrQuery.chipsetContains) {
        builder.chipsetContains(filterOrQuery.chipsetContains);
      }
      if (
        filterOrQuery.minRamGb !== undefined &&
        filterOrQuery.maxRamGb !== undefined
      ) {
        builder.ramBetween(filterOrQuery.minRamGb, filterOrQuery.maxRamGb);
      } else if (filterOrQuery.minRamGb !== undefined) {
        builder.ramGreaterThanOrEqual(filterOrQuery.minRamGb);
      } else if (filterOrQuery.maxRamGb !== undefined) {
        builder.ramLessOrEqual(filterOrQuery.maxRamGb);
      }
    }

    return this.executeFilterQuery(builder.toQueryString(), signal);
  }

  /**
   * Internal executor method for DeviceQueryBuilder.
   */
  public async executeFilterQuery(
    queryString: string,
    signal?: AbortSignal
  ): Promise<DeviceSpecsResponse[]> {
    const relativeUrl = `${DEVICES_PATH}${queryString}`;
    return this.sendRequest<DeviceSpecsResponse[]>(relativeUrl, signal);
  }

  /**
   * Retrieves all tracked mobile devices from a specific manufacturer.
   */
  public async getDevicesByManufacturer(
    manufacturer: string,
    signal?: AbortSignal
  ): Promise<DeviceSpecsResponse[]> {
    if (!manufacturer || manufacturer.trim() === "") {
      throw new Error("Manufacturer name cannot be empty.");
    }
    const relativeUrl = `${DEVICES_BY_MANUFACTURER_PATH}/${encodeURIComponent(
      manufacturer.trim()
    )}`;
    return this.sendRequest<DeviceSpecsResponse[]>(relativeUrl, signal);
  }

  /**
   * Retrieves all mobile devices powered by a specific SoC/chipset.
   */
  public async getDevicesByChipset(
    chipset: string,
    signal?: AbortSignal
  ): Promise<DeviceSpecsResponse[]> {
    if (!chipset || chipset.trim() === "") {
      throw new Error("Chipset name cannot be empty.");
    }
    const relativeUrl = `${DEVICES_BY_CHIPSET_PATH}/${encodeURIComponent(
      chipset.trim()
    )}`;
    return this.sendRequest<DeviceSpecsResponse[]>(relativeUrl, signal);
  }

  /**
   * Retrieves the detailed raw and normalized specifications for a specific device model.
   */
  public async getSpecs(
    manufacturer: string,
    model: string,
    signal?: AbortSignal
  ): Promise<DeviceSpecsResponse | null> {
    if (!manufacturer || manufacturer.trim() === "") {
      throw new Error("Manufacturer name cannot be empty.");
    }
    if (!model || model.trim() === "") {
      throw new Error("Model name cannot be empty.");
    }

    const relativeUrl = `${GET_SPECS_PATH}/${encodeURIComponent(
      manufacturer.trim()
    )}/${encodeURIComponent(model.trim())}`;

    try {
      return await this.sendRequest<DeviceSpecsResponse>(relativeUrl, signal);
    } catch (error) {
      if (
        error instanceof DeviceSpecsApiException &&
        error.statusCode === 404
      ) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Retrieves a device by matching its hardware model number or variant identifier (e.g. "SM-S928B", "A3106").
   */
  public async getDeviceByModelNumber(
    modelNumber: string,
    signal?: AbortSignal
  ): Promise<DeviceSpecsResponse | null> {
    if (!modelNumber || modelNumber.trim() === "") {
      throw new Error("Model number cannot be empty.");
    }

    const relativeUrl = `${DEVICE_BY_MODEL_NUMBER_PATH}/${encodeURIComponent(
      modelNumber.trim()
    )}`;

    try {
      return await this.sendRequest<DeviceSpecsResponse>(relativeUrl, signal);
    } catch (error) {
      if (
        error instanceof DeviceSpecsApiException &&
        error.statusCode === 404
      ) {
        return null;
      }
      throw error;
    }
  }

  private async sendRequest<T>(
    relativeUrl: string,
    signal?: AbortSignal
  ): Promise<T> {
    const fullUrl = new URL(relativeUrl, this._baseUrl).toString();
    const headers: Record<string, string> = {
      Accept: "application/json",
      [API_KEY_HEADER]: this._apiKey,
      [API_HOST_HEADER]: this._apiHost,
    };

    if (typeof fetch !== "function") {
      throw new Error(
        "Global fetch is not available in this environment. Please upgrade Node.js to >=18 or provide a fetch polyfill."
      );
    }

    const response = await fetch(fullUrl, {
      method: "GET",
      headers,
      signal,
    });

    const responseContent = await response.text();

    if (!response.ok) {
      throw new DeviceSpecsApiException(
        response.status,
        responseContent,
        `DeviceSpecs API returned non-success HTTP status code ${response.status} (${response.statusText}).`
      );
    }

    try {
      return JSON.parse(responseContent) as T;
    } catch (err: any) {
      throw new DeviceSpecsApiException(
        response.status,
        responseContent,
        `Failed to parse JSON response from DeviceSpecs API: ${err.message}`
      );
    }
  }
}
