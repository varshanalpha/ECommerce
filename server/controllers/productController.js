import Product from '../models/Product.js';

// @desc    Fetch all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const query = {};

    // Keyword search across name and description
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // In stock filter
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (req.query.sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (req.query.sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (req.query.sort === 'name-asc') {
      sortOptions = { name: 1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all product categories with count
// @route   GET /api/products/meta/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { category: 1 } }
    ]);

    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      images,
      category,
      brand,
      stock,
      specs,
      compareAtPrice,
      featured
    } = req.body;

    if (!name || price === undefined || !description || !category || stock === undefined) {
      return res.status(400).json({ message: 'Please provide name, price, description, category, and stock' });
    }

    const product = new Product({
      name,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      description,
      category,
      brand: brand || 'AeroCraft',
      stock: Number(stock),
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
      specs: specs || {},
      featured: !!featured,
      rating: 5.0,
      numReviews: 0
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name ?? product.name;
      product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
      product.compareAtPrice = req.body.compareAtPrice !== undefined ? Number(req.body.compareAtPrice) : product.compareAtPrice;
      product.description = req.body.description ?? product.description;
      product.category = req.body.category ?? product.category;
      product.brand = req.body.brand ?? product.brand;
      product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
      if (req.body.images && req.body.images.length > 0) {
        product.images = req.body.images;
      }
      if (req.body.specs) {
        product.specs = req.body.specs;
      }
      if (req.body.featured !== undefined) {
        product.featured = req.body.featured;
      }

      const updatedProduct = await product.save();
      res.json({ success: true, product: updatedProduct });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ success: true, message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};
