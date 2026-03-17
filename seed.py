import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.insert(0, '/home/user/foodrush')
django.setup()

from accounts.models import User
from restaurant.models import Restaurant, Category, Review
from menu.models import MenuItem, MenuCategory

print("🌱 Seeding database...")

# ── Categories ───────────────────────────────────────────────────────
cats_data = [
    ('Pizza',   '🍕'), ('Burger',  '🍔'), ('Sushi',   '🍣'),
    ('Chinese', '🥡'), ('Indian',  '🍛'), ('Mexican', '🌮'),
    ('Desserts','🍰'), ('Healthy', '🥗'), ('BBQ',     '🍖'),
    ('Seafood', '🦞'),
]
categories = {}
for name, icon in cats_data:
    c, _ = Category.objects.get_or_create(name=name, defaults={'icon': icon})
    categories[name] = c
print(f"  ✅ {len(categories)} categories created")

# ── Users ────────────────────────────────────────────────────────────
admin_user, _ = User.objects.get_or_create(
    email='admin@foodrush.com',
    defaults={'username': 'admin', 'role': 'restaurant_owner', 'phone': '+1-555-0001',
              'city': 'New York', 'address': '1 Admin St', 'is_staff': True, 'is_superuser': True}
)
admin_user.set_password('admin123')
admin_user.save()

owner2, _ = User.objects.get_or_create(
    email='mario@foodrush.com',
    defaults={'username': 'mario_rossi', 'role': 'restaurant_owner', 'phone': '+1-555-0002',
              'city': 'New York', 'address': '22 Italian Ave'}
)
owner2.set_password('owner123')
owner2.save()

owner3, _ = User.objects.get_or_create(
    email='sakura@foodrush.com',
    defaults={'username': 'sakura_tanaka', 'role': 'restaurant_owner', 'phone': '+1-555-0003',
              'city': 'San Francisco', 'address': '5 Sushi Lane'}
)
owner3.set_password('owner123')
owner3.save()

customer, _ = User.objects.get_or_create(
    email='john@example.com',
    defaults={'username': 'john_doe', 'role': 'customer', 'phone': '+1-555-1234',
              'city': 'New York', 'address': '42 Maple Street'}
)
customer.set_password('test123')
customer.save()

print("  ✅ Users created (admin@foodrush.com / admin123, john@example.com / test123)")

# ── Restaurants ──────────────────────────────────────────────────────
restaurants_data = [
    {
        'owner': admin_user, 'name': "Tony's Pizzeria", 'category': 'Pizza',
        'description': 'Authentic Neapolitan pizza baked in a wood-fired oven. Family recipes since 1982.',
        'address': '123 Little Italy Blvd', 'city': 'New York', 'phone': '+1-212-555-0101',
        'rating': 4.8, 'total_reviews': 312, 'delivery_time': 25, 'delivery_fee': 1.99,
        'min_order': 12.00, 'is_open': True, 'is_featured': True,
    },
    {
        'owner': owner2, 'name': "Burger Palace", 'category': 'Burger',
        'description': 'Juicy gourmet burgers crafted from 100% Angus beef. 20+ signature burgers.',
        'address': '456 Main Street', 'city': 'New York', 'phone': '+1-212-555-0202',
        'rating': 4.6, 'total_reviews': 489, 'delivery_time': 20, 'delivery_fee': 2.49,
        'min_order': 10.00, 'is_open': True, 'is_featured': True,
    },
    {
        'owner': owner3, 'name': "Sakura Sushi Bar", 'category': 'Sushi',
        'description': 'Premium omakase and à la carte sushi. Fresh fish flown in daily from Tokyo.',
        'address': '789 Japantown St', 'city': 'San Francisco', 'phone': '+1-415-555-0303',
        'rating': 4.9, 'total_reviews': 201, 'delivery_time': 35, 'delivery_fee': 3.99,
        'min_order': 20.00, 'is_open': True, 'is_featured': True,
    },
    {
        'owner': admin_user, 'name': "Spice Garden", 'category': 'Indian',
        'description': 'Authentic Indian curries, biryanis and tandoor dishes. Vegetarian-friendly.',
        'address': '99 Curry Row', 'city': 'New York', 'phone': '+1-212-555-0404',
        'rating': 4.7, 'total_reviews': 156, 'delivery_time': 30, 'delivery_fee': 2.99,
        'min_order': 15.00, 'is_open': True, 'is_featured': False,
    },
    {
        'owner': owner2, 'name': "Dragon Palace", 'category': 'Chinese',
        'description': 'Traditional Cantonese dim sum and Sichuan specialties since 1990.',
        'address': '55 Chinatown Blvd', 'city': 'New York', 'phone': '+1-212-555-0505',
        'rating': 4.5, 'total_reviews': 278, 'delivery_time': 28, 'delivery_fee': 1.99,
        'min_order': 12.00, 'is_open': True, 'is_featured': False,
    },
    {
        'owner': owner3, 'name': "El Rancho Taqueria", 'category': 'Mexican',
        'description': 'Street-style tacos, burritos, and quesadillas. Handmade tortillas daily.',
        'address': '77 Taco Lane', 'city': 'Los Angeles', 'phone': '+1-310-555-0606',
        'rating': 4.4, 'total_reviews': 390, 'delivery_time': 22, 'delivery_fee': 1.49,
        'min_order': 8.00, 'is_open': True, 'is_featured': False,
    },
    {
        'owner': admin_user, 'name': "Sweet Bliss Bakery", 'category': 'Desserts',
        'description': 'Artisan pastries, cakes, and ice cream. Gluten-free options available.',
        'address': '33 Pastry Ave', 'city': 'Chicago', 'phone': '+1-312-555-0707',
        'rating': 4.9, 'total_reviews': 123, 'delivery_time': 20, 'delivery_fee': 2.49,
        'min_order': 10.00, 'is_open': True, 'is_featured': True,
    },
    {
        'owner': owner2, 'name': "Green Bowl", 'category': 'Healthy',
        'description': 'Nutritious poke bowls, salads, and smoothie bowls. 100% organic ingredients.',
        'address': '11 Wellness Way', 'city': 'San Francisco', 'phone': '+1-415-555-0808',
        'rating': 4.6, 'total_reviews': 87, 'delivery_time': 18, 'delivery_fee': 2.99,
        'min_order': 12.00, 'is_open': False, 'is_featured': False,
    },
]

