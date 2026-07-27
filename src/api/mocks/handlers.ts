import { http, HttpResponse } from 'msw';
import { mockCategories, mockProducts, mockUser, mockOrders } from './mockData';
import type { Cart, CartItem, Order, User } from '../types';

const API_BASE_URL = 'https://api.eticaret.example.com/v1';

// In-memory state for mock backend session
let inMemoryUser: User | null = mockUser;
let inMemoryOrders: Order[] = [...mockOrders];

let inMemoryCart: Cart = {
  items: [
    {
      id: 'item-1',
      productId: 'prod-1',
      product: mockProducts[0],
      quantity: 1,
      unitPrice: mockProducts[0].price,
      totalPrice: mockProducts[0].price,
    },
    {
      id: 'item-2',
      productId: 'prod-5',
      product: mockProducts[4],
      quantity: 2,
      unitPrice: mockProducts[4].price,
      totalPrice: mockProducts[4].price * 2,
    },
  ],
  subtotal: mockProducts[0].price + mockProducts[4].price * 2,
  shipping: 0,
  discount: 100,
  total: mockProducts[0].price + mockProducts[4].price * 2 - 100,
  totalItems: 3,
};

function recalculateCart() {
  const subtotal = inMemoryCart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = inMemoryCart.items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 49;
  const discount = subtotal > 2000 ? 150 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  inMemoryCart = {
    ...inMemoryCart,
    subtotal,
    shipping,
    discount,
    total,
    totalItems,
  };
}

