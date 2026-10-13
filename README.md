# Box Box

Günlük F1 pilot grid bulmacası. Her gün iki dönemde (Tüm Zamanlar, 2000 Sonrası) ve üç zorlukta yeni bir 3x3 grid açılır. Satır ve sütundaki iki şartı da sağlayan pilotu bulursun.

- Site: GitHub Pages (`index.html`, `app.js`, `data.js`)
- Hesap ve seri: Supabase (Google ile giriş, `supabase/schema.sql`)
- Veri: [STATS F1](https://www.statsf1.com) yarış kayıtları, 2026 Singapur GP dahil

## Dosyalar

| Dosya | İçerik |
|-|-|
| `index.html` | Sayfa yapısı ve stil |
| `app.js` | Oyun, grid üretimi, seri, arşiv, sıralama |
| `data.js` | Pilot verisi (Tüm Zamanlar 380, 2000 Sonrası 130 pilot) |
| `config.js` | Supabase adresi ve anon anahtarı |
| `supabase/schema.sql` | Tablolar, güvenlik kuralları, sıralama görünümü |

## Veriyi güncellemek

Her yarıştan sonra `data.js` yeniden üretilir. Bir pilotun satırı:
`ad | ülke kodu | ilk yıl | son yıl | yarış | galibiyet | pole | podyum | şampiyonluk | takımlar | podyum aldığı takımlar | kazandığı takımlar`
