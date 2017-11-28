const net = require('net');
const path = require('path');
const port = 3002;
const client = new net.Socket();
const Request = process.argv[2];
const Path = process.argv[3];

client.setEncoding('utf8');

client.connect(port, function () {
    client.write("REMOTE");
});

client.on('data', IfACK);
client.on('data', IfDEC);

function IfACK(data) {
    if (data === 'ACK') {
        if (Request === "COPY") {
            sendMessage("COPY", Path, "C");
        }
        else if (Request === "ENCODE") {
            sendMessage("ENCODE", Path, "E", "MyKey");
        }
        else if (Request === "DECODE") {
            sendMessage("DECODE", Path, "D", "MyKey");
        }
        else if (Request === "ALL") {
            sendMessage("COPY", Path, "copy-");
            sendMessage("ENCODE", Path, "encode-", "MyKey");
            sendMessage("DECODE", Path, "decode-", "MyKey");
        }1
        client.end();
    }
}

function IfDEC(data) {
    if (data === 'DEC') {
        console.log(data);
        client.destroy();
    }
}

function sendMessage(Type, Path, Prefix, key) {
    const NewName = path.dirname(Path) + '\\' + Prefix + path.basename(Path);
    const message = Type + '|' + Path + '|' + NewName + '|' + key;
    client.write(message);
    client.end();
}