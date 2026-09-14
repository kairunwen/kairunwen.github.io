"""Export the homepage's aggregate GA4 views; see README.md for authentication."""
import json
import os
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROPERTY_ID = "553978254"


def view_count(report):
    if report.get("metadata", {}).get("subjectToThresholding"):
        raise ValueError("GA report is thresholded; keeping the previous count")
    # GA omits headers and rows entirely for a new property with no collected data.
    if report.get("kind") == "analyticsData#runReport" and not report.get("metricHeaders") and not report.get("rows"):
        return 0
    if report.get("metricHeaders") != [{"name": "screenPageViews", "type": "TYPE_INTEGER"}]:
        raise ValueError("Unexpected GA metric; keeping the previous count")
    rows = report.get("rows", [])
    if len(rows) > 1:
        raise ValueError("Expected one aggregate row")
    count = int(rows[0]["metricValues"][0]["value"]) if rows else 0
    if not 0 <= count <= 9007199254740991:
        raise ValueError("Invalid view count")
    return count


def main():
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession

    credentials = service_account.Credentials.from_service_account_file(
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"],
        scopes=["https://www.googleapis.com/auth/analytics.readonly"],
    )
    with AuthorizedSession(credentials) as session:
        response = session.post(
            f"https://analyticsdata.googleapis.com/v1beta/properties/{PROPERTY_ID}:runReport",
            json={
                "dateRanges": [{"startDate": "2026-09-14", "endDate": "today"}],
                "metrics": [{"name": "screenPageViews"}],
                "dimensionFilter": {"andGroup": {"expressions": [
                    {"filter": {"fieldName": "hostName", "stringFilter": {
                        "matchType": "EXACT", "value": "kairunwen.github.io"}}},
                    {"filter": {"fieldName": "pagePath", "inListFilter": {
                        "values": ["/", "/index.html"]}}},
                ]}},
            },
            timeout=30,
        )
        if not response.ok:
            raise RuntimeError(f"Google Analytics returned HTTP {response.status_code}; check Data API and property Viewer access")
        count = view_count(response.json())
    output = ROOT / "data/page-views.json"
    temporary = output.with_suffix(".tmp")
    temporary.write_text(json.dumps({
        "views": count,
        "updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }) + "\n")
    temporary.replace(output)
    print(f"Exported {count} homepage views")


if __name__ == "__main__":
    main()
