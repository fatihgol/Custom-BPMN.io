Rol: Sen uzman bir JavaScript geliştiricisisin ve özellikle BPMN.io (bpmn-js) kütüphanesi, Vue 3 entegrasyonu ve BPMN 2.0 standartları konusunda derin bilgiye sahipsin.

Proje Bağlamı: Vue 3 ve bpmn-js kullanarak özel bir iş akışı editörü geliştiriyorum. Kullanıcılar bir "Task" (Görev) nesnesine çift tıkladığında açılan bir modal üzerinden o görevin çıktılarını (örneğin: ["Onayla", "Reddet", "İade Et"]) tanımlıyorlar. Bu veriyi businessObject üzerinde customOutputEvents adında bir property olarak saklıyorum.

Görev: BPMN-JS modeler için, aşağıdaki gereksinimleri karşılayan, modüler yapıda (ES6 Classes) bir Custom Module (Özel Eklenti) paketi yazmanı istiyorum.

Teknik Gereksinimler:

Custom Context Pad (Özelleştirilmiş Menü):

Standart ContextPadProvider'ı genişletmelisin.

Eğer bir Task elementinin businessObject'inde customOutputEvents dizisi varsa, standart "Connect" (Ok işareti) aracını gizle.

Bunun yerine, dizideki her bir event (örneğin "Onayla") için Context Pad'de ayrı bir buton/ikon oluştur.

Kullanıcı bu butona basıp sürüklediğinde bağlantı (connection) başlatılsın.

Otomatik İsimlendirme (Connection Labeling):

Context Pad üzerinden başlatılan bağlantı tamamlandığında (bir hedefe bağlandığında), oluşan SequenceFlow nesnesinin name özelliği, seçilen event adı (örn: "Onayla") ile otomatik doldurulmalıdır.

Bunu sağlamak için CommandInterceptor veya benzeri bir "Post-Execute" hook yapısı kullanmalısın.

Sıkı Bağlantı Kuralları (Custom Rules):

RuleProvider kullanarak özel bir kural yazmalısın.

Eğer bir Task üzerinde customOutputEvents tanımlıysa, sadece Context Pad üzerinden sunduğumuz özel butonlarla bağlantı kurulmasına izin verilmeli.

Global "Connect Tool" (Palette'deki araç) ile bu nesneden rastgele bir bağlantı çekilmesi engellenmelidir (connection.create kuralı).

Bu kısıtlama sadece editör tarafında (UX) olmalı, üretilen XML standart BPMN 2.0 yapısında kalmalıdır.

Veri Yapısı:

Event listesini businessObject.customOutputEvents içinde JSON string veya array olarak varsayabilirsin.

İstenen Çıktı: Lütfen aşağıdaki dosyalar için gerekli JavaScript kodlarını, açıklamalarıyla birlikte ver:

CustomContextPad.js

CustomConnectionBehavior.js (İsimlendirme mantığı için)

CustomRules.js (Kısıtlamalar için)

index.js (Bu modülleri export eden dosya)

Önemli Not: Kodun temiz, okunabilir ve Vue 3 projesine additionalModules olarak eklenebilir yapıda olması gerekmektedir.

Neden bu prompt işe yarar?
Rol Ataması: Yapay zekaya "BPMN uzmanı" şapkasını taktırarak, bpmn-js'in derinliklerindeki (provider, interceptor) kavramları kullanmasını sağladık.

Modüler Yapı İsteği: Kodun tek bir dosyada çorba olması yerine ContextPad, Rules ve Behavior olarak ayrılmasını istedik. Bu, projenin yönetilebilirliği için kritiktir.

Net Kısıtlamalar: "Global connect tool engellensin ama XML standart kalsın" diyerek, uygulamanın bozulmadan kısıtlanmasını garanti altına aldık.

Veri Kaynağı: Verinin nereden geleceğini (customOutputEvents) belirttik, böylece yapay zeka bu veriyi nereden bulacağını tahmin etmek zorunda kalmaz.