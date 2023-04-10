import axios from "axios";

export const ConfigEtsy = async (req, res) => {

    const requestOptions = {
        method: 'GET',
        url: 'https://www.etsy.com/oauth/connect',
        headers: {
            'x-api-key': '6wl6zwoq4sveuj1ajv1pehbs',
        },
    };

    try {
        await axios(
            requestOptions
        ).then(response => {
            if (response) {

                res.send(response.data);
            } else {
                res.send("oops");
            }
        })
    } catch (error) {
        res.json({ error })
    }




}