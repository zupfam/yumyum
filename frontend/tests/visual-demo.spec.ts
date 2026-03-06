import { test, expect } from '@playwright/test';

test('capture vendor microsite screenshot', async ({ page }) => {
  // Mock the API response for the vendor menu
  await page.route('**/api/v1/public/menu/pizza-palace', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        brand: {
          id: 1,
          name: 'Pizza Palace',
          slug: 'pizza-palace',
          logo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
          cuisine: 'Authentic Italian',
          description: 'The best wood-fired pizzas in the city. Made with love and fresh ingredients.',
          whatsapp_number: '919876543210',
          city: 'Mumbai',
          instagram_url: 'https://instagram.com/pizzapalace'
        },
        dishes: [
          {
            id: 1,
            name: 'Margherita Bliss',
            category: 'Pizzas',
            price: 499,
            image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
            is_veg: true,
            tag: 'Best Seller',
            description: 'Classic tomato, mozzarella, and fresh basil.'
          },
          {
            id: 2,
            name: 'Pepperoni Heat',
            category: 'Pizzas',
            price: 599,
            image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
            is_veg: false,
            tag: 'Spicy',
            description: 'Double pepperoni with a kick of hot honey.'
          },
          {
            id: 3,
            name: 'Garlic Knots',
            category: 'Sides',
            price: 199,
            image_url: 'https://images.unsplash.com/photo-1619531038896-986270e5b7c8?w=800&q=80',
            is_veg: true,
            description: 'Buttery knots with fresh garlic and parsley.'
          }
        ],
        statuses: [
          { id: 1, type: 'image', content: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80' }
        ]
      }),
    });
  });

  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 13 Pro
  await page.goto('http://localhost:5173/pizza-palace');
  
  // Wait for content to load
  await expect(page.getByRole('heading', { name: 'Pizza Palace' })).toBeVisible({ timeout: 10000 });
  
  // Take a high-quality screenshot
  await page.screenshot({ path: '.playwright-mcp/microsite-demo.png', fullPage: true });
});