export const handlers = [
  // 1. AUTH: Register
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string; firstName?: string; lastName?: string };

    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return HttpResponse.json(
        {
          type: 'https://api.eticaret.example.com/errors/validation-error',
          title: 'Doğrulama Hatası',
          status: 400,
          detail: 'Tüm zorunlu alanlar doldurulmalıdır (ad, soyad, e-posta, şifre).',
        },
        { status: 400, headers: { 'Content-Type': 'application/problem+json' } }
      );
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      createdAt: new Date().toISOString(),
    };

    inMemoryUser = newUser;

    return HttpResponse.json({
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      user: newUser,
    });
  }),

  // 2. AUTH: Login
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email === 'error@test.com') {
      return HttpResponse.json(
        {
          type: 'https://api.eticaret.example.com/errors/invalid-credentials',
          title: 'Giriş Başarısız',
          status: 401,
          detail: 'E-posta adresi veya şifre hatalı.',
        },
        { status: 401, headers: { 'Content-Type': 'application/problem+json' } }
      );
    }

    const userToReturn = inMemoryUser || mockUser;

    return HttpResponse.json({
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      user: {
        ...userToReturn,
        email: body.email || userToReturn.email,
      },
    });
  }),

  // 3. AUTH: Refresh Token
  http.post(`${API_BASE_URL}/auth/refresh`, async () => {
    return HttpResponse.json({
      accessToken: `mock-refreshed-access-token-${Date.now()}`,
      refreshToken: `mock-refreshed-refresh-token-${Date.now()}`,
    });
  }),

  // 4. USER: Get Me
  http.get(`${API_BASE_URL}/users/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader && !inMemoryUser) {
      return HttpResponse.json(
        {
          type: 'https://api.eticaret.example.com/errors/unauthorized',
          title: 'Yetkisiz Erişim',
          status: 401,
          detail: 'Bu işlemi yapmak için oturum açmalısınız.',
        },
        { status: 401, headers: { 'Content-Type': 'application/problem+json' } }
      );
    }
    return HttpResponse.json(inMemoryUser || mockUser);
  }),

  // 5. USER: Update Me
  http.patch(`${API_BASE_URL}/users/me`, async ({ request }) => {
    const body = (await request.json()) as Partial<User>;
    if (!inMemoryUser) inMemoryUser = mockUser;

    inMemoryUser = {
      ...inMemoryUser,
      ...body,
      address: body.address ? { ...inMemoryUser.address, ...body.address } : inMemoryUser.address,
    };

    return HttpResponse.json(inMemoryUser);
  }),

  // 6. CATEGORIES: Get All
  http.get(`${API_BASE_URL}/categories`, () => {
    return HttpResponse.json(mockCategories);
  }),

  // 7. PRODUCTS: Get Filtered & Paginated List
  http.get(`${API_BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const size = parseInt(url.searchParams.get('size') || '12', 10);
    const category = url.searchParams.get('category') || '';
    const query = url.searchParams.get('q')?.toLowerCase() || '';
    const minPrice = parseFloat(url.searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(url.searchParams.get('maxPrice') || '9999999');
    const sort = url.searchParams.get('sort') || 'featured';

    let filtered = mockProducts.filter((p) => {
      const matchCategory = !category || p.categoryId === category || p.categoryName.toLowerCase() === category.toLowerCase();
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query));
      const matchPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchCategory && matchQuery && matchPrice;
    });

    // Sorting
    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const startIndex = (page - 1) * size;
    const content = filtered.slice(startIndex, startIndex + size);

    return HttpResponse.json({
      content,
      totalElements,
      totalPages,
      page,
      size,
    });
  }),

  // 8. PRODUCTS: Get Detail By ID
  http.get(`${API_BASE_URL}/products/:id`, ({ params }) => {
    const { id } = params;
    const product = mockProducts.find((p) => p.id === id || p.slug === id);

    if (!product) {
      return HttpResponse.json(
        {
          type: 'https://api.eticaret.example.com/errors/not-found',
          title: 'Ürün Bulunamadı',
          status: 404,
          detail: `ID: ${id} olan ürün mevcut değil.`,
        },
        { status: 404, headers: { 'Content-Type': 'application/problem+json' } }
      );
    }

    return HttpResponse.json(product);
  }),

  // 9. CART: Get Cart
  http.get(`${API_BASE_URL}/cart`, () => {
    recalculateCart();
    return HttpResponse.json(inMemoryCart);
  }),

  // 10. CART: Add Item
  http.post(`${API_BASE_URL}/cart/items`, async ({ request }) => {
    const body = (await request.json()) as { productId: string; quantity: number };
    const product = mockProducts.find((p) => p.id === body.productId);

    if (!product) {
      return HttpResponse.json(
        {
          type: 'https://api.eticaret.example.com/errors/not-found',
          title: 'Ürün Bulunamadı',
          status: 404,
          detail: 'Sepete eklenmek istenen ürün sistemde bulunamadı.',
        },
        { status: 404, headers: { 'Content-Type': 'application/problem+json' } }
      );
    }

    const existingIndex = inMemoryCart.items.findIndex((item) => item.productId === body.productId);

    if (existingIndex > -1) {
      const existing = inMemoryCart.items[existingIndex];
      const newQty = existing.quantity + (body.quantity || 1);
      inMemoryCart.items[existingIndex] = {
        ...existing,
        quantity: newQty,
        totalPrice: newQty * existing.unitPrice,
      };
    } else {
      const newItem: CartItem = {
        id: `item-${Date.now()}`,
        productId: product.id,
        product,
        quantity: body.quantity || 1,
        unitPrice: product.price,
        totalPrice: product.price * (body.quantity || 1),
      };
      inMemoryCart.items.push(newItem);
    }

    recalculateCart();
    return HttpResponse.json(inMemoryCart);
  }),

  // 11. CART: Update Item Quantity
  http.patch(`${API_BASE_URL}/cart/items/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { quantity: number };

    const itemIndex = inMemoryCart.items.findIndex((item) => item.id === id || item.productId === id);

    if (itemIndex === -1) {
      return HttpResponse.json(
        {
          type: 'https://api.eticaret.example.com/errors/not-found',
          title: 'Sepet Öğesi Bulunamadı',
          status: 404,
          detail: 'Güncellenmek istenen sepet ürünü bulunamadı.',
        },
        { status: 404, headers: { 'Content-Type': 'application/problem+json' } }
      );
    }

    if (body.quantity <= 0) {
      inMemoryCart.items.splice(itemIndex, 1);
    } else {
      const item = inMemoryCart.items[itemIndex];
      inMemoryCart.items[itemIndex] = {
        ...item,
        quantity: body.quantity,
        totalPrice: item.unitPrice * body.quantity,
      };
    }

    recalculateCart();
    return HttpResponse.json(inMemoryCart);
  }),

  // 12. CART: Delete Item
  http.delete(`${API_BASE_URL}/cart/items/:id`, ({ params }) => {
    const { id } = params;
    inMemoryCart.items = inMemoryCart.items.filter((item) => item.id !== id && item.productId !== id);
    recalculateCart();
    return HttpResponse.json(inMemoryCart);
  }),

  // 13. ORDERS: Create Order
  http.post(`${API_BASE_URL}/orders`, async ({ request }) => {
    const body = (await request.json()) as { shippingAddress: any; paymentDetails: any };

    if (!inMemoryCart.items.length) {
      return HttpResponse.json(
        {
          type: 'https://api.eticaret.example.com/errors/empty-cart',
          title: 'Boş Sepet Hatası',
          status: 400,
          detail: 'Sepetinizde ürün bulunmadığından sipariş oluşturulamaz.',
        },
        { status: 400, headers: { 'Content-Type': 'application/problem+json' } }
      );
    }

    const orderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderNumber = `TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      userId: inMemoryUser?.id || 'user-101',
      orderNumber,
      items: inMemoryCart.items.map((ci) => ({
        productId: ci.productId,
        productName: ci.product.name,
        productImage: ci.product.images[0],
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        totalPrice: ci.totalPrice,
      })),
      status: 'processing',
      shippingAddress: body.shippingAddress || {
        fullName: `${inMemoryUser?.firstName || 'Ahmet'} ${inMemoryUser?.lastName || 'Yılmaz'}`,
        addressLine1: 'Atatürk Cad. No: 42',
        city: 'İstanbul',
        state: 'Kadıköy',
        zipCode: '34710',
        country: 'Türkiye',
        phone: '+90 555 123 45 67',
      },
      paymentDetails: body.paymentDetails || {
        method: 'credit_card',
        cardLastFour: '4242',
        cardHolderName: 'AHMET YILMAZ',
      },
      subtotal: inMemoryCart.subtotal,
      shippingFee: inMemoryCart.shipping,
      discount: inMemoryCart.discount,
      totalAmount: inMemoryCart.total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    inMemoryOrders.unshift(newOrder);

    // Empty cart
    inMemoryCart.items = [];
    recalculateCart();

    return HttpResponse.json(newOrder, { status: 201 });
  }),

  // 14. ORDERS: List Orders
  http.get(`${API_BASE_URL}/orders`, () => {
    return HttpResponse.json(inMemoryOrders);
  }),

  // 15. ORDERS: Get Order Detail
  http.get(`${API_BASE_URL}/orders/:id`, ({ params }) => {
    const { id } = params;
    const order = inMemoryOrders.find((o) => o.id === id || o.orderNumber === id);

    if (!order) {
      return HttpResponse.json(
        {
          type: 'https://api.eticaret.example.com/errors/not-found',
          title: 'Sipariş Bulunamadı',
          status: 404,
          detail: `ID: ${id} olan sipariş kaydı bulunamadı.`,
        },
        { status: 404, headers: { 'Content-Type': 'application/problem+json' } }
      );
    }

    return HttpResponse.json(order);
  }),
];
