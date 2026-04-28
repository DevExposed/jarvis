

const API_KEY = 'YOUR_BING_SEARCH_API_KEY'; 
const endpoint = 'https://api.bing.microsoft.com/v7.0/search';

const YOUTUBE_API_KEY = 'Your youtube api key'; 
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';




const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

// wish me 

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Sir..");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Boss..");
    } else {
        speak("Good Evening Sir..");
    }
}

window.addEventListener('load', () => {
    speak("Arvind sir, How are you?");
    wishMe();
});

// speech recognition setup

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    content.textContent = transcript;  
    await handleQuestion(transcript);  
};

btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});

async function fetchAnswer(query) {
    try {
        const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`, {
            headers: { 'Ocp-Apim-Subscription-Key': API_KEY }
        });
        const data = await response.json();
        const answer = data.webPages.value[0]?.snippet || "Sorry, I couldn't find an answer.";
        return answer;
    } catch (error) {
        return "There was an error fetching the answer. make more intelligent arvind sir";
    }
}


// Math calculations

async function handleQuestion(message) {
    const question = message.toLowerCase().trim();

    
    try {
        const mathExpression = question.replace(/[^-()\d/*+.]/g, "").trim();
        const mathResult = eval(mathExpression);

        if (!isNaN(mathResult)) {
            speak(`The answer is ${mathResult}`);
            return;
        }
    } catch (error) {
        // Ignore math errors
    }

    // Song play
    if (question.includes('jarvis play')) {
        const song = question.replace('jarvis play', '').trim();
        playMusic(song);
        return;
    }

    // Date
    if (question.includes('date') || question.includes('what is the date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric" });
        speak("Today's date is " + date);
        return;
    }

    // Time
    if (question.includes('time') || question.includes('what time is it')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric", hour12: true });
        speak("The time is " + time);
        return;
    }

    // if(question.includes('hello jarvis') || question.includes('hi jarvis') || question.includes('hey jarvis')) {
    //     speak('Hello, how can I assist you today?');
    //     return;
    //     }

    // Commands
    if (question.includes('hello') || question.includes('hi')) {
        speak("Hello Sir, How May I Help You?");
    } else if (question.includes('open google')) {
        speak("Opening Google...");
        openWebsite("https://www.google.com");
    } else if (question.includes('open linkedin')) {
        speak("Opening LinkedIn...");
        openWebsite("https://www.linkedin.com/feed/");
    } else if (question.includes('open github')) {
        speak("Opening GitHub...");
        openWebsite("https://github.com/");
    } else if (question.includes('youtube')) {
        speak("Opening YouTube...");
        openWebsite("https://www.youtube.com");
    } else if (question.includes('open whatsapp')) {
        speak("Opening WhatsApp...");
        openWebsite("https://web.whatsapp.com");
    } else if (question.includes('calculator')) {
        speak("Opening Calculator...");
        openWebsite("https://www.google.com/search?q=online+calculator");
    } else if (question.includes('open')) {
        const website = question.replace('open ', '');
        speak("Opening " + website);
        openWebsite("https://www." + website + ".com");
    } else if (question.includes('tell me about')) {
        const person = question.replace('tell me about ', '');
        speak("Searching information about " + person);
        searchPerson(person); 
    } else {
        const answer = await fetchAnswer(question);
        speak(answer);
    }
}


function openWebsite(url) {
    setTimeout(() => {
        window.open(url, "_blank");
    }, 1000);
}

function searchPerson(person) {
    const url = `https://www.google.com/search?q=${person}`;
    openWebsite(url);
}

// play song 

async function playMusic(song) {
    const query = encodeURIComponent(song);
    const url = `${YOUTUBE_SEARCH_URL}?part=snippet&q=${query}&key=${YOUTUBE_API_KEY}&type=video`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const videoId = data.items[0]?.id?.videoId;
        if (videoId) {
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            window.open(videoUrl, '_blank');
            speak(`Playing ${song} on YouTube.`);
        } else {
            speak('Sorry, I could not find the video for that song.');
        }
    } catch (error) {
        speak('There was an error fetching the video.');
    }
}
// end song




async function askJarvis(question) {
    const openAi_Key = 'your open api key';

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAi_Key}`
            },
            body: JSON.stringify({
                model: "text-davinci-003", 
                prompt: question,
                max_tokens: 150
            })
        });

        const data = await response.json();
        return data.choices[0].text.trim(); 
    } catch (error) {
        console.error("Error fetching from OpenAI:", error);
        return "Sorry, I couldn't fetch an answer right now.";
    }
}

