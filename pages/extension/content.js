const apiKey = "";
const completionsEndpoint = 'https://api.openai.com/v1/completions';

const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', () => {
  const inputText = document.getElementById('inputText').value;
  generateCompletion(apiKey, completionsEndpoint, inputText);
});

function generateCompletion(apiKey, completionsEndpoint, inputText) {
  const data = JSON.stringify({
    prompt: `Scan the text or website ${inputText} and provide a summary of how suspicious it appears:`,
    max_tokens: 50,
    model: "text-davinci-003",
    temperature: 0.5
  });

  const httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        const response = JSON.parse(httpRequest.responseText);

        if (response.hasOwnProperty('choices') && response.choices.length > 0) {
            let completion = response.choices[0].text;

            completion = completion.replace(/legitimate/g, '<b style="color:green;">legitimate</b>');
            completion = completion.replace(/trustworthy/g, '<b style="color:green">trustworthy</b>');
            completion = completion.replace(/suspicious/g, '<b style="color:red">suspicious</b>');
            completion = completion.replace(/illegitimate/g, '<b style="color:red;">illegitimate</b>');
            completion = completion.replace(/not/g, '<b style="color:black;">NOT</b>');

            // Print the generated completion to the console
            console.log(completion);
            // Populate the <p/> with the colored completion
            const result = document.getElementById("result");
            result.innerHTML = completion;
        } else {
          console.error(`Error generating completion: ${response.error.message}`);
        }
      } else {
        console.error(`Error sending HTTP request: ${httpRequest.statusText}`);
      }
    }
  };

  httpRequest.open('POST', completionsEndpoint);
  httpRequest.setRequestHeader('Content-Type', 'application/json');
  httpRequest.setRequestHeader('Content-Length', data.length);
  httpRequest.setRequestHeader('Authorization', `Bearer ${apiKey}`);

  httpRequest.send(data);
}

