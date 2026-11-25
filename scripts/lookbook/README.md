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
Dress → `full`: the edit replaces both the top and the trousers ("bare lower
legs, same shoes"), and the layer keeps the legs and shoes too. Upload it as
type "Даашинз"; the try-on takes the bottom off while a dress is worn.
It writes `out/<name>.png` (full size) and `out/<name>.webp` (half size).

### Accessories worn over a top (hood-bib, scarf)

The edit re-draws the top under them a little, so cut them through a green
top instead:

1. Edit the base photo: recolour the top flat chroma-key green (#00B140),
   everything else unchanged.
2. Edit that green photo to wear the accessory.
3. `python3 make_accessory_layer.py base.jpg green.png accessory.png out/hood`

## 3. Upload and approve

Admin → Lookbook → pick the product → upload the `.webp`. New layers start as
drafts; check them on the model, then press **Нийтлэх**. Only approved layers
show on the storefront, and the try-on replaces the old "build the look"
block once one gender has a model photo and at least one approved layer.

A person must check every layer against the real garment (colour, knit
pattern, length) before approving it.

## Fast path for tops (sweaters, cardigans, vests, T-shirts)

`make_top_layer.py` does step 2 for a top and also removes what the AI drew
below the new hem, which `make_layer.py` alone leaves in when the new top is
shorter than the one in the base photo. It writes one check sheet; look at
that once.

```sh
python3 make_top_layer.py segformer_clothes.onnx base.jpg edit.png out/top-name bottom1.webp bottom2.webp
# -> out/top-name.webp (upload) and out/top-name_sheet.jpg (check)
```

Per product, the whole job is:

1. Upload the base photo once per session and 1–2 front photos of the
   garment (Higgsfield `media_upload`, PUT, `media_confirm`). Several
   products can go in one `media_upload` call.
2. Generate all edits in one `generate_image_batch` call
   (`gpt_image_2_6`, quality high, 2k, 2:3, about 2.75 credits each) with:

   > Edit the FIRST image only. Use the other reference images ONLY for the
   > garment, not the person; ignore any other garments in them. Replace
   > his/her &lt;current top&gt; with &lt;garment: colour, neckline, sleeves,
   > fastening, pockets, hem&gt;. &lt;If arms become bare: Her forearms are now
   > bare, with natural skin matching her hands.&gt; The hem must reach at
   > least as low as the &lt;current top&gt;'s hem in the first image so none of
   > it remains visible. Everything else must stay exactly the same as the
   > first image: same face, hair, pose, hands, trousers, shoes, background,
   > framing, lighting. Do not move or resize the person.

3. Run `make_top_layer.py` on each result with two bottom layers and look
   at the sheets. Upload the `.webp` files in Admin → Lookbook.

Base photos are the active model photos in Admin → Lookbook (1333×2000).
Bottoms and hats still use `make_layer.py` as in step 2.
