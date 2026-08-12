export const CATEGORIES = ["Jogos Americanos", "Porta-guardanapos"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Variation = {
  name: string;
  hex: string;
  pattern: "xadrez" | "liso";
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
  image_status: "final" | "placeholder";
  sort_order: number;
  is_visible: boolean;
  variations?: Variation[];
  created_at?: string;
};
export type ProductInput = Omit<Product, "id" | "created_at" | "variations">;

export const FEATURED_PRODUCTS: Product[] = [
  { id:"laco-elegance", name:"Laço Elegance", category:"Porta-guardanapos", sku:"PG-LE", collection:"Laços", color_name:"Preço único · escolha a variação", color_hex:null, retail_price:14.9, wholesale_price:10.9, image_url:"/produtos/laco-elegance.png", image_status:"final", sort_order:1, is_visible:true, variations:[
    {name:"Rosa bebê",hex:"#E9B7BC",pattern:"xadrez"},{name:"Vermelho",hex:"#A8202A",pattern:"xadrez"},{name:"Verde",hex:"#215F3E",pattern:"xadrez"},{name:"Amarelo",hex:"#E4AD31",pattern:"xadrez"},{name:"Marinho",hex:"#1D2C49",pattern:"xadrez"},{name:"Preto",hex:"#272727",pattern:"xadrez"},
    {name:"Rosa bebê",hex:"#E9B7BC",pattern:"liso"},{name:"Vermelho",hex:"#A8202A",pattern:"liso"},{name:"Verde",hex:"#215F3E",pattern:"liso"},{name:"Amarelo",hex:"#E4AD31",pattern:"liso"},{name:"Marinho",hex:"#1D2C49",pattern:"liso"},{name:"Preto",hex:"#272727",pattern:"liso"},
  ]},
  { id:"laco-charm", name:"Laço Charm", category:"Porta-guardanapos", sku:"PG-LC", collection:"Laços", color_name:"Preço único · escolha a cor", color_hex:null, retail_price:11.9, wholesale_price:7.9, image_url:"/produtos/laco-charm.png", image_status:"final", sort_order:2, is_visible:true, variations:[
    {name:"Rosa bebê",hex:"#E9B7BC",pattern:"xadrez"},{name:"Vermelho",hex:"#A8202A",pattern:"xadrez"},{name:"Verde",hex:"#215F3E",pattern:"xadrez"},{name:"Amarelo",hex:"#E4AD31",pattern:"xadrez"},{name:"Marinho",hex:"#1D2C49",pattern:"xadrez"},{name:"Preto",hex:"#272727",pattern:"xadrez"},
  ]},
  { id:"ovinho", name:"Ovinho", category:"Porta-guardanapos", sku:"PG-OV", collection:"Café da manhã", color_name:null, color_hex:null, retail_price:13.9, wholesale_price:9.04, image_url:"/produtos/ovinho.png", image_status:"final", sort_order:3, is_visible:true },
  { id:"orquidea-azul", name:"Orquídea Azul", category:"Porta-guardanapos", sku:"PG-OA", collection:"Florais", color_name:"Azul serenity", color_hex:"#2878C6", retail_price:15.3, wholesale_price:9.04, image_url:"/produtos/orquidea-azul.png", image_status:"final", sort_order:4, is_visible:true },
  { id:"flor-rosa", name:"Flor Rosa", category:"Porta-guardanapos", sku:"PG-FR", collection:"Florais", color_name:"Rosa", color_hex:"#D94F72", retail_price:13.9, wholesale_price:9.04, image_url:"/produtos/flor-rosa.png", image_status:"final", sort_order:5, is_visible:true },
  { id:"no-turco", name:"Nó Turco · Kit com 4", category:"Porta-guardanapos", sku:"PG-NT", collection:"Naturais", color_name:"Juta", color_hex:"#A66A37", retail_price:7, wholesale_price:4.9, image_url:"/produtos/no-turco.png", image_status:"final", sort_order:6, is_visible:true },
  { id:"courino", name:"Courino Marrom · Kit com 4", category:"Porta-guardanapos", sku:"PG-CM", collection:"Essenciais", color_name:"Marrom", color_hex:"#934B2E", retail_price:6.5, wholesale_price:4.03, image_url:"/produtos/courino-marrom.png", image_status:"final", sort_order:7, is_visible:true },
  { id:"xadrez-dupla-face", name:"Jogo Americano Redondo Xadrez", category:"Jogos Americanos", sku:"JA-XD", collection:"Dupla Face", color_name:"Variações com o mesmo preço", color_hex:null, retail_price:null, wholesale_price:null, image_url:"/produtos/jogo-xadrez-dupla-face.jpg", image_status:"final", sort_order:1, is_visible:true },
  { id:"fundo-mar-convencional", name:"Fundo do Mar Convencional", category:"Jogos Americanos", sku:"JA-FMC", collection:"Fundo do Mar", color_name:"Azul e off-white", color_hex:"#4C83A8", retail_price:null, wholesale_price:null, image_url:"/produtos/fundo-do-mar-convencional.png", image_status:"final", sort_order:2, is_visible:true },
];
