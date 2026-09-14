"""Run with python3 check_site.py; no dependencies required."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent

class SiteCheck(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.anchors, self.labels = set(), [], []
        self.publications = self.abstracts = self.videos = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f"Duplicate ID: {attrs['id']}"
            self.ids.add(attrs['id'])
        self.labels.extend(attrs.get('aria-labelledby', '').split())
        for key in ('src', 'href', 'poster'):
            if key not in attrs:
                continue
            url = urlsplit(attrs[key])
            assert url.scheme != 'javascript', 'Use native details for disclosures'
            if not url.scheme and not url.netloc:
                if url.path:
                    assert (ROOT / unquote(url.path)).is_file(), f"Missing asset: {url.path}"
                elif url.fragment:
                    self.anchors.append(unquote(url.fragment))
        if tag == 'img':
            assert 'alt' in attrs, 'Image missing alt text'
        if tag == 'video':
            assert 'controls' in attrs and 'aria-label' in attrs
            assert 'autoplay' not in attrs, 'Keep playback user-controlled'
            self.videos += 1
        if tag == 'article' and attrs.get('class') == 'publication':
            self.publications += 1
        if attrs.get('class') == 'abstract':
            self.abstracts += 1

page = SiteCheck()
page.feed((ROOT / 'index.html').read_text())
assert set(page.anchors + page.labels) <= page.ids, 'Missing anchor or heading'
assert page.publications == 7 and page.abstracts == 8
assert page.videos == 5
print('PASS: 7 publications, 8 abstracts, 5 accessible videos; unique IDs and valid local links.')

from scripts.update_views import view_count
headers = {"metricHeaders": [{"name": "screenPageViews", "type": "TYPE_INTEGER"}]}
assert view_count(headers) == 0
assert view_count({"metadata": {"currencyCode": "CNY", "timeZone": "Asia/Shanghai"}, "kind": "analyticsData#runReport"}) == 0
assert view_count(dict(headers, rows=[{"metricValues": [{"value": "1234"}]}])) == 1234
for report in ({}, dict(headers, metadata={"subjectToThresholding": True}),
               dict(headers, rows=[{"metricValues": [{"value": "-1"}]}])):
    try:
        view_count(report)
    except ValueError:
        pass
    else:
        raise AssertionError('Invalid report must not overwrite the saved count')
print('PASS: GA export accepts real zero/counts and rejects invalid or thresholded reports.')
