import("https://apis.google.com/js/api.js").then(() => {
    gapi.load("client:auth2", () => { console.log("success") });
});

// Set up the Gmail API client
const CLIENT_ID = '532276903581-o51emkfb244rk3h50scacl02lqe82gb3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAZc32Hd67wjLNU3GCNBCUdOCqNBPQmxdQ';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'];
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
});

// Call the Gmail API to get the raw email data for a specific email
export function getEmailData(emailId) {
    gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': emailId,
        'format': 'raw'
    }).then(function (response) {
        const raw = response.result.raw;
        // Here you can do something with the raw email data
        filterEmailData(raw);
        console.log(raw);
    }, function (error) {
        console.error(error);
    });
}

function filterEmailData(rawEmailData) {

}
