export const CATEGORIES = ["Jogos", "Lugar Americano", "Porta-guardanapos"] as const;
export type Category = (typeof CATEGORIES)[number];
export type Variation = {
  name: string;
  hex: string;
  pattern: "xadrez" | "liso";
  sku?: string;
};
export type GameItem = {
  label: string;
  retail_price?: number | null;
  wholesale_price: number | null;
};
export type MaterialDetail = {
  label: string;
  value: string;
};
export type Product = {
  id: string;
  name: string;
  category: Category;
  sku: string | null;
  tray_id?: number | null;
  collection: string | null;
  color_name: string | null;
  color_hex: string | null;
  retail_price: number | null;
  wholesale_price: number | null;
  image_url: string | null;
  editorial_image_url?: string | null;
  /** Texto comercial breve, exibido na página do produto. */
  description?: string;
  /** Materiais confirmados por componente. Use "—" quando ainda não informado. */
  materials?: MaterialDetail[];
  /** Medidas confirmadas por componente. Use "—" quando ainda não informado. */
  dimensions?: MaterialDetail[];
  image_status: "final" | "placeholder";
  sort_order: number;
  is_visible: boolean;
  /** When present, the item is sold only as a kit and this is its piece count. */
  kit_quantity?: number | null;
  /** A complete table game: placemat, napkin and napkin ring sold together. */
  game_items?: GameItem[];
  variations?: Variation[];
  created_at?: string;
};
export type ProductInput = Omit<Product, "id" | "created_at"> & {
  variations?: Variation[];
};

const portaNames = [
  ["Lírio Provence", 12, 9.04],
  ["Lavanda Provençal", 17, 11.05],
  ["Limone Toscano", 14.9, 10.43],
  ["Cereja Mediterrânea", 15.9, 10.43],
  ["Estrela Náutica", 13.9, 11.12],
  ["Costela de Adão Tropical", 11.9, 9.04],
  ["Medalhão Mediterrâneo Esmeralda", 20, 11.83],
  ["Medalhão Mediterrâneo Âmbar", 20, 11.83],
  ["Costela de Adão Mediterrânea", 15.9, 12.72],
  ["Alecrim", 17, 11.9],
  ["Dália Rosé Provence", 13.9, 9.04],
  ["Orquídea Sauvage", 14.9, 9.04],
  ["Estrela Náutica Provence", 15.5, 12.4],
  ["Chapéu de Palha Junino", 12.9, 6],
  ["Esferas Vermelhas Bordô", 12.9, 8],
  ["Dourado com Pérolas", 13.9, 9],
  ["Nó Trançado Cru com Detalhe em Courino", 13.9, 8],
  ["Rosa Coral com Fibra Natural", 13.9, 9.04],
  ["Flor Azul com Fibra Natural", 13.9, 9.04],
  ["Suculenta Verde com Fibra Natural", 13.9, 9.04],
  ["Pizza Bordado", 13.9, 9.04],
  ["Courino Marrom · Kit com 4", 6.5, 4.03],
  ["Nó Turco · Kit com 4", 7, 4.9],
  ["Flor Rosa", 13.9, 9.04],
  ["Orquídea Azul", 15.3, 9.04],
  ["Ovinho", 13.9, 9.04],
  ["Laço Elegance", 14.9, 10.9],
  ["Laço Charm", 11.9, 7.9],
] as const;
const lacoColors = [
  ["Rosa bebê", "#E9B7BC"],
  ["Vermelho", "#A8202A"],
  ["Verde", "#215F3E"],
  ["Amarelo", "#E4AD31"],
  ["Marinho", "#1D2C49"],
  ["Preto", "#272727"],
] as const;
const portaEditorialImages = [
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_lirio_provence_70_1_67abb5b31686a3eccde08a35b4100883.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_lavanda_provencal_71_1_a4a884d8b87b9b5e9046f84a3c9e2dc8.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_limone_toscano_72_1_8344ead1eba83836e87ecd3834a34741.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_cereja_mediterranea_73_1_54142eeca24c7c5366971f8fdb498b3a.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_estrela_nautica_74_1_5395a9819d52468913f234c6661f0d1a.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_costela_de_adao_tropical_75_1_8a36038ee1a2e1567525806906cb76ee.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_medalhao_mediterraneo_esmeralda_76_1_1851eca2e36876d0692f4c8f7e012b52.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_medalhao_mediterraneo_ambar_77_1_38ec0ff3787f52a0ca25d9ef3c7791d9.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_costela_de_adao_mediterranea_78_1_e1e1c833da7a698b5f6d1b9536246a97.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_alecrim_79_1_0f96aceb7613799badb10a36e5da1b85.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_dalia_rose_provence_80_1_833e363cbf1a957ff650d7c01cc7140e.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_orquidea_sauvage_81_1_c988d41d6badd1efa2385eedb82389ed.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_estrela_nautica_provence_82_1_3bb629e8d7a984df92f29c36eb831282.jpg",
] as const;
const portaStudioImages = [
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_lirio_provence_70_2_42905d2211971642638d54fbc12f43b9.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_lavanda_provencal_71_2_6c169bdd781ccc57423060e797ec8382.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_limone_toscano_72_2_a4a89e0a8fea4a45cbc2ca6948aed6ae.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_cereja_mediterranea_73_2_1f5ab6ff2f93d45f2659fc11c46aef1c.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_estrela_nautica_74_2_5e483e65c7841b23331b8ec4fdeb7579.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_costela_de_adao_tropical_75_2_fe903e2461b2a4cf34d7eb3096e1e30f.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_medalhao_mediterraneo_esmeralda_76_2_fc46d95d54a76f439347852bf9a79e97.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_medalhao_mediterraneo_ambar_77_2_522dd86c840917b8aaf4a2c1bac03469.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_costela_de_adao_mediterranea_78_2_192617c99c845172b3937da1767b1220.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_alecrim_79_2_8936e20af1396f4bcd17ae777b3e65bd.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_dalia_rose_provence_80_2_b42f66a6e314fe4d9ccf2cfd1c25ad85.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_orquidea_sauvage_81_2_77b902577cf0e6d28ed1ca4a8b2ab9e9.jpg",
  "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_estrela_nautica_provence_82_2_a27899165db976414667998d6a019bd8.jpg",
] as const;
const updatedPortaImageSlugs = [
  "lirio-provence", "lavanda-provencal", "limone-toscano", "cereja-mediterranea",
  "estrela-nautica", "costela-adao-tropical", "medalhao-esmeralda", "medalhao-ambar",
  "costela-adao-mediterranea", "alecrim", "dalia-rose-provence", "orquidea-sauvage",
  "estrela-nautica-provence", "chapeu-palha-junino", "esferas-vermelhas-bordo", "dourado-perolas",
  "no-trancado-courino", "rosa-coral", "flor-azul", "suculenta-verde", "pizza-bordado",
  null, null, null, null, null, null, null,
] as const;
const generatedPortaEditorialImages: Partial<Record<number, string>> = {
  16: "/produtos/editorial-no-nautico.webp",
  21: "/produtos/editorial-courino-marrom.webp",
  22: "/produtos/editorial-no-turco.webp",
  23: "/produtos/editorial-flor-rosa.webp",
  24: "/produtos/editorial-orquidea-azul.webp",
  25: "/produtos/editorial-ovinho-portal.webp",
  26: "/produtos/editorial-laco-elegance.webp",
  27: "/produtos/editorial-laco-charm.webp",
};
const portaColorDetails = [
  ["Roxo, verde e vinho", "#765B6A"],
  ["Lilás e verde", "#8B7A8F"],
  ["Amarelo e verde", "#D5A833"],
  ["Vermelho e verde", "#B9373A"],
  ["Azul-marinho e bege", "#263D5D"],
  ["Verde", "#5A8251"],
  ["Verde-esmeralda e dourado", "#39766B"],
  ["Âmbar e dourado", "#B78232"],
  ["Verde e bege", "#657E5C"],
  ["Verde", "#5E7A50"],
  ["Rosé", "#B16D77"],
  ["Rosa e lilás", "#B47A91"],
  ["Bege e dourado", "#B89C70"],
  ["Palha e bege", "#B99B6E"],
  ["Vermelho rubi", "#A41E2D"],
  ["Dourado", "#BE8B33"],
  ["Bege natural", "#AA8D6E"],
  ["Pêssego e verde", "#D98973"],
  ["Azul serenity", "#5489B3"],
  ["Verde eucalipto", "#819D83"],
  ["Amarelo, vermelho e verde", "#D5A233"],
  ["Marrom", "#754A31"],
  ["Marrom e bege", "#927554"],
  ["Rosa", "#C45E7E"],
  ["Azul", "#3F82BC"],
  ["Branco, amarelo e natural", "#D8A929"],
  ["Variações disponíveis", "#A8202A"],
  ["Variações disponíveis", "#A8202A"],
] as const;

