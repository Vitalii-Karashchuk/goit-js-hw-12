import axios from "axios";

export const searchApi = (searchData, page) => {
        const axiosOption = {
           params: {
                key: "48272938-5d16b358faf0ec3baa9736196",
                q: searchData,
                page: page,
                per_page: 15,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
           } 
        };

        return axios.get(`https://pixabay.com/api/`, axiosOption);

    };