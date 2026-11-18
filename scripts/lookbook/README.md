# Lookbook try-on layers

Every garment on `/lookbook` is a transparent image the same size as the
model's base photo (Admin → Lookbook). This folder makes those images.

## 1. Try-on photo (Higgsfield)

For each product colour, edit the **base photo** with GPT Image 2.6
(`gpt_image_2_6`, quality `high`, resolution `2k`, same aspect ratio as the
base). References: the base photo first, then the product's front photo and
one 3/4 photo. Prompt pattern:

> Edit the FIRST image only. Replace the <base garment> with the <product
> description> from the other reference images. Match the exact colour, knit
> pattern and fit. Everything else must stay exactly the same as the first
> image: same face, hair, pose, hands, other clothes, shoes, background,
> framing and lighting. Do not move or resize the person.

FLUX 3 changed the model's face in testing; don't use it for this.

## 2. Cut the layer

```bash
pip install onnxruntime scipy pillow numpy
curl -L -o segformer_clothes.onnx https://huggingface.co/mattmdjaga/segformer_b2_clothes/resolve/main/onnx/model.onnx
python3 make_layer.py segformer_clothes.onnx base.png edit.png top out/sweater-taupe
```

Slot by type: hat → `head`, tshirt/shirt → `top`, pants/skirt → `bottom`.
It writes `out/<name>.png` (full size) and `out/<name>.webp` (half size).

## 3. Upload and approve

Admin → Lookbook → pick the product → upload the `.webp`. New layers start as
drafts; check them on the model, then press **Нийтлэх**. Only approved layers
show on the storefront, and the try-on replaces the old "build the look"
block once one gender has a model photo and at least one approved layer.

A person must check every layer against the real garment (colour, knit
pattern, length) before approving it.
