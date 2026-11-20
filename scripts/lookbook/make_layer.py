"""Cut one garment layer for the lookbook try-on.

Compares an AI try-on edit with the base model photo and keeps the garment
(found with a SegFormer clothing model) as a transparent image the size of
the base photo. See scripts/lookbook/README.md.

usage: make_layer.py model.onnx base.png edit.png head|top|bottom out_prefix
"""
import sys, json
import numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

model_p, base_p, edit_p, slot, out = sys.argv[1:6]
base = Image.open(base_p).convert("RGB"); edit = Image.open(edit_p).convert("RGB")
if edit.size != base.size: edit = edit.resize(base.size, Image.LANCZOS)
W, H = base.size
sess = ort.InferenceSession(model_p, providers=["CPUExecutionProvider"])

def segment(img):
    x = np.asarray(img.resize((512, 512), Image.BILINEAR)).astype(np.float32) / 255
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    x = x.transpose(2, 0, 1)[None].astype(np.float32)
    logits = sess.run(None, {sess.get_inputs()[0].name: x})[0][0]          # (18, 128, 128)
    up = np.stack([np.asarray(Image.fromarray(c).resize((W, H), Image.BILINEAR)) for c in logits])
    return up.argmax(0)

seg_e = segment(edit)
seg_b = segment(base)
# The edit often shifts the studio background's brightness a little; where a
# narrower garment uncovers background that the base garment hid, that shows
# as a lighter or darker patch. Match the edit's background to the base's,
# measured locally (blurred) over pixels that are background in both.
bg = (seg_b == 0) & (seg_e == 0)
if bg.mean() > 0.05:
    e_np = np.asarray(edit).astype(np.float32); b_np = np.asarray(base).astype(np.float32)
    diff = np.where(bg[..., None], b_np - e_np, 0)
    w = ndi.gaussian_filter(bg.astype(np.float32), 60)
    corr = np.stack([ndi.gaussian_filter(diff[..., c], 60) for c in range(3)], -1) / np.maximum(w, 1e-3)[..., None]
    edit = Image.fromarray(np.clip(e_np + corr * (seg_e == 0)[..., None], 0, 255).astype(np.uint8))
d = np.sqrt(((np.asarray(base.filter(ImageFilter.GaussianBlur(2))).astype(np.float32)
              - np.asarray(edit.filter(ImageFilter.GaussianBlur(2))).astype(np.float32)) ** 2).sum(2))
changed = ndi.binary_opening(d > 22, structure=np.ones((7, 7)))
isin = lambda *ids: np.isin(seg_e, ids)
# A layer covers the union of the NEW garment and the BASE garment it replaces,
# so whatever the base wore in that slot is fully painted over (bare legs under a skirt, etc.).
base_has = lambda *ids: ndi.binary_dilation(np.isin(seg_b, ids), iterations=8)  # cover the base garment's edge pixels too
if slot == "top":
    m = isin(4, 7) | base_has(4) | (isin(14, 15) & changed)
elif slot == "bottom":
    m = isin(5, 6, 7) | base_has(5, 6) | (isin(12, 13) & changed)
else:                  # head: an accessory worn OVER other clothes - only strongly changed pixels
    # The model labels a hood or bib mostly as upper clothes, and the edit often
    # re-renders the sweater under it with thin streaks. Compare blurred images
    # so only a real change of colour counts, then keep what is joined to the
    # change around the head (only the accessory can be there).
    soft = lambda im: np.asarray(im.filter(ImageFilter.GaussianBlur(9))).astype(np.float32)
    d_low = np.sqrt(((soft(base) - soft(edit)) ** 2).sum(2))
    rows = np.arange(H)[:, None]
    m = isin(1, 17) | (isin(1, 2, 4, 11, 17) & (d_low > 28))
    m = ndi.binary_opening(m, structure=np.ones((7, 7)))
    lab, n = ndi.label(m)
    touching = np.unique(lab[m & (rows < 0.24 * H)])
    m = np.isin(lab, touching[touching > 0])
    # Blurring spreads the change onto the untouched sweater around the bib
    # and ties; drop pixels that still match the base photo.
    m &= d > 22
    m = ndi.binary_opening(m, structure=np.ones((3, 3)))
    m &= np.arange(H)[:, None] < 0.55 * H
lab, n = ndi.label(m)
if n:
    sizes = ndi.sum(m, lab, range(1, n + 1))
    m = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 0.001 * W * H])
m = ndi.binary_fill_holes(ndi.binary_closing(m, structure=np.ones((9, 9))))
alpha = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))
layer = edit.copy(); layer.putalpha(alpha); layer.save(out + ".png")
layer.resize((W // 2, H // 2), Image.LANCZOS).save(out + ".webp", quality=86)
print(json.dumps({"slot": slot, "layer_area_pct": round(100 * float(m.mean()), 2)}))