const PORTA_CONFIG: Array<{ slug: string; code: string; tray_id: number | null; customImage?: string; customEditorial?: string }> = [
  { slug: "porta-guardanapo-lirio-provence", code: "LIRI", tray_id: 70 },
  { slug: "porta-guardanapo-lavanda-provencal", code: "LAVA", tray_id: 71 },
  { slug: "porta-guardanapo-limone-toscano", code: "LIMO", tray_id: 72 },
  { slug: "porta-guardanapo-cereja-mediterranea", code: "CERE", tray_id: 73 },
  { slug: "porta-guardanapo-estrela-nautica", code: "NAUT", tray_id: 74 },
  { slug: "porta-guardanapo-costela-de-adao-tropical", code: "COTR", tray_id: 75 },
  { slug: "porta-guardanapo-medalhao-esmeralda", code: "MDES", tray_id: 76 },
  { slug: "porta-guardanapo-medalhao-ambar", code: "MDAM", tray_id: 77 },
  { slug: "porta-guardanapo-costela-de-adao-mediterranea", code: "COME", tray_id: 78 },
  { slug: "porta-guardanapo-alecrim", code: "ALEC", tray_id: 79 },
  { slug: "porta-guardanapo-dalia-rose-provence", code: "DALI", tray_id: 80 },
  { slug: "porta-guardanapo-orquidea-sauvage", code: "ORQS", tray_id: 81 },
  { slug: "porta-guardanapo-estrela-nautica-provence", code: "NAUP", tray_id: 82 },
  { slug: "porta-guardanapo-chapeu-de-palha-junino", code: "CHAP", tray_id: 153 },
  { slug: "porta-guardanapo-esferas-vermelhas-bordo", code: "ESFE", tray_id: 154 },
  { slug: "porta-guardanapo-dourado-com-perolas", code: "PERO", tray_id: 152 },
  { slug: "porta-guardanapo-no-trancado-courino", code: "NOTR", tray_id: 156 },
  { slug: "porta-guardanapo-rosa-coral-fibra-natural", code: "ROSC", tray_id: 151 },
  { slug: "porta-guardanapo-flor-azul-fibra-natural", code: "FLAZ", tray_id: 158 },
  { slug: "porta-guardanapo-suculenta-verde-fibra-natural", code: "SUCU", tray_id: 155 },
  { slug: "porta-guardanapo-pizza-bordado", code: "PIZZ", tray_id: 214 },
  { slug: "porta-guardanapo-courino-marrom-kit-4", code: "COUR-K4", tray_id: 212, customImage: "/produtos/courino-marrom.webp", customEditorial: "/produtos/editorial-courino-marrom.webp" },
  { slug: "porta-guardanapo-no-turco-kit-4", code: "NOTU-K4", tray_id: null, customImage: "/produtos/no-turco.webp", customEditorial: "/produtos/editorial-no-turco.webp" },
  { slug: "porta-guardanapo-flor-rosa", code: "FLRO", tray_id: null, customImage: "/produtos/flor-rosa.webp", customEditorial: "/produtos/editorial-flor-rosa.webp" },
  { slug: "porta-guardanapo-orquidea-azul", code: "ORQA", tray_id: 235, customImage: "/produtos/orquidea-azul.webp", customEditorial: "/produtos/editorial-orquidea-azul.webp" },
  { slug: "porta-guardanapo-ovinho", code: "OVIN", tray_id: null, customImage: "/produtos/ovinho.webp", customEditorial: "/produtos/editorial-ovinho-portal.webp" },
  { slug: "porta-guardanapo-laco-elegance", code: "ELEG", tray_id: null, customImage: "/produtos/laco-elegance.webp", customEditorial: "/produtos/editorial-laco-elegance.webp" },
  { slug: "porta-guardanapo-laco-charm", code: "CHAR", tray_id: null, customImage: "/produtos/laco-charm.webp", customEditorial: "/produtos/editorial-laco-charm.webp" },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "lugar-americano-redondo-xadrez",
    name: "Lugar Americano Redondo Xadrez",
    category: "Lugar Americano",
    sku: "MG-LA-XADR",
    tray_id: null,
    collection: "Dupla Face",
    color_name: "Variações disponíveis",
    color_hex: null,
    retail_price: 28,
    wholesale_price: 22.82,
    image_url: "/produtos/dupla-face-rosa-bebe.webp",
    editorial_image_url: "/produtos/editorial-jogo-xadrez.webp",
    image_status: "final",
    sort_order: 1,
    is_visible: true,
    variations: [
      { name: "Rosa bebê", hex: "#E9B7BC", pattern: "xadrez", sku: "MG-LA-XADR-RS" },
      { name: "Vermelho", hex: "#C51F2A", pattern: "xadrez", sku: "MG-LA-XADR-VM" },
      { name: "Verde", hex: "#1F5A3D", pattern: "xadrez", sku: "MG-LA-XADR-VD" },
      { name: "Amarelo", hex: "#D99B19", pattern: "xadrez", sku: "MG-LA-XADR-AM" },
      { name: "Marinho", hex: "#203150", pattern: "xadrez", sku: "MG-LA-XADR-MR" },
      { name: "Preto", hex: "#292929", pattern: "xadrez", sku: "MG-LA-XADR-PR" },
      { name: "Rosa bebê", hex: "#E9B7BC", pattern: "liso", sku: "MG-LA-XADR-RS-LIS" },
      { name: "Vermelho", hex: "#C51F2A", pattern: "liso", sku: "MG-LA-XADR-VM-LIS" },
      { name: "Verde", hex: "#1F5A3D", pattern: "liso", sku: "MG-LA-XADR-VD-LIS" },
      { name: "Amarelo", hex: "#D99B19", pattern: "liso", sku: "MG-LA-XADR-AM-LIS" },
      { name: "Marinho", hex: "#203150", pattern: "liso", sku: "MG-LA-XADR-MR-LIS" },
      { name: "Preto", hex: "#292929", pattern: "liso", sku: "MG-LA-XADR-PR-LIS" },
    ],
  },
  {
    id: "kit-fundo-do-mar-convencional",
    name: "Jogo Fundo do Mar Convencional",
    category: "Jogos",
    sku: "MG-KT-FUND",
    tray_id: null,
    collection: "Fundo do Mar",
    color_name: "Azul e off-white",
    color_hex: "#4C83A8",
    retail_price: null,
    wholesale_price: null,
    game_items: [
      { label: "Lugar americano", wholesale_price: 19.2 },
      { label: "Guardanapo", wholesale_price: 13.86 },
      { label: "Porta-guardanapo", wholesale_price: 11.12 },
    ],
    image_url: "/produtos/fundo-mar-convencional.webp",
    image_status: "final",
    sort_order: 2,
    is_visible: true,
  },
  {
    id: "lugar-americano-laco-frances",
    name: "Laço Francês",
    category: "Lugar Americano",
    sku: "MG-LA-LACO",
    tray_id: null,
    collection: "Coleção Essencial",
    color_name: "Variações disponíveis",
    color_hex: null,
    retail_price: 32.9,
    wholesale_price: 16.45,
    image_url: "/produtos/laco-frances-rosa-bebe.webp",
    editorial_image_url: "/produtos/editorial-laco-frances.webp",
    image_status: "final",
    sort_order: 3,
    is_visible: true,
    variations: [
      { name: "Rosa bebê", hex: "#E9B7BC", pattern: "liso", sku: "MG-LA-LACO-RS" },
      { name: "Rosa pink", hex: "#D82872", pattern: "liso", sku: "MG-LA-LACO-PK" },
      { name: "Azul marinho", hex: "#1A2947", pattern: "liso", sku: "MG-LA-LACO-MR" },
      { name: "Marrom", hex: "#704126", pattern: "liso", sku: "MG-LA-LACO-MO" },
      { name: "Vinho", hex: "#781F32", pattern: "liso", sku: "MG-LA-LACO-VI" },
      { name: "Amarelo", hex: "#D8A61B", pattern: "liso", sku: "MG-LA-LACO-AM" },
      { name: "Verde", hex: "#637039", pattern: "liso", sku: "MG-LA-LACO-VD" },
    ],
  },
  ...[
    ["classico-ondulado", "Clássico Ondulado", "01-Classico-Ondulado.webp", "CLAS"],
    ["beija-flor", "Beija-Flor", "02-Beija-Flor.webp", "BEIJ"],
    ["versailles", "Versailles", "03-Versailles.webp", "VERS"],
    ["imperial", "Imperial", "04-Imperial.webp", "IMPE"],
    ["provencal", "Provençal", "05-Provencal.webp", "PROV"],
    ["arabesco", "Arabesco", "06-Arabesco.webp", "ARAB"],
    ["flor-de-lis", "Flor de Lis", "07-Flor-de-Lis.webp", "FLOR"],
    ["jardim", "Jardim", "08-Jardim.webp", "JARD"],
    ["vintage", "Vintage", "09-Vintage.webp", "VINT"],
    ["signature-mesa-graca", "Signature Mesa & Graça", "10-Signature-Mesa-e-Graca.webp", "SIGN"],
  ].map((entry, index): Product => {
    const [id, name, image, code] = entry as [string, string, string, string];
    return {
      id: `lugar-americano-${id}`,
      name,
      category: "Lugar Americano",
      sku: `MG-LA-${code}`,
      tray_id: null,
      collection: "Coleção Essencial",
      color_name: "Variações disponíveis",
      color_hex: null,
      retail_price: 23.9,
      wholesale_price: 14.34,
      image_url: `/produtos/colecao-essencial/${image}`,
      image_status: "final",
      sort_order: index + 4,
      is_visible: true,
      variations: [
        { name: "Rosa bebê", hex: "#E9B7BC", pattern: "liso", sku: `MG-LA-${code}-RS` },
        { name: "Rosa pink", hex: "#D82872", pattern: "liso", sku: `MG-LA-${code}-PK` },
        { name: "Azul marinho", hex: "#1A2947", pattern: "liso", sku: `MG-LA-${code}-MR` },
        { name: "Marrom", hex: "#704126", pattern: "liso", sku: `MG-LA-${code}-MO` },
        { name: "Vinho", hex: "#781F32", pattern: "liso", sku: `MG-LA-${code}-VI` },
        { name: "Amarelo", hex: "#D8A61B", pattern: "liso", sku: `MG-LA-${code}-AM` },
        { name: "Verde", hex: "#637039", pattern: "liso", sku: `MG-LA-${code}-VD` },
      ],
    };
  }),
  {
    id: "kit-abelhinha",
    name: "Jogo Abelhinha",
    category: "Jogos",
    sku: "MG-KT-ABEL",
    tray_id: 250,
    collection: "Abelhinha",
    color_name: "Amarelo",
    color_hex: "#E5AA1A",
    retail_price: 16.9,
    wholesale_price: null,
    game_items: [
      { label: "Lugar americano", retail_price: 32.9, wholesale_price: 19.74 },
      { label: "Guardanapo", wholesale_price: 12.6 },
      { label: "Porta-guardanapo", wholesale_price: 8.9 },
    ],
    image_url: "/produtos/colecao-abelhinha.webp",
    editorial_image_url: "/produtos/editorial-abelhinha.webp",
    image_status: "final",
    sort_order: 4,
    is_visible: true,
  },
  {
    id: "kit-ovinho",
    name: "Jogo Ovinho",
    category: "Jogos",
    sku: "MG-KT-OVIN",
    tray_id: 251,
    collection: "Ovinho",
    color_name: "Branco e amarelo",
    color_hex: "#E5A70D",
    retail_price: 15.9,
    wholesale_price: null,
    game_items: [
      { label: "Lugar americano", retail_price: 20.9, wholesale_price: 17.77 },
      { label: "Guardanapo", wholesale_price: 11.2 },
      { label: "Porta-guardanapo", wholesale_price: 10.9 },
    ],
    image_url: "/produtos/colecao-ovinho.webp",
    editorial_image_url: "/produtos/editorial-ovinho.webp",
    image_status: "final",
    sort_order: 5,
    is_visible: true,
  },
  {
    id: "kit-cerejinha",
    name: "Jogo Cerejinha",
    category: "Jogos",
    sku: "MG-KT-CERE",
    tray_id: 252,
    collection: "Cerejinha",
    color_name: "Vermelho",
    color_hex: "#C41432",
    retail_price: 16.9,
    wholesale_price: null,
    game_items: [
      { label: "Lugar americano", wholesale_price: 17.03 },
      { label: "Guardanapo", wholesale_price: 11.64 },
      { label: "Porta-guardanapo", wholesale_price: 10.43 },
    ],
    image_url: "/produtos/colecao-cerejinha.webp",
    editorial_image_url: "/produtos/editorial-cerejinha.webp",
    image_status: "final",
    sort_order: 6,
    is_visible: true,
  },
  {
    id: "kit-folhas",
    name: "Jogo Folhas",
    category: "Jogos",
    sku: "MG-KT-FOLH",
    tray_id: 253,
    collection: "Folhas",
    color_name: "Verde",
    color_hex: "#486632",
    retail_price: null,
    wholesale_price: null,
    game_items: [
      { label: "Lugar americano", wholesale_price: 14.59 },
      { label: "Guardanapo", wholesale_price: 13.86 },
      { label: "Porta-guardanapo", wholesale_price: 9.9 },
    ],
    image_url: "/produtos/colecao-folhas.webp",
    editorial_image_url: "/produtos/editorial-folhas.webp",
    image_status: "final",
    sort_order: 7,
    is_visible: true,
  },
  {
    id: "kit-magnolia",
    name: "Jogo Magnólia",
    category: "Jogos",
    sku: "MG-KT-MAGN",
    tray_id: 254,
    collection: "Magnólia",
    color_name: "Floral",
    color_hex: "#B53A62",
    retail_price: 24.9,
    wholesale_price: null,
    game_items: [
      { label: "Lugar americano", wholesale_price: 18 },
      { label: "Guardanapo", wholesale_price: 13.86 },
      { label: "Porta-guardanapo", wholesale_price: 9 },
    ],
    image_url: "/produtos/colecao-magnolia.webp",
    editorial_image_url: "/produtos/editorial-magnolia.webp",
    image_status: "final",
    sort_order: 8,
    is_visible: true,
  },
  ...[
    ["kit-feijoada", "Jogo Feijoada", "#5E4634", 16.68, 12.6, 4.03, "FEIJ", 141, "jogo-feijoada"],
    ["kit-hot-dog", "Jogo Hot Dog", "#C84948", 19.15, 11.5, null, "HOTD", 140, "jogo-hot-dog"],
    ["kit-churrasco", "Jogo Churrasco", "#883F31", 26.04, 14.34, 4.03, "CHUR", 139, "jogo-churrasco"],
    ["kit-hamburguer", "Jogo Hambúrguer", "#274A69", 24.02, 14.34, 4.03, "HAMB", 142, "jogo-hamburguer"],
    ["kit-pizza-dupla-face", "Jogo Pizza Dupla Face", "#A83A3E", 19.32, 12.05, 9.04, "PIZZ", null, "jogo-pizza-dupla-face"],
    ["kit-quadrado-xadrez", "Jogo Americano Quadrado Xadrez Dupla Face", "#A8202A", 18.19, 12.05, 7.1, "QXAD", null, "jogo-quadrado-xadrez"],
    ["kit-limao", "Jogo Limão", "#577836", 14.59, 13.86, 10.43, "LIMA", 176, "jogo-limao"],
    ["kit-essence-campestre", "Jogo Essence Campestre Dupla Face", "#725441", 16.72, 11.5, 4.9, "CAMP", null, "jogo-essence-campestre"],
    ["kit-costela-de-adao", "Jogo Costela de Adão", "#46693E", 19.14, 13.43, 12.72, "COST", 120, "jogo-costela-adao"],
    ["kit-alecrim", "Jogo Alecrim", "#5E7A50", 19.14, 13.43, 11.9, "ALEC", 121, "jogo-alecrim"],
    ["kit-lavanda", "Jogo Lavanda", "#8F78A3", 19.14, 13.43, 11.05, "LAVA", 119, "jogo-lavanda"],
    ["kit-oliveira", "Jogo Oliveira", "#7B6651", 19.14, 13.43, 9.04, "OLIV", 122, "jogo-oliveira"],
    ["kit-rose-imperial", "Jogo Rosé Imperial", "#BD8392", 14.59, 11.64, 9.04, "ROSE", null, "jogo-rose-imperial"],
    ["kit-mariposa-rose", "Jogo Mariposa Rosé", "#6E453A", 15.4, 11.64, 8.2, "MARI", null, null],
    ["kit-belle-rose", "Jogo Belle Rosé", "#5C3B35", 15.4, 11.64, 8.2, "BELL", null, null],
    ["kit-flor-de-lottus", "Jogo Flor de Lóttus", "#DC8AA2", 16.22, 11.64, 9.3, "LOTT", 229, "jogo-flor-lottus"],
    ["kit-bridgerton-azul", "Jogo Bridgerton Azul", "#557AB7", 16.22, 11.83, 9.95, "BRIA", 231, "jogo-bridgerton-azul"],
    ["kit-bridgerton-verde", "Jogo Bridgerton Verde", "#477252", 18.66, 11.83, 11, "BRIV", 234, "jogo-bridgerton-verde"],
    ["kit-fundo-do-mar-premium", "Jogo Fundo do Mar Premium", "#213C68", 22.5, 13.86, 12.4, "FUNP", null, null],
  ].map((entry, index): Product => {
    const [id, name, color, placemat, napkin, ring, code, trayId, imageSlug] = entry as [string, string, string, number, number, number | null, string, number | null, string | null];
    return {
    id,
    name,
    category: "Jogos",
    sku: `MG-KT-${code}`,
    tray_id: trayId,
    collection: name.replace(/^Jogo /, "").replace(/^Jogo Americano /, ""),
    color_name: "Conforme composição",
    color_hex: color,
    retail_price: null,
    wholesale_price: null,
    game_items: [
      { label: "Lugar americano", retail_price: id === "kit-fundo-do-mar-premium" ? 45 : null, wholesale_price: placemat },
      { label: "Guardanapo", retail_price: ["kit-churrasco", "kit-hamburguer"].includes(id) ? 23.9 : null, wholesale_price: napkin },
      { label: "Porta-guardanapo", wholesale_price: ring },
    ],
    image_url: imageSlug ? `/produtos/jogos/${imageSlug}-${imageSlug === "jogo-hot-dog" ? "01" : "02"}.webp` : "/produtos/placeholder-mesaegraca.webp",
    editorial_image_url: imageSlug ? `/produtos/jogos/${imageSlug}-${imageSlug === "jogo-hot-dog" ? "02" : "01"}.webp` : null,
    image_status: imageSlug ? "final" : "placeholder",
    sort_order: index + 9,
    is_visible: true,
  }; }),
  ...[
    ["lugar-americano-natal-majestosa-vinho", "Lugar Americano Natal Majestosa Vinho", "#7B1C2D", 30.32, 16.68, "/produtos/natal-majestosa-vinho.webp", "MAJV"],
    ["lugar-americano-natal-majestosa-verde", "Lugar Americano Natal Majestosa Verde", "#285A3C", 30.32, 16.68, "/produtos/natal-majestosa-verde.webp", "MAJE"],
    ["lugar-americano-natal-floresta-encantada", "Lugar Americano Natal Floresta Encantada", "#2F5938", 28.9, 15.9, "/produtos/natal-floresta-encantada.webp", "NTFL"],
    ["lugar-americano-natal-classico-borda-xadrez", "Lugar Americano Natal Clássico Borda Xadrez", "#A23A35", 35, 17.5, "/produtos/natal-classico-borda-xadrez.webp", "NTCL"],
    ["lugar-americano-canto-da-graca", "Canto da Graça", "#B59471", 38.9, 19.45, "/produtos/canto-da-graca.webp", "CANT"],
  ].map((entry, index): Product => {
    const [id, name, color, retail, wholesale, image, code] = entry as [string, string, string, number, number, string, string];
    return {
    id,
    name,
    category: "Lugar Americano",
    sku: `MG-LA-${code}`,
    tray_id: null,
    collection: name.includes("Natal") ? "Natal" : null,
    color_name: "Variações disponíveis",
    color_hex: color,
    retail_price: retail,
    wholesale_price: wholesale,
    image_url: image ?? "/produtos/placeholder-mesaegraca.webp",
    image_status: image ? "final" : "placeholder",
    sort_order: index + 10,
    is_visible: true,
  }; }),
  ...portaNames.map(([name, retail, wholesale], index): Product => {
    const config = PORTA_CONFIG[index] ?? { slug: `porta-guardanapo-${index + 1}`, code: `PG${String(index + 1).padStart(2, "0")}`, tray_id: null };
    return {
    id: config.slug,
    name,
    category: "Porta-guardanapos",
    sku: `MG-PG-${config.code}`,
    tray_id: config.tray_id,
    collection: null,
    color_name: portaColorDetails[index][0],
    color_hex: portaColorDetails[index][1],
    retail_price: retail,
    wholesale_price: wholesale,
    image_url:
      config.customImage ??
      (updatedPortaImageSlugs[index] && `/produtos/porta-guardanapos/${updatedPortaImageSlugs[index]}-02.webp`) ??
      portaStudioImages[index] ??
      `/produtos/produto-${String(index + 1).padStart(2, "0")}.webp`,
    editorial_image_url:
      config.customEditorial ??
      generatedPortaEditorialImages[index] ??
      (updatedPortaImageSlugs[index] && `/produtos/porta-guardanapos/${updatedPortaImageSlugs[index]}-01.webp`) ??
      portaEditorialImages[index] ?? null,
    image_status: "final",
    sort_order: index + 1,
    is_visible: true,
    kit_quantity: name.includes("Kit com 4") ? 4 : null,
    variations:
      name === "Laço Elegance"
        ? [
            ...lacoColors.map(([cName, hex]) => ({
              name: cName,
              hex,
              pattern: "xadrez" as const,
              sku: `MG-PG-ELEG-${cName.substring(0, 2).toUpperCase()}-XD`,
            })),
            ...lacoColors.map(([cName, hex]) => ({
              name: cName,
              hex,
              pattern: "liso" as const,
              sku: `MG-PG-ELEG-${cName.substring(0, 2).toUpperCase()}-LS`,
            })),
          ]
        : name === "Laço Charm"
          ? lacoColors.map(([cName, hex]) => ({
              name: cName,
              hex,
              pattern: "xadrez" as const,
              sku: `MG-PG-CHAR-${cName.substring(0, 2).toUpperCase()}`,
            }))
          : undefined,
  }; }),
];

