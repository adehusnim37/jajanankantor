import axios from "axios";
import CryptoJS from 'crypto-js';
import moment from "moment";
export async function createTransactionQris (userOrder, orderId){
    console.log(userOrder)
    console.log(`${process.env.URL_BACKEND}/api/orders/webhook/qris`)
    const body = {
        expired: moment(userOrder.expired_time).format('YYYY-MM-DD HH:mm:ss'),
        amount: userOrder.price,
        customer_phone: String(userOrder.telpon),
        customer_email: userOrder.email,
        customer_name: userOrder.name,
        url_callback: `${process.env.URL_BACKEND}/api/orders/webhook/qris`,
        identifier_id: orderId,
    }
    try {
        const resultVa = await axios.post(`${process.env.EGATE_HOST}/partner/create/qris`,
            body,
            {
                headers: {
                    'Client-key': process.env.EGATE_CLIENT_KEY,
                    'Request-Timestamp': new Date().toISOString(),
                    'Signature': await generateSignature(body)
                }
            }
        )
        return resultVa.data
    } catch (e) {
        console.log(e.response.data)
    }

}

async function generateSignature(jsonBody) {
    const request_target = '/partner/create/qris';
    const jsonstring = JSON.stringify(jsonBody);
    const client_id = process.env.EGATE_CLIENT_KEY;
    const secret_key = process.env.EGATE_SECRET_KEY;
    const request_timestamp = new Date().toISOString();
    return createSignatureVA(client_id , request_target, jsonstring, request_timestamp, secret_key)
}

async function createSignatureVA (client_id, target, body, iso_timestamp, secret_key) {
    const raw_string_data = [
        `Client-Key:${client_id}`,
        `Request-Timestamp:${iso_timestamp}`,
        `Request-Target:${target}`,
        `Digest:${CryptoJS.SHA256(body).toString(CryptoJS.enc.Base64)}`,
    ];
    const signature = CryptoJS.HmacSHA256(raw_string_data.join('\n'), secret_key).toString(CryptoJS.enc.Hex);
    return signature;
}