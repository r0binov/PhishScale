// TODO(developer): Set to client ID and API key from the Developer Console
//   const CLIENT_ID = '<YOUR_CLIENT_ID>';
//   const API_KEY = '<YOUR_API_KEY>';
const CLIENT_ID = '380493706161-m638vru7clq6fhmhcs847cotco1q7ve5.apps.googleusercontent.com';
const API_KEY = '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';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
        throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    // await listLabels();
    await listMessages();
    };

    if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

// messages

async function listMessages() {
    let response;
    try {
        response = await gapi.client.gmail.users.messages.list({
            'userId': 'me',
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }

    const messages = response.result.messages;
    if (!messages || messages.length == 0) {
        document.getElementById('content').innerText = 'No messages found.';
        return;
    }

    // Retrieve full message content for each message ID
    const messagePromises = messages.map(async message => {
        const messageResponse = await gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': message.id,
            'format': 'full'
        });

        // Extract message details
        const fullMessage = messageResponse.result;
        const headers = fullMessage.payload.headers;
        const messageId = fullMessage.id;
        const snippet = fullMessage.snippet;
        const sender = headers.find(header => header.name === 'From').value;
        const senderName = sender.match(/(.*) <.*>/)[1];
        const senderEmail = sender.match(/.* <(.*)>/)[1];
        const replyTo = headers.find(header => header.name === 'Reply-To');
        const replyToEmail = replyTo ? replyTo.value : '';

        return {
            messageId,
            snippet,
            senderName,
            senderEmail,
            replyToEmail,
            fullMessage
        };
    });
    const messagesWithDetails = await Promise.all(messagePromises);

    // Format output
    const output = messagesWithDetails.reduce(
        (str, message) => `${str}Message ID: ${message.messageId}\nSender: ${message.senderName} <${message.senderEmail}>\nReply-To: ${message.replyToEmail}\n\n${message.snippet}\n\n`,
        'Messages:\n\n');
    document.getElementById('content').innerText = output;
    console.log(output);
}

