import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hasAdminAccess } from "@/lib/admin-access";
import { getUIProducts } from "@/lib/catalog-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const isAuthorized = await hasAdminAccess();
  if (!isAuthorized) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  // Lista todos os produtos (incluindo inativos)
  const products = await getUIProducts({ includeInactive: true });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const isAuthorized = await hasAdminAccess();
  if (!isAuthorized) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { message: "Banco de dados não configurado para escrita." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const slug =
      body.id ||
      body.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const payload = {
      id: slug,
      name: body.name,
      category: body.category || "Lugar Americano",
      sku: body.sku || null,
      collection: body.collection || null,
      color_name: body.color_name || null,
      color_hex: body.color_hex || null,
      wholesale_price: body.wholesale_price != null ? Number(body.wholesale_price) : null,
      price: body.retail_price != null ? Number(body.retail_price) : null,
      sort_order: Number(body.sort_order ?? 0),
      active: body.is_visible !== false,
      short_description: body.description || "",
      description: body.description || "",
      media: {
        images: [
          body.image_url
            ? {
                url: body.image_url,
                url_webp: body.image_url,
                is_cover: true,
                type: "studio",
              }
            : null,
          body.editorial_image_url
            ? {
                url: body.editorial_image_url,
                url_webp: body.editorial_image_url,
                is_cover: false,
                type: "editorial",
              }
            : null,
        ].filter(Boolean),
      },
    };

    const { data, error } = await supabaseAdmin
      .from("produtos")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, product: data });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Erro ao criar produto." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  const isAuthorized = await hasAdminAccess();
  if (!isAuthorized) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { message: "Banco de dados não configurado para escrita." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: "ID obrigatório." }, { status: 400 });
    }

    const dbUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.sku !== undefined) dbUpdates.sku = updates.sku || null;
    if (updates.collection !== undefined) dbUpdates.collection = updates.collection || null;
    if (updates.color_name !== undefined) dbUpdates.color_name = updates.color_name || null;
    if (updates.color_hex !== undefined) dbUpdates.color_hex = updates.color_hex || null;
    if (updates.wholesale_price !== undefined) dbUpdates.wholesale_price = updates.wholesale_price != null ? Number(updates.wholesale_price) : null;
    if (updates.retail_price !== undefined) dbUpdates.price = updates.retail_price != null ? Number(updates.retail_price) : null;
    if (updates.sort_order !== undefined) dbUpdates.sort_order = Number(updates.sort_order);
    if (updates.is_visible !== undefined) dbUpdates.active = Boolean(updates.is_visible);
    if (updates.description !== undefined) {
      dbUpdates.description = updates.description;
      dbUpdates.short_description = updates.description;
    }

    // Se houver alteração de imagem
    if (updates.image_url !== undefined || updates.editorial_image_url !== undefined) {
      const { data: current } = await supabaseAdmin
        .from("produtos")
        .select("media")
        .eq("id", id)
        .single();

      const existingImages = current?.media?.images || [];
      const newImages = [...existingImages];

      if (updates.image_url) {
        const coverIdx = newImages.findIndex((img: any) => img.is_cover);
        const item = { url: updates.image_url, url_webp: updates.image_url, is_cover: true, type: "studio" };
        if (coverIdx > -1) newImages[coverIdx] = item;
        else newImages.unshift(item);
      }

      if (updates.editorial_image_url) {
        const editIdx = newImages.findIndex((img: any) => !img.is_cover);
        const item = { url: updates.editorial_image_url, url_webp: updates.editorial_image_url, is_cover: false, type: "editorial" };
        if (editIdx > -1) newImages[editIdx] = item;
        else newImages.push(item);
      }

      dbUpdates.media = { images: newImages };
    }

    const { data, error } = await supabaseAdmin
      .from("produtos")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, product: data });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Erro ao atualizar produto." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const isAuthorized = await hasAdminAccess();
  if (!isAuthorized) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { message: "Banco de dados não configurado para escrita." },
      { status: 500 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID obrigatório." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("produtos").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ ok: true, message: "Produto excluído." });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Erro ao excluir produto." },
      { status: 400 },
    );
  }
}