const MATERIALS_BY_PRODUCT_ID: Record<string, MaterialDetail[]> = {
  "kit-bridgerton-azul": [{ label: "Lugar americano", value: "Tricoline" }, { label: "Guardanapo", value: "Tricoline off-white" }],
  "kit-bridgerton-verde": [{ label: "Lugar americano", value: "Tricoline" }, { label: "Guardanapo", value: "Tricoline off-white" }],
  "kit-pizza-dupla-face": [{ label: "Lugar americano", value: "Nylon e Oxford" }, { label: "Guardanapo", value: "Oxford verde e xadrez" }],
  "kit-hot-dog": [{ label: "Lugar americano", value: "Nylon e Oxford" }, { label: "Guardanapo", value: "Oxford branco" }],
  "kit-feijoada": [{ label: "Lugar americano", value: "Nylon" }, { label: "Guardanapo", value: "Tricoline off-white" }],
  "kit-hamburguer": [{ label: "Lugar americano", value: "Jeans e courino" }, { label: "Guardanapo", value: "Jeans" }],
  "kit-churrasco": [{ label: "Lugar americano", value: "Jeans e courino" }, { label: "Guardanapo", value: "Jeans" }],
  "kit-abelhinha": [{ label: "Lugar americano", value: "Nylon" }, { label: "Guardanapo", value: "Tricoline amarelo" }],
  "lugar-americano-canto-da-graca": [{ label: "Lugar americano", value: "Nylon" }, { label: "Guardanapo", value: "Tricoline off-white" }],
  "kit-limao": [{ label: "Lugar americano", value: "Gorgurinho" }, { label: "Guardanapo", value: "Tricoline azul-marinho" }],
  "kit-cerejinha": [{ label: "Lugar americano", value: "Nylon" }, { label: "Guardanapo", value: "Tricoline listrado" }],
  "kit-ovinho": [{ label: "Lugar americano", value: "Nylon" }, { label: "Guardanapo", value: "Tricoline off-white" }],
  "kit-folhas": [{ label: "Lugar americano", value: "Gorgurinho" }, { label: "Guardanapo", value: "Oxford verde" }],
  "kit-magnolia": [{ label: "Lugar americano", value: "Jacquard" }, { label: "Guardanapo", value: "Oxford verde" }],
  "kit-quadrado-xadrez": [{ label: "Lugar americano", value: "Nylon e Oxford" }, { label: "Guardanapo", value: "—" }],
  "kit-essence-campestre": [{ label: "Lugar americano", value: "Jacquard" }, { label: "Guardanapo", value: "Tricoline off-white" }],
  "kit-rose-imperial": [{ label: "Lugar americano", value: "Gorgurinho" }, { label: "Guardanapo", value: "—" }],
  "kit-flor-de-lottus": [{ label: "Lugar americano", value: "Courino" }, { label: "Guardanapo", value: "—" }],
  "kit-fundo-do-mar-premium": [{ label: "Lugar americano", value: "Nylon" }, { label: "Guardanapo", value: "Tricoline azul-marinho" }],
  "kit-mariposa-rose": [{ label: "Lugar americano", value: "Nylon" }, { label: "Guardanapo", value: "—" }],
  "kit-belle-rose": [{ label: "Lugar americano", value: "Nylon" }, { label: "Guardanapo", value: "—" }],
  "kit-costela-de-adao": [{ label: "Lugar americano", value: "Córdoba" }, { label: "Guardanapo", value: "Polly linho" }],
  "kit-alecrim": [{ label: "Lugar americano", value: "Córdoba" }, { label: "Guardanapo", value: "Polly linho" }],
  "kit-lavanda": [{ label: "Lugar americano", value: "Córdoba" }, { label: "Guardanapo", value: "Polly linho" }],
  "kit-oliveira": [{ label: "Lugar americano", value: "Córdoba" }, { label: "Guardanapo", value: "Polly linho" }],
};

