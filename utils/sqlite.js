import { openDatabase } from 'expo-sqlite';
const db = openDatabase('veggieking.db');

if (!db) {
    console.error('Failed to open database');
}

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, prodId INTEGER, quantity INTEGER)',
        [],
        () => console.log('Cart table created'),
        (_, error) => console.error('Error creating cart table:', error)
    );
});

// db.transaction(tx => {
//     tx.executeSql(
//         'DROP TABLE IF EXISTS products',
//         [],
//         () => {
//             console.log('Products table dropped');
//             // After dropping the table, create a new one
//             // createProductsTable(tx);
//         },
//         (_, error) => console.error('Error dropping products table:', error)
//     );
// });

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, catId INTEGER, name STRING, image STRING, price INTEGER)',
        [],
        () => console.log('Products table created'),
        (_, error) => console.error('Error creating products table:', error)
    );
});

export const syncProducts = async (serverProducts) => {
    try {
        // console.log("syncing");
        await db.transaction(async (tx) => {
            for (const product of serverProducts) {
                const { id, catId, name, price, image } = product;
                console.log(product);
                // Check if the product with the same ID already exists in the local table
                // const [existingProduct] = await tx.executeSql(
                //     'SELECT * FROM products WHERE id = ?',
                //     [id]
                // );

                tx.executeSql(
                    'SELECT * FROM items WHERE id = ?',
                    [id],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            console.log("asdsdd");
                            tx.executeSql(
                                'UPDATE items SET catId = ?, name = ?, image = ?, price = ? WHERE id = ?',
                                [name, catId, image, price, id],
                                (_, { rows }) => {
                                    console.log("Products updated");
                                },
                                (_, error) => console.error('Error adding item to products:', error)
                            );
                        } else {
                            tx.executeSql(
                                'INSERT INTO items (id, catId, name, price, image) VALUES (?, ?, ?, ?, ?)',
                                [id, catId, name, price, image],
                                (_, { rows }) => {
                                    console.log("Products added");
                                },
                                (_, error) => console.error('Error adding item to products:', error)
                            );
                        }
                    },
                    (_, error) => console.error('Error adding item to products:', error)
                );
            }
        });

        // Return success response
        return { response: 'Products synced successfully', status: 200 };
    } catch (error) {
        console.error('Error syncing products:', error);
        // Return error response
        return { response: 'Error syncing products', status: 500 };
    }
};

export const addToCart = (prodId) => {
    db.transaction(
        tx => {
            tx.executeSql(
                'SELECT * FROM cart WHERE prodId = ?',
                [prodId],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        // Product already exists in the cart, increase quantity
                        const quantity = rows.item(0).quantity;
                        const newQty = quantity + 1;
                        tx.executeSql(
                            'UPDATE cart SET quantity = ? WHERE prodId = ?',
                            [newQty, prodId],
                            () => console.log('Quantity increased'),
                            (_, error) => console.error('Error updating quantity:', error)
                        );
                    } else {
                        // Product not in cart, insert new entry
                        tx.executeSql(
                            'INSERT INTO cart (prodId, quantity) VALUES (?, ?, ?)',
                            [prodId, 1],
                            () => console.log('Item added to cart'),
                            (_, error) => console.error('Error adding item to cart:', error)
                        );
                    }
                },
                (_, error) => console.error('Error checking cart:', error)
            );
        },
        error => console.error('Transaction error:', error)
    );
};

export const listCart = async () => {
    try {
        // Execute SQL transaction to list cart items
        const cartItems = [];
        const results = [];
        await db.transaction(async (tx) => {
            // Retrieve cart items for the given userId
            // const [result] = await tx.executeSql('SELECT * FROM cart');

            // console.log(`cart-query=${result}`);

            // try {
            //     const { rows } = await tx.executeSql('SELECT * FROM cart');
            //     const data = rows._array; // Extract the array data from the query result
            //     console.log(data);
            //     // setCartItems(data); // Update the state with the array data
            // } catch (error) {
            //     console.error('Error executing SQL:', error);
            // }


            try {
                await tx.executeSql('SELECT * FROM items', [], (_, result) => {
                    const { rows } = result;
                    console.log(`success-results=${JSON.stringify(rows)}`);

                    for (let i = 0; i < rows.length; i++) {
                        const row = rows._array[i];
                        console.log(`row=${JSON.stringify(row.id)}`);
                        // Retrieve product details for each cart item
                        tx.executeSql('SELECT * FROM items', [], (_, result) => {
                            console.log(`products=${JSON.stringify(result)}`);
                            // const { rows } = result;
                            // console.log(`success-results=${JSON.stringify(rows)}`);

                            for (let i = 0; i < rows.length; i++) {
                                const row = rows._array[i];
                                console.log(`row=${JSON.stringify(row.id)}`);
                                //     // Retrieve product details for each cart item
                                // await tx.executeSql(
                                //     'SELECT * FROM products WHERE id = ?',
                                //     [row.prodId]
                                // );
                                //     if (product.rows.length > 0) {
                                //         // Product found, add details to cart item
                                //         const productDetails = product.rows.item(0);
                                //         cartItems.push({
                                //             id: row.id,
                                //             prodId: row.prodId,
                                //             quantity: row.quantity,
                                //             product_name: productDetails.name,
                                //             product_image: productDetails.image,
                                //             product_price: productDetails.price,
                                //         });
                                //     }
                            }
                        }, (_, error) => {
                            console.error('Error executing products SQL:', error);
                        });
                    }
                }, (_, error) => {
                    console.error('Error executing cart SQL:', error);
                });
            } catch (err) {
                console.log(err);
            }

            // console.log(`cart-result=${rows}`);

            // Iterate through the cart items
            // for (let i = 0; i < result.rows.length; i++) {
            //     const row = result.rows.item(i);
            //     // Retrieve product details for each cart item
            //     const [product] = await tx.executeSql(
            //         'SELECT * FROM products WHERE id = ?',
            //         [row.prodId]
            //     );
            //     if (product.rows.length > 0) {
            //         // Product found, add details to cart item
            //         const productDetails = product.rows.item(0);
            //         cartItems.push({
            //             id: row.id,
            //             prodId: row.prodId,
            //             quantity: row.quantity,
            //             product_name: productDetails.name,
            //             product_image: productDetails.image,
            //             product_price: productDetails.price,
            //         });
            //     }
            // }
        });

        // if (cartItems.length > 0) {
        //     return { response: cartItems, status: 200 };
        // } else {
        //     const error = new Error('No items in cart');
        //     error.status = 404;
        //     throw error;
        // }
    } catch (error) {
        error.status = 500;
        throw error;
    }
};


// Other functions...
