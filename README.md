# HomePage
Kairun Wen's HomePage

## Homepage views

GA4 property `553978254`, web stream `15771368119`, measurement ID `G-DF4WX2Z0XM`.
Tracking runs only on the production homepage; local previews are excluded.
Enhanced measurement is disabled in the stream so section navigation is not counted as another visit.

Views are recorded privately in [Google Analytics](https://analytics.google.com/analytics/web/#/a407755889p553978254/reports/intelligenthome).
The website does not display or publish a view count. GA reporting can be delayed.

For an optional local query of `screenPageViews` since 2026-09-14 (not unique visitors),
use the reporting service account with **Viewer** access and keep its JSON key outside this repo:

```sh
python3 -m venv /tmp/homepage-analytics-venv
/tmp/homepage-analytics-venv/bin/pip install google-auth requests
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/outside/repo/key.json /tmp/homepage-analytics-venv/bin/python scripts/update_views.py
```

The script prints the count locally without writing a public snapshot.

References: [GA pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views),
[Data API setup](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart).
