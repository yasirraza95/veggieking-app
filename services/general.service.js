import axios from "axios";

// const API_URL = "http://localhost/veggieking-api";
const API_URL = "https://api.veggieking.pk/public";

const login = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.post(
        `${API_URL}/login/user`,
        {
            phone: values.phone,
            password: values.password,
        },
        {
            headers: headers,
        }
    );
};

const register = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.post(
        `${API_URL}/user-register`,
        {
            name: values.name,
            address: values.address,
            phone: values.phone,
            email: values.email,
            password: values.password,
        },
        {
            headers: headers,
        }
    );
};

const forgot = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.post(
        `${API_URL}/forgot`,
        {
            phone: values.phone,
        },
        {
            headers: headers,
        }
    );
};

const checkForgotToken = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.post(
        `${API_URL}/check-forgot/${values.token}`,
        {
            headers: headers,
        }
    );
};
const showProfile = (accessToken) => {
    return axios.get(`${API_URL}/profile`, {
      headers: authHeader(accessToken),
    });
  };
const locationUpdate = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.put(
        `${API_URL}/location-update]${values.id}`,
        {
            latitude: values.latitude,
            longitude: values.longitude,
        },
        {
            headers: headers,
        }
    );
};

const smsVerification = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/sms-verify/${values.id}/${values.code}`,
        {
            headers: headers,
        }
    );
};

const emailVerification = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/email-verify/${values.id}/${values.code}`,
        {
            headers: headers,
        }
    );
};

const listCartByUserId = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/list-cart/${values.id}`,
        {
            headers: headers,
        }
    );
};

const increaseQty = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.put(
        `${API_URL}/increase-quantity`, {
        created_by: values.user_id,
        prod_id: values.prod_id,
    },
        {
            headers: headers,
        }
    );
};

const decreaseQty = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.put(
        `${API_URL}/decrease-quantity`, {
        created_by: values.user_id,
        prod_id: values.prod_id,
    },
        {
            headers: headers,
        }
    );
};

const deleteCart = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.delete(
        `${API_URL}/delete-cart`, {
        created_by: values.user_id,
        prod_id: values.prod_id,
    },
        {
            headers: headers,
        }
    );
};

const fetchProductByType = (type) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/fetch-product-by-type/${type}`,
        {
            headers: headers,
        }
    );
};

const listAllProducts = () => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/list-product`,
        {
            headers: headers,
        }
    );
};

const addProduct = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.post(
        `${API_URL}/add-product`, {
        name: values.name,
        image: values.image,
        price: values.price,
        type: values.type,
        created_by: values.user_id,
    },
        {
            headers: headers,
        }
    );
};

const updateProduct = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.post(
        `${API_URL}/update-product/${values.id}`, {
        name: values.name,
        image: values.image,
        price: values.price,
        type: values.type,
        updated_by: values.user_id,
    },
        {
            headers: headers,
        }
    );
};

const deleteProduct = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.delete(
        `${API_URL}/delete-product`, {
        prod_id: values.prod_id,
        admin_id: values.user_id,
    },
        {
            headers: headers,
        }
    );
};

const placeOrder = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.post(
        `${API_URL}/place-order/${values.user_id}`, {
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
    },
        {
            headers: headers,
        }
    );
};

const listAllOrders = () => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/list-orders`,
        {
            headers: headers,
        }
    );
};

const listOrdersByUserIdandStatus = (status, userId) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/list-orders-user/${status}/${userId}`,
        {
            headers: headers,
        }
    );
};

const listOrdersByUserIdOngoing = (userId) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/list-orders-user-ongoing/${userId}`,
        {
            headers: headers,
        }
    );
};

const listOrdersByUserIdHistory = (userId) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/list-orders-user-history/${userId}`,
        {
            headers: headers,
        }
    );
};

const listOrdersDetailByOrderId = (id) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/list-order-dtl/${id}`,
        {
            headers: headers,
        }
    );
};

const updateOrderStatus = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.post(
        `${API_URL}/order-status/${values.order_id}/${values.status}`,
        {
            headers: headers,
        }
    );
};

const orderInfoById = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/order-info/${values.id}`,
        {
            headers: headers,
        }
    );
};

const orderInfoForPrintById = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/order-info-print/${values.id}`,
        {
            headers: headers,
        }
    );
};

const updateOrderInfoById = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.put(
        `${API_URL}/order-status/${values.id}`, {
        custom_field: values.custom_field,
        custom_note: values.custom_note,
        created_at: values.created_at,
    },
        {
            headers: headers,
        }
    );
};

const listAllRiders = () => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/list-user/rider`,
        {
            headers: headers,
        }
    );
};

const assignOrderToRider = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.put(
        `${API_URL}/order-rider`, {
        rider_id: values.rider_id,
        order_id: values.order_id,
        admin_id: values.admin_id,
    },
        {
            headers: headers,
        }
    );
};

const listAssignedOrderByRiderId = (values) => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/list-rider-order/${values.id}`,
        {
            headers: headers,
        }
    );
};

const sendNotification = () => {
    const headers = {
        "Content-Type": "application/json",
    };
    return axios.get(
        `${API_URL}/send-notification`,
        {
            headers: headers,
        }
    );
};

const GeneralService = {
    login, register, forgot, checkForgotToken,showProfile, locationUpdate, smsVerification, emailVerification, listCartByUserId, increaseQty, decreaseQty,
    deleteCart, fetchProductByType, listAllProducts, addProduct, updateProduct, deleteProduct, placeOrder, listAllOrders, listOrdersByUserIdandStatus,
    listOrdersDetailByOrderId, updateOrderStatus, orderInfoById, orderInfoForPrintById, updateOrderInfoById, listAllRiders, assignOrderToRider,
    listAssignedOrderByRiderId, sendNotification, listOrdersByUserIdOngoing, listOrdersByUserIdHistory
};
export default GeneralService;
