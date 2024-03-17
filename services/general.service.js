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

const GeneralService = {
    login
};
export default GeneralService;
