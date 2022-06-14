const axios = require('axios');


async function getProducts() {
    try {
        const response = await axios.get('http://localhost:8080/productos/')
        console.log(response.data)
    }
    catch (err) {
        console.error(err)
    }
}


async function addProduct() {
    try {
        const response = await axios.post('http://localhost:8080/productos', {            
            "title": "medias",
            "price": 10,
            "description": "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
            "image": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
            "count": 430
        })
        console.log(await response.data)
        return response.data.id
    }
    catch (err) {
        console.error(err)
    }
}


async function updateProduct(id) {
    try {
        const response = await axios.put(`http://localhost:8080/productos/${id}`, {
            "count": 20
        })
        console.log(await response.data)
    }
    catch (err) {
        console.error(err)
    }
}


async function deleteProduct(id) {
    try {
        const response = await axios.delete(`http://localhost:8080/productos/${id}`)
        console.log(await response.data)
    }
    catch (err) {
        console.error(err)
    }
}

(async () => {
    try {
        await getProducts()
        const id = await addProduct()
        await updateProduct(id)
        await deleteProduct(id)
    }
    catch (err) {
        console.error(err)
    }
})()