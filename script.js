// list of commenters' channels
const channels = [
  "UCPW_cNzrDSf0xejLOKvV7Cg", // pi
  "UC775DwuDDYTrMRNzAcjcVbw", // MrNoName
  "UCBWMFqHUUcF1NHdLMUhLpEQ", // Headless Commenter
  "UCgom_YXc5tgNrx9ytccu9Xg", // Angel Niko
  "UC-eHa-b4udma8bGlpPxWB7A", // Dong
  "UCpT57JyuQSrTvLhquVT096Q", // Shadow
  "UCeDSghsyAtM2B1WezvMcOXw", // GreatBritainTEA
  "UCK83UhfcEsWAzAxuUgZYnwg", // Earth Commenter
  "UClFDTPiMwDQpppSO-gnkFAQ", // HeisenbergFam
  "UCiTfB-A55Vq2fB610vaWJVA", // Justin Y
  "UC3RIcfnBQinhnhKHCIEA16Q", // Just Some Guy without a Mustache
  "UCJXhCTH64vJAPlB6ZoS2KZA", // watercat
  "UCu7uCS2gni38qUtYJshHJ0A", // Xavier
  "UCwJ55XnPUxSLTCwu-WydD3g", // SAVAGE COMMENTER
];

// utils
const numberWithCommas = x => x.toLocaleString("en-US");
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// global cache
let channelData = [];

// fetch data
async function fetchData(isUpdate = false) {
  const loading = document.getElementById("Loading");
  const clist = document.getElementById("clist");

  if (!isUpdate) {
    clist.innerHTML = "";
    clist.style.display = "none";
    loading.style.display = "block";
    loading.textContent = "Fetching channel data...";
  }

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
          name: info.snippet.title === null ? "" : info.snippet.title,
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

    channelData = validResults;

    if (!isUpdate) {
      renderList(validResults);
      loading.style.display = "none";
      clist.style.display = "flex";
    } else {
      updateSubs(validResults);
    }

  } catch (err) {
    console.error("Error fetching channels:", err);
    if (!isUpdate) loading.textContent = "Something went wrong while fetching data.";
  }
}

// render all channels
function renderList(channels) {
  const clist = document.getElementById("clist");
  clist.innerHTML = "";

  const topColors = [
    "linear-gradient(90deg, #a2770a, #eec600)",
    "linear-gradient(90deg, #3d3d3f, #606067)",
    "linear-gradient(90deg, #421e08, #67330d)"
  ];

  channels.forEach((ch, i) => {
    const div = document.createElement("div");
    div.className = "ui";
    
    if (i < 3) {
      div.style.background = topColors[i];
      div.classList.add("top3highlight");
    }

    div.innerHTML = `
      <a href="https://www.youtube.com/channel/${ch.id}" target="_blank" rel="noopener noreferrer">
        <img class="pfp" src="${ch.pfp}" alt="${ch.name}" />
      </a>
      <div class="channelinfo">
        <p>${getOrdinal(i + 1)}. ${ch.name}</p>
        <p class="odometer" id="subs-${ch.id}">
          ${numberWithCommas(ch.subs)}
        </p>
      </div>
    `;
    clist.appendChild(div);
  });
}

// only update subscriber counts
function updateSubs(channels) {
  channels.forEach(ch => {
    const subEl = document.getElementById(`subs-${ch.id}`);
    if (subEl) subEl.textContent = numberWithCommas(ch.subs);
  });
}

// run on load + set 5-second refresh
document.addEventListener("DOMContentLoaded", async () => {
  await fetchData();
  setInterval(() => fetchData(true), 5000);
});
