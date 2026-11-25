"""Cut a TOP layer (sweater, cardigan, vest, T-shirt) and save a check sheet.

Runs make_layer.py, then removes what the AI drew below the new top's hem
(its version of the trousers). Without this, a top that ends higher than
the base photo's top leaves a strip of AI trousers over every bottom layer.

usage: make_top_layer.py model.onnx base.jpg edit.png out_prefix [bottom.webp ...]

Writes out_prefix.png, out_prefix.webp (upload this one) and
out_prefix_sheet.jpg: the layer on the base photo and on each bottom given,
plus a zoom of the hem. Look at the sheet once; nothing else needs checking.
"""
import subprocess, sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image
from scipy import ndimage as ndi

TOP, SKIRT, PANTS = 4, 5, 6  # SegFormer clothes labels

model_p, base_p, edit_p, out = sys.argv[1:5]
bottoms = sys.argv[5:]

subprocess.run(
    [sys.executable, str(Path(__file__).with_name("make_layer.py")), model_p, base_p, edit_p, "top", out],
    check=True, capture_output=True,
)

base = Image.open(base_p).convert("RGB")
W, H = base.size
edit = Image.open(edit_p).convert("RGB").resize((W, H), Image.LANCZOS)
sess = ort.InferenceSession(model_p, providers=["CPUExecutionProvider"])


def seg(img):
    x = np.asarray(img.resize((512, 512), Image.BILINEAR)).astype(np.float32) / 255
    x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    logits = sess.run(None, {sess.get_inputs()[0].name: x})[0][0]
    return np.stack([np.asarray(Image.fromarray(c).resize((W, H), Image.BILINEAR)) for c in logits]).argmax(0)


seg_b, seg_e = seg(base), seg(edit)
top = seg_e == TOP
cols = [x for x in range(int(W * 0.43), int(W * 0.57), 4) if top[: int(H * 0.65), x].any()]
hem = int(np.median([np.nonzero(top[: int(H * 0.65), x])[0].max() for x in cols]))

# Below the hem, drop pixels that are trousers/skirt in either photo: the
# bottom layer (or the base) shows there. Arms and background stay, so the
# base photo's sleeves stay covered.
lower = np.ones((H, W), bool)
lower[: hem + 2] = False
lower[hem + int(H * 0.1):] = False
bottom = ndi.binary_dilation(np.isin(seg_b, [SKIRT, PANTS]) | np.isin(seg_e, [SKIRT, PANTS]), iterations=3)
# Trousers the same colour as the top get labelled "top" too, so under the
# torso (the top's width just above the hem) everything but skin goes.
row = top[hem - 10]
c = W // 2
x0, x1 = c, c
while x0 > 0 and row[x0 - 1]:
    x0 -= 1
while x1 < W - 1 and row[x1 + 1]:
    x1 += 1
rgb = np.asarray(edit).astype(np.int16)
skin = (rgb[..., 0] - rgb[..., 2] > 28) & (rgb[..., 0] > rgb[..., 1])
skin = ndi.binary_opening(skin, iterations=4)  # lone warm specks in the knit are not skin
torso = np.zeros((H, W), bool)
torso[:, x0:x1 + 1] = True
layer = np.asarray(Image.open(out + ".png")).copy()
layer[..., 3][lower & ((bottom & ~top) | (torso & ~skin))] = 0
Image.fromarray(layer).save(out + ".png")
Image.fromarray(layer).save(out + ".webp", quality=88, method=6)

# Check sheet: base + each bottom, then a hem/arm zoom on the last one.
lay = Image.fromarray(layer)
tiles = []
for b in [None, *bottoms]:
    c = base.convert("RGBA")
    if b:
        c.alpha_composite(Image.open(b).convert("RGBA").resize((W, H)))
    c.alpha_composite(lay)
    tiles.append(c.convert("RGB"))
zoom = tiles[-1].crop((int(W * 0.25), hem - int(H * 0.2), int(W * 0.75), hem + int(H * 0.08)))
w, h = W // 3, H // 3
zw = round(h * zoom.width / zoom.height)
sheet = Image.new("RGB", (w * len(tiles) + zw, h), "white")
for i, t in enumerate(tiles):
    sheet.paste(t.resize((w, h)), (i * w, 0))
sheet.paste(zoom.resize((zw, h)), (w * len(tiles), 0))
sheet.save(out + "_sheet.jpg", quality=85)
print(f"{out}: hem row {hem}, layer {100 * (layer[..., 3] > 128).mean():.1f}% of the frame")
