import api from "./axios";

const fetchUser = async () => {
    const response = await api.get('/users/');
    return response.data;
}

export default fetchUser