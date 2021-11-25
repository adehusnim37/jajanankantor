import Product from "../models/productModel.js";
import asyncHandler from 'express-async-handler';
import products from "../data/products.js";

//@description fetch all produk
//@route get api/products
//@access Public route
const getProducts = asyncHandler(async (req,res) => {
    const PageSize = 4
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
    name: {
        $regex: req.query.keyword,
        $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({... keyword})
    if(!keyword){
        console.log('Tidak ada yang pas nih')
    }else {
        const products = await Product.find ({ ...keyword}).limit(PageSize).skip(PageSize * (page -1))
        res.json({products, page, pages: Math.ceil(count / PageSize)})
    }

})

//@description fetch satuan(single) produk
//@route get api/products
//@access Public route
const getProductbyId = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id)
    if(product){
        res.json(product)
    }else {
        res.status(404)
        throw new Error('Tidak Ditemukan')
    }
})

//@description menghapus produk
//@route DELETE api/products/:id
//@access Admin/Private
const deleteProduct = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id)
    if(product){
        await product.remove()
        res.json({message: 'product telah dihapus'})
    }else {
        res.status(404)
        throw new Error('Tidak Ditemukan')
    }
})

//@description membuat produk
//@route post api/products
//@access Admin/Private
const createProduct = asyncHandler(async (req,res) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: 'images/sample.jpg',
        brand: 'samplebrand',
        category: 'Software',
        countInStock: 10,
        numReviews: 0,
        description: 'Sample'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

//@description mengubah produk
//@route PUT api/products/:id
//@access Admin/Private
const updateProduct = asyncHandler(async (req,res) => {
    const {name,price,description,image,brand,category,countInStock} = req.body

    const product = await Product.findById(req.params.id)

    if(product){
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updateProduct = await product.save()
        res.json(updateProduct)
    } else {
        res.status(404)
        throw new Error('Id Produk Tidak cocok')
    }
})

//@description membuat review
//@route POST api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async (req,res) => {
    const {rating,comment} = req.body

    const product = await Product.findById(req.params.id)

    if(product){
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        if(alreadyReviewed){
            res.status(400)
            throw new Error('Produk telah direview')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length

        product.rating = product.reviews.reduce((acc, item)=> item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(201).json({message: 'ulasan telah ditambahkan'})
    } else {
        res.status(404)
        throw new Error('Id Produk Tidak cocok')
    }
})

//@description membuat top review produk
//@route POST api/products/top-produk
//@access Private
const createTopProducts = asyncHandler(async (req,res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3)

    res.json(products)
})

export {
    getProducts, getProductbyId, deleteProduct, createProduct, updateProduct, createProductReview, createTopProducts
}