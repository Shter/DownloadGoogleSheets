const fs = require('fs');
const path = require('path');
const os = require('os');
const uuid = require('uuid');
const readline = require('readline');
const {google} = require('googleapis');
const googleAuth = require('google-auth-library');
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const TOKEN_DIR = './.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';
const Names = ['1yLZB6HqMfRecF9NOkE06nEoSl8y6ZpFtnRTC_Fpz6lk','1yX53qPWrgycVs1LvYTin-U3hMU6jfrqcrigOZGVMGbQ'];

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }

    authorize(JSON.parse(content), (oauth2Client) => {
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });
    for (let i=0; Names.length - 1 >= i; i++) {
        downloadFile(drive, Names[i], () => {
            console.log('test file donwloaded');
});}
});
});

function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

function downloadFile (drive, fileId, callback) {
    const filePath = path.join(__dirname, 'test' + uuid.v4() + '.xlsx');
    console.log(`writing to ${filePath}`);
    const dest = fs.createWriteStream(filePath);
    let progress = 0;
    drive.files.export({
        fileId: fileId,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }, {
        responseType: 'stream',
        encoding: null,
    },function(err, response){
        if(err) throw err;

        response.data.on('error', err => {
            console.error('Error downloading file.');
        throw err;
    }).on('end', ()=>{
            console.log('Done downloading file.');
        callback(filePath);
    })
    .pipe(dest);
    });
}