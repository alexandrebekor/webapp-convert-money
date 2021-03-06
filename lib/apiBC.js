const axios = require("axios")
const moment = require('moment')

const formatList = (listAPI) => {
    try {
        // format the list
        const listFormat = Object.keys(listAPI).map(item => {
            const [code, codein] = item.split("-")
            const [name, namein] = listAPI[item].split("/")

            return { code, name, codein, namein }
        })
        // extract all coin codes
        const coinCodesAll = listFormat.map(item => item.codein)
        // filter the unique codes
        const coinCodesUnique = [...new Set(coinCodesAll)]
        coinCodesUnique.sort()

        // create a new format to each coin code
        const list = coinCodesUnique.map(code => {
            const group = {}
            group[code] = listFormat.filter(item => item.codein == code)
            return group
        })

        return list
    } catch (error) {
        return {}
    }

}

const getListCurrency = async () => {
    const response = await axios.get(`https://economia.awesomeapi.com.br/json/available`).then(response => response.data)

    const list = formatList(response)

    return {
        list
    }
}

const getDataAPI = (to, from) => {
    const coin = `${to}-${from}`
    const url = `https://economia.awesomeapi.com.br/last/${coin}`
    return axios.get(url)
}

const getQuotation = async (to, from) => {

    try {
        const response = await getDataAPI(to, from)

        const {
            code,
            codein,
            name,
            ask,
            create_date
        } = await response.data[to + from]

        return {
            code,
            ask,
            last_update: moment(create_date, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY")
        }
    } catch (error) {
        return {
            message: 'API falhando! Nosso time já está sendo avisado...'
        }
    }
}

module.exports = {
    getQuotation,
    getListCurrency
}