export const CATEGORIES = ["Jogos", "Lugar Americano", "Porta-guardanapos", "Guardanapos"] as const;
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
  description?: string;
  materials?: MaterialDetail[];
  dimensions?: MaterialDetail[];
  image_status: "final" | "placeholder";
  sort_order: number;
  is_visible: boolean;
  kit_quantity?: number | null;
  game_items?: GameItem[];
  variations?: Variation[];
  created_at?: string;
};

export type ProductInput = Omit<Product, "id" | "created_at"> & {
  variations?: Variation[];
};

export const FEATURED_PRODUCTS: Product[] = [
  {
    "id": "kit-mesa-posta-costela-de-adao-com-lugar-americano-guardanapo-porta-guardanapo-255",
    "name": "Kit Mesa Posta Costela de Adão - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "KIT-TEC-GRA-120",
    "tray_id": 255,
    "collection": "COSTELA DE ADÃO",
    "color_name": null,
    "color_hex": null,
    "retail_price": 57.8,
    "wholesale_price": 40.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_costela_de_adao_com_lugar_americano_guardanapo_porta_guardanapo_255_2_fb1be81f54bcc036ede5fc42c505f197.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_costela_de_adao_com_lugar_americano_guardanapo_porta_guardanapo_255_1_6fd832c3f4c6122fa95743935f6ac89e.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em CÓRDOBA ESTAMPADO (SEM BORDADO).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "CÓRDOBA ESTAMPADO (SEM BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "LINHO 50%"
      },
      {
        "label": "Porta-guardanapo",
        "value": "COSTELA DE ADÃO MEDITERRANEO"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 18.2,
        "retail_price": 26
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.5,
        "retail_price": 17.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.9
      }
    ],
    "created_at": "2026-10-29T16:35:55.215406+00:00"
  },
  {
    "id": "kit-mesa-posta-xadrez-verde-com-lugar-americano-guardanapo-porta-guardanapo-135",
    "name": "Kit Mesa Posta Xadrez Verde - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-COM-135",
    "tray_id": 135,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 55,
    "wholesale_price": 38.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_verde_com_g_2_20260623101350_e453e1fbd87a.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_verde_com_guardanapo_e_porta_guardanapo_laco_135_1_f2bd3879c982d96f0c73f21b101d9be5.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.1,
        "retail_price": 17.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.8
      }
    ],
    "created_at": "2026-10-29T16:35:44.98497+00:00"
  },
  {
    "id": "kit-mesa-posta-xadrez-laranja-com-lugar-americano-guardanapo-porta-guardanapo-137",
    "name": "Kit Mesa Posta Xadrez Laranja - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-COM-137",
    "tray_id": 137,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 55,
    "wholesale_price": 38.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_laranja_com_2_20260623101609_f59f8d92416b.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_laranja_com_guardanapo_e_porta_guardanapo_laco_137_1_d06c33cda7bae6ba44f88d017c4fb99c.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.1,
        "retail_price": 17.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.8
      }
    ],
    "created_at": "2026-10-29T16:35:45.328983+00:00"
  },
  {
    "id": "lugar-americano-limao-siciliano-azul-marinho-com-borda-amarela-179",
    "name": "Lugar Americano Limão Siciliano Azul Marinho com Borda Amarela",
    "category": "Lugar Americano",
    "sku": "MES-NYL-LAM-179",
    "tray_id": 179,
    "collection": "LIMÃO AZUL",
    "color_name": null,
    "color_hex": null,
    "retail_price": 21.9,
    "wholesale_price": 15.3,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_limao_siciliano_azul_marinho_com_borda_amarela_179_2_d9b65ddd082ead774b27c8ca09222e84.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_limao_siciliano_azul_marinho_com_borda_amarela_179_1_e9e6879155b232056421b981fd43fdce.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em GORGURINHO.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "GORGURINHO"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:51.521261+00:00"
  },
  {
    "id": "lugar-americano-festa-junina-xadrez-vermelho-bordo-165",
    "name": "Lugar Americano Festa Junina Xadrez Vermelho Bordô",
    "category": "Lugar Americano",
    "sku": "MES-NYL-JAM-165",
    "tray_id": 165,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 23,
    "wholesale_price": 16.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_festa_junina_xadrez_vermelho_bordo_165_2_89c32c2c6aad848753be2e3832377173.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_festa_junina_xadrez_vermelho_bordo_165_1_a54556fad62b8828958546d5cf089b92.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhe Estruturado.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:49.412812+00:00"
  },
  {
    "id": "lugar-americano-italia-redondo-verde-com-borda-xadrez-para-mesa-posta-168",
    "name": "Lugar Americano Itália Redondo Verde com Borda Xadrez para Mesa Posta",
    "category": "Lugar Americano",
    "sku": "MES-NYL-LAM-168",
    "tray_id": 168,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 36,
    "wholesale_price": 25.2,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_itlia_redondo_verde_com_borda_xadr_2_20260625150332_0b4c3f00deca.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_itlia_redondo_verde_com_borda_xadr_1_20260625150332_3a2ee33fc003.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhe Estruturado.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "Redondo 44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:49.869426+00:00"
  },
  {
    "id": "lugar-americano-floral-rosa-com-acabamento-bordado-181",
    "name": "Lugar Americano Floral Rosa com Acabamento Bordado",
    "category": "Lugar Americano",
    "sku": "MES-NYL-LAM-181",
    "tray_id": 181,
    "collection": "ROSE IMPERIAL",
    "color_name": null,
    "color_hex": null,
    "retail_price": 19.9,
    "wholesale_price": 13.9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_floral_rosa_com_acabamento_bordado_181_2_cf1b723faabdf15af6665e71bbf5b1d2.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_floral_rosa_com_acabamento_bordado_181_1_c48d8d17acf5fc968110d55e3481e2ad.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em GORGURINHO.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "GORGURINHO"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:51.822931+00:00"
  },
  {
    "id": "lugar-americano-costela-de-adao-com-frase-a-mesa-e-o-lugar-onde-o-amor-se-reune-145",
    "name": "Lugar Americano Costela de Adão Com Frase \"A Mesa é o Lugar Onde o Amor Se Reúne\"",
    "category": "Lugar Americano",
    "sku": "MES-TEC-JAM-145",
    "tray_id": 145,
    "collection": "COSTELA DE ADÃO",
    "color_name": null,
    "color_hex": null,
    "retail_price": 26,
    "wholesale_price": 18.2,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/jogo_americano_costela_de_adao_com_frase_a_mesa_e_o_lugar_onde_o_amor_se_reune_145_2_ed1feeba9e0c03742309f416f6d11772.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/jogo_americano_costela_de_adao_com_frase_a_mesa_e_o_lugar_onde_o_amor_se_reune_145_1_b41e3affa2f987cec11bae1c439a2ffe.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em CÓRDOBA ESTAMPADO.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "CÓRDOBA ESTAMPADO"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "100 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:46.529084+00:00"
  },
  {
    "id": "lugar-americano-festa-junina-xadrez-azul-161",
    "name": "Lugar Americano Festa Junina Xadrez Azul",
    "category": "Lugar Americano",
    "sku": "MES-NYL-JAM-161",
    "tray_id": 161,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 23,
    "wholesale_price": 16.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_festa_junina_xadrez_azul_161_2_b2dab6c673773269dcbb888bd6a9fec3.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_festa_junina_xadrez_azul_161_1_52121ea5748695cfbba771b3c94fdf99.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhe Estruturado.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:48.846884+00:00"
  },
  {
    "id": "lugar-americano-hamburguer-em-tecido-jeans-com-detalhe-em-courino-236",
    "name": "Lugar Americano Hambúrguer em Tecido Jeans com Detalhe em Courino",
    "category": "Lugar Americano",
    "sku": "MES-TEC-LAH-236",
    "tray_id": 236,
    "collection": "HAMBURGUER",
    "color_name": null,
    "color_hex": null,
    "retail_price": 43.9,
    "wholesale_price": 30.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_hamburguer_em_tecido_jeans_com_detalhe_em_courino_236_2_721de5a262c506c696e6753102fb163f.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_hamburguer_em_tecido_jeans_com_detalhe_em_courino_236_1_20c7c865019f0f001d35d17118865f69.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em JEANS - COURINO.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "JEANS - COURINO"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:54.084952+00:00"
  },
  {
    "id": "lugar-americano-bridgerton-verde-floral-com-borda-ondulada-232",
    "name": "Lugar Americano Bridgerton Verde Floral com Borda Ondulada",
    "category": "Lugar Americano",
    "sku": "MES-TEC-LAB-232",
    "tray_id": 232,
    "collection": "BRIDGERTON VERDE",
    "color_name": null,
    "color_hex": null,
    "retail_price": 25.6,
    "wholesale_price": 17.9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_bridgerton_verde_floral_com_borda_ondulada_232_2_7ce21eb7c0e808485d11e7d6abc30982.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_bridgerton_verde_floral_com_borda_ondulada_232_1_bf07150e0fdaa4344ff1e91977e5f46d.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em TRICOLINE FLORIDO 100%.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "TRICOLINE FLORIDO 100%"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:53.452879+00:00"
  },
  {
    "id": "kit-mesa-posta-xadrez-vermelho-com-lugar-americano-guardanapo-porta-guardanapo-87",
    "name": "Kit Mesa Posta Xadrez Vermelho  - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-COM-087",
    "tray_id": 87,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 55,
    "wholesale_price": 38.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_vermelho_com_guardanapo_e_porta_guardanapo_laco_87_2_b8bc4e46cfaeb4cfba1581cd1c21055b.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_vermelho_com_guardanapo_e_porta_guardanapo_laco_87_1_98754c2fecb31f116641764570681dc5.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.1,
        "retail_price": 17.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.8
      }
    ],
    "created_at": "2026-10-29T16:35:43.823266+00:00"
  },
  {
    "id": "kit-mesa-posta-floral-marrom-com-lugar-americano-guardanapo-porta-guardanapo-177",
    "name": "Kit Mesa Posta Floral Marrom - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-KIT-MPT-177",
    "tray_id": 177,
    "collection": "FLOR MARROM",
    "color_name": null,
    "color_hex": null,
    "retail_price": 51.5,
    "wholesale_price": 36.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_floral_marrom_com_lugar_americano_guardanapo_porta_guardanapo_177_2_eacb8949ca391117ae09070d8473947d.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_floral_marrom_com_lugar_americano_guardanapo_porta_guardanapo_177_1_aad1ea8416f35e8485058ee2c8d4c8d8.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em JACGUARD (BORDADO).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "JACGUARD (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "TRICOLINE 50% CREME"
      },
      {
        "label": "Porta-guardanapo",
        "value": "NÓ TURCO"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16,
        "retail_price": 22.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 13.2,
        "retail_price": 18.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 6.8,
        "retail_price": 9.7
      }
    ],
    "created_at": "2026-10-29T16:35:51.21342+00:00"
  },
  {
    "id": "guardanapo-de-tecido-italia-verde-169",
    "name": "Guardanapo de Tecido Itália Verde",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-169",
    "tray_id": 169,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 19.9,
    "wholesale_price": 13.9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_italia_verde_169_2_66bf6f4d12b053e32e4d0273ff75683e.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_italia_verde_169_1_ec5cdc4807cfcd00132b0f00444c9fa1.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Tricoline 100% Algodão com Toque Suave.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Tricoline 100% Algodão com Toque Suave"
      },
      {
        "label": "Acabamento",
        "value": "Bainha costurada e acabamento fino"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:50.002915+00:00"
  },
  {
    "id": "kit-mesa-posta-festa-junina-azul-com-lugar-americano-guardanapo-porta-guardanapo-83",
    "name": "Kit Mesa Posta Festa Junina Azul - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-COM-083",
    "tray_id": 83,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 55,
    "wholesale_price": 38.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_azul_com_guardanapo_e_porta_guardanapo_83_2_33495fe568597e77631449ae6c845aef.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_azul_com_guardanapo_e_porta_guardanapo_83_1_53111740fc122e405b6f0813151781dd.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.1,
        "retail_price": 17.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.8
      }
    ],
    "created_at": "2026-10-29T16:35:43.253188+00:00"
  },
  {
    "id": "kit-mesa-posta-festa-junina-laranja-com-lugar-americano-guardanapo-porta-guardanapo-85",
    "name": "Kit Mesa Posta Festa Junina Laranja - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-COM-085",
    "tray_id": 85,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 55,
    "wholesale_price": 38.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_laranja_com_guardanapo_e_porta_guardanapo_85_2_52eae4b9b37ad4cf4bf8cf3766ef882c.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_laranja_com_guardanapo_e_porta_guardanapo_85_1_4ee8ddba425a6ecb0a1aea494a0a21c0.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.1,
        "retail_price": 17.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.8
      }
    ],
    "created_at": "2026-10-29T16:35:43.540983+00:00"
  },
  {
    "id": "guardanapo-de-tecido-branco-182",
    "name": "Guardanapo de Tecido Branco",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-182",
    "tray_id": 182,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 14.9,
    "wholesale_price": 10.4,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_branco_182_2_f9b8133ad34134ea5b3262e6bcf0ecbd.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_branco_182_1_03bb60ead4509abb8618e3298fcc1674.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Tricoline 100% Algodão com Toque Suave.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Tricoline 100% Algodão com Toque Suave"
      },
      {
        "label": "Acabamento",
        "value": "Bainha costurada e acabamento fino"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:52.009497+00:00"
  },
  {
    "id": "kit-mesa-posta-xadrez-azul-com-lugar-americano-guardanapo-porta-guardanapo-136",
    "name": "Kit Mesa Posta Xadrez Azul - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-COM-136",
    "tray_id": 136,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 55,
    "wholesale_price": 38.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_azul_com_guardanapo_e_porta_guardanapo_laco_136_2_75614fe10725bc3aa88d5a5c1a5cd46c.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_azul_com_guardanapo_e_porta_guardanapo_laco_136_1_ff0dc2455ae46dd53182b9e279f500d7.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.1,
        "retail_price": 17.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.8
      }
    ],
    "created_at": "2026-10-29T16:35:45.161092+00:00"
  },
  {
    "id": "jogo-de-4-porta-guardanapos-margarida-fibra-natural-62",
    "name": "Jogo de 4 Porta-Guardanapos Margarida Fibra Natural",
    "category": "Porta-guardanapos",
    "sku": "MES-FIB-NAU-062",
    "tray_id": 62,
    "collection": null,
    "color_name": null,
    "color_hex": null,
    "retail_price": 76.9,
    "wholesale_price": 53.8,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/jogo_de_4_porta_guardanapos_margarida_fibra_natural_62_2_939620b40877d81f5cde9dff4fd4b82a.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/jogo_de_4_porta_guardanapos_margarida_fibra_natural_62_1_2dcc35d69b397d6ee51d251ccf746fe7.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:40.968976+00:00"
  },
  {
    "id": "lugar-americano-alecrim-com-frase-que-nunca-nos-falte-gratidao-a-mesa-147",
    "name": "Lugar Americano Alecrim Com Frase \"Que Nunca Nos Falte Gratidão à Mesa\"",
    "category": "Lugar Americano",
    "sku": "MES-TEC-JAM-147",
    "tray_id": 147,
    "collection": "ALECRIM",
    "color_name": null,
    "color_hex": null,
    "retail_price": 26,
    "wholesale_price": 18.2,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/jogo_americano_alecrim_com_frase_que_nunca_nos_falte_gratidao_a_mesa_147_2_500bfbc8c72cfd5e77321d16f504c6ea.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/jogo_americano_alecrim_com_frase_que_nunca_nos_falte_gratidao_a_mesa_147_1_30220bea68546fdc758909fac14bba81.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em CÓRDOBA ESTAMPADO.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "CÓRDOBA ESTAMPADO"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:46.815055+00:00"
  },
  {
    "id": "kit-mesa-posta-xadrez-azul-marinho-com-lugar-americano-guardanapo-porta-guardanapo-138",
    "name": "Kit Mesa Posta Xadrez Azul Marinho - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-COM-138",
    "tray_id": 138,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 55,
    "wholesale_price": 38.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_azul_marinh_2_20260623101548_c898923f74a2.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_azul_marinho_com_guardanapo_e_porta_guardanapo_laco_138_1_b3652e6bda5440209392c9e90fdabbb6.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.1,
        "retail_price": 17.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.8
      }
    ],
    "created_at": "2026-10-29T16:35:45.493073+00:00"
  },
  {
    "id": "lugar-americano-oliveira-com-frase-a-esperanca-floresce-onde-deus-e-centro-149",
    "name": "Lugar Americano Oliveira Com Frase \"A Esperança Floresce Onde Deus é Centro\"",
    "category": "Lugar Americano",
    "sku": "MES-TEC-JAM-149",
    "tray_id": 149,
    "collection": "RAMO DE OLIVEIRA",
    "color_name": null,
    "color_hex": null,
    "retail_price": 26,
    "wholesale_price": 18.2,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/jogo_americano_oliveira_com_frase_a_esperanca_floresce_onde_deus_e_centro_149_2_7d833bf5e4533939388daca3328af3d6.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/jogo_americano_oliveira_com_frase_a_esperanca_floresce_onde_deus_e_centro_149_1_9552a12862abe7e474664c44f6a99867.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em CÓRDOBA ESTAMPADO.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "CÓRDOBA ESTAMPADO"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "100 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:47.113502+00:00"
  },
  {
    "id": "porta-guardanapo-dourado-com-esferas-metalizadas-157",
    "name": "Porta Guardanapo Dourado com Esferas Metalizadas",
    "category": "Porta-guardanapos",
    "sku": "MES-PGU-DOU-157",
    "tray_id": 157,
    "collection": null,
    "color_name": null,
    "color_hex": null,
    "retail_price": 13.9,
    "wholesale_price": 9.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_dourado_com_esferas_metalizadas_157_2_28114bf08c51a43b9d018df4d65e2e94.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_dourado_com_esferas_metalizadas_157_1_883d4c67b5821887038f4fd78c45db3f.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Artesanal em Fibra Natural e Madeira.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:48.256927+00:00"
  },
  {
    "id": "guardanapo-de-tecido-hot-dog-bordado-171",
    "name": "Guardanapo de Tecido Hot Dog Bordado",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-171",
    "tray_id": 171,
    "collection": "HOTDOG",
    "color_name": null,
    "color_hex": null,
    "retail_price": 22.9,
    "wholesale_price": 16,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_hot_dog_bordado_171_2_a2887692c6c4baf924a3bdd3e3ef79d4.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_hot_dog_bordado_171_1_62ad775e1acc9eb95c3039c2e98d8298.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em OXFORD BRANCO.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "OXFORD BRANCO"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 X 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:50.310849+00:00"
  },
  {
    "id": "guardanapo-de-tecido-festa-junina-xadrez-azul-162",
    "name": "Guardanapo de Tecido Festa Junina Xadrez Azul",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-162",
    "tray_id": 162,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 19.9,
    "wholesale_price": 13.9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_festa_junina_xadrez_azul_162_2_030734e8a407c1f1dc95dd0e1816fcd8.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_festa_junina_xadrez_azul_162_1_409c456bb2025f7f2294bcb3d40d9fa6.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Tricoline 100% Algodão com Toque Suave.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Tricoline 100% Algodão com Toque Suave"
      },
      {
        "label": "Acabamento",
        "value": "Bainha costurada e acabamento fino"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:48.992855+00:00"
  },
  {
    "id": "lugar-americano-lavanda-com-frase-que-nesta-mesa-reine-a-paz-143",
    "name": "Lugar Americano Lavanda Com Frase \"Que Nesta Mesa Reine a Paz\"",
    "category": "Lugar Americano",
    "sku": "MES-TEC-JAM-143",
    "tray_id": 143,
    "collection": "LAVANDA",
    "color_name": null,
    "color_hex": null,
    "retail_price": 26,
    "wholesale_price": 18.2,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/jogo_americano_lavanda_com_frase_que_nesta_mesa_reine_a_paz_143_2_cc8052daa44bde82c2d151b622441ae9.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/jogo_americano_lavanda_com_frase_que_nesta_mesa_reine_a_paz_143_1_5bc65f75954a67bf684e21e2b75bda6a.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em CÓRDOBA ESTAMPADO.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "CÓRDOBA ESTAMPADO"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:46.250969+00:00"
  },
  {
    "id": "guardanapo-de-tecido-festa-junina-xadrez-vermelho-bordo-166",
    "name": "Guardanapo de Tecido Festa Junina Xadrez Vermelho Bordô",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-166",
    "tray_id": 166,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 19.9,
    "wholesale_price": 13.9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_festa_junina_xadrez_vermelho_bordo_166_2_528864a86d65fdd0823c832d8f4c5ec3.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_festa_junina_xadrez_vermelho_bordo_166_1_3b988786c65b8fdf6ab71fe69ddebdb1.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Tricoline 100% Algodão com Toque Suave.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Tricoline 100% Algodão com Toque Suave"
      },
      {
        "label": "Acabamento",
        "value": "Bainha costurada e acabamento fino"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:49.551377+00:00"
  },
  {
    "id": "lugar-americano-churrasco-azul-com-bolso-decorativo-com-a-frase-dia-de-churrasco-174",
    "name": "Lugar Americano Churrasco Azul com Bolso Decorativo Com a Frase \"Dia de Churrasco\"",
    "category": "Lugar Americano",
    "sku": "MES-NYL-LAM-174",
    "tray_id": 174,
    "collection": "CHURRASCO",
    "color_name": null,
    "color_hex": null,
    "retail_price": 42.9,
    "wholesale_price": 30,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_churrasco_azul_com_bolso_decorativ_2_20260625145923_59211816b9c4.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_churrasco_azul_com_bolso_decorativ_1_20260625145923_21a1f2b03b20.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em JEANS - COURINO.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "JEANS - COURINO"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "100 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:50.750881+00:00"
  },
  {
    "id": "guardanapo-azul-de-tecido-churrasco-172",
    "name": "Guardanapo Azul de Tecido Churrasco",
    "category": "Guardanapos",
    "sku": "MES-NYL-LAM-172",
    "tray_id": 172,
    "collection": "CHURRASCO",
    "color_name": null,
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 16.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_hambrguer_azul_2_20260625150039_b4f6a1ba4f92.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_hambrguer_azul_1_20260625150039_2adbceb9e652.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em JEANS LEVE.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "JEANS LEVE"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 X 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:50.436798+00:00"
  },
  {
    "id": "kit-mesa-posta-floral-rosa-com-lugar-americano-guardanapo-porta-guardanapo-178",
    "name": "Kit Mesa Posta Floral Rosa - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-KIT-MPT-178",
    "tray_id": 178,
    "collection": "ROSE IMPERIAL",
    "color_name": null,
    "color_hex": null,
    "retail_price": 48.7,
    "wholesale_price": 34.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_floral_rosa_com_lugar_americano_guardanapo_porta_guardanapo_178_2_236d0b84ba4fb3e270525c8953b646a4.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_floral_rosa_com_lugar_americano_guardanapo_porta_guardanapo_178_1_e63e1f2b867fc958a55b102a8a8b6d45.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em GORGURINHO (BORDADO).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "GORGURINHO (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "OXFORD BRANCO"
      },
      {
        "label": "Porta-guardanapo",
        "value": "FLOR ROSA"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 13.9,
        "retail_price": 19.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 10.4,
        "retail_price": 14.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.9
      }
    ],
    "created_at": "2026-10-29T16:35:51.373687+00:00"
  },
  {
    "id": "guardanapo-de-tecido-azul-marinho-180",
    "name": "Guardanapo de Tecido Azul Marinho",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-180",
    "tray_id": 180,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 16,
    "wholesale_price": 11.2,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_azul_marinho_180_2_14ff19b4e17861d74654d7f86ce81161.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_azul_marinho_180_1_fd9f5f747ec253861fe0c9226771e9ba.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Tricoline 100% Algodão com Toque Suave.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Tricoline 100% Algodão com Toque Suave"
      },
      {
        "label": "Acabamento",
        "value": "Bainha costurada e acabamento fino"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:51.660707+00:00"
  },
  {
    "id": "guardanapo-de-tecido-festa-junina-xadrez-verde-160",
    "name": "Guardanapo de Tecido Festa Junina Xadrez Verde",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-160",
    "tray_id": 160,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 19.9,
    "wholesale_price": 13.9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_festa_junina_xadrez_verde_160_2_de99465eb6317db22d8c275702f462d2.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_festa_junina_xadrez_verde_160_1_b9de10d99053f74af94b4a3f764bf045.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Tricoline 100% Algodão com Toque Suave.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Tricoline 100% Algodão com Toque Suave"
      },
      {
        "label": "Acabamento",
        "value": "Bainha costurada e acabamento fino"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:48.665051+00:00"
  },
  {
    "id": "guardanapo-de-tecido-festa-junina-xadrez-laranja-164",
    "name": "Guardanapo de Tecido Festa Junina Xadrez Laranja",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-164",
    "tray_id": 164,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 19.9,
    "wholesale_price": 13.9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_festa_junina_xadrez_laranja_164_2_44123d19b0dcba567d8add3ff268b469.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_festa_junina_xadrez_laranja_164_1_b443c6323211d1b3f06ff7a43a7f3e8e.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Tricoline 100% Algodão com Toque Suave.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Tricoline 100% Algodão com Toque Suave"
      },
      {
        "label": "Acabamento",
        "value": "Bainha costurada e acabamento fino"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:49.258847+00:00"
  },
  {
    "id": "lugar-americano-flor-de-lottus-rosa-bordado-230",
    "name": "Lugar Americano Flor de Lóttus Rosa Bordado",
    "category": "Lugar Americano",
    "sku": "MES-COU-LAF-230",
    "tray_id": 230,
    "collection": "FLOR DE LÓTUS",
    "color_name": null,
    "color_hex": null,
    "retail_price": 22.9,
    "wholesale_price": 16,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_flor_de_lottus_rosa_bordado_230_2_546660d78827e35bb57e217d13980711.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_flor_de_lottus_rosa_bordado_230_1_b517533f8fb4471d7cc0ce2c3b10c05f.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em COURINO ROSA.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "COURINO ROSA"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:53.160756+00:00"
  },
  {
    "id": "lugar-americano-videira-off-white-bordado-verde-245",
    "name": "Lugar Americano Videira Off White Bordado Verde",
    "category": "Lugar Americano",
    "sku": "MES-TEC-LAV-245",
    "tray_id": 245,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 34.9,
    "wholesale_price": 24.4,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_videira_off_white_bordado_verde_245_2_f5000ec01d86a78aff45e85fb4c4b3cb.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_videira_off_white_bordado_verde_245_1_15a3ff30201eca083ef9a1bb94903a83.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhe Estruturado.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:54.228834+00:00"
  },
  {
    "id": "kit-mesa-posta-festa-junina-azul-marinho-com-lugar-americano-guardanapo-porta-guardanapo-86",
    "name": "Kit Mesa Posta Festa Junina Azul Marinho - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-COM-086",
    "tray_id": 86,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 55,
    "wholesale_price": 38.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_azul_marinho_com_guardanapo_e_porta_guardanapo_86_2_d428e6d2be58be7bc5889570638d6c93.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_azul_marinho_com_guardanapo_e_porta_guardanapo_86_1_d28231f6587faa9ef3ec8f919c9c5597.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.1,
        "retail_price": 17.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.8
      }
    ],
    "created_at": "2026-10-29T16:35:43.687541+00:00"
  },
  {
    "id": "guardanapo-de-tecido-lavanda-com-frase-casa-aberta-144",
    "name": "Guardanapo de Tecido Lavanda Com Frase \"Casa Aberta\"",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-144",
    "tray_id": 144,
    "collection": "LAVANDA",
    "color_name": null,
    "color_hex": null,
    "retail_price": 17.9,
    "wholesale_price": 12.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_lavanda_com_frase_casa_aberta_144_2_58db4b4bb020ac729375180512f0bf2e.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_lavanda_com_frase_casa_aberta_144_1_643db508d25a6bc3257a5f5af9582173.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em LINHO 50%.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "LINHO 50%"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 X 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:46.38934+00:00"
  },
  {
    "id": "kit-mesa-posta-festa-junina-verde-com-lugar-americano-guardanapo-porta-guardanapo-88",
    "name": "Kit Mesa Posta Festa Junina Verde - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-COM-088",
    "tray_id": 88,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 55,
    "wholesale_price": 38.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_verde_com_guardanapo_e_porta_guardanapo_88_2_b537f99eba0672fcc96728af4aa891d5.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_verde_com_guardanapo_e_porta_guardanapo_88_1_d727a54635064bcb59d0079f8d495684.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.1,
        "retail_price": 17.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.8
      }
    ],
    "created_at": "2026-10-29T16:35:43.965168+00:00"
  },
  {
    "id": "guardanapo-de-tecido-oliveira-com-frase-graca-a-mesa-150",
    "name": "Guardanapo de Tecido Oliveira Com Frase \"Graça à Mesa\"",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-150",
    "tray_id": 150,
    "collection": "RAMO DE OLIVEIRA",
    "color_name": null,
    "color_hex": null,
    "retail_price": 17.9,
    "wholesale_price": 12.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_oliveira_com_frase_graca_a_mesa_150_2_cd1649a47f72a1cbf26f20c5bf11c151.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_oliveira_com_frase_graca_a_mesa_150_1_dd02281ace5239ee1d0dd8e225c6644b.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em LINHO 50%.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "LINHO 50%"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:47.243+00:00"
  },
  {
    "id": "guardanapo-de-tecido-costela-de-adao-com-frase-a-mesa-146",
    "name": "Guardanapo de Tecido Costela de Adão Com Frase \"À Mesa\"",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-146",
    "tray_id": 146,
    "collection": "COSTELA DE ADÃO",
    "color_name": null,
    "color_hex": null,
    "retail_price": 17.9,
    "wholesale_price": 12.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_costela_de_adao_com_frase_a_mesa_146_2_3ab814da72a7cb6b476a11a2bbea3769.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_costela_de_adao_com_frase_a_mesa_146_1_d05a45948874613c75eaed39ab6e5a67.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em LINHO 50%.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "LINHO 50%"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:46.663189+00:00"
  },
  {
    "id": "lugar-americano-festa-junina-xadrez-verde-159",
    "name": "Lugar Americano Festa Junina Xadrez Verde",
    "category": "Lugar Americano",
    "sku": "MES-NYL-JAM-159",
    "tray_id": 159,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 23,
    "wholesale_price": 16.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_festa_junina_xadrez_verde_159_2_0c9a51209634dfebbb87d235f481046c.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_festa_junina_xadrez_verde_159_1_ca46eeb0333c67d7333ccbd025abd5d7.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhe Estruturado.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:48.53107+00:00"
  },
  {
    "id": "lugar-americano-festa-junina-xadrez-laranja-163",
    "name": "Lugar Americano Festa Junina Xadrez Laranja",
    "category": "Lugar Americano",
    "sku": "MES-NYL-JAM-163",
    "tray_id": 163,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 23,
    "wholesale_price": 16.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_festa_junina_xadrez_laranja_163_2_9913707690c53b8b53642598ed711160.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_festa_junina_xadrez_laranja_163_1_0fc8cd820697e33e3e12bd1fd2f24ff3.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhe Estruturado.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:49.128978+00:00"
  },
  {
    "id": "lugar-americano-feijoada-marrom-com-acabamento-ondulado-173",
    "name": "Lugar Americano Feijoada Marrom com Acabamento Ondulado",
    "category": "Lugar Americano",
    "sku": "MES-NYL-LAM-173",
    "tray_id": 173,
    "collection": "FEIJOADA",
    "color_name": null,
    "color_hex": null,
    "retail_price": 25,
    "wholesale_price": 17.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_feijoada_marrom_com_acabamento_ond_2_20260625150009_56bc75eecdeb.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_feijoada_marrom_com_acabamento_ond_1_20260625150009_5894a3dcea8c.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em NYLON 600 MARROM.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "NYLON 600 MARROM"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:50.612932+00:00"
  },
  {
    "id": "lugar-americano-hot-dog-xadrez-vermelho-175",
    "name": "Lugar Americano Hot Dog Xadrez Vermelho",
    "category": "Lugar Americano",
    "sku": "MES-NYL-LAM-175",
    "tray_id": 175,
    "collection": "HOTDOG",
    "color_name": null,
    "color_hex": null,
    "retail_price": 29.9,
    "wholesale_price": 20.9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_hot_dog_xadrez_vermelho_2_20260625145847_7f0f849ec3df.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_hot_dog_xadrez_vermelho_1_20260625145847_7c4277610718.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em NYLON 600 MARROM / OXFORD XADREZ.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "NYLON 600 MARROM / OXFORD XADREZ"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:50.896846+00:00"
  },
  {
    "id": "lugar-americano-floral-marrom-com-acabamento-ondulado-183",
    "name": "Lugar Americano Floral Marrom com Acabamento Ondulado",
    "category": "Lugar Americano",
    "sku": "MES-NYL-LAM-183",
    "tray_id": 183,
    "collection": "FLOR MARROM",
    "color_name": null,
    "color_hex": null,
    "retail_price": 22.9,
    "wholesale_price": 16,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_floral_marrom_com_acabamento_ondulado_183_2_6210df7d72f6de70836e8d73a1ea102c.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_floral_marrom_com_acabamento_ondulado_183_1_86f409ad3dcecd471f0c5d5cdc959ccf.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em JACGUARD.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "JACGUARD"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:52.171409+00:00"
  },
  {
    "id": "porta-guardanapo-tassel-marrom-185",
    "name": "Porta Guardanapo Tassel Marrom",
    "category": "Porta-guardanapos",
    "sku": "MES-PGU-TAS-185",
    "tray_id": 185,
    "collection": null,
    "color_name": null,
    "color_hex": null,
    "retail_price": 9.7,
    "wholesale_price": 6.8,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_tassel_marrom_185_2_7bdb7664bab5297de56265dc3db16b02.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_tassel_marrom_185_1_508f67d352d83a5a49aff44831e593fb.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Artesanal em Fibra Natural e Madeira.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:52.44731+00:00"
  },
  {
    "id": "lugar-americano-bridgerton-azul-floral-com-borda-ondulada-233",
    "name": "Lugar Americano Bridgerton Azul Floral com Borda Ondulada",
    "category": "Lugar Americano",
    "sku": "MES-TEC-LAB-233",
    "tray_id": 233,
    "collection": "BRIDGERTON AZUL",
    "color_name": null,
    "color_hex": null,
    "retail_price": 25.6,
    "wholesale_price": 20.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_bridgerton_azul_floral_com_borda_o_2_20260806180313_61755ee28529.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/lugar_americano_bridgerton_azul_floral_com_borda_o_1_20260806180628_a958086220dc.png",
    "description": "Peça exclusiva Mesa & Graça confeccionada em TRICOLINE FLORIDO 100%.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "TRICOLINE FLORIDO 100%"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "120 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:53.600733+00:00"
  },
  {
    "id": "guardanapo-de-tecido-hamburguer-individual-215",
    "name": "Guardanapo de Tecido Hambúrguer Individual",
    "category": "Guardanapos",
    "sku": "MES-TEC-GTH-215",
    "tray_id": 215,
    "collection": "HAMBURGUER",
    "color_name": null,
    "color_hex": null,
    "retail_price": 21.9,
    "wholesale_price": 15.3,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_hamburguer_individual_215_2_8f3514261b1de287d732f9acc8ed9397.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_hamburguer_individual_215_1_5fe55eec6230db78adfd956d7122ec9b.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em JEANS LEVE.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "JEANS LEVE"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 X 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:52.875118+00:00"
  },
  {
    "id": "guardanapo-de-tecido-feijoada-bordado-com-frase-tradicao-e-reunir-quem-a-gente-ama-170",
    "name": "Guardanapo de Tecido Feijoada Bordado com Frase \"Tradição é Reunir Quem a Gente Ama\"",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-170",
    "tray_id": 170,
    "collection": "FEIJOADA",
    "color_name": null,
    "color_hex": null,
    "retail_price": 22.9,
    "wholesale_price": 16,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_feijoada_bordado_com_frase_tradicao_e_reunir_quem_a_gente_ama_170_2_c56ad070464b21ce7ac6c61e0d1ea072.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_feijoada_bordado_com_frase_tradicao_e_reunir_quem_a_gente_ama_170_1_1b36477d8b5dbe409b57275a1af9b786.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em TRICOLINE CREME.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "TRICOLINE CREME"
      },
      {
        "label": "Acabamento",
        "value": "BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 X 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:50.170947+00:00"
  },
  {
    "id": "guardanapo-de-tecido-off-white-184",
    "name": "Guardanapo de Tecido Off White",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-184",
    "tray_id": 184,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 18.9,
    "wholesale_price": 13.2,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_off_white_184_2_744b835673c64b6b0122af572b717c3b.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_off_white_184_1_5b389c4cc2ab54664852088ce99c860e.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Tricoline 100% Algodão com Toque Suave.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Tricoline 100% Algodão com Toque Suave"
      },
      {
        "label": "Acabamento",
        "value": "Bainha costurada e acabamento fino"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:52.302938+00:00"
  },
  {
    "id": "kit-mesa-posta-festa-junina-bordo-com-lugar-americano-guardanapo-porta-guardanapo-84",
    "name": "Kit Mesa Posta Festa Junina Bordô - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-COM-084",
    "tray_id": 84,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 55,
    "wholesale_price": 38.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_bordo_com_guardanapo_e_porta_guardanapo_84_2_9c65e9dcd508a45fb13f67159bbf9c2d.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_festa_junina_xadrez_bordo_com_guardanapo_e_porta_guardanapo_84_1_400179a8243172519d3b9ed25763166d.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.1,
        "retail_price": 17.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.8
      }
    ],
    "created_at": "2026-10-29T16:35:43.389147+00:00"
  },
  {
    "id": "guardanapo-de-tecido-alecrim-com-frase-em-casa-148",
    "name": "Guardanapo de Tecido Alecrim Com Frase \"Em Casa\"",
    "category": "Guardanapos",
    "sku": "MES-TEC-GUA-148",
    "tray_id": 148,
    "collection": "ALECRIM",
    "color_name": null,
    "color_hex": null,
    "retail_price": 17.9,
    "wholesale_price": 12.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_alecrim_com_frase_em_casa_148_2_520bdc2c71c9675faea4358f0c28c855.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/guardanapo_de_tecido_alecrim_com_frase_em_casa_148_1_561b67ffe25c91286abb3879889ac90f.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em LINHO 50%.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "LINHO 50%"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Comprimento x Largura",
        "value": "44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm dobrado"
      },
      {
        "label": "Peso Aproximado",
        "value": "50 g"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-29T16:35:46.947015+00:00"
  },
  {
    "id": "kit-mesa-posta-italia-com-lugar-americano-guardanapo-porta-guardanapo-167",
    "name": "Kit Mesa Posta Itália - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-KIT-MPT-167",
    "tray_id": 167,
    "collection": "Linha Mesa & Graça",
    "color_name": null,
    "color_hex": null,
    "retail_price": 52,
    "wholesale_price": 36.4,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_italia_completo_1_pessoa_com_lugar_americano_guardanapo_e_porta_guardanapo_pizza_167_2_960ad0c76ca0855435b37f74694bc6ee.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_italia_completo_1_pessoa_com_lugar_americano_guardanapo_e_porta_guardanapo_pizza_167_1_e501a2246d055f989be7fbe44ab89a3c.jpg",
    "description": "Peça exclusiva Mesa & Graça confeccionada em Nylon 600 Impermeável com Detalhes (Acabamento refinado).",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 0,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 15.8,
        "retail_price": 22.6
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.5,
        "retail_price": 16.4
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.1,
        "retail_price": 13
      }
    ],
    "created_at": "2026-10-29T16:35:49.701187+00:00"
  },
  {
    "id": "lugar-americano-redondo-xadrez",
    "name": "Lugar Americano Redondo Xadrez",
    "category": "Lugar Americano",
    "sku": "MG-LA-XADR",
    "tray_id": null,
    "collection": "Dupla Face",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 28,
    "wholesale_price": 22.8,
    "image_url": "/produtos/dupla-face-rosa-bebe.webp",
    "editorial_image_url": "/produtos/editorial-jogo-xadrez.webp",
    "description": "Lugar americano redondo dupla face, com acabamento ondulado e opções xadrez ou lisas para alternar a composição da mesa.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "Redondo 44 x 44 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 1,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Vermelho",
        "hex": "#C51F2A",
        "pattern": "xadrez",
        "sku": "MG-LA-XADR-VM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "xadrez",
        "sku": "MG-LA-XADR-VD"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "xadrez",
        "sku": "MG-LA-XADR-AM"
      },
      {
        "name": "Marinho",
        "hex": "#203150",
        "pattern": "xadrez",
        "sku": "MG-LA-XADR-MR"
      },
      {
        "name": "Preto",
        "hex": "#292929",
        "pattern": "xadrez",
        "sku": "MG-LA-XADR-PR"
      },
      {
        "name": "Vermelho",
        "hex": "#C51F2A",
        "pattern": "liso",
        "sku": "MG-LA-XADR-VM-LIS"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-XADR-VD-LIS"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-XADR-AM-LIS"
      },
      {
        "name": "Marinho",
        "hex": "#203150",
        "pattern": "liso",
        "sku": "MG-LA-XADR-MR-LIS"
      },
      {
        "name": "Preto",
        "hex": "#292929",
        "pattern": "liso",
        "sku": "MG-LA-XADR-PR-LIS"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "xadrez",
        "sku": "MG-LA-XADR-RS"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-XADR-RS-LIS"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-lirio-provence",
    "name": "Porta Guardanapo Lírio Provence",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-CLA-070",
    "tray_id": 70,
    "collection": null,
    "color_name": "Roxo, verde e vinho",
    "color_hex": "#765B6A",
    "retail_price": 15,
    "wholesale_price": 10.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_lirio_provence_70_2_42905d2211971642638d54fbc12f43b9.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_lirio_provence_70_1_67abb5b31686a3eccde08a35b4100883.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 1,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-fundo-do-mar-convencional",
    "name": "Jogo Fundo do Mar Convencional",
    "category": "Jogos",
    "sku": "MG-KT-FUND",
    "tray_id": null,
    "collection": "Fundo do Mar",
    "color_name": "Azul e off-white",
    "color_hex": "#4C83A8",
    "retail_price": 72.9,
    "wholesale_price": 44.2,
    "image_url": "/produtos/fundo-mar-convencional.webp",
    "editorial_image_url": null,
    "description": "Composição em azul e off-white que une lugar americano, guardanapo e porta-guardanapo para uma mesa de inspiração marítima.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 2,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 24.5,
        "retail_price": 35
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.2,
        "retail_price": 16
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 10.3,
        "retail_price": 14.7
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-lavanda-provencal",
    "name": "Porta Guardanapo Lavanda Provençal",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-CLA-071",
    "tray_id": 71,
    "collection": null,
    "color_name": "Lilás e verde",
    "color_hex": "#8B7A8F",
    "retail_price": 20,
    "wholesale_price": 14,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_lavanda_provencal_71_2_6c169bdd781ccc57423060e797ec8382.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_lavanda_provencal_71_1_a4a884d8b87b9b5e9046f84a3c9e2dc8.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "LAVANDA"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 2,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-laco-frances",
    "name": "Laço Francês",
    "category": "Lugar Americano",
    "sku": "MG-LA-LACO",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 32.9,
    "wholesale_price": 16.5,
    "image_url": "/produtos/laco-frances-rosa-bebe.webp",
    "editorial_image_url": "/produtos/editorial-laco-frances.webp",
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 3,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-LACO-PK"
      },
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-LACO-MR"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-LACO-MO"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-LACO-VI"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-LACO-AM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-LACO-VD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-LACO-RS"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-limone-toscano",
    "name": "Porta Guardanapo Limone Toscano",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-TRO-072",
    "tray_id": 72,
    "collection": null,
    "color_name": "Amarelo e verde",
    "color_hex": "#D5A833",
    "retail_price": 15.9,
    "wholesale_price": 11.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_limone_toscano_72_2_a4a89e0a8fea4a45cbc2ca6948aed6ae.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_limone_toscano_72_1_8344ead1eba83836e87ecd3834a34741.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 3,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-cereja-mediterranea",
    "name": "Porta Guardanapo Cereja Mediterrânea",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-CLA-073",
    "tray_id": 73,
    "collection": null,
    "color_name": "Vermelho e verde",
    "color_hex": "#B9373A",
    "retail_price": 15.9,
    "wholesale_price": 11.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_cereja_mediterranea_73_2_1f5ab6ff2f93d45f2659fc11c46aef1c.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_cereja_mediterranea_73_1_54142eeca24c7c5366971f8fdb498b3a.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "CEREJINHA"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 4,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-abelhinha",
    "name": "Kit Mesa Posta Abelinha - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "KIT-TEC-KMP-250",
    "tray_id": 250,
    "collection": "ABELINHA",
    "color_name": "Amarelo",
    "color_hex": "#E5AA1A",
    "retail_price": 53.8,
    "wholesale_price": 37.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_abelinha_com_lugar_americano_guardanapo_porta_guardanapo_250_2_e4c6922c5183682d97557b12b2b22ea6.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_abelinha_com_lugar_americano_guardanapo_porta_guardanapo_250_1_911cacaef696238da5d80505403c90a7.jpg",
    "description": "Jogo delicado com lugar americano temático, guardanapo e porta-guardanapo Florzinha Amarela para uma mesa leve e cheia de charme.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "NYLON 600 (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "TRICOLINE 50% AMARELO"
      },
      {
        "label": "Porta-guardanapo",
        "value": "FLOR AMARELA"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 4,
    "is_visible": false,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.1,
        "retail_price": 23
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.8,
        "retail_price": 16.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.9
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-classico-ondulado",
    "name": "Clássico Ondulado",
    "category": "Lugar Americano",
    "sku": "MG-LA-CLAS",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 14.3,
    "image_url": "/produtos/colecao-essencial/01-Classico-Ondulado.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 4,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-CLAS-PK"
      },
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-CLAS-MR"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-CLAS-MO"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-CLAS-VI"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-CLAS-AM"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-CLAS-RS"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-CLAS-VD"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-estrela-nautica",
    "name": "Porta Guardanapo Estrela Náutica",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-NAU-074",
    "tray_id": 74,
    "collection": null,
    "color_name": "Azul-marinho e bege",
    "color_hex": "#263D5D",
    "retail_price": 16.9,
    "wholesale_price": 11.8,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_estrela_nautica_74_2_5e483e65c7841b23331b8ec4fdeb7579.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_estrela_nautica_74_1_5395a9819d52468913f234c6661f0d1a.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 5,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-beija-flor",
    "name": "Beija-Flor",
    "category": "Lugar Americano",
    "sku": "MG-LA-BEIJ",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 14.3,
    "image_url": "/produtos/colecao-essencial/02-Beija-Flor.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 5,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-BEIJ-PK"
      },
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-BEIJ-MR"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-BEIJ-MO"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-BEIJ-VI"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-BEIJ-AM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-BEIJ-VD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-BEIJ-RS"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-ovinho",
    "name": "Kit Mesa Posta Ovinho - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "KIT-TEC-KMP-251",
    "tray_id": 251,
    "collection": "OVINHO",
    "color_name": "Branco e amarelo",
    "color_hex": "#E5A70D",
    "retail_price": 56.8,
    "wholesale_price": 39.8,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_ovinho_com_lugar_americano_guardanapo_porta_guardanapo_251_2_fb047c247057061714ee8ec2f599a249.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_ovinho_com_lugar_americano_guardanapo_porta_guardanapo_251_1_358007854d8f3aecc4c7582b72bdb5cf.jpg",
    "description": "Composição divertida e delicada com lugar americano Ovinho, guardanapo creme e porta-guardanapo temático para cafés e mesas afetivas.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "NYLON 600  BRANCO E AMARELO (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "TRICOLINE 50% CREME"
      },
      {
        "label": "Porta-guardanapo",
        "value": "OVINHO"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 5,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 18.1,
        "retail_price": 25.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.9,
        "retail_price": 17
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.9
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-versailles",
    "name": "Versailles",
    "category": "Lugar Americano",
    "sku": "MG-LA-VERS",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 14.3,
    "image_url": "/produtos/colecao-essencial/03-Versailles.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 6,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-VERS-PK"
      },
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-VERS-MR"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-VERS-MO"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-VERS-VI"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-VERS-AM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-VERS-VD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-VERS-RS"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-costela-de-adao-tropical",
    "name": "Porta Guardanapo Costela de Adão Tropical",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-AFE-075",
    "tray_id": 75,
    "collection": null,
    "color_name": "Verde",
    "color_hex": "#5A8251",
    "retail_price": 13.9,
    "wholesale_price": 9.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_costela_de_adao_tropical_75_2_fe903e2461b2a4cf34d7eb3096e1e30f.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_costela_de_adao_tropical_75_1_8a36038ee1a2e1567525806906cb76ee.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "COSTELA DE ADÃO MEDITERRANEO"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 6,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-cerejinha",
    "name": "Kit Mesa Posta Cerejinha - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "KIT-TEC-KMP-252",
    "tray_id": 252,
    "collection": "CEREJINHA",
    "color_name": "Vermelho",
    "color_hex": "#C41432",
    "retail_price": 61.7,
    "wholesale_price": 43.2,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_cerejinha_com_lugar_americano_guardanapo_porta_guardanapo_252_2_d112718465cdb072fb0aa34ffc94fc87.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_cerejinha_com_lugar_americano_guardanapo_porta_guardanapo_252_1_749b45375cf0812627b276a1a593dd5a.jpg",
    "description": "Jogo em tons de vermelho com detalhes de cerejinhas, composto por lugar americano, guardanapo listrado e porta-guardanapo coordenado.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "NYLON 600 (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "TRICOLINE 50% LISTRADO VERMELHO/BRANCO"
      },
      {
        "label": "Porta-guardanapo",
        "value": "CEREJINHA"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 6,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 18.1,
        "retail_price": 25.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 13.9,
        "retail_price": 19.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 11.1,
        "retail_price": 15.9
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-folhas",
    "name": "Kit Mesa Posta Folhas - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "KIT-TEC-KMP-253",
    "tray_id": 253,
    "collection": "FOLHAS VERDE",
    "color_name": "Verde",
    "color_hex": "#486632",
    "retail_price": 35.9,
    "wholesale_price": 25.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_folhas_com_lugar_americano_guardanapo_porta_guardanapo_253_2_da31b52c1d2be2698c3fedbbb853986a.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_folhas_com_lugar_americano_guardanapo_porta_guardanapo_253_1_2d19527ab86ab6c05a1467abbf5af273.jpg",
    "description": "Composição em folhagem verde que combina lugar americano, guardanapo e porta-guardanapo Esfera Marfim para uma mesa natural e acolhedora.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "GORGURINHO (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "OXFORD VERDE OU CREME"
      },
      {
        "label": "Porta-guardanapo",
        "value": "-"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 7,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 11.3,
        "retail_price": 16.2
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 7.9,
        "retail_price": 11.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 5.9,
        "retail_price": 8.4
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-imperial",
    "name": "Imperial",
    "category": "Lugar Americano",
    "sku": "MG-LA-IMPE",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 14.3,
    "image_url": "/produtos/colecao-essencial/04-Imperial.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 7,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-IMPE-PK"
      },
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-IMPE-MR"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-IMPE-MO"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-IMPE-VI"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-IMPE-AM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-IMPE-VD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-IMPE-RS"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-medalhao-esmeralda",
    "name": "Porta Guardanapo Medalhão Mediterrâneo Esmeralda",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-AFE-076",
    "tray_id": 76,
    "collection": null,
    "color_name": "Verde-esmeralda e dourado",
    "color_hex": "#39766B",
    "retail_price": 23,
    "wholesale_price": 16.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_medalhao_mediterraneo_esmeralda_76_2_fc46e375e48833f734be6ff79eab2c83.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_medalhao_mediterraneo_esmeralda_76_1_1851eca2e36876d0692f4c8f7e012b52.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 7,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-provencal",
    "name": "Provençal",
    "category": "Lugar Americano",
    "sku": "MG-LA-PROV",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 14.3,
    "image_url": "/produtos/colecao-essencial/05-Provencal.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 8,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-PROV-PK"
      },
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-PROV-MR"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-PROV-MO"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-PROV-VI"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-PROV-AM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-PROV-VD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-PROV-RS"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-medalhao-ambar",
    "name": "Porta Guardanapo Medalhão Mediterrâneo Âmbar",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-AFE-077",
    "tray_id": 77,
    "collection": null,
    "color_name": "Âmbar e dourado",
    "color_hex": "#B78232",
    "retail_price": 23,
    "wholesale_price": 16.1,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_medalhao_mediterraneo_ambar_77_2_52272bf25a3c42a6091e17a902b4717d.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_medalhao_mediterraneo_ambar_77_1_38ec0ff3787f52a0ca25d9ef3c7791d9.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 8,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-magnolia",
    "name": "Kit Mesa Posta Magnólia - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "KIT-TEC-KMP-254",
    "tray_id": 254,
    "collection": "MAGNÓLIA",
    "color_name": "Floral",
    "color_hex": "#B53A62",
    "retail_price": 55.7,
    "wholesale_price": 39,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_magnolia_com_lugar_americano_guardanapo_porta_guardanapo_254_2_d6957d3ee65003cec013a3f15b28faa9.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_magnolia_com_lugar_americano_guardanapo_porta_guardanapo_254_1_7fc82de1be9bc83c5e48ce75f0e61e25.jpg",
    "description": "Jogo floral de presença delicada, com lugar americano Magnólia, guardanapo creme e porta-guardanapo Esfera Dourada.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "JACGUARD (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "TRICOLINE 50% CREME"
      },
      {
        "label": "Porta-guardanapo",
        "value": "ESFERA DOURADA"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 8,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 17.4,
        "retail_price": 24.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.8,
        "retail_price": 16.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.9
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-arabesco",
    "name": "Arabesco",
    "category": "Lugar Americano",
    "sku": "MG-LA-ARAB",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 14.3,
    "image_url": "/produtos/colecao-essencial/06-Arabesco.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 9,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-ARAB-PK"
      },
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-ARAB-MR"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-ARAB-VI"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-ARAB-AM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-ARAB-VD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-ARAB-RS"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-ARAB-MO"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-costela-de-adao-mediterranea",
    "name": "Porta Guardanapo Costela de Adão Mediterrânea",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-AFE-078",
    "tray_id": 78,
    "collection": null,
    "color_name": "Verde e bege",
    "color_hex": "#657E5C",
    "retail_price": 13.9,
    "wholesale_price": 9.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_costela_de_adao_mediterranea_78_2_1926d0968b47c556cb73265e54080663.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_costela_de_adao_mediterranea_78_1_e1e1c833da7a698b5f6d1b9536246a97.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "COSTELA DE ADÃO MEDITERRANEO"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 9,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-feijoada",
    "name": "Kit Mesa Posta Feijoada - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-TEM-141",
    "tray_id": 141,
    "collection": "FEIJOADA",
    "color_name": "Conforme composição",
    "color_hex": "#5E4634",
    "retail_price": 55.4,
    "wholesale_price": 38.8,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_feijoada_com_guardanapo_bordado_e_acabamento_ondulado_141_2_f9be72ea550668a145f271f854e34156.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_feijoada_com_guardanapo_bordado_e_acabamento_ondulado_141_1_a8096a3826ce99f95e8310033c06f50f.jpg",
    "description": "Jogo completo de inspiração brasileira, com lugar americano em nylon, guardanapo em tricoline e porta-guardanapo coordenado.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "NYLON 600 MARROM (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "TRICOLINE CREME"
      },
      {
        "label": "Porta-guardanapo",
        "value": "COURINO"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 9,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 17.5,
        "retail_price": 25
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 16,
        "retail_price": 22.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 5.3,
        "retail_price": 7.5
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-natal-majestosa-vinho",
    "name": "Lugar Americano Natal Majestosa Vinho",
    "category": "Lugar Americano",
    "sku": "MG-LA-MAJV",
    "tray_id": null,
    "collection": "Natal",
    "color_name": "Variações disponíveis",
    "color_hex": "#7B1C2D",
    "retail_price": 30.3,
    "wholesale_price": 16.7,
    "image_url": "/produtos/natal-majestosa-vinho.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "NYLON 600 CREME"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 10,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-flor-de-lis",
    "name": "Flor de Lis",
    "category": "Lugar Americano",
    "sku": "MG-LA-FLOR",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 14.3,
    "image_url": "/produtos/colecao-essencial/07-Flor-de-Lis.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 10,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-FLOR-PK"
      },
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-FLOR-MR"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-FLOR-MO"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-FLOR-VI"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-FLOR-AM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-FLOR-VD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-FLOR-RS"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-hot-dog",
    "name": "Kit Mesa Posta Hot Dog - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-TEM-140",
    "tray_id": 140,
    "collection": "HOTDOG",
    "color_name": "Conforme composição",
    "color_hex": "#C84948",
    "retail_price": 52.8,
    "wholesale_price": 37,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_hot_dog_com_guardanapo_bordado_e_porta_guardanapo_em_courino_140_2_0179f7fd8b5129e50ed44b46288b464a.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_hot_dog_com_guardanapo_bordado_e_porta_guardanapo_em_courino_140_1_5f2316d7ee764596291e08afb628d81e.jpg",
    "description": "Composição temática com borda xadrez vermelha, guardanapo bordado de hot dog e porta-guardanapo em courino. Ideal para mesas descontraídas.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "NYLON 600 MARROM / OXFORD XADREZ (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "OXFORD BRANCO"
      },
      {
        "label": "Porta-guardanapo",
        "value": "-"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 10,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.1,
        "retail_price": 23
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.7,
        "retail_price": 16.6
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.2,
        "retail_price": 13.2
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-alecrim",
    "name": "Porta Guardanapo Alecrim",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-AFE-079",
    "tray_id": 79,
    "collection": null,
    "color_name": "Verde",
    "color_hex": "#5E7A50",
    "retail_price": 17.9,
    "wholesale_price": 12.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_alecrim_79_2_8936fc37370a1711f7da2dabf9353655.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_alecrim_79_1_0f96aceb7613799badb10a36e5da1b85.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "ALECRIM"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 10,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-dalia-rose-provence",
    "name": "Porta Guardanapo Dália Rosé Provence",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-AFE-080",
    "tray_id": 80,
    "collection": null,
    "color_name": "Rosé",
    "color_hex": "#B16D77",
    "retail_price": 13.9,
    "wholesale_price": 9.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_dalia_rose_provence_80_2_b42df4ce4b3e3f07e60ef2ceca5e03cf.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_dalia_rose_provence_80_1_833e363cbf1a957ff650d7c01cc7140e.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "FLOR ROSA"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 11,
    "is_visible": false,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-churrasco",
    "name": "Kit Mesa Posta Churrasco - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-TEM-139",
    "tray_id": 139,
    "collection": "CHURRASCO",
    "color_name": "Conforme composição",
    "color_hex": "#883F31",
    "retail_price": 74.3,
    "wholesale_price": 52,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_churrasco_com_guardanapo_bordad_2_20260623101631_a70c7fc1a90c.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_churrasco_com_guardanapo_bordado_e_porta_guardanapo_em_courino_139_1_acea6668c3665cab92c551001f2641e3.jpg",
    "description": "Jogo completo com lugar americano em jeans e courino, guardanapo em jeans e porta-guardanapo coordenado. Uma proposta marcante para receber.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "JEANS - COURINO (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "JEANS LEVE"
      },
      {
        "label": "Porta-guardanapo",
        "value": "COURINO"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 11,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 30,
        "retail_price": 42.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 16.7,
        "retail_price": 23.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 5.3,
        "retail_price": 7.5
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-natal-majestosa-verde",
    "name": "Lugar Americano Natal Majestosa Verde",
    "category": "Lugar Americano",
    "sku": "MG-LA-MAJE",
    "tray_id": null,
    "collection": "Natal",
    "color_name": "Variações disponíveis",
    "color_hex": "#285A3C",
    "retail_price": 30.3,
    "wholesale_price": 16.7,
    "image_url": "/produtos/natal-majestosa-verde.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "NYLON 600 CREME"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 11,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-jardim",
    "name": "Jardim",
    "category": "Lugar Americano",
    "sku": "MG-LA-JARD",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 14.3,
    "image_url": "/produtos/colecao-essencial/08-Jardim.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 11,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-JARD-PK"
      },
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-JARD-MR"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-JARD-MO"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-JARD-VI"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-JARD-AM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-JARD-VD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-JARD-RS"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-hamburguer",
    "name": "Kit Mesa Posta Hambúrguer - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-NYL-TEM-142",
    "tray_id": 142,
    "collection": "HAMBURGUER",
    "color_name": "Conforme composição",
    "color_hex": "#274A69",
    "retail_price": 72.3,
    "wholesale_price": 50.6,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_hambrguer_com_guardanapo_bordad_2_20260623103245_7d50eae486bf.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_jogo_americano_hambrguer_com_guardanapo_bordad_1_20260623103245_413b6116b882.jpg",
    "description": "Composição temática em jeans e courino, acompanhada de guardanapo em jeans e porta-guardanapo coordenado para uma mesa casual e cheia de personalidade.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "JEANS - COURINO (SEM BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "JEANS LEVE"
      },
      {
        "label": "Porta-guardanapo",
        "value": "COURINO"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 12,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 30.7,
        "retail_price": 43.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 15.3,
        "retail_price": 21.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 4.6,
        "retail_price": 6.5
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-orquidea-sauvage",
    "name": "Porta Guardanapo Orquídea Sauvage",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-AFE-081",
    "tray_id": 81,
    "collection": null,
    "color_name": "Rosa e lilás",
    "color_hex": "#B47A91",
    "retail_price": 17.9,
    "wholesale_price": 12.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_orquidea_sauvage_81_2_77b744167b8d48381a8c42e8f50ea284.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_orquidea_sauvage_81_1_c988d41d6badd1efa2385eedb82389ed.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 12,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-vintage",
    "name": "Vintage",
    "category": "Lugar Americano",
    "sku": "MG-LA-VINT",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 14.3,
    "image_url": "/produtos/colecao-essencial/09-Vintage.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 12,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-VINT-PK"
      },
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-VINT-MR"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-VINT-MO"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-VINT-VI"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-VINT-AM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-VINT-VD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-VINT-RS"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-natal-floresta-encantada",
    "name": "Lugar Americano Natal Floresta Encantada",
    "category": "Lugar Americano",
    "sku": "MG-LA-NTFL",
    "tray_id": null,
    "collection": "Natal",
    "color_name": "Variações disponíveis",
    "color_hex": "#2F5938",
    "retail_price": 28.9,
    "wholesale_price": 15.9,
    "image_url": "/produtos/natal-floresta-encantada.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "NYLON 600 CREME"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 12,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-pizza-dupla-face",
    "name": "Jogo Pizza Dupla Face",
    "category": "Jogos",
    "sku": "MG-KT-PIZZ",
    "tray_id": null,
    "collection": "Pizza Dupla Face",
    "color_name": "Conforme composição",
    "color_hex": "#A83A3E",
    "retail_price": 66.7,
    "wholesale_price": 40.4,
    "image_url": "/produtos/jogos/jogo-pizza-dupla-face-02.webp",
    "editorial_image_url": "/produtos/jogos/jogo-pizza-dupla-face-01.webp",
    "description": "Jogo dupla face com lugar americano em nylon e Oxford, guardanapo em Oxford e porta-guardanapo Pizza Bordado para uma mesa temática.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "NYLON 600 VERDE / OXFORD XADREZ (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "OXFORD DUPLO (VERDE E XADREZ)"
      },
      {
        "label": "Porta-guardanapo",
        "value": "PIZZA - BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "42 X 42 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 13,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 24.6,
        "retail_price": 35.1
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 17.4,
        "retail_price": 24.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.9
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-signature-mesa-graca",
    "name": "Signature Mesa & Graça",
    "category": "Lugar Americano",
    "sku": "MG-LA-SIGN",
    "tray_id": null,
    "collection": "Coleção Essencial",
    "color_name": "Variações disponíveis",
    "color_hex": null,
    "retail_price": 23.9,
    "wholesale_price": 14.3,
    "image_url": "/produtos/colecao-essencial/10-Signature-Mesa-e-Graca.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 13,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Azul marinho",
        "hex": "#1A2947",
        "pattern": "liso",
        "sku": "MG-LA-SIGN-MR"
      },
      {
        "name": "Marrom",
        "hex": "#704126",
        "pattern": "liso",
        "sku": "MG-LA-SIGN-MO"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-LA-SIGN-AM"
      },
      {
        "name": "Verde",
        "hex": "#1F5A3D",
        "pattern": "liso",
        "sku": "MG-LA-SIGN-VD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-LA-SIGN-RS"
      },
      {
        "name": "Rosa pink",
        "hex": "#D82872",
        "pattern": "liso",
        "sku": "MG-LA-SIGN-PK"
      },
      {
        "name": "Vinho",
        "hex": "#781F32",
        "pattern": "liso",
        "sku": "MG-LA-SIGN-VI"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-natal-classico-borda-xadrez",
    "name": "Lugar Americano Natal Clássico Borda Xadrez",
    "category": "Lugar Americano",
    "sku": "MG-LA-NTCL",
    "tray_id": null,
    "collection": "Natal",
    "color_name": "Variações disponíveis",
    "color_hex": "#A23A35",
    "retail_price": 35,
    "wholesale_price": 17.5,
    "image_url": "/produtos/natal-classico-borda-xadrez.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "NYLON 600 CREME"
      },
      {
        "label": "Acabamento",
        "value": "SEM BORDADO"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 X 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 13,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-estrela-nautica-provence",
    "name": "Porta Guardanapo Estrela Náutica Provence",
    "category": "Porta-guardanapos",
    "sku": "MES-MAD-NAU-082",
    "tray_id": 82,
    "collection": null,
    "color_name": "Bege e dourado",
    "color_hex": "#B89C70",
    "retail_price": 18.5,
    "wholesale_price": 13,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_estrela_nautica_provence_82_2_a278b948fd6d28e394a4265f420fbb83.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_estrela_nautica_provence_82_1_3bb629e8d7a984df92f29c36eb831282.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 13,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-chapeu-de-palha-junino",
    "name": "Porta Guardanapo Chapéu de Palha Junino",
    "category": "Porta-guardanapos",
    "sku": "MES-PGU-CHA-153",
    "tray_id": 153,
    "collection": null,
    "color_name": "Palha e bege",
    "color_hex": "#B99B6E",
    "retail_price": 12.9,
    "wholesale_price": 9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_chapeu_de_palha_junino_153_2_7b05c504d516b7bd2ad8c4e35c774363.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_chapeu_de_palha_junino_153_1_429829d30c1fb92db1645f34b938d869.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 14,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-quadrado-xadrez",
    "name": "Jogo Americano Quadrado Xadrez Dupla Face",
    "category": "Jogos",
    "sku": "MG-KT-QXAD",
    "tray_id": null,
    "collection": "Americano Quadrado Xadrez Dupla Face",
    "color_name": "Conforme composição",
    "color_hex": "#A8202A",
    "retail_price": 61.6,
    "wholesale_price": 37.3,
    "image_url": "/produtos/jogos/jogo-quadrado-xadrez-02.webp",
    "editorial_image_url": "/produtos/jogos/jogo-quadrado-xadrez-01.webp",
    "description": "Jogo dupla face com lugar americano quadrado xadrez, guardanapo e porta-guardanapo coordenados. Escolha a cor que melhor combina com sua composição.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 14,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16.2,
        "retail_price": 26.8
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.7,
        "retail_price": 19.4
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.4,
        "retail_price": 15.4
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "lugar-americano-canto-da-graca",
    "name": "Canto da Graça",
    "category": "Lugar Americano",
    "sku": "MG-LA-CANT",
    "tray_id": null,
    "collection": null,
    "color_name": "Variações disponíveis",
    "color_hex": "#B59471",
    "retail_price": 38.9,
    "wholesale_price": 19.5,
    "image_url": "/produtos/canto-da-graca.webp",
    "editorial_image_url": null,
    "description": "Lugar americano avulso para compor a mesa posta com acabamento exclusivo Mesa & Graça.",
    "materials": [
      {
        "label": "Tecido Principal",
        "value": "Nylon 600 Impermeável com Detalhe Estruturado"
      },
      {
        "label": "Acabamento",
        "value": "Bordado exclusivo ou acabamento ondulado"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões (Comp x Larg)",
        "value": "44 x 36 cm"
      },
      {
        "label": "Espessura",
        "value": "1 cm"
      },
      {
        "label": "Peso Aproximado",
        "value": "150 g"
      }
    ],
    "image_status": "final",
    "sort_order": 14,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-limao",
    "name": "Kit Mesa Posta Limão Siciliano - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-KIT-MPT-176",
    "tray_id": 176,
    "collection": "LIMÃO BRANCO",
    "color_name": "Conforme composição",
    "color_hex": "#577836",
    "retail_price": 52.1,
    "wholesale_price": 36.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_limao_siciliano_com_lugar_americano_guardanapo_porta_guardanapo_176_2_85041db860a6599a396b4c2df20d6751.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_limao_siciliano_com_lugar_americano_guardanapo_porta_guardanapo_176_1_7b414908c8ef79f4bd7ba32f4751bdaf.jpg",
    "description": "Composição vibrante de limões, com lugar americano em gorgurinho, guardanapo em tricoline e porta-guardanapo coordenado.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "JACQUARD (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "OXFORD BRANCO"
      },
      {
        "label": "Porta-guardanapo",
        "value": "LIMÃO"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 15,
    "is_visible": false,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16,
        "retail_price": 22.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 10.4,
        "retail_price": 14.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 10,
        "retail_price": 14.3
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-esferas-vermelhas-bordo",
    "name": "Porta Guardanapo de Esferas Vermelhas Bordô",
    "category": "Porta-guardanapos",
    "sku": "MES-PGU-VER-154",
    "tray_id": 154,
    "collection": null,
    "color_name": "Vermelho rubi",
    "color_hex": "#A41E2D",
    "retail_price": 12.9,
    "wholesale_price": 9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_de_esferas_vermelhas_bordo_154_2_cfce5bbb00ce5c12f647242f35b32bd5.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_de_esferas_vermelhas_bordo_154_1_8b7282756edd6ed5ad1ba9fd3d4cdd2c.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 15,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-dourado-com-perolas",
    "name": "Porta Guardanapo Dourado com Pérolas",
    "category": "Porta-guardanapos",
    "sku": "MES-PGU-PER-152",
    "tray_id": 152,
    "collection": null,
    "color_name": "Dourado",
    "color_hex": "#BE8B33",
    "retail_price": 13.9,
    "wholesale_price": 9.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_dourado_com_perolas_152_2_3e5ec1cd5a77627bd1550c795ff4bfb0.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_dourado_com_perolas_152_1_e52056ab2bd09e102f6d12966ceaaa3f.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 16,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-essence-campestre",
    "name": "Jogo Essence Campestre Dupla Face",
    "category": "Jogos",
    "sku": "MG-KT-CAMP",
    "tray_id": null,
    "collection": "Essence Campestre Dupla Face",
    "color_name": "Conforme composição",
    "color_hex": "#725441",
    "retail_price": 54.7,
    "wholesale_price": 33.1,
    "image_url": "/produtos/jogos/jogo-essence-campestre-02.webp",
    "editorial_image_url": "/produtos/jogos/jogo-essence-campestre-01.webp",
    "description": "Jogo dupla face de atmosfera campestre, com lugar americano, guardanapo e porta-guardanapo para composições acolhedoras e versáteis.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 16,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 14.4,
        "retail_price": 23.8
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 10.4,
        "retail_price": 17.2
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 8.3,
        "retail_price": 13.7
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-costela-de-adao",
    "name": "Kit Mesa Posta Costela de Adão - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-TEC-GRA-120",
    "tray_id": 120,
    "collection": "COSTELA DE ADÃO",
    "color_name": "Conforme composição",
    "color_hex": "#46693E",
    "retail_price": 57.8,
    "wholesale_price": 40.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_costela_de_ado_completo_1_pessoa_2_20260617184224_9adcc585f9ed.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_costela_de_ado_completo_1_pessoa_1_20260617184224_8cccee3f2877.jpg",
    "description": "Composição tropical com estampa de Costela de Adão, guardanapo e porta-guardanapo coordenados para levar frescor à mesa.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "CÓRDOBA ESTAMPADO (SEM BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "LINHO 50%"
      },
      {
        "label": "Porta-guardanapo",
        "value": "COSTELA DE ADÃO MEDITERRANEO"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 17,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 18.2,
        "retail_price": 26
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.5,
        "retail_price": 17.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.9
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-no-trancado-courino",
    "name": "Porta Guardanapo Nó Trançado Cru com Detalhe em Courino",
    "category": "Porta-guardanapos",
    "sku": "MES-PGU-NOT-156",
    "tray_id": 156,
    "collection": null,
    "color_name": "Bege natural",
    "color_hex": "#AA8D6E",
    "retail_price": 13.9,
    "wholesale_price": 9.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_no_trancado_cru_com_detalhe_em_courino_156_2_8e0eb856151df70342cb8a146d27ce16.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_no_trancado_cru_com_detalhe_em_courino_156_1_f91f9b0fcf501421d9431e2b89ffcf95.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 17,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-alecrim",
    "name": "Kit Mesa Posta Alecrim - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-TEC-GRA-121",
    "tray_id": 121,
    "collection": "ALECRIM",
    "color_name": "Conforme composição",
    "color_hex": "#5E7A50",
    "retail_price": 61.8,
    "wholesale_price": 43.3,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_alecrim_completo_1_pessoa_com_lug_2_20260617184312_34d3ca6c8980.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_alecrim_completo_1_pessoa_com_lug_1_20260617184312_ec9dd259a42e.jpg",
    "description": "Jogo de inspiração botânica, com lugar americano, guardanapo e porta-guardanapo coordenados para uma mesa leve e elegante.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "CÓRDOBA ESTAMPADO (SEM BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "LINHO 50%"
      },
      {
        "label": "Porta-guardanapo",
        "value": "ALECRIM"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 18,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 18.2,
        "retail_price": 26
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.5,
        "retail_price": 17.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 12.5,
        "retail_price": 17.9
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-rosa-coral-fibra-natural",
    "name": "Porta Guardanapo Rosa Coral com Fibra Natural",
    "category": "Porta-guardanapos",
    "sku": "MES-PGU-ROS-151",
    "tray_id": 151,
    "collection": null,
    "color_name": "Pêssego e verde",
    "color_hex": "#D98973",
    "retail_price": 13.9,
    "wholesale_price": 9.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_rosa_coral_com_fibra_natural_151_2_ca4dea7103ff0052a972d89cbae1658b.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_rosa_coral_com_fibra_natural_151_1_536247d87258987f9f60eb3604e18af7.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 18,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-lavanda",
    "name": "Kit Mesa Posta Lavanda - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-TEC-GRA-119",
    "tray_id": 119,
    "collection": "LAVANDA",
    "color_name": "Conforme composição",
    "color_hex": "#8F78A3",
    "retail_price": 63.9,
    "wholesale_price": 44.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_lavanda_completo_1_pessoa_com_lug_2_20260617184137_49e24510497f.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_lavanda_completo_1_pessoa_com_lug_1_20260617184137_28973dbda345.jpg",
    "description": "Composição suave em tons de lavanda, com lugar americano, guardanapo e porta-guardanapo coordenados para receber com delicadeza.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "CÓRDOBA ESTAMPADO (SEM BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "LINHO 50%"
      },
      {
        "label": "Porta-guardanapo",
        "value": "LAVANDA"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 19,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 18.2,
        "retail_price": 26
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.5,
        "retail_price": 17.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 14,
        "retail_price": 20
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-flor-azul-fibra-natural",
    "name": "Porta Guardanapo Flor Azul com Fibra Natural",
    "category": "Porta-guardanapos",
    "sku": "MES-PGU-FLA-158",
    "tray_id": 158,
    "collection": null,
    "color_name": "Azul serenity",
    "color_hex": "#5489B3",
    "retail_price": 13.9,
    "wholesale_price": 9.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_flor_azul_com_fibra_natural_158_2_d44db69305ba492e968b1ce957d18f75.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_flor_azul_com_fibra_natural_158_1_d4f7635b8752b3237552b918a3ef05b0.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 19,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-oliveira",
    "name": "Kit Mesa Posta Oliveira - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "MES-TEC-GRA-122",
    "tray_id": 122,
    "collection": "RAMO DE OLIVEIRA",
    "color_name": "Conforme composição",
    "color_hex": "#7B6651",
    "retail_price": 59.8,
    "wholesale_price": 41.9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_oliveira_completo_1_pessoa_com_lu_2_20260617184352_5552b520114f.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_oliveira_completo_1_pessoa_com_lu_1_20260617184352_ac1e72e567de.jpg",
    "description": "Jogo de inspiração mediterrânea com lugar americano, guardanapo e porta-guardanapo coordenados em uma composição acolhedora.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "CÓRDOBA ESTAMPADO (SEM BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "LINHO 50%"
      },
      {
        "label": "Porta-guardanapo",
        "value": "DALIA ROSE"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 20,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 18.2,
        "retail_price": 26
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 12.5,
        "retail_price": 17.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 11.1,
        "retail_price": 15.9
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-suculenta-verde-fibra-natural",
    "name": "Porta Guardanapo Suculenta Verde com Fibra Natural",
    "category": "Porta-guardanapos",
    "sku": "MES-PGU-SUC-155",
    "tray_id": 155,
    "collection": null,
    "color_name": "Verde eucalipto",
    "color_hex": "#819D83",
    "retail_price": 13.9,
    "wholesale_price": 9.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_suculenta_verde_com_fibra_natural_155_2_4d5209aefccf4b3cca56f62f365b3dd8.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_suculenta_verde_com_fibra_natural_155_1_d2891cbf8422eada1753265cb19cd744.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 20,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-pizza-bordado",
    "name": "Porta Guardanapo Pizza Bordado",
    "category": "Porta-guardanapos",
    "sku": "MES-BOR-PGU-214",
    "tray_id": 214,
    "collection": null,
    "color_name": "Amarelo, vermelho e verde",
    "color_hex": "#D5A233",
    "retail_price": 13.9,
    "wholesale_price": 9.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_pizza_bordado_214_2_5c9c3a4b7be9ce113d4084e087a7914c.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_pizza_bordado_214_1_e6d3e976fc6c546a6d1d3480e6947d84.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "PIZZA - BORDADO"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 21,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-rose-imperial",
    "name": "Jogo Rosé Imperial",
    "category": "Jogos",
    "sku": "MG-KT-ROSE",
    "tray_id": null,
    "collection": "Rosé Imperial",
    "color_name": "Conforme composição",
    "color_hex": "#BD8392",
    "retail_price": 58.2,
    "wholesale_price": 35.3,
    "image_url": "/produtos/jogos/jogo-rose-imperial-02.webp",
    "editorial_image_url": "/produtos/jogos/jogo-rose-imperial-01.webp",
    "description": "Composição floral Rosé Imperial com lugar americano, guardanapo e porta-guardanapo para mesas românticas e cheias de detalhes.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "GORGURINHO (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "OXFORD BRANCO"
      },
      {
        "label": "Porta-guardanapo",
        "value": "FLOR ROSA"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 21,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 13.9,
        "retail_price": 19.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 10.4,
        "retail_price": 14.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 9.7,
        "retail_price": 13.9
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-mariposa-rose",
    "name": "Jogo Mariposa Rosé",
    "category": "Jogos",
    "sku": "MG-KT-MARI",
    "tray_id": null,
    "collection": "Mariposa Rosé",
    "color_name": "Conforme composição",
    "color_hex": "#6E453A",
    "retail_price": 58.2,
    "wholesale_price": 35.2,
    "image_url": "/produtos/placeholder-mesaegraca.webp",
    "editorial_image_url": null,
    "description": "Jogo floral em tons rosé, composto por lugar americano, guardanapo e porta-guardanapo coordenados para uma mesa delicada.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "GORGURINHO (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "OXFORD BRANCO"
      },
      {
        "label": "Porta-guardanapo",
        "value": "FLOR ROSA"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 22,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 15.3,
        "retail_price": 25.3
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.1,
        "retail_price": 18.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 8.8,
        "retail_price": 14.6
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-courino-marrom-kit-4",
    "name": "Porta Guardanapos Courino Marrom - Conjunto com 4 Peças",
    "category": "Porta-guardanapos",
    "sku": "MES-COU-PGU-212",
    "tray_id": 212,
    "collection": null,
    "color_name": "Marrom",
    "color_hex": "#754A31",
    "retail_price": 27,
    "wholesale_price": 18.9,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapos_courino_marrom_conjunto_com_4_pecas_212_2_afef548f0dd86928ffb0bfdac5458aad.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapos_courino_marrom_conjunto_com_4_pecas_212_1_99083c921955974cf60020ee8b8ad95e.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 22,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-belle-rose",
    "name": "Jogo Belle Rosé",
    "category": "Jogos",
    "sku": "MG-KT-BELL",
    "tray_id": null,
    "collection": "Belle Rosé",
    "color_name": "Conforme composição",
    "color_hex": "#5C3B35",
    "retail_price": 58.2,
    "wholesale_price": 35.2,
    "image_url": "/produtos/placeholder-mesaegraca.webp",
    "editorial_image_url": null,
    "description": "Composição Belle Rosé com lugar americano, guardanapo e porta-guardanapo coordenados, pensada para receber com elegância.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "GORGURINHO (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "OXFORD BRANCO"
      },
      {
        "label": "Porta-guardanapo",
        "value": "FLOR ROSA"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 23,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 15.3,
        "retail_price": 25.3
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.1,
        "retail_price": 18.3
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 8.8,
        "retail_price": 14.6
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-no-turco-kit-4",
    "name": "Nó Turco · Kit com 4",
    "category": "Porta-guardanapos",
    "sku": "MG-PG-NOTU-K4",
    "tray_id": null,
    "collection": null,
    "color_name": "Marrom e bege",
    "color_hex": "#927554",
    "retail_price": 7,
    "wholesale_price": 4.9,
    "image_url": "/produtos/editorial-no-turco.webp",
    "editorial_image_url": "/produtos/no-turco.webp",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 23,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-flor-rosa",
    "name": "Flor Rosa",
    "category": "Porta-guardanapos",
    "sku": "MG-PG-FLRO",
    "tray_id": null,
    "collection": null,
    "color_name": "Rosa",
    "color_hex": "#C45E7E",
    "retail_price": 13.9,
    "wholesale_price": 9,
    "image_url": "/produtos/flor-rosa.webp",
    "editorial_image_url": "/produtos/editorial-flor-rosa.webp",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 24,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-flor-de-lottus",
    "name": "Kit Mesa Posta Flor de Lóttus - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "KIT-COU-KMP-229",
    "tray_id": 229,
    "collection": "FLOR DE LÓTUS",
    "color_name": "Conforme composição",
    "color_hex": "#DC8AA2",
    "retail_price": 52.1,
    "wholesale_price": 36.5,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_flor_de_lottus_com_lugar_americano_guardanapo_porta_guardanapo_229_2_9bc78c80a4f202c0dc2b1d42c5a549a5.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_flor_de_lottus_com_lugar_americano_guardanapo_porta_guardanapo_229_1_eab41c7d339e7bc27a8ee9416acced62.jpg",
    "description": "Jogo em tons florais suaves, com lugar americano, guardanapo e porta-guardanapo coordenados para uma mesa romântica.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "COURINO ROSA (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "OXFORD BRANCO"
      },
      {
        "label": "Porta-guardanapo",
        "value": "FLOR DE LOTUS"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 24,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 16,
        "retail_price": 22.9
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 10.4,
        "retail_price": 14.9
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 10,
        "retail_price": 14.3
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-bridgerton-azul",
    "name": "Kit Mesa Posta Bridgerton Azul - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "KIT-TEC-KMP-231",
    "tray_id": 231,
    "collection": "BRIDGERTON AZUL",
    "color_name": "Conforme composição",
    "color_hex": "#557AB7",
    "retail_price": 60.3,
    "wholesale_price": 48.2,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_bridgerton_azul_com_lugar_america_2_20260807084236_d1b4dd893d13.png",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_bridgerton_azul_com_lugar_america_1_20260807084236_5826154fa599.png",
    "description": "Composição em tricoline com estampa floral azul, guardanapo coordenado e porta-guardanapo para uma mesa clássica e refinada.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "TRICOLINE FLORIDO 100% (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "TRICOLINE CREME"
      },
      {
        "label": "Porta-guardanapo",
        "value": "ORQUIDEA AZUL"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 25,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 17.9,
        "retail_price": 25.6
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.2,
        "retail_price": 16
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 13.1,
        "retail_price": 18.7
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-orquidea-azul",
    "name": "Porta Guardanapo Orquídea Azul com Fibra Natural",
    "category": "Porta-guardanapos",
    "sku": "MES-FIB-PGO-235",
    "tray_id": 235,
    "collection": null,
    "color_name": "Azul",
    "color_hex": "#3F82BC",
    "retail_price": 15.3,
    "wholesale_price": 10.7,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_orquidea_azul_com_fibra_natural_235_2_90d5b182d16ed49a2c5989024bdb3d80.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/porta_guardanapo_orquidea_azul_com_fibra_natural_235_1_402f81c7a38fb9031829f49a5f3b6129.jpg",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 25,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-ovinho",
    "name": "Ovinho",
    "category": "Porta-guardanapos",
    "sku": "MG-PG-OVIN",
    "tray_id": null,
    "collection": null,
    "color_name": "Branco, amarelo e natural",
    "color_hex": "#D8A929",
    "retail_price": 13.9,
    "wholesale_price": 9,
    "image_url": "/produtos/ovinho.webp",
    "editorial_image_url": "/produtos/editorial-ovinho-portal.webp",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "OVINHO"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 26,
    "is_visible": true,
    "kit_quantity": null,
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-bridgerton-verde",
    "name": "Kit Mesa Posta Bridgerton Verde - Com Lugar Americano + Guardanapo + Porta-Guardanapo",
    "category": "Jogos",
    "sku": "KIT-TEC-KMP-234",
    "tray_id": 234,
    "collection": "BRIDGERTON VERDE",
    "color_name": "Conforme composição",
    "color_hex": "#477252",
    "retail_price": 63.3,
    "wholesale_price": 44.3,
    "image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_bridgerton_verde_com_lugar_americano_guardanapo_porta_guardanapo_234_2_89fb3f9ed6245a65c8598b1efc2bb501.jpg",
    "editorial_image_url": "https://images.tcdn.com.br/img/img_prod/1483700/kit_mesa_posta_bridgerton_verde_com_lugar_americano_guardanapo_porta_guardanapo_234_1_bcba27d42d30b2a9f8485ba052e10d79.jpg",
    "description": "Composição em tricoline com estampa floral verde, guardanapo coordenado e porta-guardanapo para uma mesa leve e elegante.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "TRICOLINE FLORIDO 100% (BORDADO)"
      },
      {
        "label": "Guardanapo",
        "value": "TRICOLINE CREME"
      },
      {
        "label": "Porta-guardanapo",
        "value": "M. MEDITARRÂNEO ESMERALDA"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 X 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 X 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "05 X 07 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 26,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 17.9,
        "retail_price": 25.6
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 13.4,
        "retail_price": 19.2
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 13,
        "retail_price": 18.5
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-laco-elegance",
    "name": "Laço Elegance",
    "category": "Porta-guardanapos",
    "sku": "MG-PG-ELEG",
    "tray_id": null,
    "collection": null,
    "color_name": "Variações disponíveis",
    "color_hex": "#A8202A",
    "retail_price": 14.9,
    "wholesale_price": 10.9,
    "image_url": "/produtos/laco-elegance.webp",
    "editorial_image_url": "/produtos/editorial-laco-elegance.webp",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 27,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "xadrez",
        "sku": "MG-PG-ELEG-RO-XD"
      },
      {
        "name": "Vermelho",
        "hex": "#C51F2A",
        "pattern": "xadrez",
        "sku": "MG-PG-ELEG-VE-XD"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "xadrez",
        "sku": "MG-PG-ELEG-AM-XD"
      },
      {
        "name": "Marinho",
        "hex": "#203150",
        "pattern": "xadrez",
        "sku": "MG-PG-ELEG-MA-XD"
      },
      {
        "name": "Preto",
        "hex": "#292929",
        "pattern": "xadrez",
        "sku": "MG-PG-ELEG-PR-XD"
      },
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "liso",
        "sku": "MG-PG-ELEG-RO-LS"
      },
      {
        "name": "Vermelho",
        "hex": "#C51F2A",
        "pattern": "liso",
        "sku": "MG-PG-ELEG-VE-LS"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "liso",
        "sku": "MG-PG-ELEG-AM-LS"
      },
      {
        "name": "Marinho",
        "hex": "#203150",
        "pattern": "liso",
        "sku": "MG-PG-ELEG-MA-LS"
      },
      {
        "name": "Preto",
        "hex": "#292929",
        "pattern": "liso",
        "sku": "MG-PG-ELEG-PR-LS"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "kit-fundo-do-mar-premium",
    "name": "Jogo Fundo do Mar Premium",
    "category": "Jogos",
    "sku": "MG-KT-FUNP",
    "tray_id": null,
    "collection": "Fundo do Mar Premium",
    "color_name": "Conforme composição",
    "color_hex": "#213C68",
    "retail_price": 80.5,
    "wholesale_price": 48.8,
    "image_url": "/produtos/placeholder-mesaegraca.webp",
    "editorial_image_url": null,
    "description": "Versão premium da linha Fundo do Mar, com lugar americano, guardanapo e porta-guardanapo coordenados em uma composição sofisticada.",
    "materials": [
      {
        "label": "Lugar Americano",
        "value": "Nylon 600 Impermeável com Detalhes (Acabamento refinado)"
      },
      {
        "label": "Guardanapo",
        "value": "Tricoline 100% Algodão Premium"
      },
      {
        "label": "Porta-guardanapo",
        "value": "Artesanal com Fibra Natural"
      }
    ],
    "dimensions": [
      {
        "label": "Lugar Americano",
        "value": "44 x 36 cm"
      },
      {
        "label": "Guardanapo",
        "value": "44 x 44 cm"
      },
      {
        "label": "Porta-guardanapo",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Pacote do Kit Completo",
        "value": "44 x 36 x 05 cm (Peso aprox.: 340 g)"
      }
    ],
    "image_status": "final",
    "sort_order": 27,
    "is_visible": true,
    "kit_quantity": null,
    "game_items": [
      {
        "label": "Lugar Americano (44 x 36 cm)",
        "wholesale_price": 24.5,
        "retail_price": 35
      },
      {
        "label": "Guardanapo de Tecido (44 x 44 cm)",
        "wholesale_price": 11.2,
        "retail_price": 16
      },
      {
        "label": "Porta-guardanapo Artesanal (07 x 05 cm)",
        "wholesale_price": 10.3,
        "retail_price": 14.7
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  },
  {
    "id": "porta-guardanapo-laco-charm",
    "name": "Laço Charm",
    "category": "Porta-guardanapos",
    "sku": "MG-PG-CHAR",
    "tray_id": null,
    "collection": null,
    "color_name": "Variações disponíveis",
    "color_hex": "#A8202A",
    "retail_price": 11.9,
    "wholesale_price": 7.9,
    "image_url": "/produtos/laco-charm.webp",
    "editorial_image_url": "/produtos/editorial-laco-charm.webp",
    "description": "Porta-guardanapo para finalizar a composição da mesa com praticidade e cuidado nos detalhes.",
    "materials": [
      {
        "label": "Estrutura e Material",
        "value": "Artesanal em Fibra Natural e Madeira"
      },
      {
        "label": "Acabamento",
        "value": "Confecção artesanal exclusiva para mesa posta"
      }
    ],
    "dimensions": [
      {
        "label": "Dimensões Unitárias",
        "value": "07 x 05 x 05 cm"
      },
      {
        "label": "Aro do Guardanapo",
        "value": "Diâmetro interno de 4 cm (padrão)"
      },
      {
        "label": "Peso Unitário Aproximado",
        "value": "40 g"
      }
    ],
    "image_status": "final",
    "sort_order": 28,
    "is_visible": true,
    "kit_quantity": null,
    "variations": [
      {
        "name": "Rosa bebê",
        "hex": "#E9B7BC",
        "pattern": "xadrez",
        "sku": "MG-PG-CHAR-RO"
      },
      {
        "name": "Vermelho",
        "hex": "#C51F2A",
        "pattern": "xadrez",
        "sku": "MG-PG-CHAR-VE"
      },
      {
        "name": "Marinho",
        "hex": "#203150",
        "pattern": "xadrez",
        "sku": "MG-PG-CHAR-MA"
      },
      {
        "name": "Preto",
        "hex": "#292929",
        "pattern": "xadrez",
        "sku": "MG-PG-CHAR-PR"
      },
      {
        "name": "Amarelo",
        "hex": "#D99B19",
        "pattern": "xadrez",
        "sku": "MG-PG-CHAR-AM"
      }
    ],
    "created_at": "2026-10-16T22:26:08.953663+00:00"
  }
];