const DIMENSIONS_BY_PRODUCT_ID: Record<string, MaterialDetail[]> = {
  "kit-bridgerton-azul": [{ label: "Lugar americano", value: "43 × 35 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-bridgerton-verde": [{ label: "Lugar americano", value: "43 × 35 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-pizza-dupla-face": [{ label: "Lugar americano", value: "38 × 38 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-hot-dog": [{ label: "Lugar americano", value: "43 × 34 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-feijoada": [{ label: "Lugar americano", value: "42,5 × 35,5 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-hamburguer": [{ label: "Lugar americano", value: "43 × 34 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-churrasco": [{ label: "Lugar americano", value: "43 × 33,5 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-abelhinha": [{ label: "Lugar americano", value: "44 × 34 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "lugar-americano-canto-da-graca": [{ label: "Lugar americano", value: "—" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-limao": [{ label: "Lugar americano", value: "43 × 34,5 cm" }, { label: "Guardanapo", value: "40 × 40 cm" }],
  "kit-cerejinha": [{ label: "Lugar americano", value: "44 × 35 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-ovinho": [{ label: "Lugar americano", value: "44 × 32,5 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-folhas": [{ label: "Lugar americano", value: "43 × 34,5 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-magnolia": [{ label: "Lugar americano", value: "43,5 × 33,5 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-quadrado-xadrez": [{ label: "Lugar americano", value: "43 × 34 cm" }, { label: "Guardanapo", value: "—" }],
  "kit-essence-campestre": [{ label: "Lugar americano", value: "43 × 33,5 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-rose-imperial": [{ label: "Lugar americano", value: "44 × 32 cm" }, { label: "Guardanapo", value: "—" }],
  "kit-flor-de-lottus": [{ label: "Lugar americano", value: "43 × 39 cm" }, { label: "Guardanapo", value: "—" }],
  "kit-fundo-do-mar-premium": [{ label: "Lugar americano", value: "41 × 32,5 cm" }, { label: "Guardanapo", value: "40 × 40 cm" }],
  "kit-mariposa-rose": [{ label: "Lugar americano", value: "43 × 33 cm" }, { label: "Guardanapo", value: "—" }],
  "kit-belle-rose": [{ label: "Lugar americano", value: "43 × 33 cm" }, { label: "Guardanapo", value: "—" }],
  "kit-costela-de-adao": [{ label: "Lugar americano", value: "43 × 34 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-alecrim": [{ label: "Lugar americano", value: "43 × 34 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-lavanda": [{ label: "Lugar americano", value: "43 × 34 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
  "kit-oliveira": [{ label: "Lugar americano", value: "43 × 34 cm" }, { label: "Guardanapo", value: "42 × 42 cm" }],
};

const GAME_DESCRIPTIONS: Record<string, string> = {
  "kit-fundo-do-mar-convencional": "Composição em azul e off-white que une lugar americano, guardanapo e porta-guardanapo para uma mesa de inspiração marítima.",
  "lugar-americano-redondo-xadrez": "Lugar americano redondo dupla face, com acabamento ondulado e opções xadrez ou lisas para alternar a composição da mesa.",
  "kit-abelhinha": "Jogo delicado com lugar americano temático, guardanapo e porta-guardanapo Florzinha Amarela para uma mesa leve e cheia de charme.",
  "kit-ovinho": "Composição divertida e delicada com lugar americano Ovinho, guardanapo creme e porta-guardanapo temático para cafés e mesas afetivas.",
  "kit-cerejinha": "Jogo em tons de vermelho com detalhes de cerejinhas, composto por lugar americano, guardanapo listrado e porta-guardanapo coordenado.",
  "kit-folhas": "Composição em folhagem verde que combina lugar americano, guardanapo e porta-guardanapo Esfera Marfim para uma mesa natural e acolhedora.",
  "kit-magnolia": "Jogo floral de presença delicada, com lugar americano Magnólia, guardanapo creme e porta-guardanapo Esfera Dourada.",
  "kit-feijoada": "Jogo completo de inspiração brasileira, com lugar americano em nylon, guardanapo em tricoline e porta-guardanapo coordenado.",
  "kit-hot-dog": "Composição temática com borda xadrez vermelha, guardanapo bordado de hot dog e porta-guardanapo em courino. Ideal para mesas descontraídas.",
  "kit-churrasco": "Jogo completo com lugar americano em jeans e courino, guardanapo em jeans e porta-guardanapo coordenado. Uma proposta marcante para receber.",
  "kit-hamburguer": "Composição temática em jeans e courino, acompanhada de guardanapo em jeans e porta-guardanapo coordenado para uma mesa casual e cheia de personalidade.",
  "kit-pizza-dupla-face": "Jogo dupla face com lugar americano em nylon e Oxford, guardanapo em Oxford e porta-guardanapo Pizza Bordado para uma mesa temática.",
  "kit-quadrado-xadrez": "Jogo dupla face com lugar americano quadrado xadrez, guardanapo e porta-guardanapo coordenados. Escolha a cor que melhor combina com sua composição.",
  "kit-limao": "Composição vibrante de limões, com lugar americano em gorgurinho, guardanapo em tricoline e porta-guardanapo coordenado.",
  "kit-essence-campestre": "Jogo dupla face de atmosfera campestre, com lugar americano, guardanapo e porta-guardanapo para composições acolhedoras e versáteis.",
  "kit-costela-de-adao": "Composição tropical com estampa de Costela de Adão, guardanapo e porta-guardanapo coordenados para levar frescor à mesa.",
  "kit-alecrim": "Jogo de inspiração botânica, com lugar americano, guardanapo e porta-guardanapo coordenados para uma mesa leve e elegante.",
  "kit-lavanda": "Composição suave em tons de lavanda, com lugar americano, guardanapo e porta-guardanapo coordenados para receber com delicadeza.",
  "kit-oliveira": "Jogo de inspiração mediterrânea com lugar americano, guardanapo e porta-guardanapo coordenados em uma composição acolhedora.",
  "kit-rose-imperial": "Composição floral Rosé Imperial com lugar americano, guardanapo e porta-guardanapo para mesas românticas e cheias de detalhes.",
  "kit-mariposa-rose": "Jogo floral em tons rosé, composto por lugar americano, guardanapo e porta-guardanapo coordenados para uma mesa delicada.",
  "kit-belle-rose": "Composição Belle Rosé com lugar americano, guardanapo e porta-guardanapo coordenados, pensada para receber com elegância.",
  "kit-flor-de-lottus": "Jogo em tons florais suaves, com lugar americano, guardanapo e porta-guardanapo coordenados para uma mesa romântica.",
  "kit-bridgerton-azul": "Composição em tricoline com estampa floral azul, guardanapo coordenado e porta-guardanapo para uma mesa clássica e refinada.",
  "kit-bridgerton-verde": "Composição em tricoline com estampa floral verde, guardanapo coordenado e porta-guardanapo para uma mesa leve e elegante.",
  "kit-fundo-do-mar-premium": "Versão premium da linha Fundo do Mar, com lugar americano, guardanapo e porta-guardanapo coordenados em uma composição sofisticada.",
};

const defaultDescription = (product: Product) => {
  if (GAME_DESCRIPTIONS[product.id]) return GAME_DESCRIPTIONS[product.id];
  if (product.category === "Jogos") return "Jogo completo para mesa posta, composto por lugar americano, guardanapo e porta-guardanapo.";
  if (product.category === "Porta-guardanapos") return "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.";
  return "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.";
};

FEATURED_PRODUCTS.forEach((product) => {
  product.description ??= defaultDescription(product);
  product.materials ??= MATERIALS_BY_PRODUCT_ID[product.id] ?? [{ label: "Material", value: "—" }];
  product.dimensions ??= DIMENSIONS_BY_PRODUCT_ID[product.id] ?? [{ label: "Medidas", value: "—" }];
});
