import { http, HttpResponse, delay } from 'msw';
import { mockCategories, mockProducts, mockUser, mockOrders } from './mockData';
import type { Order } from '../../types';

export const handlers = [
  // Categories
  http.get('/api/categories', async () => {
    await delay(200);
    return HttpResponse.json(mockCategories);
  }),

  // Products List & Filter
  http.get('/api/products', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('q');
    const sort = url.searchParams.get('sort');

    let filtered = [...mockProducts];

    if (category) {
      filtered = filtered.filter((p) => p.categoryId === category || p.categoryName.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    return HttpResponse.json({
      content: filtered,
      page: 0,
      size: filtered.length,
      totalElements: filtered.length,
      totalPages: 1,
      isLast: true,
    });
  }),

  // Single Product Detail
  http.get('/api/products/:id', async ({ params }) => {
    await delay(200);
    const product = mockProducts.find((p) => p.id === params.id);
    if (!product) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404, detail: 'İstenen ürün bulunamadı.' },
        { status: 404 }
      );
    }
    return HttpResponse.json(product);
  }),

  // Auth - Login
  http.post('/api/auth/login', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as any;
    if (body.email && body.password) {
      return HttpResponse.json({
        user: mockUser,
        accessToken: 'mock-access-jwt-token-12345',
        refreshToken: 'mock-refresh-jwt-token-67890',
      });
    }
    return HttpResponse.json(
      { title: 'Bad Request', status: 400, detail: 'Geçersiz e-posta veya şifre' },
      { status: 400 }
    );
  }),

  // Orders List
  http.get('/api/orders', async () => {
    await delay(300);
    return HttpResponse.json(mockOrders);
  }),

  // Create Order
  http.post('/api/orders', async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as any;

    const newOrder: Order = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: mockUser.id,
      orderNumber: `TR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      items: body.items || [],
      status: 'pending',
      shippingAddress: body.shippingAddress,
      paymentDetails: {
        method: body.paymentDetails?.method || 'credit_card',
        cardLastFour: '4242',
      },
      subtotal: body.subtotal || 0,
      shippingFee: body.shippingFee || 0,
      discount: body.discount || 0,
      totalAmount: body.totalAmount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: '3 İş Günü',
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    mockOrders.unshift(newOrder as any);
    return HttpResponse.json(newOrder, { status: 201 });
  }),
];
