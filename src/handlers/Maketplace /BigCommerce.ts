import axios from "axios";
import prisma from "../../db";

const Shopdetail: any = (info: any) => {
    return new Promise((resolve) => {
        try {
            const data = prisma.config.findFirst({
                where: {
                    userId: info
                }
            })
            resolve(data)
        } catch (error) {
            resolve(error)
        }
    })
}

export const fetchproduct = async (req, res) => {
    Shopdetail(req.session.user.id).then((response) => {
        if (response.Shop_name) {
            var config = {
                method: 'get',
                url: `https://${response.Shop_name}/admin/api/2023-01/products.json?limit=250`,
                headers: {
                    'X-Shopify-Access-Token': response.token,
                    'client-id': response.Client_id,
                    'client-scrt': response.Client_scrt
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
        } else {
            res.json({ message: "Kindly provide Shop credentials " })
        }
    })
}