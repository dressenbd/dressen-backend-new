# Dynamic Promotional Category System

## Overview
A flexible system to create dynamic offer/combo/deal categories separate from regular product categories. Admin can create unlimited promotional categories and assign products to them.

---

## System Architecture

### 1. **Promo Category Module** (New)
- **Location**: `src/app/modules/promoCategory/`
- **Purpose**: Manage dynamic promotional categories (Flash Sale, Combo Deals, Weekend Offers, etc.)

### 2. **Product Module** (Updated)
- **Added Field**: `promoCategories` array in product schema
- **Purpose**: Link products to multiple promotional categories

---

## API Endpoints

### Promo Category Management

#### Create Promo Category
```
POST /api/promo-category/
Content-Type: multipart/form-data

Body:
{
  "name": "Flash Sale",
  "description": "Limited time flash sale items",
  "isActive": true,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "image": [file]
}
```

#### Get All Promo Categories (Admin)
```
GET /api/promo-category/
```

#### Get Active Promo Categories (Frontend)
```
GET /api/promo-category/active
```

#### Get Single Promo Category
```
GET /api/promo-category/:id
```

#### Update Promo Category
```
PATCH /api/promo-category/:id
Content-Type: multipart/form-data

Body:
{
  "name": "Updated Flash Sale",
  "isActive": false,
  "image": [file]
}
```

#### Delete Promo Category
```
DELETE /api/promo-category/:id
```

---

### Product Management with Promo Categories

#### Create Product with Promo Categories
```
POST /api/product/create-product
Content-Type: multipart/form-data

Body:
{
  "brandAndCategories": {
    "brand": "brandId",
    "categories": ["categoryId1", "categoryId2"],
    "tags": ["tagId1"],
    "subcategory": "subcategoryName",
    "promoCategories": ["promoCategoryId1", "promoCategoryId2"]  // NEW
  },
  "description": { ... },
  "productInfo": { ... },
  "featuredImgFile": [file],
  "galleryImagesFiles": [files]
}
```

#### Update Product with Promo Categories
```
PATCH /api/product/update-product/:id
Content-Type: multipart/form-data

Body:
{
  "brandAndCategories": {
    "promoCategories": ["promoCategoryId1", "promoCategoryId3"]
  }
}
```

#### Get Products by Promo Category
```
GET /api/product/promo-category/:promoCategoryId

Response:
{
  "success": true,
  "message": "Products by promo category retrieved successfully!",
  "data": [
    {
      "_id": "productId",
      "description": { "name": "Product Name" },
      "productInfo": { "price": 1000, "salePrice": 800 },
      "brandAndCategories": {
        "categories": [...],
        "promoCategories": [
          {
            "_id": "promoCategoryId",
            "name": "Flash Sale",
            "slug": "flash-sale"
          }
        ]
      }
    }
  ]
}
```

---

## Database Schema

### PromoCategory Model
```typescript
{
  name: String (required, unique),
  slug: String (auto-generated),
  description: String,
  image: String,
  isActive: Boolean (default: true),
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model (Updated)
```typescript
{
  brandAndCategories: {
    brand: ObjectId,
    categories: [ObjectId],
    tags: [ObjectId],
    subcategory: String,
    promoCategories: [ObjectId]  // NEW - References PromoCategory
  },
  // ... other fields
}
```

---

## Frontend Integration Examples

### 1. Admin Panel - Create Promo Category
```typescript
const createPromoCategory = async (formData: FormData) => {
  const response = await fetch('/api/promo-category/', {
    method: 'POST',
    body: formData, // { name, description, isActive, image }
  });
  return response.json();
};
```

### 2. Admin Panel - Assign Product to Promo Category
```typescript
const createProduct = async (productData) => {
  const formData = new FormData();
  
  // Regular fields
  formData.append('brandAndCategories[brand]', brandId);
  formData.append('brandAndCategories[categories][]', categoryId);
  
  // Promo categories (NEW)
  formData.append('brandAndCategories[promoCategories][]', promoCategoryId1);
  formData.append('brandAndCategories[promoCategories][]', promoCategoryId2);
  
  // ... other fields
  
  const response = await fetch('/api/product/create-product', {
    method: 'POST',
    body: formData,
  });
  return response.json();
};
```

### 3. Frontend - Display Promo Categories
```typescript
// Fetch active promo categories
const fetchPromoCategories = async () => {
  const response = await fetch('/api/promo-category/active');
  const data = await response.json();
  return data.data; // Array of active promo categories
};

// Display in UI
const PromoCategories = () => {
  const [promoCategories, setPromoCategories] = useState([]);
  
  useEffect(() => {
    fetchPromoCategories().then(setPromoCategories);
  }, []);
  
  return (
    <div>
      {promoCategories.map(promo => (
        <Link key={promo._id} href={`/promo/${promo.slug}`}>
          <img src={promo.image} alt={promo.name} />
          <h3>{promo.name}</h3>
        </Link>
      ))}
    </div>
  );
};
```

### 4. Frontend - Display Products by Promo Category
```typescript
// Fetch products for a specific promo category
const fetchPromoProducts = async (promoCategoryId: string) => {
  const response = await fetch(`/api/product/promo-category/${promoCategoryId}`);
  const data = await response.json();
  return data.data;
};

// Display in promo category page
const PromoCategoryPage = ({ promoCategoryId }) => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchPromoProducts(promoCategoryId).then(setProducts);
  }, [promoCategoryId]);
  
  return (
    <div>
      <h1>Flash Sale Products</h1>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
```

---

## Key Features

✅ **Dynamic Creation**: Admin can create unlimited promo categories
✅ **Flexible Assignment**: Products can belong to multiple promo categories
✅ **Separate from Regular Categories**: Doesn't interfere with existing category system
✅ **Active/Inactive Toggle**: Control visibility on frontend
✅ **Date Range Support**: Optional start/end dates for time-limited offers
✅ **Image Support**: Each promo category can have a banner image
✅ **Auto Slug Generation**: SEO-friendly URLs

---

## Use Cases

1. **Flash Sales**: Create "Flash Sale" category, add products with time limits
2. **Combo Deals**: Create "Buy 1 Get 1" category for bundled products
3. **Seasonal Offers**: "Summer Sale", "Winter Collection", etc.
4. **Special Events**: "Black Friday", "Eid Special", "New Year Deals"
5. **Clearance**: "Clearance Sale" for products to clear inventory
6. **Featured Collections**: "Editor's Pick", "Trending Now", "Best Sellers"

---

## Comparison: Regular Category vs Promo Category

| Feature | Regular Category | Promo Category |
|---------|-----------------|----------------|
| Purpose | Product organization | Marketing/Promotions |
| Structure | Hierarchical (subcategories) | Flat |
| Permanence | Long-term | Temporary/Dynamic |
| Product Assignment | Single category | Multiple promo categories |
| Use Case | "Electronics", "Clothing" | "Flash Sale", "Combo Deals" |

---

## Migration Notes

- **No Breaking Changes**: Existing products work without modification
- **Optional Field**: `promoCategories` is optional in product schema
- **Backward Compatible**: Products without promo categories function normally
- **Existing APIs**: All existing product APIs remain unchanged

---

## Testing Checklist

- [ ] Create promo category with image
- [ ] Create product with promo category assignment
- [ ] Fetch products by promo category
- [ ] Update promo category status (active/inactive)
- [ ] Assign multiple promo categories to one product
- [ ] Remove promo category from product
- [ ] Delete promo category
- [ ] Frontend displays active promo categories only
