# BPMN Editör (Vue 3 + bpmn-js)

Örnek Vue 3 projesi; bpmn-js ile özel task paleti barındıran BPMN editör.

## Kurulum

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışır.

## Özellikler

- Start, User Task, User Group Task, Service Task, Decision Node, Notification, API Call, End düğümleri için özel palet.
- Her öğe `data-task-type` alanı üzerinden renklenir ve tanımlı metadataları taşır.
- Başlangıç diyagramı hazır gelir, XML içe/dışa aktarma butonları mevcuttur.
- Modal üzerinden çift tıklayarak dokümandaki `attr.md` referansına uygun tüm `data-*` alanları düzenleyebilirsiniz; alanlar tip bazlı gösterilir.

## Notlar

- Bağımlılıkları indirmek için internet gerekir; çevrimdışı çalışacaksanız paketleri önceden temin edin.
- Palet/renk haritaları `src/bpmn/taskTypes.js` dosyasında tutulur; yeni tip eklemek için aynı dosyaya ekleme yapmanız yeterli.
