"""
Tatlı Takip — App Icon Generator
Çalıştır: python make_icons.py
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import os, math

OUT = os.path.dirname(os.path.abspath(__file__))

# ── Renk paleti ────────────────────────────────
BG_INNER  = (10,  17,  34)   # #0a1122
BG_OUTER  = ( 5,   9,  18)   # #050912
FACET_A   = (254, 230, 138)  # #fee68a — en aydınlık (sol üst)
FACET_B   = (245, 165,  25)  # #f5a519 — üst sağ
FACET_C   = (210, 110,   8)  # #d26e08 — sol alt
FACET_D   = (140,  60,   8)  # #8c3c08 — en karanlık (sağ alt)
EDGE_HI   = (255, 245, 200)  # kenar highlight
GLOW_COL  = (245, 158,  11)  # amber glow
JEWEL_COL = (255, 250, 220)  # merkez parlama

def radial_bg(size):
    """Koyu radyal degrade arka plan (numpy)"""
    cx = cy = size / 2.0
    x = np.arange(size, dtype=np.float32)
    y = np.arange(size, dtype=np.float32)
    xx, yy = np.meshgrid(x, y)
    dist = np.sqrt((xx - cx)**2 + (yy - cy)**2) / (size * 0.72)
    dist = np.clip(dist, 0, 1)

    r = np.clip(BG_INNER[0] * (1-dist) + BG_OUTER[0] * dist, 0, 255).astype(np.uint8)
    g = np.clip(BG_INNER[1] * (1-dist) + BG_OUTER[1] * dist, 0, 255).astype(np.uint8)
    b = np.clip(BG_INNER[2] * (1-dist) + BG_OUTER[2] * dist, 0, 255).astype(np.uint8)
    a = np.full((size, size), 255, dtype=np.uint8)
    return Image.fromarray(np.stack([r, g, b, a], axis=2), 'RGBA')

def rounded_mask(size, radius_pct=0.19):
    radius = int(size * radius_pct)
    mask = Image.new('L', (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=255)
    return mask

def draw_icon(draw_size, safe_pct=0.74, flat_bottom=False):
    """
    draw_size : çizim çözünürlüğü (2x, sonra küçültülecek)
    safe_pct  : elmasın boyutu (1.0 = tam frame'i doldur)
    flat_bottom: maskable için elmasın biraz küçük olması
    """
    S = draw_size
    cx = cy = S // 2

    # ── Arka plan ──────────────────────────────
    img = radial_bg(S)
    draw = ImageDraw.Draw(img, 'RGBA')

    # ── Glow (elmanın arkasında) ────────────────
    glow_r = int(S * safe_pct * 0.48)
    glow_img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow_img)
    for step in range(40, 0, -1):
        alpha = int(step * 3.2)
        r = glow_r + (40 - step) * 3
        gd.ellipse([cx - r, cy - r, cx + r, cy + r],
                   fill=(*GLOW_COL, alpha))
    glow_img = glow_img.filter(ImageFilter.GaussianBlur(int(S * 0.06)))
    img = Image.alpha_composite(img, glow_img)
    draw = ImageDraw.Draw(img, 'RGBA')

    # ── Elmas (baklava) köşe noktaları ─────────
    hw = int(S * safe_pct * 0.50)   # yatay yarı genişlik
    hh = int(S * safe_pct * 0.58)   # dikey yarı yükseklik
    top    = (cx,      cy - hh)
    right  = (cx + hw, cy      )
    bottom = (cx,      cy + hh)
    left   = (cx - hw, cy      )
    C      = (cx, cy)

    # ── 4 facet (üçgen) ────────────────────────
    # Işık sol üstten geliyor gibi
    draw.polygon([top, left, C],   fill=(*FACET_A, 255))  # sol üst — en parlak
    draw.polygon([top, C, right],  fill=(*FACET_B, 255))  # sağ üst
    draw.polygon([C, left, bottom],fill=(*FACET_C, 255))  # sol alt
    draw.polygon([C, right, bottom],fill=(*FACET_D, 255)) # sağ alt — en karanlık

    # ── Kenar çizgileri (ince highlight) ───────
    lw = max(2, S // 128)
    edge_col = (*EDGE_HI, 160)
    draw.line([top, left],   fill=edge_col, width=lw)
    draw.line([top, right],  fill=edge_col, width=lw)

    dark_edge = (20, 10, 2, 180)
    draw.line([left, bottom],  fill=dark_edge, width=lw)
    draw.line([right, bottom], fill=dark_edge, width=lw)

    # Orta çizgiler (facet sınırları)
    mid_col = (180, 100, 10, 120)
    draw.line([top, bottom], fill=mid_col, width=max(1, lw//2))
    draw.line([left, right], fill=mid_col, width=max(1, lw//2))

    # ── İç highlight (sol üst köşe parlaması) ──
    hi_pts = [top,
              (cx - hw//3, cy - hh//6),
              (cx,         cy - hh//4),
              (cx - hw//4, cy - hh//2)]
    draw.polygon(hi_pts, fill=(255, 250, 200, 60))

    # ── Merkez jewel ───────────────────────────
    jr = int(S * 0.042)
    for step in range(6, 0, -1):
        a = 40 * step
        r = jr + step * (S // 80)
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(*JEWEL_COL, a))
    draw.ellipse([cx-jr, cy-jr, cx+jr, cy+jr], fill=(*JEWEL_COL, 255))
    # Jewel küçük highlight noktası
    hr = max(2, jr // 3)
    hx, hy = cx - jr//2, cy - jr//2
    draw.ellipse([hx-hr, hy-hr, hx+hr, hy+hr], fill=(255, 255, 255, 220))

    return img

def make_png(final_size, rounded=True, safe_pct=0.74, draw_x=4):
    """Yüksek çözünürlükte çiz, küçült (anti-aliasing)"""
    ds = final_size * draw_x
    img = draw_icon(ds, safe_pct=safe_pct)

    if rounded:
        mask = rounded_mask(ds, radius_pct=0.19)
        img.putalpha(mask)

    # Beyaz/koyu zemin üstüne değil, şeffaf alpha ile — PNG olarak kaydet
    out = img.resize((final_size, final_size), Image.LANCZOS)
    return out

def save(img, filename):
    path = os.path.join(OUT, filename)
    img.save(path, 'PNG', optimize=True)
    print(f'  OK {filename}  ({img.size[0]}x{img.size[1]})')

print('\nIkon uretiliyor...\n')

# icon-512.png  (any — rounded corners, şeffaf)
save(make_png(512, rounded=True,  safe_pct=0.74), 'icon-512.png')

# icon-192.png  (any — rounded corners)
save(make_png(192, rounded=True,  safe_pct=0.74), 'icon-192.png')

# maskable-512.png (maskable — full bleed, safe zone %80 içinde)
save(make_png(512, rounded=False, safe_pct=0.62, draw_x=4), 'maskable-512.png')

# maskable-192.png
save(make_png(192, rounded=False, safe_pct=0.62, draw_x=4), 'maskable-192.png')

# apple-touch-icon.png (180x180, beyaz zemin + rounded)
apple_raw = make_png(180, rounded=True, safe_pct=0.72, draw_x=4)
apple = Image.new('RGBA', (180, 180), (10, 17, 34, 255))
apple = Image.alpha_composite(apple, apple_raw)
apple = apple.convert('RGB')
save(apple, 'apple-touch-icon.png')

# favicon-32.png
save(make_png(32, rounded=True, safe_pct=0.74, draw_x=8), 'favicon-32.png')

print('\nTamamlandi! 6 ikon olusturuldu.\n')
