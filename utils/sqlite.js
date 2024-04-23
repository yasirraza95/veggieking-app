import { openDatabase } from 'expo-sqlite';
const db = openDatabase('app.db');

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
//         'DROP TABLE IF EXISTS items',
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
                // console.log(product);
                tx.executeSql(
                    'SELECT * FROM items WHERE id = ?',
                    [id],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            // console.log("asdsdd");
                            tx.executeSql(
                                'UPDATE items SET catId = ?, name = ?, image = ?, price = ? WHERE id = ?',
                                [catId, name, image, price, id],
                                (_, { rows }) => {
                                    // console.log("Products updated");
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

export const decreaseQty = (prodId) => {
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

export const addToCart = (prodId) => {
    db.transaction(
        tx => {
            tx.executeSql(
                'SELECT * FROM cart WHERE prodId = ?',
                [prodId],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        const quantity = rows.item(0).quantity;
                        const newQty = quantity + 1;
                        tx.executeSql(
                            'UPDATE cart SET quantity = ? WHERE prodId = ?',
                            [newQty, prodId],
                            () => console.log('Quantity increased'),
                            (_, error) => console.error('Error updating quantity:', error)
                        );
                    } else {
                        tx.executeSql(
                            'INSERT INTO cart (prodId, quantity) VALUES (?, ?)',
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

export const deleteToCart = (prodId) => {
    db.transaction(
        tx => {
            tx.executeSql(
                'SELECT * FROM cart WHERE prodId = ?',
                [prodId],
                (_, { rows }) => {
                    tx.executeSql(
                        'DELETE FROM cart WHERE prodId = ?',
                        [prodId],
                        () => console.log('Cart deleted'),
                        (_, error) => console.error('Error deleting cart:', error)
                    );
                },
                (_, error) => console.error('Error checking cart:', error)
            );
        },
        error => console.error('Transaction error:', error)
    );
};

export const clearCart = () => {
    db.transaction(
        tx => {
            tx.executeSql(
                'DELETE FROM cart',
                [],
                (_, { rows }) => {
                    console.log("cart cleared");
                },
                (_, error) => console.error('Error clearing cart:', error)
            );
        },
        error => console.error('Transaction error:', error)
    );
};

export const increaseQty = (prodId) => {
    db.transaction(
        tx => {
            tx.executeSql(
                'SELECT * FROM cart WHERE prodId = ?',
                [prodId],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        const quantity = rows.item(0).quantity;
                        if (quantity >= 2) {
                            const newQty = quantity - 1;
                            tx.executeSql(
                                'UPDATE cart SET quantity = ? WHERE prodId = ?',
                                [newQty, prodId],
                                () => console.log('Quantity increased'),
                                (_, error) => console.error('Error updating quantity:', error)
                            );
                        }
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
        return new Promise((resolve, reject) => {
            const cartItems = [];
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        'SELECT cart.id, cart.prodId, cart.quantity, items.name, items.image, items.price ' +
                        'FROM cart ' +
                        'INNER JOIN items ON cart.prodId = items.id',
                        [],
                        (_, result) => {
                            const { rows } = result;
                            for (let i = 0; i < rows.length; i++) {
                                const row = rows.item(i);

                                cartItems.push({
                                    cartId: row.id,
                                    productId: row.prodId,
                                    quantity: row.quantity,
                                    productName: row.name,
                                    productImage: row.image,
                                    productPrice: row.price,
                                });
                            }
                            resolve(cartItems);
                        },
                        (_, error) => {
                            console.error('Error executing SQL:', error);
                            reject(error);
                        }
                    );
                },
                (error) => {
                    console.error('Transaction error:', error);
                    reject(error);
                }
            );
        });
    } catch (error) {
        console.error('Error in listCart:', error);
        throw error;
    }
};

export const cartCounting = async () => {
    try {
        return new Promise((resolve, reject) => {
            const cartItems = [];
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        'SELECT COUNT(prodId) AS cart_count FROM cart',
                        [],
                        (_, result) => {
                            console.log(result);
                            const { rows } = result;
                            const cartCount = rows.item(0).cart_count;
                            resolve(cartCount);
                        },
                        (_, error) => {
                            console.error('Error executing SQL:', error);
                            reject(error);
                        }
                    );
                },
                (error) => {
                    console.error('Transaction error:', error);
                    reject(error);
                }
            );
        });
    } catch (error) {
        console.error('Error in cartCounter:', error);
        throw error;
    }
};


