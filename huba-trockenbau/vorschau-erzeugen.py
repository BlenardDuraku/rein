"""Packt die Website in eine einzige HTML-Datei zum Verschicken/Öffnen ohne Server.

Aufruf: python3 huba-trockenbau/vorschau-erzeugen.py  → huba-trockenbau-vorschau.html
"""
import base64
from pathlib import Path

src = Path(__file__).parent
font = base64.b64encode((src / 'fonts/archivo-variable.woff2').read_bytes()).decode()
css = (src / 'styles.css').read_text().replace(
    'url("fonts/archivo-variable.woff2")', f'url("data:font/woff2;base64,{font}")')
js = (src / 'main.js').read_text()
fav = 'data:image/svg+xml,' + (src / 'favicon.svg').read_text().strip().replace('#', '%23').replace('"', "'")

html = (src / 'index.html').read_text()
html = html.replace('<link rel="preload" href="fonts/archivo-variable.woff2" as="font" type="font/woff2" crossorigin>\n', '')
html = html.replace('<link rel="icon" href="favicon.svg" type="image/svg+xml">', f'<link rel="icon" href="{fav}" type="image/svg+xml">')
html = html.replace('<link rel="stylesheet" href="styles.css">', f'<style>\n{css}\n</style>')
html = html.replace('<script src="main.js" defer></script>', f'<script>\n{js}\n</script>')

out = src.parent / 'huba-trockenbau-vorschau.html'
out.write_text(html)
print(f'{out} ({len(html) // 1024} KB)')