created_restaurants = {}
for r_data in restaurants_data:
    cat = categories[r_data.pop('category')]
    r, _ = Restaurant.objects.get_or_create(
        name=r_data['name'],
        defaults={**r_data, 'category': cat}
    )
    created_restaurants[r.name] = r

print(f"  ✅ {len(created_restaurants)} restaurants created")

# ── Menu Items ───────────────────────────────────────────────────────
menu_items_data = {
    "Tony's Pizzeria": {
        'Starters': [
            ('Garlic Bread', 'Crispy baked bread with garlic butter and herbs', 5.99, False, 0),
            ('Bruschetta', 'Toasted bread with tomato, basil, and olive oil', 7.99, True, 0),
            ('Mozzarella Sticks', 'Golden fried mozzarella with marinara sauce', 8.99, True, 0),
        ],
        'Classic Pizzas': [
            ('Margherita', 'San Marzano tomatoes, fresh mozzarella, basil', 13.99, True, 0),
            ('Pepperoni', 'Generous pepperoni, mozzarella, tomato sauce', 15.99, False, 0),
            ('BBQ Chicken', 'Grilled chicken, BBQ sauce, red onion, cilantro', 16.99, False, 0),
            ('Vegetarian Supreme', 'Bell peppers, mushrooms, olives, onions, spinach', 14.99, True, 1),
            ('Meat Lovers', 'Pepperoni, sausage, bacon, ham, ground beef', 18.99, False, 1),
        ],
        'Gourmet Pizzas': [
            ('Truffle Mushroom', 'Truffle oil, wild mushrooms, parmesan, arugula', 22.99, True, 0),
            ('Prosciutto & Fig', 'Prosciutto, fig jam, gorgonzola, walnuts', 24.99, False, 0),
            ('Spicy Diavola', 'Spicy salami, chili flakes, mozzarella', 17.99, False, 3),
        ],
        'Drinks': [
            ('Sparkling Water', 'Italian mineral water 500ml', 2.99, True, 0),
            ('Lemon Soda', 'Fresh lemon soda', 3.99, True, 0),
            ('House Wine', 'Glass of Chianti red or Pinot Grigio white', 7.99, True, 0),
        ],
    },
    "Burger Palace": {
        'Signature Burgers': [
            ('Classic Smash', '2x smash patties, American cheese, pickles, onion, special sauce', 12.99, False, 0),
            ('BBQ Bacon Burger', 'Angus beef, crispy bacon, BBQ sauce, cheddar, coleslaw', 14.99, False, 1),
            ('Mushroom Swiss', 'Beef patty, sautéed mushrooms, Swiss cheese, garlic aioli', 13.99, False, 0),
            ('Spicy Inferno', 'Jalapeño beef blend, ghost pepper sauce, pepper jack, pickled onions', 15.99, False, 4),
        ],
        'Chicken': [
            ('Crispy Chicken Sandwich', 'Buttermilk fried chicken, coleslaw, pickles, mayo', 12.99, False, 0),
            ('Grilled Chicken Wrap', 'Grilled chicken, lettuce, tomato, avocado sauce', 11.99, False, 0),
        ],
        'Veggie': [
            ('Impossible Burger', 'Plant-based patty, lettuce, tomato, vegan mayo', 13.99, True, 0),
            ('Portobello Mushroom Burger', 'Grilled portobello, roasted peppers, pesto, brie', 12.99, True, 0),
        ],
        'Sides': [
            ('Classic Fries', 'Golden crispy shoestring fries', 3.99, True, 0),
            ('Truffle Parmesan Fries', 'Fries with truffle oil and parmesan', 5.99, True, 0),
            ('Onion Rings', 'Beer-battered onion rings with ranch', 4.99, True, 0),
            ('Loaded Fries', 'Fries with cheese, bacon, jalapeños, sour cream', 7.99, False, 1),
        ],
        'Shakes': [
            ('Vanilla Bean Shake', 'Creamy vanilla milkshake', 5.99, True, 0),
            ('Chocolate Fudge Shake', 'Rich chocolate shake with fudge swirl', 6.49, True, 0),
            ('Strawberry Shake', 'Fresh strawberry milkshake', 5.99, True, 0),
        ],
    },
    "Sakura Sushi Bar": {
        'Starters': [
            ('Edamame', 'Steamed salted soybeans', 4.99, True, 0),
            ('Gyoza (6 pcs)', 'Pan-fried pork and cabbage dumplings', 7.99, False, 0),
            ('Miso Soup', 'Traditional miso with tofu and seaweed', 3.99, True, 0),
            ('Agedashi Tofu', 'Crispy tofu in savory dashi broth', 8.99, True, 0),
        ],
        'Nigiri & Sashimi': [
            ('Salmon Nigiri (2 pcs)', 'Fresh Atlantic salmon over seasoned rice', 6.99, False, 0),
            ('Tuna Nigiri (2 pcs)', 'Premium bluefin tuna over rice', 7.99, False, 0),
            ('Sashimi Platter (12 pcs)', 'Chef selection of fresh sashimi', 28.99, False, 0),
            ('Yellowtail Nigiri (2 pcs)', 'Buttery yellowtail over rice', 7.49, False, 0),
        ],
        'Specialty Rolls': [
            ('Dragon Roll', 'Shrimp tempura, cucumber, avocado on top', 16.99, False, 1),
            ('Spider Roll', 'Soft shell crab, avocado, cucumber, spicy mayo', 17.99, False, 2),
            ('Rainbow Roll', 'California roll topped with assorted fish', 18.99, False, 0),
            ('Volcano Roll', 'Spicy tuna, crab, topped with baked scallop in spicy mayo', 19.99, False, 3),
        ],
        'Ramen & Udon': [
            ('Tonkotsu Ramen', 'Rich pork bone broth, chashu, soft egg, nori', 14.99, False, 0),
            ('Spicy Miso Ramen', 'Miso broth, ground pork, bamboo shoots, corn', 13.99, False, 2),
            ('Tempura Udon', 'Thick udon noodles with shrimp tempura in dashi', 15.99, False, 0),
        ],
    },
    "Spice Garden": {
        'Starters': [
            ('Samosa (3 pcs)', 'Crispy pastry filled with spiced potatoes and peas', 5.99, True, 1),
            ('Paneer Tikka', 'Marinated cottage cheese grilled in tandoor', 10.99, True, 2),
            ('Chicken 65', 'Spicy deep-fried chicken, South Indian style', 11.99, False, 3),
        ],
        'Curry': [
            ('Butter Chicken', 'Tender chicken in rich tomato-cream sauce', 15.99, False, 1),
            ('Palak Paneer', 'Cottage cheese in creamy spinach gravy', 13.99, True, 1),
            ('Lamb Rogan Josh', 'Kashmiri-style slow-cooked lamb curry', 17.99, False, 2),
            ('Dal Makhani', 'Slow-cooked black lentils in butter and cream', 12.99, True, 1),
            ('Prawn Masala', 'Tiger prawns in spiced tomato-onion gravy', 18.99, False, 2),
        ],
        'Biryani': [
            ('Hyderabadi Chicken Biryani', 'Fragrant basmati with saffron and dum-cooked chicken', 17.99, False, 2),
            ('Vegetable Biryani', 'Mixed vegetables and basmati in aromatic spices', 14.99, True, 1),
        ],
        'Breads & Rice': [
            ('Garlic Naan', 'Leavened bread with garlic and butter', 3.99, True, 0),
            ('Basmati Rice', 'Steamed aromatic basmati', 2.99, True, 0),
        ],
    },
    "Sweet Bliss Bakery": {
        'Cakes': [
            ('New York Cheesecake', 'Classic creamy cheesecake on graham cracker crust', 6.99, True, 0),
            ('Chocolate Lava Cake', 'Warm chocolate cake with molten center and vanilla ice cream', 8.99, True, 0),
            ('Red Velvet Slice', 'Moist red velvet with cream cheese frosting', 5.99, True, 0),
            ('Tiramisu', 'Classic Italian tiramisu with mascarpone and espresso', 7.99, True, 0),
        ],
        'Pastries': [
            ('Croissant', 'Buttery, flaky French croissant', 3.49, True, 0),
            ('Pain au Chocolat', 'Chocolate-filled croissant', 3.99, True, 0),
            ('Cinnamon Roll', 'Oven-fresh cinnamon roll with cream cheese glaze', 4.49, True, 0),
            ('Macaron Box (6 pcs)', 'Assorted French macarons', 12.99, True, 0),
        ],
        'Ice Cream': [
            ('Gelato Scoop', 'Authentic Italian gelato — pick your flavor', 4.49, True, 0),
            ('Sundae', 'Three scoops, hot fudge, whipped cream, cherry', 8.99, True, 0),
            ('Banana Split', 'Classic banana split with three flavors', 9.99, True, 0),
        ],
        'Drinks': [
            ('Specialty Coffee', 'Espresso, cappuccino, or latte', 4.49, True, 0),
            ('Hot Chocolate', 'Rich dark chocolate with whipped cream', 4.99, True, 0),
        ],
    },
}

