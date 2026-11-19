"""Cut an accessory worn OVER other clothes (hood-bib, scarf) for the lookbook try-on.

Make it in two AI edits so it separates cleanly:
  1. base photo -> same photo with the top recoloured flat chroma-key green
  2. green photo -> green photo wearing the accessory
The accessory is then every pixel that changed between 1 and 2, is not green,
and is joined to the head. See scripts/lookbook/README.md.

usage: make_accessory_layer.py base.jpg green.png accessory.png out_prefix [segformer.onnx]

With the SegFormer clothing model given, the face inside a hood is left out,
so the real face of the base photo shows instead of the AI's redrawn one.
"""
import sys, json
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

base_p, green_p, acc_p, out = sys.argv[1:5]
model_p = sys.argv[5] if len(sys.argv) > 5 else None
base = Image.open(base_p).convert("RGB")
W, H = base.size
green = Image.open(green_p).convert("RGB").resize((W, H), Image.LANCZOS)
acc = Image.open(acc_p).convert("RGB").resize((W, H), Image.LANCZOS)

g = np.asarray(green.filter(ImageFilter.GaussianBlur(2))).astype(np.float32)
a = np.asarray(acc.filter(ImageFilter.GaussianBlur(2))).astype(np.float32)
changed = np.sqrt(((g - a) ** 2).sum(2)) > 30

r, gg, b = a[..., 0], a[..., 1], a[..., 2]
is_green = (gg > r + 30) & (gg > b + 30)            # chroma green and its spill
m = changed & ~is_green
m &= np.arange(H)[:, None] < 0.6 * H
m = ndi.binary_opening(m, structure=np.ones((3, 3)))
lab, n = ndi.label(m)
touching = np.unique(lab[m & (np.arange(H)[:, None] < 0.24 * H)])
m = np.isin(lab, touching[touching > 0])
m = ndi.binary_fill_holes(ndi.binary_closing(m, structure=np.ones((5, 5)))) & ~is_green

if model_p:
    import onnxruntime as ort
    sess = ort.InferenceSession(model_p, providers=["CPUExecutionProvider"])
    x = np.asarray(acc.resize((512, 512), Image.BILINEAR)).astype(np.float32) / 255
    x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    logits = sess.run(None, {sess.get_inputs()[0].name: x})[0][0]
    seg = np.stack([np.asarray(Image.fromarray(c).resize((W, H), Image.BILINEAR)) for c in logits]).argmax(0)
    face = ndi.binary_fill_holes(seg == 11)          # face incl. eyes and mouth
    m &= ~ndi.binary_erosion(face, iterations=2)     # keep the hood's own edge

alpha = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
# Remove green spill from the kept edge pixels.
px = np.asarray(acc).astype(np.float32)
px[..., 1] = np.minimum(px[..., 1], (px[..., 0] + px[..., 2]) / 2 + 12)
layer = Image.fromarray(px.clip(0, 255).astype(np.uint8))
layer.putalpha(alpha)
layer.save(out + ".png")
layer.save(out + ".webp", quality=88, method=6)
print(json.dumps({"layer_area_pct": round(100 * float(m.mean()), 2)}))
