export interface DeviceVariant {
  id: number;
  model_number: string;
}

export interface DisplayMetrics {
  size_inches?: number;
  panel_type?: string;
  refresh_rate_hz?: number;
  peak_brightness_nits?: number;
  protection_type?: string;
}

export interface CpuMetrics {
  total_cores?: number;
  max_clock_speed_ghz?: number;
}

export interface MemoryMetrics {
  available_ram_gb?: number[];
  available_storage_gb?: number[];
  has_card_slot?: boolean;
  storage_technology?: string;
}

export interface PowerMetrics {
  capacities_mah?: number[];
  max_wired_charging_w?: number;
  has_wireless_charging?: boolean;
}

export interface CameraSummary {
  main_lenses_count?: number;
  max_main_resolution_mp?: number;
  selfie_lenses_count?: number;
}

export interface PhysicalMetrics {
  height_mm?: number;
  width_mm?: number;
  thickness_mm?: number;
  weight_g?: number;
  build_materials?: string[];
  sim_options?: string[];
  ip_rating?: string;
  is_water_resistant?: boolean;
}

export interface SoundMetrics {
  has_stereo_speakers?: boolean;
  has_jack_35mm?: boolean;
  audio_quality_features?: string[];
}

export interface ConnectivityMetrics {
  wlan_features?: string[];
  bluetooth_version?: number;
  bluetooth_features?: string[];
  positioning_tech?: string[];
  has_nfc?: boolean;
  has_infrared?: boolean;
  has_radio?: boolean;
  usb_type?: string;
  usb_has_otg?: boolean;
}

export interface BenchmarkMetrics {
  antutu_score?: string;
  geekbench_score?: string;
  measured_display_brightness_nits?: number;
  measured_loudspeaker_lufs?: number;
  measured_battery_active_use_hours?: number;
}

export interface EuLabelMetrics {
  energy_class?: string;
  battery_endurance?: string;
  battery_endurance_hours?: number;
  free_fall_class?: string;
  repairability_class?: string;
}

export interface NormalizedSpecs {
  display?: DisplayMetrics;
  processor?: CpuMetrics;
  memory_options?: MemoryMetrics;
  battery_and_charging?: PowerMetrics;
  cameras?: CameraSummary;
  physical?: PhysicalMetrics;
  sound?: SoundMetrics;
  connectivity?: ConnectivityMetrics;
  benchmarks?: BenchmarkMetrics;
  eu_label?: EuLabelMetrics;
}

export interface DeviceSpecsResponse {
  id: number;
  manufacturer: string;
  model: string;
  network: string;
  announceDate: string;
  status: string;
  chipset: string;
  androidVersion: string;
  battery_raw: string;
  cpu_raw: string;
  displayResolution_raw: string;
  displaySize_raw: string;
  displayType_raw: string;
  gpu: string;
  internal_raw: string;
  mainCameraFeatures: string;
  mainCameraSpecs_raw: string;
  mainVideoSpecs: string;
  selfieCameraFeatures: string;
  selfieCameraSpecs_raw: string;
  selfieVideoSpecs: string;
  sensors: string;
  charging_raw: string;
  price_usd?: number;
  price_eur?: number;
  price_gbp?: number;
  colors?: string[];
  variants?: DeviceVariant[];
  normalized_specs?: NormalizedSpecs;
}

export interface DeviceSpecsOptions {
  apiKey: string;
  baseUrl?: string;
  apiHost?: string;
}
