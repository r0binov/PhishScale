async function gptScript () {

  // Initialize a new XMLHttpRequest object to send HTTP requests
const httpRequest = new XMLHttpRequest();

// Replace the API key below with your own key
const apiKey = "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";
const completionsEndpoint = 'https://api.openai.com/v1/completions';

// Initialize readline interface for command-line input
const website = prompt('Enter the text or URL, which you would like scan:');

// Initialize the data to send in the HTTP request
const data = JSON.stringify({
  prompt: `Scan the website ${website} and provide a summary of how suspicious it appears:`,
  max_tokens: 50,
  model: "text-davinci-003",
  temperature: 0.5
});

// Send the HTTP request to the OpenAI completions endpoint
httpRequest.onreadystatechange = function() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      // Parse the response body as JSON
      const response = JSON.parse(httpRequest.responseText);

      if (response.hasOwnProperty('choices') && response.choices.length > 0) {
        // Print the generated completion to the console
        console.log(response.choices[0].text);
      } else {
        console.error(`Error generating completion: ${response.error.message}`);
      }
    } else {
      console.error(`Error sending HTTP request: ${httpRequest.statusText}`);
    }

    // Close the readline interface
    rl.close();
  }
};

// Initialize the HTTP request options
httpRequest.open('POST', completionsEndpoint);
httpRequest.setRequestHeader('Content-Type', 'application/json');
httpRequest.setRequestHeader('Content-Length', data.length);
httpRequest.setRequestHeader('Authorization', `Bearer ${apiKey}`);

// Send the data in the HTTP request body
httpRequest.send(data);
}
if(window.location.pathname.includes === "https://mail.google.com/mail/u/0/#inbox/") {
  gptScript();
}


