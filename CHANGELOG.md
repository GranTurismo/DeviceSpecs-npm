# Changelog

## 1.0.1 - 2026-11-09

### Fixed
- Default `baseUrl` now points at the RapidAPI gateway (`https://gsmarenaparser.p.rapidapi.com/`) and the default `x-rapidapi-host` header matches it. Previous releases defaulted to the marketing site's proxy, which bypassed RapidAPI metering and did not reach the production dataset. Explicit `baseUrl` / `apiHost` options keep working; when only `baseUrl` is given, `apiHost` is derived from it.
- Corrected repository, homepage and bug-tracker links in `package.json` and the README.

### Added
- README sections for client options and the other official SDKs (Python, .NET) and the MCP server.

## 1.0.0 - 2026-07-30
- Initial release.
