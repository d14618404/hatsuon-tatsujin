"""Reproduce supplied atlas crops. Requires Pillow; never modifies originals."""
from pathlib import Path
from PIL import Image
import json
import shutil
root = Path(__file__).resolve().parent.parent
out = root / 'public/assets'
out.mkdir(parents=True, exist_ok=True)
image = Image.open(root / 'english-rhythm-sprite-atlas.png')
manifest = {}
for name, x, y in [('drum', 0, 0), ('drumstick-left', 627, 0), ('drumstick-right', 0, 627), ('sentence-frame', 627, 627)]:
    tile = image.crop((x, y, x + 627, y + 627))
    bounds = tile.getchannel('A').point(lambda a: 255 if a > 32 else 0).getbbox()
    box = (max(0, bounds[0]-4), max(0, bounds[1]-4), min(627, bounds[2]+4), min(627, bounds[3]+4))
    tile.crop(box).save(out / (name + '.png'))
    manifest[name] = {'tile': [x, y, 627, 627], 'trim': box, 'alphaThreshold': 32}
shutil.copy(root / 'english-rhythm-background.png', out)
(out / 'crops.json').write_text(json.dumps(manifest, indent=2))
