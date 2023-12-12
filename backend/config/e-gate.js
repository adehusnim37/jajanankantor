var https = require('follow-redirects').https;
var fs = require('fs');

function createSignature(client_id, target, body, iso_timestamp, secret_key) {
    const raw_string_data = [
        `Client-Key:${client_id}`,
        `Request-Timestamp:${iso_timestamp}`,
        `Request-Target:${target}`,
        `Digest:${CryptoJS.SHA256(body).toString(CryptoJS.enc.Base64)}`
    ];
    const signature = CryptoJS.HmacSHA256(raw_string_data.join('\n'), secret_key).toString(CryptoJS.enc.Hex);
    return signature;
}
function generateSignature(jsonBody) {
    const jsonstring = JSON.stringify(jsonBody);
    const client_id = "your client id";
    const secret_key = "your client secret";
    const request_timestamp = new Date().toISOString();
    return createSignature(client_id , '/partner/create/va', jsonstring, request_timestamp, secret_key)
}
const body = {
    "expired": "2023-12-26 23:00:00",
    "amount": 40000,
    "customer_phone": "081231857418",
    "customer_email": "pay@egate.id",
    "bank_code": "008",
    "customer_name": "Test Payment",
    "remark": "test satu",
    "url_callback": "https://host_callback/dummy/merchant",
    "identifier_id": "1"
}
const signature = generateSignature(body);

var options = {
    'method': POST,
    'hostname': process.env.EGATE_HOST,
    'path': '/partner/create/qris',
    'headers': {
        'Client-key': process.env.EGATE_CLIENT_KEY,
        'Request-Timestamp': '{{request_timestamp_iso_format}}',
        'Signature': '{{signature}}'
    },
    'maxRedirects': 20
};

var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });

    res.on("error", function (error) {
        console.error(error);
    });
});

var postData =  "{\r\n    \"expired\": \"2023-12-26 23:00:00\",\r\n    \"amount\": 50000,\r\n    \"customer_phone\": \"081231857418\",\r\n    \"customer_email\": \"pay@egate.id\",\r\n    \"customer_name\": \"Test Qris\",\r\n    \"url_callback\": \"your callback url\",\r\n    \"identifier_id\": \"171\"\r\n}";

req.write(postData);

req.end();