for rest_name, categories_dict in menu_items_data.items():
    if rest_name not in created_restaurants:
        continue
    restaurant = created_restaurants[rest_name]
    for cat_name, items in categories_dict.items():
        menu_cat, _ = MenuCategory.objects.get_or_create(
            restaurant=restaurant, name=cat_name
        )
        for item_data in items:
            name, desc, price, is_veg, spice = item_data
            MenuItem.objects.get_or_create(
                restaurant=restaurant,
                name=name,
                defaults={
                    'category': menu_cat,
                    'description': desc,
                    'price': price,
                    'is_veg': is_veg,
                    'spice_level': spice,
                    'is_available': True,
                    'is_featured': price > 15,
                }
            )

total_items = MenuItem.objects.count()
print(f"  ✅ {total_items} menu items created")

# ── Reviews ──────────────────────────────────────────────────────────
sample_reviews = [
    ("Tony's Pizzeria", customer, 5, "Best pizza in NYC! The wood-fired crust is absolutely perfect."),
    ("Burger Palace",   customer, 4, "The smash burgers are incredible. Truffle fries are a must!"),
    ("Sakura Sushi Bar",customer, 5, "Freshest sushi I've ever had outside of Japan. The dragon roll is divine."),
    ("Spice Garden",    customer, 5, "Authentic Indian food! The butter chicken is heavenly."),
    ("Sweet Bliss Bakery", customer, 5, "The chocolate lava cake is out of this world. Worth every calorie!"),
]
for rest_name, user, rating, comment in sample_reviews:
    if rest_name in created_restaurants:
        Review.objects.get_or_create(
            restaurant=created_restaurants[rest_name],
            user=user,
            defaults={'rating': rating, 'comment': comment}
        )

print(f"  ✅ Sample reviews added")
print("\n🎉 Database seeded successfully!")
print("\n📋 Login credentials:")
print("   Admin/Owner: admin@foodrush.com / admin123")
print("   Customer:    john@example.com   / test123")
