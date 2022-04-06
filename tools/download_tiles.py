import argparse
import os
import time
from typing import NamedTuple

from progress.bar import Bar
import requests


class Bounds(NamedTuple("Bounds", [("left", float), ("top", float),
                                   ("right", float), ("bottom", float)])):
    def contains(self, rect: "Bounds") -> bool:
        return not (rect.right < self.left or
                    rect.left > self.right or
                    rect.top > self.bottom or
                    rect.bottom < self.top)

    @property
    def x(self) -> float:
        return 0.5 * (self.left + self.right)

    @property
    def y(self) -> float:
        return 0.5 * (self.top + self.bottom)

    def move(self, dx: float, dy: float) -> "Bounds":
        return Bounds(self.left + dx, self.top + dy,
                      self.right + dx, self.bottom + dy)


URIF = "https://api.maptiler.com/maps/streets/static/{lon:.4f},{lat:.4f},{zoom}/{width}x{height}.jpg?key={key}"
NAMEF = "tile_{row}_{col}.jpg"
ROMANIA = Bounds(17.557, 43.468, 28.103, 47.694)


def _parse_args():
    parser = argparse.ArgumentParser("MapTiler Static API Client")
    parser.add_argument("output_dir", help="Output directory for tile images")
    parser.add_argument("key", help="MapTiler API Key")
    parser.add_argument("--lat0", type=float, default=44.35)
    parser.add_argument("--lat1", type=float, default=53.03)
    parser.add_argument("--lon0", type=float, default=20.73)
    parser.add_argument("--lon1", type=float, default=41.92)
    parser.add_argument("--rows", type=int, default=72)
    parser.add_argument("--cols", type=int, default=70)
    parser.add_argument("--width", type=int, default=960)
    parser.add_argument("--height", type=int, default=550)
    parser.add_argument("--lon-width", type=float, default=0.3295)
    parser.add_argument("--lat-height", type=float, default=0.1257)
    parser.add_argument("--zoom", type=int, default=11)
    return parser.parse_args()


def _main():
    args = _parse_args()

    start = Bounds(args.lon0, args.lat0,
                   args.lon0 + args.lon_width, args.lat0 + args.lat_height)
    start = start.move(-0.5 * args.lon_width, -0.5 * args.lat_height)
    dx = (args.lon1 - args.lon0) / (args.cols - 1)
    dy = (args.lat1 - args.lat0) / (args.rows - 1)

    print(dx, args.lon_width, dy, args.lat_height)
    assert dx < args.lon_width and dy < args.lat_height

    if not os.path.exists(args.output_dir):
        os.makedirs(args.output_dir)

    progress = Bar("Downloading tiles", max=args.rows * args.cols)
    for r in range(args.rows):
        for c in range(args.cols):
            progress.next()
            tile = start.move(dx * c, dy * r)
            if ROMANIA.contains(tile):
                continue

            url = URIF.format(lon=tile.x, lat=tile.y, zoom=args.zoom,
                              width=args.width, height=args.height,
                              key=args.key)
            name = NAMEF.format(row=r, col=c)
            path = os.path.join(args.output_dir, name)
            if os.path.exists(path):
                continue

            time.sleep(1)
            with requests.get(url) as res:
                res.raise_for_status()
                with open(path, "wb") as file:
                    file.write(res.content)

    progress.finish()


if __name__ == "__main__":
    _main()
