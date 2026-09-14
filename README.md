# HomePage
Kairun Wen's HomePage

## Homepage views

GA4 property `553978254`, web stream `15771368119`, measurement ID `G-DF4WX2Z0XM`.
Tracking runs only on the production homepage; local previews are excluded.
Enhanced measurement is disabled in the stream so section navigation is not counted as another visit.

The footer reads `data/page-views.json`, an aggregate export of `screenPageViews`
since 2026-09-14 (not unique visitors). Until a successful export, it shows `—`.
The exporter preserves the last snapshot on API errors. GA reporting can be delayed.

To refresh the export, grant the reporting service account **Viewer** on this
property, enable the Google Analytics Data API, and keep its JSON key outside this repo:

```sh
python3 -m venv /tmp/homepage-analytics-venv
/tmp/homepage-analytics-venv/bin/pip install google-auth requests
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/outside/repo/key.json /tmp/homepage-analytics-venv/bin/python scripts/update_views.py
```

Publish the resulting JSON with the website to update the displayed count.
Automatic refresh is not enabled yet; run the exporter and publish its snapshot to refresh the count.

References: [GA pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views),
[Data API setup](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart).
