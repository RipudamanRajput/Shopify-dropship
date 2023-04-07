import axios from "axios";
import prisma from "../db";

export const fetchproduct = async (req, res) => {
    var config = {
        method: 'get',
        url: 'https://dummyinfotech.myshopify.com/admin/api/2023-01/products.json?limit=250',
        headers: {
            'X-Shopify-Access-Token': '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',
            'client-id': '9a058d486bb8aa461c86c23eac5a5d88',
            'client-scrt': '59c61db92588ada74cddd491c81bb350'
        }
    };
    try {

        const findproduct = (element) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const data = prisma.product.findUnique({
                        where: { prod_id: element.id }
                    })
                    resolve(data)
                }, 100)
            })
        }

        const createProduct = async (element) => {
            await prisma.product.create({
                data: {
                    admin_graphql_api_id: element.admin_graphql_api_id,
                    body_html: element.body_html,
                    created_at: element.created_at,
                    handle: element.handle,
                    prod_id: element.id,
                    image: element.image,
                    images: element.images,
                    options: element.options,
                    status: element.status,
                    product_type: element.product_type,
                    published_at: element.published_at,
                    published_scope: element.published_scope,
                    tags: element.tags,
                    template_suffix: element.template_suffix,
                    title: element.title,
                    updated_at: element.updated_at,
                    variants: element.variants,
                    vendor: element.vendor,
                    User: { connect: { id: req.session.user.id } }
                }
            })
        }

        const makeRequest = async (nextLink) => {
            return new Promise((resolve, reject) => {

                axios(nextLink).then(async (r) => {
                    for (const element of r.data.products) {
                        const response = await findproduct(element)
                        if (!response) {
                            createProduct(element)
                        }
                    }
                    const headerLink = r.headers[('link')]
                    const match = headerLink.match(/<[^;]+\/(\w+\.json[^;]+)>;\srel="next"/);
                    const nextLink = await match ? match[1] : false;
                    if (nextLink) {
                        makeRequest({
                            method: config.method,
                            url: "https://dummyinfotech.myshopify.com/admin/api/2023-01/" + nextLink,
                            headers: config.headers
                        })
                    } else {
                        resolve(res.json({ message: "product has been uploaded" }))
                    }
                }).catch((Err) => {
                    resolve(res.json({ error: Err.message }));
                })
            })
        }
        makeRequest(config)
    } catch (error) {
        res.json({ error: error });
    }
}

export const getproducts = async (req, res) => {
    try {
        const allproducts = await prisma.product.findMany({
            where: {
                userId: req.session.user.id
            }
        })
        if (allproducts) {
            res.json({ data: allproducts })
        }
    } catch (error) {
        res.json({ error: error })
    }
}

export const getaProduct = async (req, res) => {

    try {
        const allproducts = await prisma.product.findUnique({
            where: {
                prod_id: JSON.parse(req.params.id)
            }
        })
        if (allproducts) {
            res.json({ data: allproducts })
        }
    } catch (error) {
        res.json({ error })
    }
}

export const getTotalCount = async (req, res) => {
    try {
        var config = {
            method: 'get',
            url: 'https://dummyinfotech.myshopify.com/admin/api/2023-01/products/count.json',
            headers: {
                'X-Shopify-Access-Token': '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',
                'client-id': '9a058d486bb8aa461c86c23eac5a5d88',
                'client-scrt': '59c61db92588ada74cddd491c81bb350'
            }
        };

        axios(config)
            .then(function (response) {
                res.json({ data: response.data })
            })
            .catch(function (error) {
                res.json({ error })
            });

    } catch (error) {
        res.json({ error })
    }
}

export const editProduct = async (req, res) => {
    console.log(req.body)
    try {
        const unique = await prisma.product.findUnique({
            where: {
                prod_id: JSON.parse(req.params.id)
            }
        })

        if (unique) {
            const update = await prisma.product.update({
                where: {
                    prod_id: JSON.parse(req.params.id)
                },
                data: req.body
            })
            if (update) {
                res.json({ message: "product updated" })
            }
        } else {
            res.json({ message: "product not found" })
        }

    } catch (error) {
        console.log(error)
        res.json({ error })
    }
}

export const SyncProducts = async (req, res) => {
    const fields = req.query.fields ? `?fields=${req.query.fields}` : '';

    try {

        const allproducts = await prisma.product.findMany({
            where: {
                userId: req.session.user.id
            }
        })

        const fetchstatus = async (allproducts: any) => {
            for (const elements of allproducts) {
                await getFields(elements.prod_id).then((res) => {
                    updateProducts(elements.prod_id, res['product'])
                })
            }
            res.json({ message: "Product Sync done" })
        }

        const getFields = (productid: any) => {
            return new Promise((resolve, reject) => {
                var configs = {
                    method: 'get',
                    url: 'https://dummyinfotech.myshopify.com/admin/api/2023-01/products/' + productid + '.json' + fields,
                    headers: {
                        'X-Shopify-Access-Token': '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',
                        'client-id': '9a058d486bb8aa461c86c23eac5a5d88',
                        'client-scrt': '59c61db92588ada74cddd491c81bb350'
                    },
                };
                axios(configs)
                    .then(function (response) {
                        resolve(response.data)
                    })
                    .catch(function (error) {
                        resolve(error)
                    });
            })
        }

        const updateProducts = async (productid: any, data: any) => {
            await prisma.product.update({
                where: {
                    prod_id: productid
                },
                data: data
            })
        }

        if (allproducts) {
            fetchstatus(allproducts)
        }

    } catch (error) {
        res.json({ error })
    }
}