#!/bin/sh
# Rebuild runtime images from the original cropped PNGs. Requires cwebp.
set -eu
cd "$(dirname "$0")/.."
cwebp -quiet -q 85 -m 6 public/assets/english-rhythm-background.png -o public/assets/english-rhythm-background.webp
for asset in drum drumstick-left drumstick-right sentence-frame; do
  cwebp -quiet -lossless -m 6 "public/assets/$asset.png" -o "public/assets/$asset.webp"
done
