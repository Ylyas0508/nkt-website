import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import type { Product, BlogPost } from "@/lib/data";

const SEED_PRODUCTS: Product[] = [
  {
    "id": "prod-001",
    "name": { "en": "Diesel Fuel D2 (EN590)", "ru": "Дизельное топливо Д2 (EN590)", "zh": "柴油 D2 (EN590)", "tr": "Motorin D2 (EN590)" },
    "description": {
      "en": "High-quality diesel fuel EN590 standard. Available in large volumes. Delivery terms: CIF, FOB. Documentation: POP, SGS, CIQ, Bill of Lading. Origin: Russia/Kazakhstan.",
      "ru": "Высококачественное дизельное топливо стандарта EN590. Доступно в больших объёмах. Условия поставки: CIF, FOB. Документация: POP, SGS, CIQ, коносамент.",
      "zh": "高品质EN590标准柴油，大批量供应。交货条款：CIF、FOB。文件：POP、SGS、CIQ、提单。产地：俄罗斯/哈萨克斯坦。",
      "tr": "EN590 standartlarında yüksek kaliteli motorin. Büyük hacimde temin edilebilir. Teslimat: CIF, FOB. Belgeler: POP, SGS, CIQ, Konişmento."
    },
    "price": "Contact for pricing",
    "category": "oil-petroleum",
    "image": "https://c4.wallpaperflare.com/wallpaper/354/359/832/landscape-industry-the-evening-silhouettes-wallpaper-preview.jpg",
    "createdAt": "2024-01-10T08:00:00Z"
  },
  {
    "id": "prod-002",
    "name": { "en": "Steel Billets (3SP/5SP)", "ru": "Стальные заготовки (3СП/5СП)", "zh": "钢坯 (3SP/5SP)", "tr": "Çelik Kütük (3SP/5SP)" },
    "description": {
      "en": "Continuously cast steel billets, grades 3SP and 5SP. Size: 150x150mm, length 6-12m. Mill test certificates available. FOB/CIF delivery from Black Sea or Chinese ports.",
      "ru": "Непрерывнолитые стальные заготовки марок 3СП и 5СП. Размер: 150х150мм, длина 6-12м. Имеются заводские сертификаты. Поставка FOB/CIF.",
      "zh": "连铸钢坯，牌号3SP和5SP。规格：150x150mm，长度6-12米。提供厂检证书。FOB/CIF交货。",
      "tr": "Sürekli döküm çelik kütük, 3SP ve 5SP kalite. Boyut: 150x150mm, uzunluk 6-12m. Fabrika test sertifikaları mevcuttur."
    },
    "price": "Contact for pricing",
    "category": "metallurgy",
    "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    "createdAt": "2024-01-15T08:00:00Z"
  },
  {
    "id": "prod-003",
    "name": { "en": "Granulated Sulfur (98.5%+)", "ru": "Гранулированная сера (98,5%+)", "zh": "颗粒硫磺 (98.5%+)", "tr": "Granül Kükürt (%98.5+)" },
    "description": {
      "en": "High-purity granulated sulfur, purity 98.5% and above. Used in fertilizer production, chemical industry, agriculture. Available in bags or bulk. SGS certified.",
      "ru": "Гранулированная сера высокой чистоты, чистота 98,5% и выше. Применяется в производстве удобрений, химической промышленности. В мешках или навалом. Сертификат SGS.",
      "zh": "高纯度颗粒硫磺，纯度98.5%以上，用于化肥生产、化工行业、农业。袋装或散装供应，SGS认证。",
      "tr": "Yüksek saflıkta granül kükürt, saflık %98.5 ve üzeri. Gübre üretimi, kimya endüstrisi ve tarımda kullanılır. Çuval veya dökme. SGS sertifikalı."
    },
    "price": "Contact for pricing",
    "category": "sulfur",
    "image": "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80",
    "createdAt": "2024-01-20T08:00:00Z"
  },
  {
    "id": "prod-004",
    "name": { "en": "Wheat (Grade 1, 2, 3)", "ru": "Пшеница (1, 2, 3 класс)", "zh": "小麦（1、2、3级）", "tr": "Buğday (1., 2., 3. Sınıf)" },
    "description": {
      "en": "Export-grade wheat, grades 1-3. Protein content 11-14%. Moisture max 14%. Phytosanitary certificate, quality certificate. FOB Novorossiysk or Chinese ports.",
      "ru": "Экспортная пшеница 1-3 класса. Содержание протеина 11-14%. Влажность не более 14%. Фитосанитарный сертификат, сертификат качества. FOB Новороссийск.",
      "zh": "出口级小麦，1-3级。蛋白质含量11-14%，水分最高14%。植物检疫证书、品质证书。FOB新罗西斯克或中国港口。",
      "tr": "İhracat kalitesi buğday, 1-3. sınıf. Protein içeriği %11-14. Nem maks. %14. Fitosaniter sertifika, kalite sertifikası. FOB Novorossiysk."
    },
    "price": "Contact for pricing",
    "category": "agricultural",
    "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
    "createdAt": "2024-02-01T08:00:00Z"
  },
  {
    "id": "prod-005",
    "name": { "en": "Industrial Textile Machinery", "ru": "Промышленное текстильное оборудование", "zh": "工业纺织机械", "tr": "Endüstriyel Tekstil Makineleri" },
    "description": {
      "en": "Wide range of industrial textile machinery: weaving looms, spinning machines, knitting machines. New and refurbished units available. Full technical documentation. After-sales support.",
      "ru": "Широкий ассортимент промышленного текстильного оборудования: ткацкие станки, прядильные машины, вязальные машины. Новые и восстановленные агрегаты. Полная техническая документация.",
      "zh": "各类工业纺织机械：织机、纺纱机、针织机。全新及翻新设备均有供应。提供完整技术文件，并提供售后支持。",
      "tr": "Geniş yelpazede endüstriyel tekstil makineleri: dokuma tezgahları, iplik makineleri, örme makineleri. Yeni ve yenilenmiş üniteler mevcuttur. Tam teknik dokümantasyon."
    },
    "price": "Contact for pricing",
    "category": "machinery",
    "image": "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
    "createdAt": "2024-02-10T08:00:00Z"
  },
  {
    "id": "prod-006",
    "name": { "en": "Copper Cathodes (Grade A)", "ru": "Медные катоды (Сорт А)", "zh": "电解铜板 (A级)", "tr": "Bakır Katot (Grade A)" },
    "description": {
      "en": "LME Grade A copper cathodes, purity 99.99%. Compliant with BS EN 1978:1998. Available in minimum lots of 25 MT. CIF/FOB delivery. SGS inspection available.",
      "ru": "Медные катоды марки LME Grade A, чистота 99,99%. Соответствуют BS EN 1978:1998. Минимальная партия 25 МТ. Поставка CIF/FOB. Инспекция SGS.",
      "zh": "LME A级电解铜板，纯度99.99%，符合BS EN 1978:1998标准。最小批量25吨，CIF/FOB交货，提供SGS检验。",
      "tr": "LME Grade A bakır katot, saflık %99.99. BS EN 1978:1998 uyumlu. Minimum 25 MT lot. CIF/FOB teslimat. SGS muayene mevcut."
    },
    "price": "Contact for pricing",
    "category": "metallurgy",
    "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    "createdAt": "2024-02-15T08:00:00Z"
  }
];

