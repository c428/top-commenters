// list of commenters' channels
const channels = [
  "UCPW_cNzrDSf0xejLOKvV7Cg", // pi
  "UC775DwuDDYTrMRNzAcjcVbw", // MrNoName
  "UCBWMFqHUUcF1NHdLMUhLpEQ", // Headless Commenter
  "UC-eHa-b4udma8bGlpPxWB7A", // Dong
  "UCeDSghsyAtM2B1WezvMcOXw", // GreatBritainTEA
  "UCK83UhfcEsWAzAxuUgZYnwg", // Earth Commenter
  "UCtkbSqvw_gSWnY4vLpYtK6A", // Happwer
  "UClFDTPiMwDQpppSO-gnkFAQ", // HeisenbergFam
  "UCiTfB-A55Vq2fB610vaWJVA", // Justin Y
  "UC3BLNSNwSVYeH_-Y52FE6fg", // thatonekid
  "UC3RIcfnBQinhnhKHCIEA16Q", // Just Some Guy without a Mustache
  "UCiBwUTzU7RmyY-T8C6bE5cQ", // NeoRacer
];

// utility functions
const numberWithCommas = x => x.toLocaleString("en-US");

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// main fetch and render
async function fetchData() {
  const loading = document.getElementById("Loading");
  const clist = document.getElementById("clist");
  const top3 = document.getElementById("top3");

  // reset UI
  clist.innerHTML = "";
  clist.style.display = "none";
  top3.style.display = "none";
  loading.style.display = "block";
  loading.textContent = "Fetching channel data...";

  try {
    const results = await Promise.allSettled(
      channels.map(async (id) => {
        const res = await fetch(`https://backend.mixerno.space/api/youtube/estv3/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${id}`);
        const data = await res.json();
        const info = data.items?.[0];
        if (!info) throw new Error("Missing data");
        return {
          id,
          name: info.snippet.title,
          subs: Number(info.statistics.subscriberCount) || 0,
          pfp: info.snippet.thumbnails.default.url,
        };
      })
    );

    const validResults = results
      .filter(r => r.status === "fulfilled")
      .map(r => r.value)
      .sort((a, b) => b.subs - a.subs);

    if (validResults.length === 0) {
      loading.textContent = "No valid data found. Try refreshing the page.";
      return;
    }

    // show top 3 separately
    renderTop3(validResults.slice(0, 3));

    // render the rest
    renderList(validResults.slice(3));

  } catch (err) {
    console.error("Error fetching channels:", err);
    loading.textContent = "Something went wrong while fetching data.";
  } finally {
    loading.style.display = "none";
    clist.style.display = "flex";
    top3.style.display = "flex";
  }
}

// render top 3
function renderTop3(top) {
  const [first, second, third] = top;

  const firstDiv = document.getElementById("first");
  const secondDiv = document.getElementById("second");
  const thirdDiv = document.getElementById("third");

  const makeHTML = (ch, rank) => `
    <a href="https://www.youtube.com/channel/${ch.id}" target="_blank" rel="noopener noreferrer">
      <img class="pfp" src="${ch.pfp}" alt="${ch.name}" />
    </a>
    <p style="margin:0;font-weight:700;">${rank}. ${ch.name}</p>
    <p style="margin:0;margin-top:0.3vw;font-size:1.5vw;font-weight:800;">
      ${numberWithCommas(ch.subs)}
    </p>
  `;

  firstDiv.innerHTML = makeHTML(first, "🥇 1st");
  secondDiv.innerHTML = makeHTML(second, "🥈 2nd");
  thirdDiv.innerHTML = makeHTML(third, "🥉 3rd");
}

// render the rest of the channels
function renderList(channels) {
  const clist = document.getElementById("clist");
  clist.innerHTML = "";

  channels.forEach((ch, i) => {
    const div = document.createElement("div");
    div.className = "ui";
    div.innerHTML = `
      <a href="https://www.youtube.com/channel/${ch.id}" target="_blank" rel="noopener noreferrer">
        <img class="pfp" src="${ch.pfp}" alt="${ch.name}" />
      </a>
      <div class="channelinfo">
        <p style="margin:0;">${getOrdinal(i + 4)}. ${ch.name}</p>
        <p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">
          ${numberWithCommas(ch.subs)}
        </p>
      </div>
    `;
    clist.appendChild(div);
  });
}

// run on load
document.addEventListener("DOMContentLoaded", fetchData);
