// List of commenter's channels
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

const numberWithCommas = x =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function getOrdinal(n) {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return suffixes[(v - 20) % 10] || suffixes[v] || "th";
}

async function fetchData() {
  const loading = document.getElementById("Loading");
  const clist = document.getElementById("clist");
  const top3 = document.getElementById("top3");

  // Reset UI
  clist.innerHTML = "";
  clist.style.display = "none";
  loading.style.display = "block";
  top3.style.display = "none";

  try {
    // Fetch all channels at the same time
    const results = await Promise.all(
      channels.map(async (id, index) => {
        loading.textContent = `${index + 1}/${channels.length} channels fetched...`;

        try {
          const res = await fetch(`https://backend.mixerno.space/api/youtube/estv3/${id}`);
          if (!res.ok) throw new Error("Fetch failed");
          const data = await res.json();

          const info = data.items[0];
          return {
            id,
            name: info.snippet.title,
            subs: Number(info.statistics.subscriberCount),
            pfp: info.snippet.thumbnails.default.url,
          };
        } catch (err) {
          console.warn(`⚠️ Failed to load ${id}`, err);
          return null; // Skip channel
        }
      })
    );

    // Filter out failed fetches
    const validResults = results.filter(Boolean);

    // Sort by subscriber count
    const sorted = validResults.sort((a, b) => b.subs - a.subs);

    // Render channels
    renderTopThree(sorted.slice(0, 3));
    renderList(sorted.slice(3));

  } catch (err) {
    console.error("Error fetching channels:", err);
  } finally {
    loading.style.display = "none";
    clist.style.display = "flex";
    top3.style.display = "flex";
  }
}

function renderTopThree(top) {
  const ranks = ["first", "second", "third"];
  top.forEach((ch, i) => {
    const container = document.getElementById(`outer${ranks[i]}`);
    if (!container) return;

    container.innerHTML = `
      <p style="margin:0.5vw;font-weight:600;">${i + 1}${getOrdinal(i + 1)}</p>
      <a href="https://www.youtube.com/channel/${ch.id}" target="_blank">
        <img class="pfp" style="outline:white solid .3vw;" src="${ch.pfp}" alt="${ch.name}" />
      </a>
      <div class="channelinfo">
        <p style="margin:0;font-weight:600;">${ch.name}</p>
        <p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">
          ${numberWithCommas(ch.subs)}
        </p>
      </div>
    `;
  });
}

function renderList(channels) {
  const clist = document.getElementById("clist");
  channels.forEach((ch, i) => {
    const div = document.createElement("div");
    div.className = "ui";
    div.innerHTML = `
      <a href="https://www.youtube.com/channel/${ch.id}" target="_blank">
        <img class="pfp" src="${ch.pfp}" alt="${ch.name}" />
      </a>
      <div class="channelinfo">
        <p style="margin:0;">${i + 4}. ${ch.name}</p>
        <p style="margin:0;margin-top:0.2vw;font-size:2vw;font-weight:800;">
          ${numberWithCommas(ch.subs)}
        </p>
      </div>
    `;
    clist.appendChild(div);
  });
}

fetchData();