const SEED_BLOG: BlogPost[] = [
  {
    "id": "blog-001",
    "title": {
      "en": "Successful Completion of 50,000 MT Diesel Fuel Supply to East Africa",
      "ru": "Успешное завершение поставки 50 000 МТ дизельного топлива в Восточную Африку",
      "zh": "成功完成向东非供应5万吨柴油的交易",
      "tr": "Doğu Afrika'ya 50.000 MT Motorin Tedarikinin Başarıyla Tamamlanması"
    },
    "excerpt": {
      "en": "Nanning Kazan Trading successfully completed a major petroleum supply contract, delivering 50,000 metric tons of EN590 diesel fuel to a consortium of buyers in East Africa.",
      "ru": "Nanning Kazan Trading успешно выполнила крупный контракт на поставку нефтепродуктов — 50 000 метрических тонн дизельного топлива EN590 в Восточную Африку.",
      "zh": "南宁市卡赞商贸成功完成了一份重要的石油供应合同，向东非买家联合体交付了5万公吨EN590柴油。",
      "tr": "Nanning Kazan Ticaret, Doğu Afrika'daki bir alıcı konsorsiyumuna 50.000 metrik ton EN590 motorin teslim ederek büyük bir petrol tedarik sözleşmesini başarıyla tamamladı."
    },
    "content": {
      "en": "Nanning Kazan Trading Co., Ltd is proud to announce the successful completion of a landmark petroleum supply contract. Our team coordinated the delivery of 50,000 metric tons of EN590-grade diesel fuel to a consortium of buyers across East Africa.\n\nThe deal was structured under CIF terms with full documentation including SGS quality inspection, Bill of Lading, and Certificate of Origin.\n\nThis milestone deal reinforces our position as a trusted partner in the global commodity trade space.",
      "ru": "Nanning Kazan Trading Co., Ltd с гордостью объявляет об успешном завершении знакового контракта. Наша команда координировала поставку 50 000 МТ дизельного топлива EN590 в Восточную Африку.\n\nСделка структурирована на условиях CIF с полным пакетом документов, включая инспекцию SGS, коносамент и сертификат происхождения.\n\nЭта сделка укрепляет наши позиции как надёжного партнёра в глобальной торговле.",
      "zh": "南宁市卡赞商贸有限公司自豪地宣布，一项重要石油供应合同已成功完成。\n\n该交易以CIF条款结构，附带完整文件，包括SGS质量检验、提单和原产地证书。\n\n这一里程碑式的交易巩固了我们作为全球大宗商品贸易可靠合作伙伴的地位。",
      "tr": "Nanning Kazan Trading Co., Ltd önemli bir petrol tedarik sözleşmesini başarıyla tamamladığını duyurmaktan gurur duymaktadır.\n\nCIF koşullarıyla yapılandırılan anlaşma, SGS kalite muayenesi, Konişmento ve Menşei Sertifikası ile desteklendi.\n\nBu önemli anlaşma, küresel emtia ticaretinde güvenilir ortağımız olarak konumumuzu güçlendirmektedir."
    },
    "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    "date": "2024-03-15",
    "category": "deals",
    "createdAt": "2024-03-15T08:00:00Z"
  },
  {
    "id": "blog-002",
    "title": {
      "en": "NKT Expands Steel Trading Operations with New Mill Partnerships",
      "ru": "NKT расширяет торговлю сталью: новые партнёрства с металлургическими заводами",
      "zh": "卡赞商贸拓展钢铁贸易业务，建立新的钢厂合作伙伴关系",
      "tr": "NKT, Yeni Fabrika Ortaklıklarıyla Çelik Ticaret Faaliyetlerini Genişletiyor"
    },
    "excerpt": {
      "en": "We are expanding our metallurgy trading portfolio with direct partnerships with steel mills in Russia, Ukraine, and China.",
      "ru": "Мы расширяем металлургический торговый портфель за счёт прямых партнёрств с заводами в России, Украине и Китае.",
      "zh": "我们正在与俄罗斯、乌克兰和中国的钢厂建立直接合作关系，拓展冶金贸易业务。",
      "tr": "Rusya, Ukrayna ve Çin'deki çelik fabrikalarıyla doğrudan ortaklıklar kurarak metalurji ticaret portföyümüzü genişletiyoruz."
    },
    "content": {
      "en": "Nanning Kazan Trading is pleased to announce the expansion of its metallurgy and raw materials division. We have established direct sourcing agreements with leading steel producers.\n\nMinimum order quantities starting from 500 MT, with flexible payment terms. All products come with full mill certification and SGS third-party inspection.",
      "ru": "Nanning Kazan Trading рада сообщить о расширении отдела металлургии. Мы заключили прямые соглашения с ведущими производителями стали.\n\nМинимальная партия от 500 МТ, гибкие условия оплаты. Полная заводская сертификация и независимая инспекция SGS.",
      "zh": "南宁市卡赞商贸很高兴宣布冶金部门的扩张。我们已与主要钢铁生产商建立直接采购协议。\n\n最小起订量从500吨起，付款条件灵活。所有产品附带完整的工厂证书和SGS第三方检验。",
      "tr": "Nanning Kazan Ticaret, metalurji bölümünün genişletildiğini duyurmaktan memnuniyet duymaktadır.\n\n500 MT'den başlayan minimum sipariş miktarları, esnek ödeme koşulları. Tam fabrika sertifikasyonu ve SGS muayenesi."
    },
    "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    "date": "2024-02-28",
    "category": "news",
    "createdAt": "2024-02-28T08:00:00Z"
  },
  {
    "id": "blog-003",
    "title": {
      "en": "Agricultural Commodity Export Season 2024: Wheat & Corn Available",
      "ru": "Сезон экспорта сельскохозяйственных товаров 2024: пшеница и кукуруза в наличии",
      "zh": "2024年农产品出口季：小麦和玉米现货供应",
      "tr": "2024 Tarımsal Emtia İhracat Sezonu: Buğday ve Mısır Temin Edilebilir"
    },
    "excerpt": {
      "en": "The 2024 grain export season is underway. We have secured supply agreements for premium-grade wheat and corn from major Black Sea origins.",
      "ru": "Сезон экспорта зерна 2024 начался. Обеспечены соглашения о поставках пшеницы и кукурузы от черноморских производителей.",
      "zh": "2024年粮食出口季已开始。我们已从主要黑海产地获得高品质小麦和玉米的供应协议。",
      "tr": "2024 tahıl ihracat sezonu başladı. Büyük Karadeniz kaynaklarından buğday ve mısır için tedarik anlaşmaları sağladık."
    },
    "content": {
      "en": "Nanning Kazan Trading is actively offering agricultural commodities for the 2024 export season.\n\nWheat (Grade 1-3): Protein 11-14%, moisture max 14%. FOB Novorossiysk or CIF destination. Min 5,000 MT.\n\nCorn: Grade A, moisture max 14%. FOB Odessa/CIF destination. Min 5,000 MT.\n\nAll shipments include phytosanitary certificates and SGS inspection at load port.",
      "ru": "Nanning Kazan Trading активно предлагает сельхозтовары на сезон 2024:\n\nПшеница 1-3 класс: протеин 11-14%, влажность до 14%. FOB Новороссийск или CIF. Мин. 5 000 МТ.\n\nКукуруза: класс А, влажность до 14%. FOB Одесса/CIF. Мин. 5 000 МТ.",
      "zh": "2024年出口季农产品：\n\n小麦（1-3级）：蛋白质11-14%，水分最高14%。FOB新罗西斯克或CIF目的港。最小5000吨。\n\n玉米：A级，水分最高14%。FOB敖德萨/CIF。最小5000吨。",
      "tr": "2024 ihracat sezonu tarımsal emtia:\n\nBuğday (1-3. Sınıf): Protein %11-14, nem maks %14. FOB Novorossiysk veya CIF. Min 5.000 MT.\n\nMısır: A Sınıfı, nem maks %14. FOB Odessa/CIF. Min 5.000 MT."
    },
    "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
    "date": "2024-02-10",
    "category": "market",
    "createdAt": "2024-02-10T08:00:00Z"
  },
  {
    "id": "blog-004",
    "title": {
      "en": "NKT Completes First Automotive Parts Shipment to Southeast Asia",
      "ru": "NKT завершила первую поставку автозапчастей в Юго-Восточную Азию",
      "zh": "卡赞商贸完成首批汽车配件向东南亚的出货",
      "tr": "NKT, Güneydoğu Asya'ya İlk Otomotiv Parçaları Sevkiyatını Tamamladı"
    },
    "excerpt": {
      "en": "We are excited to announce our first major automotive parts shipment to Southeast Asia, supplying certified OEM-equivalent components.",
      "ru": "Рады сообщить о первой крупной поставке автозапчастей в Юго-Восточную Азию.",
      "zh": "我们很高兴宣布向东南亚完成首批大规模汽车配件出货。",
      "tr": "Güneydoğu Asya'ya ilk büyük otomotiv parçaları sevkiyatımızı duyurmaktan heyecan duyuyoruz."
    },
    "content": {
      "en": "Nanning Kazan Trading has successfully completed its first major automotive parts export to Southeast Asia. The shipment consisted of engine components, filtration systems, brake assemblies, and electrical parts.\n\nAll components were sourced from certified manufacturers and meet OEM specifications.\n\nThis opens a new chapter in our automotive trading division.",
      "ru": "Nanning Kazan Trading успешно завершила первый крупный экспорт автозапчастей в Юго-Восточную Азию. Отправка включала компоненты двигателей, системы фильтрации и тормозные узлы.\n\nВсе компоненты от сертифицированных производителей, соответствуют OEM.\n\nЭта поставка открывает новую главу в нашем подразделении автомобильной торговли.",
      "zh": "南宁市卡赞商贸已成功完成首次大规模汽车配件出口。货物包括发动机零部件、过滤系统和制动总成。\n\n所有零部件均来自认证制造商，符合OEM规格。\n\n这次成功交付为我们汽车贸易部门开启了新篇章。",
      "tr": "Nanning Kazan Ticaret, Güneydoğu Asya'ya ilk otomotiv parçaları ihracatını başarıyla tamamladı. Motor bileşenleri, filtrasyon sistemleri ve fren düzeneklerinden oluştu.\n\nTüm bileşenler sertifikalı üreticilerden, OEM spesifikasyonlarını karşılıyor.\n\nBu teslimat otomotiv bölümümüzde yeni bir sayfa açmaktadır."
    },
    "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    "date": "2024-01-25",
    "category": "deals",
    "createdAt": "2024-01-25T08:00:00Z"
  }
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existingProducts = await kv.get("products");
  const existingBlog = await kv.get("blog");

  if (existingProducts && existingBlog) {
    return NextResponse.json({ message: "Already seeded", products: SEED_PRODUCTS.length, blog: SEED_BLOG.length });
  }

  await kv.set("products", SEED_PRODUCTS);
  await kv.set("blog", SEED_BLOG);

  return NextResponse.json({ ok: true, products: SEED_PRODUCTS.length, blog: SEED_BLOG.length });
}
