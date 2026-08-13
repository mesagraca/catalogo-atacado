export const CATEGORIES = ["Jogos", "Lugar Americano", "Porta-guardanapos"] as const;
export type Category = (typeof CATEGORIES)[number];
export type Variation = {
  name: string;
  hex: string;
  pattern: "xadrez" | "liso";
};
export type GameItem = {
  label: "Lugar americano" | "Guardanapo" | "Porta-guardanapo";
  wholesale_price: number | null;
};
export type Product = {
  id: string;
  name: string;
  category: Category;
  sku: string | null;
  collection: string | null;
  color_name: string | null;
  color_hex: string | null;
  retail_price: number | null;
  wholesale_price: number | null;
  image_url: string | null;
  editorial_image_url?: string | null;
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
export type ProductInput = Omit<Product, "id" | "created_at" | "variations">;

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
  ["Chapéu Junino", 12.9, 6],
  ["Rubi", 12.9, 8],
  ["Pérolas Douradas", 13.9, 9],
  ["Nó Náutico", 13.9, 8],
  ["Rosa Pêssego", 13.9, 9.04],
  ["Flor Azul Serenity", 13.9, 9.04],
  ["Folhagem Eucalipto", 13.9, 9.04],
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

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "jogo-xadrez",
    name: "Lugar Americano Redondo Xadrez",
    category: "Lugar Americano",
    sku: "JA-XD",
    collection: "Dupla Face",
    color_name: "Variações disponíveis",
    color_hex: null,
    retail_price: 22.32,
    wholesale_price: 18.19,
    image_url: "/produtos/dupla-face-rosa-bebe.png",
    image_status: "final",
    sort_order: 1,
    is_visible: true,
    variations: [
      { name: "Rosa bebê", hex: "#E9B7BC", pattern: "xadrez" },
      { name: "Vermelho", hex: "#C51F2A", pattern: "xadrez" },
      { name: "Verde", hex: "#1F5A3D", pattern: "xadrez" },
      { name: "Amarelo", hex: "#D99B19", pattern: "xadrez" },
      { name: "Marinho", hex: "#203150", pattern: "xadrez" },
      { name: "Preto", hex: "#292929", pattern: "xadrez" },
      { name: "Rosa bebê", hex: "#E9B7BC", pattern: "liso" },
      { name: "Vermelho", hex: "#C51F2A", pattern: "liso" },
      { name: "Verde", hex: "#1F5A3D", pattern: "liso" },
      { name: "Amarelo", hex: "#D99B19", pattern: "liso" },
      { name: "Marinho", hex: "#203150", pattern: "liso" },
      { name: "Preto", hex: "#292929", pattern: "liso" },
    ],
  },
  {
    id: "fundo-mar",
    name: "Jogo Fundo do Mar Convencional",
    category: "Jogos",
    sku: "JA-FMC",
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
    image_url: "/produtos/FUNDO%20DO%20MAR%20CONVENCIONAL.png",
    image_status: "final",
    sort_order: 2,
    is_visible: true,
  },
  {
    id: "laco-frances",
    name: "Laço Francês",
    category: "Lugar Americano",
    sku: "JA-LF",
    collection: "Coleção Essencial",
    color_name: "Variações disponíveis",
    color_hex: null,
    retail_price: 32.9,
    wholesale_price: 16.45,
    image_url: "/produtos/laco-frances-rosa-bebe.png",
    image_status: "final",
    sort_order: 3,
    is_visible: true,
    variations: [
      { name: "Rosa bebê", hex: "#E9B7BC", pattern: "liso" },
      { name: "Rosa pink", hex: "#D82872", pattern: "liso" },
      { name: "Azul marinho", hex: "#1A2947", pattern: "liso" },
      { name: "Marrom", hex: "#704126", pattern: "liso" },
      { name: "Vinho", hex: "#781F32", pattern: "liso" },
      { name: "Amarelo", hex: "#D8A61B", pattern: "liso" },
      { name: "Verde", hex: "#637039", pattern: "liso" },
    ],
  },
  {
    id: "ja-abelhinha",
    name: "Jogo Abelhinha",
    category: "Jogos",
    sku: "JA-AB",
    collection: "Abelhinha",
    color_name: "Amarelo",
    color_hex: "#E5AA1A",
    retail_price: 16.9,
    wholesale_price: null,
    game_items: [
      { label: "Lugar americano", wholesale_price: 16.45 },
      { label: "Guardanapo", wholesale_price: 12.6 },
      { label: "Porta-guardanapo", wholesale_price: 8.9 },
    ],
    image_url: "/produtos/colecao-abelhinha.png",
    editorial_image_url: "/produtos/editorial-abelhinha.png",
    image_status: "final",
    sort_order: 4,
    is_visible: true,
  },
  {
    id: "ja-ovinho",
    name: "Jogo Ovinho",
    category: "Jogos",
    sku: "JA-OV",
    collection: "Ovinho",
    color_name: "Branco e amarelo",
    color_hex: "#E5A70D",
    retail_price: 15.9,
    wholesale_price: null,
    game_items: [
      { label: "Lugar americano", wholesale_price: 16.45 },
      { label: "Guardanapo", wholesale_price: 11.2 },
      { label: "Porta-guardanapo", wholesale_price: 10.9 },
    ],
    image_url: "/produtos/colecao-ovinho.png",
    editorial_image_url: "/produtos/editorial-ovinho.png",
    image_status: "final",
    sort_order: 5,
    is_visible: true,
  },
  {
    id: "ja-cerejinha",
    name: "Jogo Cerejinha",
    category: "Jogos",
    sku: "JA-CE",
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
    image_url: "/produtos/colecao-cerejinha.png",
    editorial_image_url: "/produtos/editorial-cerejinha.png",
    image_status: "final",
    sort_order: 6,
    is_visible: true,
  },
  {
    id: "ja-folhas",
    name: "Jogo Folhas",
    category: "Jogos",
    sku: "JA-FO",
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
    image_url: "/produtos/colecao-folhas.png",
    editorial_image_url: "/produtos/editorial-folhas.png",
    image_status: "final",
    sort_order: 7,
    is_visible: true,
  },
  {
    id: "ja-magnolia",
    name: "Jogo Magnólia",
    category: "Jogos",
    sku: "JA-MA",
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
    image_url: "/produtos/colecao-magnolia.png",
    editorial_image_url: "/produtos/editorial-magnolia.png",
    image_status: "final",
    sort_order: 8,
    is_visible: true,
  },
  ...portaNames.map(([name, retail, wholesale], index): Product => ({
    id: `pg-${index + 1}`,
    name,
    category: "Porta-guardanapos",
    sku: `PG-${String(index + 1).padStart(2, "0")}`,
    collection: null,
    color_name: portaColorDetails[index][0],
    color_hex: portaColorDetails[index][1],
    retail_price: retail,
    wholesale_price: wholesale,
    image_url:
      portaStudioImages[index] ??
      `/produtos/produto-${String(index + 1).padStart(2, "0")}.png`,
    editorial_image_url: portaEditorialImages[index] ?? null,
    image_status: "final",
    sort_order: index + 1,
    is_visible: true,
    kit_quantity: name.includes("Kit com 4") ? 4 : null,
    variations:
      name === "Laço Elegance"
        ? [
            ...lacoColors.map(([name, hex]) => ({
              name,
              hex,
              pattern: "xadrez" as const,
            })),
            ...lacoColors.map(([name, hex]) => ({
              name,
              hex,
              pattern: "liso" as const,
            })),
          ]
        : name === "Laço Charm"
          ? lacoColors.map(([name, hex]) => ({
              name,
              hex,
              pattern: "xadrez" as const,
            }))
          : undefined,
  })),
];
